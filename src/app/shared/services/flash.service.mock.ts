import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { FlashMessage } from 'app/shared';

@Injectable()
export class FlashServiceMock extends Subject<FlashMessage> { }
