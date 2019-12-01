import { NgModule } from '@angular/core';

import { ConnectionDropDetectionService } from './connection-drop-detection.service';
import { ConnectionErrorOverlayComponent } from './connection-error-overlay.component';

@NgModule({
    declarations: [
        ConnectionErrorOverlayComponent
    ],
    providers: [
        ConnectionDropDetectionService
    ],
    exports: [
        ConnectionErrorOverlayComponent
    ]
})
export class ConnectionDropDetectionModule {
}
