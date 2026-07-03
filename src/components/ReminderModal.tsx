import { useState, type FormEvent } from 'react';
import type { UserPlant, UserPlantReminder } from '../types';

interface ReminderModalProps {
  plant: UserPlant;
  isSubmitting: boolean;
  onSubmit: (reminder: UserPlantReminder) => void;
  onCancel: () => void;
}

const DEFAULT_REMINDER: UserPlantReminder = {
  enabled: true,
  wateringIntervalDays: 3,
  fertilizingIntervalDays: 30,
  notifyTime: '08:00',
};

export default function ReminderModal({
  plant,
  isSubmitting,
  onSubmit,
  onCancel,
}: ReminderModalProps) {
  const [reminder, setReminder] = useState<UserPlantReminder>(
    plant.reminder ?? DEFAULT_REMINDER,
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(reminder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-4"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Nhắc nhở chăm sóc</h2>
          <p className="text-sm text-gray-500">{plant.customName}</p>
        </div>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">Bật nhắc nhở</span>
          <input
            type="checkbox"
            checked={reminder.enabled}
            onChange={(e) =>
              setReminder((prev) => ({ ...prev, enabled: e.target.checked }))
            }
            className="h-5 w-5 accent-green-600"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Chu kỳ tưới nước (ngày)</span>
          <input
            type="number"
            min={1}
            required
            value={reminder.wateringIntervalDays}
            onChange={(e) =>
              setReminder((prev) => ({
                ...prev,
                wateringIntervalDays: Number(e.target.value),
              }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Chu kỳ bón phân (ngày)</span>
          <input
            type="number"
            min={1}
            required
            value={reminder.fertilizingIntervalDays}
            onChange={(e) =>
              setReminder((prev) => ({
                ...prev,
                fertilizingIntervalDays: Number(e.target.value),
              }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Giờ nhắc</span>
          <input
            type="time"
            required
            value={reminder.notifyTime}
            onChange={(e) =>
              setReminder((prev) => ({ ...prev, notifyTime: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
