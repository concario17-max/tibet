import { describe, expect, it } from 'vitest';
import { flattenVerses } from './textUtils';

describe('flattenVerses', () => {
    it('flattens direct chapter verse arrays', () => {
        const data = [
            { id: 'prayer-1', verses: [{ id: '1.1' }, { id: '1.2' }] },
            { id: 'prayer-2', verses: [{ id: '2.1' }] },
        ];

        expect(flattenVerses(data)).toEqual([{ id: '1.1' }, { id: '1.2' }, { id: '2.1' }]);
    });

    it('flattens grouped subchapter verses', () => {
        const data = [
            {
                id: 'group-1',
                isGroup: true,
                subchapters: [
                    { id: 'chapter-1-0', verses: [{ id: '101' }] },
                    { id: 'chapter-1-1', verses: [{ id: '102' }, { id: '103' }] },
                ],
            },
        ];

        expect(flattenVerses(data)).toEqual([{ id: '101' }, { id: '102' }, { id: '103' }]);
    });
});
