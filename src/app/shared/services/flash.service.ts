import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// TODO this would make sense to become part of Bootstrap UI typings under this project
export enum FlashMessageUiClass {
    danger = 'danger',
    info = 'info',
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    warning = 'warning'
}

export interface FlashMessage {
    value: string;
    timeout?: number;
    iconClass?: string; // any font awesome class like 'fa fa-exclamation'
    uiClass?: FlashMessageUiClass;
}

@Injectable()
export class FlashService extends Subject<FlashMessage> {
}
