import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import * as helpers from './directives.test-helper';

describe('UnsubscribeOnDestroy', () => {

    describe('Component containing subscriptions with mixed manual/automatic unsubscribe', () => {
        let subscriptionsFixture: ComponentFixture<helpers.SubscriptionsComponent>;
        let subscriptionsComponent: helpers.SubscriptionsComponent;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.SubscriptionsComponent]
            }).compileComponents();

            subscriptionsFixture = TestBed.createComponent(helpers.SubscriptionsComponent);
            subscriptionsComponent = subscriptionsFixture.componentInstance;
        }));

        it('should call unsubscribe on a subscriptions property decorated with @UnsubscribeOnDestroy on ngOnDestroy call', () => {
            spyOn(subscriptionsComponent.subscription1, 'unsubscribe');
            spyOn(subscriptionsComponent.subscription2, 'unsubscribe');
            subscriptionsFixture.destroy();
            expect(subscriptionsComponent.subscription1.unsubscribe).toHaveBeenCalled();
            expect(subscriptionsComponent.subscription2.unsubscribe).toHaveBeenCalled();
        });

        it('should not call unsubscribe on a subscription property that is not decorated with @UnsubscribeOnDestroy on ngOnDestroy call',
            () => {
                spyOn(subscriptionsComponent.subscription3, 'unsubscribe');
                subscriptionsFixture.destroy();
                expect(subscriptionsComponent.subscription3.unsubscribe).not.toHaveBeenCalled();
            });
    });

    describe('Component containing two subscriptions, one of them with automatic unsubscribe', () => {
        let subscriptionFixture: ComponentFixture<helpers.SubscriptionComponent>;
        let subscriptionComponent: helpers.SubscriptionComponent;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.SubscriptionComponent]
            }).compileComponents();

            subscriptionFixture = TestBed.createComponent(helpers.SubscriptionComponent);
            subscriptionComponent = subscriptionFixture.componentInstance;
        }));

        it('should call unsubscribe on a subscription property decorated with @UnsubscribeOnDestroy on ngOnDestroy call', () => {
            spyOn(subscriptionComponent.decoratedSubscription, 'unsubscribe');
            subscriptionFixture.destroy();
            expect(subscriptionComponent.decoratedSubscription.unsubscribe).toHaveBeenCalled();
        });

        it('should not call unsubscribe on a subscription property that is not decorated with @UnsubscribeOnDestroy on ngOnDestroy call',
            () => {
                spyOn(subscriptionComponent.notDecoratedSubscription, 'unsubscribe');
                subscriptionFixture.destroy();
                expect(subscriptionComponent.notDecoratedSubscription.unsubscribe).not.toHaveBeenCalled();
            });
    });

    describe('Component containing an array of subscriptions with automatic unsubscribe alongside with ngOnDestroy', () => {
        let subscriptionArrayFixture: ComponentFixture<helpers.SubscriptionArrayComponent>;
        let subscriptionArrayComponent: helpers.SubscriptionArrayComponent;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.SubscriptionArrayComponent]
            }).compileComponents();

            subscriptionArrayFixture = TestBed.createComponent(helpers.SubscriptionArrayComponent);
            subscriptionArrayComponent = subscriptionArrayFixture.componentInstance;
        }));

        it('should call unsubscribe on each subscription element of an array property decorated with @UnsubscribeOnDestroy on ngOnDestroy',
            () => {
                subscriptionArrayComponent.subscription.forEach(subscription => {
                    spyOn(subscription, 'unsubscribe');
                });
                subscriptionArrayFixture.destroy();
                subscriptionArrayComponent.subscription.forEach(subscription => {
                    expect(subscription.unsubscribe).toHaveBeenCalled();
                });
            });

        it('should set the destroyed property to true on provided ngOnDestroy call', () => {
            spyOn(subscriptionArrayComponent, 'ngOnDestroy').and.callThrough();
            subscriptionArrayFixture.destroy();

            expect(subscriptionArrayComponent.ngOnDestroy).toHaveBeenCalled();
            expect(subscriptionArrayComponent.destroyed).toBe(true);
        });
    });

    describe('Directive containing a subscription with automatic unsubscribe', () => {
        let unsubscribeFixture: ComponentFixture<helpers.UnsubscribeComponent>;
        let directiveElement: DebugElement;
        let unsubscribeDirective: helpers.UnsubscribeDirective;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.UnsubscribeDirective, helpers.UnsubscribeComponent]
            }).compileComponents();

            unsubscribeFixture = TestBed.createComponent(helpers.UnsubscribeComponent);
            directiveElement = unsubscribeFixture.debugElement.query(By.directive(helpers.UnsubscribeDirective));
            unsubscribeDirective = directiveElement.injector.get(helpers.UnsubscribeDirective);
        }));

        it(`should call unsubscribe on a directive's subscription property on ngOnDestroy call`, () => {
            spyOn(unsubscribeDirective.subscription, 'unsubscribe');
            unsubscribeFixture.destroy();
            expect(unsubscribeDirective.subscription.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('Component containing a primitive property with automatic unsubscribe', () => {
        let primitivePropertyFixture: ComponentFixture<helpers.PrimitivePropertyComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.PrimitivePropertyComponent]
            }).compileComponents();

            primitivePropertyFixture = TestBed.createComponent(helpers.PrimitivePropertyComponent);
        }));

        it('should throw an error if the decorator used on non subscription object, i.e primitive value', () => {
            expect(() => { primitivePropertyFixture.destroy(); }).toThrowError('Property value does not contain unsubscribe method');
        });

        afterEach(() => {
            // This is needed to get rid of an error being thrown by ngOnDestroy() and logged to the console by
            // TestBed.resetTestingModule(), which gets automatically called while running tests.
            (primitivePropertyFixture.componentInstance as any).primitiveProperty = undefined;
        });
    });

    describe('Component containing an undefined property with automatic unsubscribe alongside with ngOnDestroy', () => {
        let undefinedPropertyFixture: ComponentFixture<helpers.UndefinedPropertyComponent>;
        let undefinedPropertyComponent: helpers.UndefinedPropertyComponent;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.UndefinedPropertyComponent]
            }).compileComponents();

            undefinedPropertyFixture = TestBed.createComponent(helpers.UndefinedPropertyComponent);
            undefinedPropertyComponent = undefinedPropertyFixture.componentInstance;
        }));

        it('should not throw an error if the decorator used on non subscription object, i.e undefined value', () => {
            expect(() => { undefinedPropertyFixture.destroy(); }).not.toThrow();
        });

        it('should call declared ngOnDestroy()', () => {
            spyOn(undefinedPropertyComponent, 'ngOnDestroy');
            undefinedPropertyFixture.destroy();
            expect(undefinedPropertyComponent.ngOnDestroy).toHaveBeenCalled();
        });
    });

    describe('Component containing a property set to null with automatic unsubscribe alongside with ngOnDestroy', () => {
        let nullPropertyFixture: ComponentFixture<helpers.NullPropertyComponent>;
        let nullPropertyComponent: helpers.NullPropertyComponent;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.NullPropertyComponent]
            }).compileComponents();

            nullPropertyFixture = TestBed.createComponent(helpers.NullPropertyComponent);
            nullPropertyComponent = nullPropertyFixture.componentInstance;
        }));

        it('should not throw an error if the decorator used on non subscription object, i.e null value', () => {
            expect(() => { nullPropertyFixture.destroy(); }).not.toThrow();
        });

        it('should call declared ngOnDestroy()', () => {
            spyOn(nullPropertyComponent, 'ngOnDestroy');
            nullPropertyFixture.destroy();
            expect(nullPropertyComponent.ngOnDestroy).toHaveBeenCalled();
        });
    });

    describe('Component containing an object property with automatic unsubscribe', () => {
        let objPropertyFixture: ComponentFixture<helpers.ObjectPropertyComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.ObjectPropertyComponent]
            }).compileComponents();

            objPropertyFixture = TestBed.createComponent(helpers.ObjectPropertyComponent);
        }));

        it('should throw an error if the decorator used on non subscription object, i.e object does not have unsubscribe method', () => {
            expect(() => { objPropertyFixture.destroy(); }).toThrowError('Property value does not contain unsubscribe method');
        });

        afterEach(() => {
            // This is needed to get rid of an error being thrown by ngOnDestroy() and logged to the console by
            // TestBed.resetTestingModule(), which gets automatically called while running tests.
            (objPropertyFixture.componentInstance as any).objProperty = undefined;
        });
    });

    describe('Component containing a property of type any with automatic unsubscribe', () => {
        let anyPropertyFixture: ComponentFixture<helpers.AnyPropertyComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [helpers.AnyPropertyComponent]
            }).compileComponents();

            anyPropertyFixture = TestBed.createComponent(helpers.AnyPropertyComponent);
        }));

        it('should throw an error if the decorator used on non subscription object, i.e any value', () => {
            expect(() => { anyPropertyFixture.destroy(); }).toThrowError('Property value does not contain unsubscribe method');
        });

        afterEach(() => {
            // This is needed to get rid of an error being thrown by ngOnDestroy() and logged to the console by
            // TestBed.resetTestingModule(), which gets automatically called while running tests.
            anyPropertyFixture.componentInstance.anyProperty = undefined;
        });
    });
});
