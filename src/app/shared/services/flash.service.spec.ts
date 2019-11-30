import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { FlashService } from './flash.service';

describe('FlashService', () => {
    let flashService: FlashService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FlashService]
        });
        flashService = TestBed.get(FlashService);
    });

    it('should be created', () => {
        expect(flashService).toBeTruthy();
    });

    it('should extend Observable.Subject', () => {
        expect(flashService instanceof Subject).toBeTruthy('Is not instance of Observable.Subject');
    });
});
