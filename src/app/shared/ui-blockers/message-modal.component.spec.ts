import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { query, queryByInnerHTML } from 'test-helpers';

import { MessageModalComponent } from './message-modal.component';

describe('messageModal', () => {
    let component: MessageModalComponent;
    let fixture: ComponentFixture<MessageModalComponent>;
    let activeModalService: NgbActiveModal;

    function modalBody() {
        return query(fixture.debugElement, '.modal-body')!.nativeElement as HTMLElement;
    }

    function xButton() {
        return query(fixture.debugElement, 'button.close')!.nativeElement as HTMLButtonElement;
    }

    function okButton() {
        return queryByInnerHTML(fixture.debugElement, 'OK')!.nativeElement as HTMLButtonElement;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MessageModalComponent],
            providers: [NgbActiveModal]
        }).compileComponents();

        fixture = TestBed.createComponent(MessageModalComponent);
        component = fixture.componentInstance;
        activeModalService = TestBed.get(NgbActiveModal);
        spyOn(activeModalService, 'close');
    });

    it('should be created', () => {
        expect(component).not.toBeUndefined();
    });

    describe('modal contents', () => {
        it('should show the message', () => {
            const someText = 'Some text message that has to be shown';
            component.message = someText;
            fixture.detectChanges();
            expect(modalBody().textContent).toContain(someText);
        });
    });

    describe('X cross', () => {
        it('should exist', () => {
            expect(xButton()).not.toBeNull();
        });

        it('clicking should close the modal', () => {
            xButton().click();
            expect(activeModalService.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('OK button', () => {
        it('should exist', () => {
            expect(okButton()).not.toBeNull();
        });

        it('clicking should close the modal', () => {
            okButton().click();
            expect(activeModalService.close).toHaveBeenCalledTimes(1);
        });
    });
});
