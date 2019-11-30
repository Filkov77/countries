import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: '[app-spinner]',
    templateUrl: './spinner.component.html',
    styleUrls: []
})
export class SpinnerComponent {
    @HostBinding('class')
    classes = 'fa fa-spinner fa-spin';

    @HostBinding('class.fa-2x') @Input()
    doubleSize = false;
}
