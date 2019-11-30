import { EventEmitter, Input, Output } from '@angular/core';

import { FlashMessage } from 'app/shared';

import { Component } from '../decorators';

@Component({
    selector: '[app-flash-message]',
    template: ''
})
export class FlashMessageMockComponent {
    @Input() item!: FlashMessage;
    @Output() onRemove = new EventEmitter();
}
