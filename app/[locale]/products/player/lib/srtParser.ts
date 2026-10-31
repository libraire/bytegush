import { SubtitleItem } from './types';

/**
 * Parse timecode HH:MM:SS,mmm or HH:MM:SS.mmm into milliseconds
 */
export function timecodeToMilliseconds(timecode: string): number {
  const normalized = timecode.trim().replace('.', ',');
  const parts = normalized.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!parts) {
    // Try without leading zeros or mm:ss,mmm format
    const shortParts = normalized.match(/(\d{2}):(\d{2}),(\d{3})/);
    if (shortParts) {
      const minutes = parseInt(shortParts[1], 10);
      const seconds = parseInt(shortParts[2], 10);
      const milliseconds = parseInt(shortParts[3], 10);
      return minutes * 60000 + seconds * 1000 + milliseconds;
    }
    throw new Error(`Invalid timecode format: ${timecode}`);
  }
  const hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[2], 10);
  const seconds = parseInt(parts[3], 10);
  const milliseconds = parseInt(parts[4], 10);
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}

/**
 * Parse raw SRT / VTT string into an array of SubtitleItems
 */
export function parseSrtContent(srtContent: string): SubtitleItem[] {
  const subtitles: SubtitleItem[] = [];
  const normalizedContent = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalizedContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const rawLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (rawLines.length === 0) continue;

    // Check if line 0 is a sequence number or directly the timecode
    let sequence = '';
    let timecodeLine = '';
    let textStartIndex = 0;

    const timecodeRegex = /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/;

    if (rawLines[0].match(timecodeRegex)) {
      sequence = String(subtitles.length + 1);
      timecodeLine = rawLines[0];
      textStartIndex = 1;
    } else if (rawLines.length >= 2 && rawLines[1].match(timecodeRegex)) {
      sequence = rawLines[0];
      timecodeLine = rawLines[1];
      textStartIndex = 2;
    } else {
      continue;
    }

    const timecodeMatch = timecodeLine.match(timecodeRegex);
    if (timecodeMatch) {
      try {
        const startTime = timecodeToMilliseconds(timecodeMatch[1]);
        const endTime = timecodeToMilliseconds(timecodeMatch[2]);
        const text = rawLines.slice(textStartIndex).join(' ');
        if (text) {
          subtitles.push({ sequence, startTime, endTime, text });
        }
      } catch (e) {
        console.warn(`Skipping invalid timecode block: ${timecodeLine}`, e);
      }
    }
  }

  return subtitles;
}

/**
 * Extracts context sentence spanning across adjacent subtitles
 * Ported from original bytegush-backend/public/js/srt.js
 */
