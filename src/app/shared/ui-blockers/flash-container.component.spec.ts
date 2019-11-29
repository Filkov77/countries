import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { query, queryAll } from 'test-helpers';

import { FlashMessageUiClass, FlashService, FlashServiceMock } from '../services';

import { FlashContainerComponent } from './flash-container.component';
import { FlashMessageMockComponent } from './flash-message.component.mock';

describe('FlashContainerComponent', () => {
    let component: FlashContainerComponent;
    let fixture: ComponentFixture<FlashContainerComponent>;
    let flashService: FlashService;
    let containerWrapper: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlashContainerComponent, FlashMessageMockComponent],
            providers: [{ provide: FlashService, useClass: FlashServiceMock }]
        });
        fixture = TestBed.createComponent(FlashContainerComponent);
        component = fixture.componentInstance;
        flashService = TestBed.get(FlashService);
        containerWrapper = query(fixture.debugElement, '.flash-container-wrapper')!;
    });

    function getClearAllControl() {
        return query(containerWrapper, '.clear-all-items-wrapper');
    }

    function getFlashMessages() {
        return queryAll(containerWrapper, FlashMessageMockComponent);
    }

    function triggerClearAllClick() {
        const clearAllWrapper = getClearAllControl();
        if (clearAllWrapper === null) {
            throw new Error(`Component does not contain clear-all control`);
        }
        const link = query(clearAllWrapper, 'a');
        if (link === null) {
            throw new Error(`Component clear-all control wrapper does not contain link to close all messages`);
        }
        link.triggerEventHandler('click', new Event('click'));
    }

    it('should set the default value for items array', () => {
        expect(component.items).toEqual([]);
    });

    it('should subscribe to FlashService', fakeAsync(() => {
        const msg = { value: 'Any message' };
        fixture.detectChanges();

        expect(component.items).withContext('right after init').toEqual([]);
        flashService.next(msg);
        tick();
        expect(component.items).withContext('after FlashService emission').toEqual([msg]);
    }));

    describe('items', () => {
        it('should render 1 flash message component without clear all control', () => {
            component.items = [
                {
                    value: 'Success Message',
                    uiClass: FlashMessageUiClass.success,
                    iconClass: 'success-icon',
                    timeout: 2000
                }
            ];

            fixture.detectChanges();
            expect(getClearAllControl()).toBeNull();
            expect(getFlashMessages().length).toBe(1);
        });

        it('should render 2 flash message components along with clear all control', () => {
            component.items = [
                {
                    value: 'Success Message',
                    uiClass: FlashMessageUiClass.success,
                    iconClass: 'success-icon',
                    timeout: 2000
                },
                {
                    value: 'Warning Message',
                    uiClass: FlashMessageUiClass.warning,
                    iconClass: 'warning-icon',
                    timeout: 2000
                }
            ];

            fixture.detectChanges();
            expect(getClearAllControl()).toBeTruthy();
            expect(getFlashMessages().length).toBe(2);
        });
    });

    describe('clearAll', () => {
        it('should clear all flash items after click on anchor element', () => {
            component.items = [
                {
                    value: 'Success Message',
                    uiClass: FlashMessageUiClass.success,
                    iconClass: 'success-icon',
                    timeout: 2000
                },
                {
                    value: 'Warning Message',
                    uiClass: FlashMessageUiClass.warning,
                    iconClass: 'warning-icon',
                    timeout: 2000
                }
            ];

            fixture.detectChanges();
            expect(getFlashMessages().length).toEqual(2);

            triggerClearAllClick();

            fixture.detectChanges();
            expect(getFlashMessages().length).toEqual(0);
            expect(getClearAllControl()).toBeNull();
        });
    });

    describe('removeMessage()', () => {
        it('should remove message from its items list', () => {
            const msg1 = {
                value: 'Foo Message'
            };
            const msg2 = {
                value: 'Bar Message'
            };
            component.items = [msg1, msg2];

            component.removeMessage(msg2);
            expect(component.items).withContext('after removing first').toEqual([msg1]);

            component.removeMessage(msg1);
            expect(component.items).withContext('after removing second').toEqual([]);
        });

        it('should allow passing non-existing or already removed message item', () => {
            component.items = [];
            expect(() => { component.removeMessage({ value: 'Foo Message' }); }).not.toThrow();
        });
    });
});
