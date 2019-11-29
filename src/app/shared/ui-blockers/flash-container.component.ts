import { Component, OnInit } from '@angular/core';

import { Destroyable } from '../directives';
import { FlashMessage, FlashService } from '../services';

@Component({
    selector: '[app-flash-container]',
    templateUrl: './flash-container.component.html',
    styleUrls: []
})
export class FlashContainerComponent extends Destroyable implements OnInit {
    items: FlashMessage[] = [];

    constructor(private flash: FlashService) {
        super();
    }

    ngOnInit() {
        const { flash, items } = this;
        this.subscriptions.push(flash.subscribe(message => items.push(message)));
    }

    clearAll() {
        this.items.length = 0;
    }

    removeMessage(message: FlashMessage) {
        const { items } = this;
        const ix = items.indexOf(message);
        if (ix > -1) {
            items.splice(ix, 1);
        }
    }
}
