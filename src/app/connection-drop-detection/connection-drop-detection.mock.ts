import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ConnectionDropDetectionServiceMock extends Subject<boolean> {
}
