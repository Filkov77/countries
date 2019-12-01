import { Component, Directive, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { UnsubscribeOnDestroy } from './unsubscribe-on-destroy.decorator';

@Component({
    selector: 'app-subscriptions',
    template: ''
})
export class SubscriptionsComponent {
    @UnsubscribeOnDestroy()
    subscription1: Subscription = new Subject<{}>().subscribe();

    @UnsubscribeOnDestroy()
    subscription2: Subscription = new Subject<{}>().subscribe();

    subscription3: Subscription = new Subject<{}>().subscribe();
}

@Component({
    selector: 'app-subscription',
    template: ''
})
export class SubscriptionComponent {
    @UnsubscribeOnDestroy()
    decoratedSubscription: Subscription = new Subject<{}>().subscribe();

    notDecoratedSubscription: Subscription = new Subject<{}>().subscribe();
}

@Component({
    selector: 'app-subscription-array',
    template: ''
})
export class SubscriptionArrayComponent implements OnDestroy {
    @UnsubscribeOnDestroy()
    subscription: Subscription[] = [new Subject<{}>().subscribe()];

    destroyed = false;

    ngOnDestroy() {
        this.destroyed = true;
    }
}

@Directive({
    selector: '[unsubscribe]'
})
export class UnsubscribeDirective {
    @UnsubscribeOnDestroy()
    subscription: Subscription = new Subject<{}>().subscribe();
}

@Component({
    selector: 'app-unsubscribe',
    template: `<div unsubscribe></div>  `
})
export class UnsubscribeComponent { }

@Component({
    selector: 'app-primitive-property',
    template: ''
})
export class PrimitivePropertyComponent {
    @UnsubscribeOnDestroy()
    primitiveProperty = 'non-subscription-value';
}

@Component({
    selector: 'app-undefined-property',
    template: ''
})
export class UndefinedPropertyComponent implements OnDestroy {
    @UnsubscribeOnDestroy()
    undefinedProperty: string | undefined;

    ngOnDestroy() { }
}

@Component({
    selector: 'app-null-property',
    template: ''
})
export class NullPropertyComponent implements OnDestroy {
    @UnsubscribeOnDestroy()
    nullProperty = null;

    ngOnDestroy() { }
}

@Component({
    selector: 'app-object-property',
    template: ''
})
export class ObjectPropertyComponent {
    @UnsubscribeOnDestroy()
    objProperty = { dummy() { } };
}

@Component({
    selector: 'app-any-property',
    template: ''
})
export class AnyPropertyComponent {
    @UnsubscribeOnDestroy()
    anyProperty: any = 23;
}
