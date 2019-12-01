import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ActivityEmitter } from './activity.service';

@Injectable()
export class ActivityServiceMock {
    createdEmitters: ActivityEmitter<any>[] = [];

    activeCountSubj = new Subject<number>();

    create(channel: string) {
        const createdEmitter = new ActivityEmitter(channel);

        createdEmitter.subscribe(() => { }, () => { }, () => {
            this.createdEmitters.splice(this.createdEmitters.indexOf(createdEmitter), 1);
            this.activeCountSubj.next(this.createdEmitters.length);
        });

        this.createdEmitters.push(createdEmitter);
        this.activeCountSubj.next(this.createdEmitters.length);

        return createdEmitter;
    }
    filter() { }

    activeCount() {
        return this.activeCountSubj.asObservable();
    }

    allEmissions() { }
    errorEmissions() { }
    complete() { }
    trackFinalization<T>(
        channel: string,
        source: Observable<T>
    ) {
        return source;
    }
}
