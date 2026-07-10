export interface SpaceOption {
  value: string;
  label: string;
}

// Mirrors Mobile's src/constants/spaces.ts SPACE_OPTIONS keys, so a plant's
// "space" means the same thing whether it was added from the app or the web.
export const SPACE_OPTIONS: SpaceOption[] = [
  { value: 'indoor', label: 'Không gian trong nhà' },
  { value: 'desk', label: 'Góc làm việc' },
  { value: 'balcony', label: 'Ban công / cửa sổ' },
  { value: 'garden', label: 'Sân vườn' },
  { value: 'other', label: 'Khác' },
];

export function getSpaceLabel(value?: string | null): string {
  return SPACE_OPTIONS.find((opt) => opt.value === value)?.label ?? 'Chưa phân loại';
}
