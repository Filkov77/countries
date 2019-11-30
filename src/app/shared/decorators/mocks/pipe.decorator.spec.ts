import { Pipe as OriginalPipe, PipeTransform } from '@angular/core';

import { getMetadata } from './get-metadata.test-helper';
import { Pipe } from './pipe.decorator';

@Pipe({
    name: 'some-pipe-name'
})
class TestMockPipe implements PipeTransform {
    transform() { }
}

@OriginalPipe({
    name: 'some-pipe-name'
})
class TestPipe implements PipeTransform {
    transform() { }
}

describe('PipeDecorator', () => {
    it('should apply the original @Pipe decorator', () => {
        const mockMetadata = getMetadata(TestMockPipe);
        const originalMetadata = getMetadata(TestPipe);

        expect(mockMetadata).toEqual(originalMetadata);
    });
});
