import { Pipe as OriginalDecorator } from '@angular/core';

export function Pipe(pipe: OriginalDecorator): ClassDecorator {
    return function (target: Function) {
        OriginalDecorator(pipe)(target);
    };
}
