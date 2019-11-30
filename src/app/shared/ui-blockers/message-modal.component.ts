import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: '[app-message-modal]',
    templateUrl: './message-modal.component.html'
})
export class MessageModalComponent {
    @Input()
    message: string | undefined;

    constructor(
        public modal: NgbActiveModal
    ) { }
}
