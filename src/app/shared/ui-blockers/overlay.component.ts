import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'div[app-overlay]',
    templateUrl: './overlay.component.html'
})
export class OverlayComponent implements OnChanges {
    /**
     * Should overlay be shown thus blocking user from interacting with elements beneath it or not shown
     */
    @Input() show = false;

    /**
     * Should the showing of overlay be delayed or instant
     */
    @Input() delayed = false;

    /**
     * Should the position of overlay be fixed or absolutely positioned
     */
    @Input() fixed = false;

    /**
     * Should indicator (spinner) be shown when overlay is on
     */
    @Input() useIndicator = true;

    /**
     * Should message we shown when overlay is on
     */
    @Input() useMessage = true;

    /**
     * Message to display if useMessage = true
     */
    @Input() message = 'Loading, please wait...';

    @HostBinding('class') classes = '';

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show) {
            // changing delayed or fixed in "mid-flight" is not advisable as it will totally mess up the animations
            // so we only trigger toggling when "show" changes
            this.toggleOverlay(changes.show.firstChange);
        }
    }

    private toggleOverlay(firstChange: boolean) {
        const classes =  this.getStaticClasses();
        if (this.show) {
            classes.push('show');
        }
        else if (!firstChange) {
            classes.push('hide');
        }
        this.classes = classes.join(' ');
    }

    private getStaticClasses() {
        const classes = [];
        if (this.delayed) {
            classes.push('delayed');
        }
        if (this.fixed) {
            classes.push('fixed');
        }
        return classes;
    }
}
