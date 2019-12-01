import { Input } from '@angular/core';

import { Component } from '../decorators';

@Component({
    selector: '[app-overlay]',
    template: ''
})
export class OverlayMockComponent {
    @Input() show = false;
    @Input() delayed = false;
    @Input() fixed = false;
    @Input() useMessage = true;
    @Input() useIndicator = true;
    @Input() message = 'Loading, please wait...';
}
