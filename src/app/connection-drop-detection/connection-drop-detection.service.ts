import { Injectable } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { Subject } from 'rxjs';

/* ConnectionDropDetectionService emits true value whenever connections breaks and false whenever connection is established */

@Injectable()
export class ConnectionDropDetectionService extends Subject<boolean> {
    constructor(
        private connectionService: ConnectionService,
    ) {
        super()/* istanbul ignore next */;

        this.connectionService.monitor().subscribe(isConnected => {
            this.next(!isConnected);
        });
    }
}
