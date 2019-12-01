import { Component as OriginalComponent } from '@angular/core';

import { Component } from './component.decorator';
import { getMetadata } from './get-metadata.test-helper';

@Component({
    selector: `app-test-component`,
    template: ``
})
class TestMockComponent { }

@OriginalComponent({
    selector: `app-test-component`,
    template: ``
})
class TestComponent { }

describe('ComponentDecorator', () => {
    it('should apply the original @Component decorator', () => {
        const mockMetadata = getMetadata(TestMockComponent);
        const originalMetadata = getMetadata(TestComponent);

        expect(mockMetadata).toEqual(originalMetadata);
    });
});
