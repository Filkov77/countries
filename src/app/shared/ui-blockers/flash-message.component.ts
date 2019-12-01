import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FlashMessage } from '../services';

@Component({
    selector: '[app-flash-message]',
    templateUrl: './flash-message.component.html',
    styleUrls: []
})
export class FlashMessageComponent implements OnInit, OnDestroy {

    @Input() item!: FlashMessage;
    @Output() onRemove: EventEmitter<void> = new EventEmitter();

    private timer: number | null = null;

    remove() {
        this.timer = null;
        this.onRemove.emit();
    }

    ngOnInit() {
        if (this.item.timeout) {
            this.timer = setTimeout(() => {
                // though it is expected "parent" FlashContainerComponent will destroy component when first onRemove event is emitted due to
                //  async nature of setTimeout() and Observables, it may be that events overlap just enough that onRemove is emitted twice
                //  - this is to prevent that from happening
                if (this.timer) {
                    this.remove();
                }
            }, this.item.timeout) as any;
        }
    }

    ngOnDestroy() {
        // it may be that user clicked "remove" button in FlashMessageContainer or "remove-all" in FlashContainerComponent
        // so if there is still timer active, we need to clear it
        if (this.timer) { // if pending timer, clear it
            clearTimeout(this.timer);
        }
    }
}
