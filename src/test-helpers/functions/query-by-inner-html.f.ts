import { DebugElement } from '@angular/core';

export function queryByInnerHTML(debugElement: DebugElement, innerHTML: string): DebugElement | null {
    return debugElement.query(d => (d.nativeElement as HTMLElement).innerHTML === innerHTML);
}
