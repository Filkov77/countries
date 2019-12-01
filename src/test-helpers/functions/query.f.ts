import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

export function query(debugElement: DebugElement, by: string | Type<any>): DebugElement | null {
    // According to Angular docs and by contents of file:
    // @link<https://github.com/angular/angular/blob/cfae2c27cb25f59b16691abac0bc690117403f26/packages/core/src/debug/debug_node.ts#L74>
    // query() method return type is only mentioning DebugElement, but it will actually return null if no element found.
    return debugElement.query(typeof by === 'string' ? By.css(by) : By.directive(by));
}
