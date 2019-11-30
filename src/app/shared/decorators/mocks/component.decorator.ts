import { Component as OriginalDecorator } from '@angular/core';

export function Component(component: OriginalDecorator): ClassDecorator {
    return function (target: Function) {
        OriginalDecorator(component)(target);
    };
}
