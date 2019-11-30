import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlashContainerComponent } from './flash-container.component';
import { FlashMessageComponent } from './flash-message.component';
import { LineLoaderComponent } from './line-loader.component';
import { MessageModalComponent } from './message-modal.component';
import { OverlayComponent } from './overlay.component';
import { ProgressBarComponent } from './progress-bar.component';
import { SpinnerComponent } from './spinner.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        OverlayComponent,
        LineLoaderComponent,
        FlashContainerComponent,
        FlashMessageComponent,
        ProgressBarComponent,
        SpinnerComponent,
        MessageModalComponent
    ],
    entryComponents: [
        MessageModalComponent
    ],
    exports: [
        OverlayComponent,
        LineLoaderComponent,
        FlashContainerComponent,
        FlashMessageComponent,
        ProgressBarComponent,
        SpinnerComponent,
        MessageModalComponent
    ]
})
export class UiBlockersModule {
}
