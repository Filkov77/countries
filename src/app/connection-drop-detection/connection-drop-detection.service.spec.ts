import { TestBed } from '@angular/core/testing';
import { ConnectionService } from 'ng-connection-service';
import { Subject } from 'rxjs';

import { ConnectionDropDetectionService } from './connection-drop-detection.service';

describe('ConnectionDropDetectionService', () => {
    let connectionDropDetectionService: ConnectionDropDetectionService,
        connectionServiceMock: jasmine.SpyObj<ConnectionService>,
        fakeObservable: Subject<boolean>;

    beforeEach(() => {
        connectionServiceMock = jasmine.createSpyObj('ConnectionService', ['monitor']);
        fakeObservable = new Subject<boolean>();
        connectionServiceMock.monitor.and.returnValue(fakeObservable.asObservable());

        TestBed.configureTestingModule({
            providers: [
                ConnectionDropDetectionService,
                { provide: ConnectionService, useValue: connectionServiceMock }
            ]
        });
        connectionDropDetectionService = TestBed.get(ConnectionDropDetectionService);
    });

    it('should be used to emit drop detection', () => {
        connectionDropDetectionService.subscribe(result => {
            expect(result).toBeTruthy();
        });
        connectionDropDetectionService.next(true);
    });

    it('on ConnectionService emitting should re-emmit negated value', () => {
        connectionDropDetectionService.subscribe(result => {
            expect(result).toBeTruthy();
        });
        fakeObservable.next(false);
    });
});
