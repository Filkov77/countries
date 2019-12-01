import { Component, OnInit } from '@angular/core';

import { ConnectionDropDetectionService } from 'app/connection-drop-detection';
import { ActivityEmission, ActivityService, Destroyable } from 'app/shared';

@Component({
    selector: '[app-root]',
    templateUrl: './app.component.html'
})
export class AppComponent extends Destroyable implements OnInit {
    loading = true;
    showLineLoader = false;
    showOverlay = false;
    overlayMessage = 'Loading, please wait...';
    isConnected = true;

    constructor(
        private activity: ActivityService,
        private connectionDropDetectionService: ConnectionDropDetectionService
    ) {
        super();

        this.connectionDropDetectionService.subscribe((show: boolean) => {
            this.isConnected = !show;
        });
    }

    ngOnInit() {
        const {
            activity,
            onLineLoaderActivity,
            onOverlayActivity
        } = this;
        this.subscriptions.push(
            activity.activeCount('line_loader').subscribe(onLineLoaderActivity.bind(this)),
            activity.allEmissions<string>('overlay').subscribe(onOverlayActivity.bind(this))
        );
    }

    private onLineLoaderActivity(activeEmitters: number) {
        this.showLineLoader = activeEmitters > 0;
    }

    private onOverlayActivity({ activeEmitters, value }: ActivityEmission<string>) {
        this.showOverlay = activeEmitters > 0;
        if (value) {
            this.overlayMessage = value;
        }
    }
}
