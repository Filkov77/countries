import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActivityService, FlashService } from './services';
import { UiBlockersModule } from './ui-blockers/ui-blockers.module';

/**
 * The module containing all the general stuff that does not need any knowledge about the application
 * and can be easily reused in other apps.
 */
@NgModule({
    imports: [
        CommonModule,
        UiBlockersModule
    ],
    exports: [
        UiBlockersModule,
    ],
    providers: [
        ActivityService,
        FlashService
    ]
})
export class SharedModule { }
