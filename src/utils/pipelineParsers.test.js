import { describe, expect, it } from 'vitest';
import { buildFinalResult, parseContent } from '../../scripts/lib/bookPipeline';
import { buildPrayerResults, parseSectionHeader, parsePrayerFileContents } from '../../scripts/lib/prayerPipeline';

describe('bookPipeline', () => {
    it('parses both starred and plain English/Korean labels', () => {
        const paragraphs = parseContent(
            [
                '[문단 1]',
                '* English: Starred English',
                '* Korean: Starred Korean',
                '',
                '[문단 2]',
                'English: Plain English',
                'Korean: Plain Korean',
            ].join('\n'),
        );

        expect(paragraphs[1]).toEqual({ english: 'Starred English', korean: 'Starred Korean' });
        expect(paragraphs[2]).toEqual({ english: 'Plain English', korean: 'Plain Korean' });
    });

    it('creates fallback English only when source text is missing', () => {
        const result = buildFinalResult(
            [{ mainId: 1, start: 1, end: 1, title: 'Section One' }],
            { 1: { english: '', korean: '한국어 미리보기 텍스트', tibetan: '' } },
        );

        expect(result[0].subchapters[0].verses[0].chapterTitle).toBe('한국어 미리보기 텍스트');
    });
});

describe('prayerPipeline', () => {
    it('parses all supported prayer section header formats', () => {
        expect(parseSectionHeader('[제 3연] 자비로운 붓다')).toEqual({ number: '3', title: '자비로운 붓다' });
        expect(parseSectionHeader('2. 법신에 대한 기도')).toEqual({ number: '2', title: '법신에 대한 기도' });
        expect(parseSectionHeader('4 중간계 수행자를 위한 기도')).toEqual({ number: '4', title: '중간계 수행자를 위한 기도' });
    });

    it('splits prayer file contents into Tibetan, English, and Korean blocks', () => {
        const sections = parsePrayerFileContents(
            '4.txt',
            [
                '1 간계 진입',
                'ཀྱེ་མ་',
                'When the time comes,',
                '그때가 오면,',
            ].join('\n'),
        );

        expect(sections).toHaveLength(1);
        expect(sections[0]).toMatchObject({
            id: '4.1',
            title: '간계 진입',
            tibetan: ['ཀྱེ་མ་'],
            english: ['When the time comes,'],
            korean: ['그때가 오면,'],
        });
    });

    it('creates audio URLs only for prayer chapters with recorded audio', () => {
        const result = buildPrayerResults({
            '1.txt': '1. 첫 기도\nཀྱེ་མ་\nEnglish line\n한국어 줄',
            '2.txt': '1. 둘째 기도\nཀྱེ་མ་\nEnglish line\n한국어 줄',
            '3.txt': '1. 셋째 기도\nཀྱེ་མ་\nEnglish line\n한국어 줄',
            '4.txt': '1 넷째 기도\nཀྱེ་མ་\nEnglish line\n한국어 줄',
            '5.txt': '1. 다섯째 기도\nཀྱེ་མ་\nEnglish line\n한국어 줄',
        });

        expect(result.find((chapter) => chapter.id === 'prayer-1')?.verses[0].audioUrl).toBeNull();
        expect(result.find((chapter) => chapter.id === 'prayer-4')?.verses[0].audioUrl).toBe('/mp3/Prayer/4-1.mp3');
    });
});