export function getContextualSentence(clickedIndex: number, subtitlesArray: SubtitleItem[]): string {
  if (!subtitlesArray || subtitlesArray.length === 0 || clickedIndex < 0 || clickedIndex >= subtitlesArray.length) {
    return '';
  }

  const textParts: string[] = [];
  const maxLinesToScan = 3;
  const maxLengthChars = 280;

  textParts.push(subtitlesArray[clickedIndex].text);
  let currentLength = subtitlesArray[clickedIndex].text.length;
  let needsMoreForward = !/[.?!"]$/.test(textParts.join(' ').trim());

  if (needsMoreForward) {
    for (let i = 1; i < maxLinesToScan; i++) {
      const nextIndex = clickedIndex + i;
      if (nextIndex < subtitlesArray.length && currentLength < maxLengthChars) {
        const nextText = subtitlesArray[nextIndex].text;
        textParts.push(nextText);
        currentLength += nextText.length + 1;
        if (/[.?!"]$/.test(nextText.trim())) {
          needsMoreForward = false;
          break;
        }
      } else {
        break;
      }
    }
  }

  const currentFullTextForPrependCheck = textParts.join(' ').trim();
  let needsMoreBackward = !/^[A-Z0-9“"']/.test(currentFullTextForPrependCheck.charAt(0));

  if (!needsMoreBackward && clickedIndex > 0) {
    const prevLineText = subtitlesArray[clickedIndex - 1].text.trim();
    if (!/[.?!"]$/.test(prevLineText)) {
      needsMoreBackward = true;
    }
  }

  if (needsMoreBackward) {
    for (let i = 1; i < maxLinesToScan; i++) {
      const prevIndex = clickedIndex - i;
      if (prevIndex >= 0 && currentLength < maxLengthChars) {
        const prevText = subtitlesArray[prevIndex].text;
        textParts.unshift(prevText);
        currentLength += prevText.length + 1;
        if (/^[A-Z0-9“"']/.test(prevText.trim().charAt(0))) {
          break;
        }
      } else {
        break;
      }
    }
  }

  let finalSentence = textParts.join(' ').trim();
  if (finalSentence.length > maxLengthChars) {
    const lastSpace = finalSentence.lastIndexOf(' ', maxLengthChars);
    if (lastSpace > -1 && lastSpace < finalSentence.length - 1) {
      finalSentence = finalSentence.substring(0, lastSpace) + '...';
    } else {
      finalSentence = finalSentence.substring(0, maxLengthChars - 3) + '...';
    }
  }

  finalSentence = finalSentence.replace(/\s\s+/g, ' ');
  return finalSentence;
}

/**
 * Format milliseconds to 00:00:00 or 00:00
 */
export function formatMilliseconds(ms: number): string {
  ms = Math.max(0, ms);
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const DEMO_SRT_CONTENT = `1
00:00:01,000 --> 00:00:04,500
I am honored to be with you today at your commencement

2
00:00:04,600 --> 00:00:08,200
from one of the finest universities in the world.

3
00:00:08,500 --> 00:00:12,100
Truth be told, I never graduated from college.

4
00:00:12,300 --> 00:00:16,000
This is the closest I've ever gotten to a college graduation.

5
00:00:16,500 --> 00:00:20,800
Today I want to tell you three stories from my life.

6
00:00:21,000 --> 00:00:23,800
That's it. No big deal. Just three stories.

7
00:00:24,200 --> 00:00:27,900
The first story is about connecting the dots.

8
00:00:28,200 --> 00:00:32,000
I dropped out of Reed College after the first six months,

9
00:00:32,200 --> 00:00:36,500
but then stayed around as a drop-in for another eighteen months or so before I really quit.

10
00:00:37,000 --> 00:00:41,200
So why did I drop out? It started before I was born.

11
00:00:41,500 --> 00:00:45,800
My biological mother was a young, unwed college graduate student,

12
00:00:46,000 --> 00:00:49,500
and she decided to put me up for adoption.

13
00:00:50,000 --> 00:00:54,800
She felt very strongly that I should be adopted by college graduates.

14
00:00:55,200 --> 00:00:59,900
You can't connect the dots looking forward;

15
00:01:00,100 --> 00:01:04,200
you can only connect them looking backward.

16
00:01:04,500 --> 00:01:09,800
So you have to trust that the dots will somehow connect in your future.

17
00:01:10,200 --> 00:01:14,500
You have to trust in something — your gut, destiny, life, karma, whatever.

18
00:01:15,000 --> 00:01:19,200
Because believing that the dots will connect down the road

19
00:01:19,500 --> 00:01:23,800
will give you the confidence to follow your heart,

20
00:01:24,000 --> 00:01:28,000
even when it leads you off the well-worn path.

21
00:01:28,500 --> 00:01:33,000
And that will make all the difference.

22
00:01:33,500 --> 00:01:38,000
Your time is limited, so don't waste it living someone else's life.

23
00:01:38,500 --> 00:01:43,500
Don't be trapped by dogma — which is living with the results of other people's thinking.

24
00:01:44,000 --> 00:01:48,800
Stay Hungry. Stay Foolish.
`;

export const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
