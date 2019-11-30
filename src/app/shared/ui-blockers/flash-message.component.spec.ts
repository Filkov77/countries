import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { query } from 'test-helpers';

import { FlashMessageUiClass } from '../services';

import { FlashMessageComponent } from './flash-message.component';

describe('FlashMessageComponent', () => {
    let component: FlashMessageComponent;
    let fixture: ComponentFixture<FlashMessageComponent>;
    let containerEl: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FlashMessageComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(FlashMessageComponent);
        component = fixture.componentInstance;
        containerEl = query(fixture.debugElement, 'div')!.nativeElement;
    }));

    function getClassValueOfDiv() {
        const classAttr = containerEl.attributes.getNamedItem('class');
        if (classAttr === null) {
            throw new Error('Class attribute not found on the div');
        }
        return classAttr.value;
    }

    function getFirstElementOfDiv() {
        const firstElement = containerEl.firstElementChild;
        if (firstElement === null) {
            throw new Error('Div has no children');
        }
        return firstElement;
    }

    function getClassValueOfFirstElement() {
        const firstSpanClassAttr = getFirstElementOfDiv().attributes.getNamedItem('class');
        if (firstSpanClassAttr === null) {
            throw new Error(`The div's first child has not class attribute`);
        }
        return firstSpanClassAttr.value;
    }

    function getTextContent() {
        return containerEl.textContent!.trim();
    }

    function triggerClick() {
        const el = query(fixture.debugElement, 'a');
        if (el === null) {
            throw new Error(`Component does not contain link element to be clicked`);
        }
        el.triggerEventHandler('click', new Event('click'));
    }

    it('should display text in default alert box', () => {
        component.item = {
            value: 'Test Message'
        };
        fixture.detectChanges();

        expect(getTextContent()).toEqual('Test Message');
        expect(getClassValueOfDiv()).toContain('alert-secondary');
        expect(getFirstElementOfDiv().tagName).toBe('A');
    });

    it('should display text in custom alert box', () => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success
        };
        fixture.detectChanges();

        expect(getTextContent()).toEqual('Test Message');
        expect(getClassValueOfDiv()).toContain('alert-success');
        expect(getFirstElementOfDiv().tagName).toBe('A');
    });

    it('should display text with custom icon', () => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success,
            iconClass: 'fa fa-check'
        };
        fixture.detectChanges();

        // textContent never returns null for a HTMLDivElement
        const textContent = containerEl.textContent!.trim();

        expect(textContent).toEqual('Test Message');
        expect(getClassValueOfDiv()).toContain('alert-success');
        expect(getFirstElementOfDiv().tagName).toBe('SPAN');
        expect(getClassValueOfFirstElement()).toBe('fa fa-check');
    });

    it('should emit "onRemove" event if provided timeout', fakeAsync(() => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success,
            timeout: 2000
        };
        spyOn(component.onRemove, 'emit');
        fixture.detectChanges();

        expect(component.onRemove.emit).withContext('initially').not.toHaveBeenCalled();

        tick(2000);
        expect(component.onRemove.emit).withContext('after timeout').toHaveBeenCalled();
    }));

    it('should emit "onRemove" event when "remove" button is clicked', () => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success
        };
        spyOn(component.onRemove, 'emit');
        fixture.detectChanges();

        triggerClick();
        expect(component.onRemove.emit).toHaveBeenCalled();
    });

    it('should not re-emit "onRemove" event when "remove" button is clicked prior of timeout expired', fakeAsync(() => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success,
            timeout: 2000
        };
        const spiedEmit = spyOn(component.onRemove, 'emit');
        fixture.detectChanges();

        triggerClick();
        expect(spiedEmit).withContext('when user clicks button').toHaveBeenCalled();

        spiedEmit.calls.reset();
        tick(2000);
        expect(spiedEmit).withContext('timeout expired after button clicked').not.toHaveBeenCalled();
    }));

    it('should not emit "onRemove" if item was destroyed before timeout expired', fakeAsync(() => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success,
            timeout: 2000
        };
        spyOn(component.onRemove, 'emit');
        fixture.detectChanges();

        component.ngOnDestroy(); // trigger destroy
        tick(2000);
        expect(component.onRemove.emit).withContext('timeout expired after destroyed').not.toHaveBeenCalled();
    }));

    it('should do nothing if no pending timer when destroying item', () => {
        component.item = {
            value: 'Test Message',
            uiClass: FlashMessageUiClass.success
        };
        spyOn(component.onRemove, 'emit');
        fixture.detectChanges();

        expect(() => { component.ngOnDestroy(); }).not.toThrow();
    });
});
