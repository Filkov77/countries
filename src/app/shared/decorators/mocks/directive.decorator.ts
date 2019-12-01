import { Directive as OriginalDecorator } from '@angular/core';

export function Directive(directive: OriginalDecorator): ClassDecorator {
    return function (target: Function) {
        OriginalDecorator(directive)(target);
    };
}
