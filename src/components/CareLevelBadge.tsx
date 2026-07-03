import type { CareLevel } from '../types';

const CARE_LEVEL_LABEL: Record<CareLevel, string> = {
  easy: 'Dễ chăm sóc',
  medium: 'Trung bình',
  hard: 'Khó chăm sóc',
};

const CARE_LEVEL_STYLE: Record<CareLevel, string> = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-red-100 text-red-800 border-red-300',
};

export default function CareLevelBadge({ level }: { level: CareLevel }) {
  const style = CARE_LEVEL_STYLE[level] ?? 'bg-gray-100 text-gray-800 border-gray-300';
  const label = CARE_LEVEL_LABEL[level] ?? level;
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${style}`}
    >
      {label}
    </span>
  );
}
