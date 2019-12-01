import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

export function queryAll(debugElement: DebugElement, by: string | Type<any>): DebugElement[] {
    return debugElement.queryAll(typeof by === 'string' ? By.css(by) : By.directive(by));
}
