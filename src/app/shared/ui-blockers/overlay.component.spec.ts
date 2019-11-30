import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from 'app/shared';

import { query } from 'test-helpers';

import { OverlayComponent } from './overlay.component';

@Component({
    template: `<div app-overlay [show]="show"
                                [delayed]="delayed"
                                [fixed]="fixed"
                                [message]="message"
                                [useIndicator]="useIndicator"
                                [useMessage]="useMessage"
                                ></div>`
})
class TestShellComplexUseComponent {
    show = false;
    delayed = false;
    fixed = false;
    message = '';
    useIndicator = true;
    useMessage = true;
}

@Component({
    template: `<div app-overlay [show]="show"></div>`
})
class TestShellDefaultUseComponent {
    show = false;
}

function expectMessageShown(fixture: ComponentFixture<TestShellDefaultUseComponent | TestShellComplexUseComponent>, expectedText: string) {
    const message = query(fixture.debugElement, '.show .overlay-message'); // it only makes sense to match it via .show parent
    if (message) {
        expect((message.nativeElement as HTMLParagraphElement).innerText).toBe(expectedText);
    }
    else {
        fail('Message is not shown');
    }
}

function expectIndicatorShown(fixture: ComponentFixture<TestShellDefaultUseComponent | TestShellComplexUseComponent>) {
    const indicator = query(fixture.debugElement, '.show .overlay-indicator'); // it only makes sense to match it via .show parent
    if (!indicator) {
        fail('Indicator is not shown');
    }
}

function expectMessageNotShown(fixture: ComponentFixture<TestShellDefaultUseComponent | TestShellComplexUseComponent>) {
    const message = query(fixture.debugElement, '.show .overlay-message'); // it only makes sense to match it via .show parent
    if (message) {
        fail('Message is shown');
    }
    else {
        expect().nothing();
    }
}

function expectIndicatorNotShown(fixture: ComponentFixture<TestShellDefaultUseComponent | TestShellComplexUseComponent>) {
    const indicator = query(fixture.debugElement, '.show .overlay-indicator'); // it only makes sense to match it via .show parent
    if (indicator) {
        fail('Indicator is shown');
    }
    else {
        expect().nothing();
    }
}

describe('OverlayComponent', () => {
    describe('default use', () => {
        let host: TestShellDefaultUseComponent;
        let fixture: ComponentFixture<TestShellDefaultUseComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    OverlayComponent,
                    TestShellDefaultUseComponent
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TestShellDefaultUseComponent);
            host = fixture.componentInstance;
        }));

        it('by default should be hidden', () => {
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show')).toBeNull();
            expect(query(fixture.debugElement, '.hide')).toBeNull();
        });

        it('should be visible at creation', () => {
            host.show = true;
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show')).toBeTruthy();
            expect(query(fixture.debugElement, '.hide')).toBeNull();
        });

        it('should become visible', () => {
            fixture.detectChanges();
            host.show = true;
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show')).toBeTruthy();
            expect(query(fixture.debugElement, '.hide')).toBeNull();
        });

        it('should apply special hide style when hiding overlay', () => {
            host.show = true;
            fixture.detectChanges();
            host.show = false; // hide
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show')).toBeFalsy();
            expect(query(fixture.debugElement, '.hide')).toBeTruthy(); // special class that applies hiding animation
        });

        it('should show default message and loader indicator when visible', () => {
            host.show = true;
            fixture.detectChanges();
            expectIndicatorShown(fixture);
            expectMessageShown(fixture, 'Loading, please wait...');
        });
    });

    describe('complex use', () => {
        let host: TestShellComplexUseComponent;
        let fixture: ComponentFixture<TestShellComplexUseComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    OverlayComponent,
                    TestShellComplexUseComponent
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TestShellComplexUseComponent);
            host = fixture.componentInstance;
        }));

        it('by default should be hidden', () => {
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show')).toBeNull();
            expect(query(fixture.debugElement, '.hide')).toBeNull();
        });

        it('should style overlay as fixed', () => {
            host.show = true;
            host.fixed = true;
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show.fixed')).toBeTruthy();
        });

        it('should style overlay as delayed', () => {
            host.show = true;
            host.delayed = true;
            fixture.detectChanges();
            expect(query(fixture.debugElement, '.show.delayed')).toBeTruthy();
        });

        it('should show custom message', () => {
            host.show = true;
            host.message = 'Custom message';
            fixture.detectChanges();
            expectMessageShown(fixture, 'Custom message');
        });

        it('should show different message mid-flight', () => {
            host.show = true;
            host.message = 'Message 1';
            fixture.detectChanges();
            expectMessageShown(fixture, 'Message 1');

            // mid-flight change
            host.message = 'Message 2';
            fixture.detectChanges();
            expectMessageShown(fixture, 'Message 2');
        });

        it('should not show message if useMessage=false', () => {
            host.show = true;
            host.useMessage = false;
            fixture.detectChanges();
            expectMessageNotShown(fixture);
        });

        it('should not show overlay indicator if useIndicator=false', () => {
            host.show = true;
            host.useIndicator = false;
            fixture.detectChanges();
            expectIndicatorNotShown(fixture);
        });
    });
});
