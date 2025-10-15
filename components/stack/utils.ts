export type ColorOption = 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'pink';

export const colorBgClass: Record<ColorOption, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
};

export const colorRingClass: Record<ColorOption, string> = {
  red: 'ring-red-500',
  orange: 'ring-orange-500',
  green: 'ring-green-500',
  blue: 'ring-blue-500',
  purple: 'ring-purple-500',
  pink: 'ring-pink-500',
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function minutesToSeconds(mins: number) {
  return Math.floor(mins * 60);
}

export function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${mm}:${ss}`;
}

export type EmojiCategoryKey = 'Smileys' | 'People' | 'Animals' | 'Objects';

export const EMOJI_CATEGORIES: { key: EmojiCategoryKey; label: string }[] = [
  { key: 'Smileys', label: 'Smileys' },
  { key: 'People', label: 'People' },
  { key: 'Animals', label: 'Animals' },
  { key: 'Objects', label: 'Objects' },
];

export const EMOJI_DATA: Record<EmojiCategoryKey, string[]> = {
  Smileys: [
    '😀','😁','😂','🤣','😊','😍','😘','😎','😇','🙂',
    '🙃','😉','😌','🤗','🤩','🥳','😴','😤','😬','🤔'
  ],
  People: [
    '👶','🧒','👦','👧','🧑','👨','👩','👨‍🦰','👩‍🦰','👨‍🦳',
    '👩‍🦳','👨‍🦱','👩‍🦱','🧓','👴','👵','🧔','🙇','💃','🕺'
  ],
  Animals: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐤','🐥','🐦','🐧','🐠'
  ],
  Objects: [
    '📚','📖','📝','🖊️','🖋️','✏️','🗓️','⏰','⏳','🕹️',
    '🎧','🎮','💻','🖥️','📱','📷','🎒','🧪','⚽','🏋️'
  ],
};

export function filterEmojis(query: string, category: EmojiCategoryKey): string[] {
  const list = EMOJI_DATA[category] ?? [];
  if (!query?.trim()) return list;
  const q = query.trim().toLowerCase();
  // Basic filter: match against unicode names is complex; use list as-is and return all for now.
  // Optionally, filter by common aliases subset if ever added.
  return list.filter(e => e.toLowerCase().includes(q));
}

export const MIN_TASK_MINUTES = 5;
export const MAX_TASK_MINUTES = 120;
export const MIN_BREAK_MINUTES = 1;
export const MAX_BREAK_MINUTES = 30;
export const TASK_INCREMENT = 5;

export type TaskData = {
  title: string;
  minutes: number;
  emoji: string;
  color: ColorOption;
};