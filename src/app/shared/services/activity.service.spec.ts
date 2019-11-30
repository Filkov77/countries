import { TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';

import { ActivityEmission, ActivityEmitter, ActivityService } from './activity.service';

describe('ActivityService', () => {
    let service: ActivityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ActivityService]
        });

        service = TestBed.get(ActivityService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('create()', () => {
        let tracker: Subject<any>;

        beforeEach(() => {
            tracker = (service as any).emissionTracker;
            spyOn(tracker, 'next').and.callThrough();
        });

        it('should create emitter - without initial value', () => {
            const emitter = service.create<string>('foo');

            expect(emitter).toEqual(jasmine.any(ActivityEmitter));
            expect(emitter.channel).toBe('foo');
            expect(tracker.next).toHaveBeenCalledWith({ channel: 'foo', activeEmitters: 1 });
        });
        it('should create emitter - with initial value', () => {
            const emitter = service.create<string>('foo', 'bar');

            expect(emitter).toEqual(jasmine.any(ActivityEmitter));
            expect(emitter.channel).toBe('foo');
            expect(tracker.next).toHaveBeenCalledWith({ channel: 'foo', activeEmitters: 1, value: 'bar' });
        });

        describe('emitter', () => {
            let emitter: ActivityEmitter<string>;

            beforeEach(() => {
                emitter = service.create('foo');
                (tracker.next as any).calls.reset();
            });

            it('should be able to emit value via its channel', () => {
                emitter.next('bar');
                expect(tracker.next).toHaveBeenCalledWith({ channel: 'foo', activeEmitters: 1, value: 'bar' });
            });

            it('should be able to emit error via its channel', () => {
                const error = new Error('bar');
                emitter.error(error);
                expect(tracker.next).toHaveBeenCalledWith({ channel: 'foo', activeEmitters: 0, error });
            });

            it('should be able to emit complete via its channel', () => {
                emitter.complete();
                expect(tracker.next).toHaveBeenCalledWith({ channel: 'foo', activeEmitters: 0 });
            });
        });
    });

    describe('activeCount()', () => {
        it('should return observable of particular channels active emitters count', () => {
            const observable = service.activeCount('foo');

            expect(observable).toEqual(jasmine.any(Observable));
        });

        describe('observable', () => {
            it('should only monitor particular channel', () => {
                const stream: number[] = [];
                service.activeCount('foo').subscribe(activeEmitters => {
                    stream.push(activeEmitters);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).toEqual([1]);

                foo.next('next foo');
                bar.next('next bar');
                expect(stream).toEqual([1, 1]);

                foo.complete();
                bar.complete();
                expect(stream).toEqual([1, 1, 0]);
            });
            it('should only monitor some channels', () => {
                const stream: number[] = [];
                service.activeCount('foo', 'bar').subscribe(activeEmitters => {
                    stream.push(activeEmitters);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                const baz = service.create<string>('baz');
                expect(stream).toEqual([1, 2]); // foo & bar

                foo.next('next foo');
                bar.next('next bar');
                baz.next('next baz');
                expect(stream).toEqual([1, 2, 2, 2]);

                foo.complete();
                bar.complete();
                baz.complete();
                expect(stream).toEqual([1, 2, 2, 2, 1, 0]);
            });
            it('should monitor all channels', () => {
                const stream: number[] = [];
                service.activeCount().subscribe(activeEmitters => {
                    stream.push(activeEmitters);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).toEqual([1, 2]); // foo & bar

                foo.next('next foo');
                bar.next('next bar');
                expect(stream).toEqual([1, 2, 2, 2]);

                foo.complete();
                bar.complete();
                expect(stream).toEqual([1, 2, 2, 2, 1, 0]);
            });
        });
    });

    describe('allEmissions()', () => {
        it('should return observable of particular channels emissions', () => {
            const observable = service.allEmissions('foo');

            expect(observable).toEqual(jasmine.any(Observable));
        });

        describe('observable', () => {
            it('should only monitor particular channel', () => {
                const stream: ActivityEmission<any>[] = [];
                service.allEmissions('foo').subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const fooish = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'foo', activeEmitters: 2 } // fooish
                ]);

                foo.next('next foo');
                fooish.next('next fooish');
                bar.next('next bar');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'foo', activeEmitters: 2 }, // fooish
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'foo', activeEmitters: 2, value: 'next fooish' } // fooish.next()
                ]);

                foo.complete();
                const error = new Error('fooish error');
                fooish.error(error);
                bar.complete();
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'foo', activeEmitters: 2 }, // fooish
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'foo', activeEmitters: 2, value: 'next fooish' }, // fooish.next()
                    { channel: 'foo', activeEmitters: 1 }, // foo.complete()
                    { channel: 'foo', activeEmitters: 0, error } // fooish.error()
                ]);
            });
            it('should only monitor some channels', () => {
                const stream: ActivityEmission<any>[] = [];
                service.allEmissions('foo', 'bar').subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                const baz = service.create<string>('baz');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 } // bar
                ]);

                foo.next('next foo');
                bar.next('next bar');
                baz.next('next baz');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 }, // bar
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'bar', activeEmitters: 2, value: 'next bar' } // bar.next()
                ]);

                foo.complete();
                bar.complete();
                baz.complete();
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 }, // bar
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'bar', activeEmitters: 2, value: 'next bar' }, // bar.next()
                    { channel: 'foo', activeEmitters: 1 }, // foo.complete()
                    { channel: 'bar', activeEmitters: 0 } // bar.complete()
                ]);
            });
            it('should only monitor all channels', () => {
                const stream: ActivityEmission<any>[] = [];
                service.allEmissions().subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 } // bar
                ]);

                foo.next('next foo');
                bar.next('next bar');
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 }, // bar
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'bar', activeEmitters: 2, value: 'next bar' } // bar.next()
                ]);

                foo.complete();
                bar.complete();
                expect(stream).toEqual([
                    { channel: 'foo', activeEmitters: 1 }, // foo
                    { channel: 'bar', activeEmitters: 2 }, // bar
                    { channel: 'foo', activeEmitters: 2, value: 'next foo' }, // foo.next()
                    { channel: 'bar', activeEmitters: 2, value: 'next bar' }, // bar.next()
                    { channel: 'foo', activeEmitters: 1 }, // foo.complete()
                    { channel: 'bar', activeEmitters: 0 } // bar.complete()
                ]);
            });
        });
    });

    describe('errorEmissions()', () => {
        it('should return observable of particular channels emissions', () => {
            const observable = service.errorEmissions('foo');

            expect(observable).toEqual(jasmine.any(Observable));
        });

        describe('observable', () => {
            it('should only monitor particular channel', () => {
                const stream: ActivityEmission<any>[] = [];
                service.errorEmissions('foo').subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).withContext('at init').toEqual([]); // no errors

                foo.next('next foo');
                bar.next('next bar');
                expect(stream).withContext('at next()').toEqual([]); // still no error

                const error1 = new Error('foo error');
                const error2 = new Error('bar error');
                foo.error(error1);
                bar.error(error2);
                expect(stream).withContext('at error()').toEqual([
                    { channel: 'foo', activeEmitters: 0, error: error1 } // foo.error()
                ]);
            });
            it('should only monitor some channels', () => {
                const stream: ActivityEmission<any>[] = [];
                service.errorEmissions('foo', 'bar').subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const fooish = service.create<string>('fooish');
                const bar = service.create<string>('bar');
                const baz = service.create<string>('baz');
                expect(stream).withContext('at init').toEqual([]); // no errors

                foo.next('next foo');
                bar.next('next bar');
                baz.next('next baz');
                expect(stream).withContext('at next()').toEqual([]); // still no error

                const error1 = new Error('foo error');
                const error2 = new Error('bar error');
                const error3 = new Error('baz error');
                foo.error(error1);
                fooish.complete(); // false positive testing - complete() should not be transmitted via error!
                bar.error(error2);
                baz.error(error3);
                expect(stream).withContext('at error()').toEqual([
                    { channel: 'foo', activeEmitters: 1, error: error1 }, // foo.error()
                    { channel: 'bar', activeEmitters: 0, error: error2 } // bar.error()
                ]);
            });
            it('should only monitor all channels', () => {
                const stream: ActivityEmission<any>[] = [];
                service.errorEmissions().subscribe(emission => {
                    stream.push(emission);
                });
                const foo = service.create<string>('foo');
                const bar = service.create<string>('bar');
                expect(stream).withContext('at init').toEqual([]); // no errors

                foo.next('next foo');
                bar.next('next bar');
                expect(stream).withContext('at next()').toEqual([]); // still no error

                const error1 = new Error('foo error');
                const error2 = new Error('bar error');
                foo.error(error1);
                bar.error(error2);
                expect(stream).withContext('at error()').toEqual([
                    { channel: 'foo', activeEmitters: 1, error: error1 }, // foo.error()
                    { channel: 'bar', activeEmitters: 0, error: error2 } // bar.error()
                ]);
            });
        });
    });

    describe('complete()', () => {
        it('should complete particular channel emitters', () => {
            const foo = service.create<string>('foo');
            const bar = service.create<string>('bar');
            spyOn(foo, 'complete');
            spyOn(bar, 'complete');

            service.complete('foo');

            expect(foo.complete).toHaveBeenCalled();
            expect(bar.complete).not.toHaveBeenCalled();
        });
        it('should complete some channel emitters', () => {
            const foo = service.create<string>('foo');
            const bar = service.create<string>('bar');
            const baz = service.create<string>('baz');
            spyOn(foo, 'complete');
            spyOn(bar, 'complete');
            spyOn(baz, 'complete');

            service.complete('foo', 'bar');

            expect(foo.complete).toHaveBeenCalled();
            expect(bar.complete).toHaveBeenCalled();
            expect(baz.complete).not.toHaveBeenCalled();
        });
        it('should complete all channel emitters', () => {
            const foo = service.create<string>('foo');
            const bar = service.create<string>('bar');
            spyOn(foo, 'complete');
            spyOn(bar, 'complete');

            service.complete();

            expect(foo.complete).toHaveBeenCalled();
            expect(bar.complete).toHaveBeenCalled();
        });
    });

    describe('trackFinalization', () => {
        let channel: string;

        beforeEach(() => {
            channel = 'test_channel';
        });

        it('should create an emitter on call', () => {
            const source = new Subject();
            service.trackFinalization(channel, source).subscribe(
                () => {
                    fail();
                }, () => {
                    fail();
                }, () => {
                    fail();
                }
            );
            service.activeCount(channel).subscribe(count => {
                expect(count).toEqual(1);
            });
        });
        it('should complete the emitter and the output observable whenever the source completes', (done) => {
            const source = new Subject();
            let activeCountReset = false;
            let outputComplete = false;

            service.trackFinalization(channel, source).subscribe(
                () => {
                    fail();
                }, () => {
                    fail();
                }, () => {
                    outputComplete = true;

                    if (outputComplete && activeCountReset) {
                        expect().nothing();
                        done();
                    }
                }
            );
            service.activeCount(channel).subscribe(count => {
                if (count === 0) {
                    activeCountReset = true;

                    if (outputComplete && activeCountReset) {
                        expect().nothing();
                        done();
                    }
                }
            });
            source.complete();
        });
        it('should complete the emitter whenever the source errors', (done) => {
            const source = new Subject();
            let activeCountReset = false;
            let outputComplete = false;

            service.trackFinalization(channel, source).subscribe(
                () => {
                    fail();
                }, () => {
                    outputComplete = true;

                    if (outputComplete && activeCountReset) {
                        expect().nothing();
                        done();
                    }
                }, () => {
                    fail();
                }
            );
            service.activeCount(channel).subscribe(count => {
                if (count === 0) {
                    activeCountReset = true;

                    if (outputComplete && activeCountReset) {
                        expect().nothing();
                        done();
                    }
                }
            });
            source.error('someError');
        });

        it('should propagate the value whenever the source emits', (done) => {
            const source = new Subject();

            service.trackFinalization(channel, source).subscribe(
                () => {
                    expect().nothing();
                    done();
                }, () => {
                    fail();
                }, () => {
                    fail();
                }
            );
            service.activeCount(channel).subscribe(count => {
                if (count === 0) {
                    fail();
                }
            });
            source.next('something');
        });
    });
});
