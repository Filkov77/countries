import { Directive as OriginalDirective } from '@angular/core';

import { Directive } from './directive.decorator';
import { getMetadata } from './get-metadata.test-helper';

@Directive({
    selector: `[appTestDirective]`
})
class TestMockDirective { }

@OriginalDirective({
    selector: `[appTestDirective]`
})
class TestDirective { }

describe('DirectiveDecorator', () => {
    it('should apply the original @Directive decorator', () => {
        const mockMetadata = getMetadata(TestMockDirective);
        const originalMetadata = getMetadata(TestDirective);

        expect(mockMetadata).toEqual(originalMetadata);
    });
});
