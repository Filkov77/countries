import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { filter, finalize, map, mergeMap } from 'rxjs/operators';

export interface ActivityEmission<T> {
    channel: string;
    activeEmitters: number;
    value?: T;
    error?: Error;
}

export class ActivityEmitter<T> extends Subject<T> {
    constructor(public channel: string) {
        super()/* istanbul ignore next */;
        // ^^ istanbul for some reason thinks super is branch so above comment is required for 100% code coverage
        // more info on:
        // @link <https://github.com/gotwarlost/istanbul/issues/690>
        // @link <https://github.com/Microsoft/TypeScript/issues/13029>
    }
}

/**
 * Purpose of ActivityService is to allow creation of emitters that can emit messages for duration of some activity.
 * Just like any other observable activity emitter must be completed either via complete() or error() calls.
 * The channel is "open" while there is at least one activity emitter existing and non completed.
 * This concept allows developer to check a channel instead of individual activity emitters, and expecting either
 * to receive messages or perform some other functions depending on number of active emitters on the channel.
 *
 * This is useful if for instance a dev wants to show overlay when any number of 'overlay' channel emitters are active,
 * and close overlay as soon all of them are completed or ended up in error.
 */
@Injectable()
export class ActivityService {

    private emitters: ActivityEmitter<any>[] = [];
    private emissionTracker: ReplaySubject<ActivityEmission<any>> = new ReplaySubject();

    /**
     * Creates activity emitter which will be emitting on particular channel.
     *
     * @param onChannel Channel identifier on which emissions will be emitted in particular format
     * @param initialValue Optional, if provided it will be first emission value of activity emitter
     */
    create<T>(onChannel: string, initialValue?: T): ActivityEmitter<T> {
        const { emitters, emissionTracker } = this;
        const emitter = new ActivityEmitter<T>(onChannel);
        let subscription: Subscription;

        const removeActivityEmitter = () => {
            subscription.unsubscribe();
            emitters.splice(emitters.indexOf(emitter), 1);
        };
        emitters.push(emitter);

        subscription = emitter.subscribe({
            next: value => {
                emissionTracker.next({
                    channel: onChannel,
                    activeEmitters: this.filter(onChannel).length,
                    value
                });
            },
            error: error => {
                removeActivityEmitter();
                emissionTracker.next({
                    channel: onChannel,
                    activeEmitters: this.filter(onChannel).length,
                    error
                });
            },
            complete: () => {
                removeActivityEmitter();
                emissionTracker.next({
                    channel: onChannel,
                    activeEmitters: this.filter(onChannel).length
                });
            }
        });

        if (initialValue) { // emit the value
            emitter.next(initialValue);
        }
        else { // or emit new activity emission
            emissionTracker.next({
                channel: onChannel,
                activeEmitters: this.filter(onChannel).length
            });
        }

        return emitter;
    }

    /**
     * Combines channel emitters into single observable that will respond with current number of active emitters any time any
     * of them triggers next(), error() or complete()
     *
     * @param onChannels Optional, if left out it will return count of all active emitters
     */
    activeCount(...onChannels: string[]): Observable<number> {
        return this.emissionTracker.pipe(
            filter(e => !onChannels.length || onChannels.includes(e.channel)),
            mergeMap(() => of(this.filter(...onChannels).length))
            // ^^ we technically only need number of active emitter when any change happened
        );
    }

    /**
     * Combines channel emitters into single observable that will respond with emission any time any emitter triggers
     * next(), error() or complete().
     *
     * @param onChannels Optional, if left out it will emit messages from all channels
     */
    allEmissions<T>(...onChannels: string[]): Observable<ActivityEmission<T>> {
        return this.emissionTracker.pipe(
            filter(e => !onChannels.length || onChannels.includes(e.channel)),
            map(e => {
                return { ...e, activeEmitters: this.filter(...onChannels).length };
            })
            // ^^ as next(), error() or complete() will only calculate activeEmitters on the channel they emit through
            // we need to re-calculate it to properly return total number of emitters of listened channels
        );
    }

    /**
     * Combines channel emitters into single observable that will respond with emission any time any emitter triggers error()
     *
     * @param onChannels Optional, if left out it will emit errors from all channels
     */
    errorEmissions<T = any>(...onChannels: string[]): Observable<ActivityEmission<T>> {
        return this.emissionTracker.pipe(
            filter(e =>
                (!onChannels.length || onChannels.includes(e.channel)) && undefined !== e.error
            ),
            map(e => {
                return { ...e, activeEmitters: this.filter(...onChannels).length };
            })
            // ^^ as next(), error() or complete() will only calculate activeEmitters on the channel they emit through
            // we need to re-calculate it to properly return total number of emitters of listened channels
        );
    }

    /**
     * Force completion of all, one or some active emitters
     *
     * @param channels Optional, if left out it will complete all active emitter
     */
    complete(...channels: string[]): void {
        this.filter(...channels)
            .forEach(e => { e.complete(); });
    }

    /**
     * Track the finalization of an observable.
     *
     * Creates an ActivityEmitter under given channel. Whenever the source observable completes or errors, the emitter gets completed.
     *
     * @param channel The channel to be used by the ActivityEmitter used to track the source observable
     * @param source The observable to be tracked.
     */
    trackFinalization<T>(
        channel: string,
        source: Observable<T>
    ) {
        const emitter = this.create<never>(channel);
        return source.pipe(
            finalize(() => {
                emitter.complete();
            })
        );
    }

    /**
     * Returns currently active activity emitters for all, one or some channels.
     *
     * @param channels Optional, if left out all channel emitters are returned
     */
    private filter(...channels: string[]): ActivityEmitter<any>[] {
        return this.emitters.filter(e => !channels.length || channels.includes(e.channel));
    }
}
