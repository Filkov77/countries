import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UnsubscribeOnDestroy } from '../decorators';

/**
 * The purpose of this base class is to provide an empty ngOnDestroy() method definition.
 * Without this empty method, the @UnsubscribeOnDestroy decorator will not work in AOT mode,
 * since the AOT compiler statically analyzes the code before running it.
 *
 * Probably, this class will become obsolete and unneeded after we start using the Angular Ivy compiler.
 */
export abstract class Destroyable implements OnDestroy {
    @UnsubscribeOnDestroy()
    protected subscriptions: Subscription[] = [];

    /** An ngOnDestroy method is required for @UnsubscribeOnDestroy() to work in AOT mode */
    ngOnDestroy() { }
}
