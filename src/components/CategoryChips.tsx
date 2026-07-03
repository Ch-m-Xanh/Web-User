import type { CategoryOption } from '../types';

interface CategoryChipsProps {
  categories: CategoryOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export default function CategoryChips({
  categories,
  selected,
  onSelect,
}: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          selected === null
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
        }`}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            selected === cat.value
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
