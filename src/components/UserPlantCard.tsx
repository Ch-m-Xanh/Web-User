import type { UserPlant } from '../types';

const FALLBACK_IMAGE =
  'https://placehold.co/400x300/e2f0e2/1f2937?text=Cham+Xanh';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

interface UserPlantCardProps {
  userPlant: UserPlant;
  onEditReminder: (userPlant: UserPlant) => void;
  onDelete: (userPlant: UserPlant) => void;
}

export default function UserPlantCard({
  userPlant,
  onEditReminder,
  onDelete,
}: UserPlantCardProps) {
  const { reminder } = userPlant;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={userPlant.photoUrl || FALLBACK_IMAGE}
          alt={userPlant.customName}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">
            {userPlant.customName}
          </h3>
          <span className="text-xs text-gray-400">
            Thêm ngày {formatDate(userPlant.addedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
              reminder?.enabled
                ? 'border-green-300 bg-green-100 text-green-800'
                : 'border-gray-300 bg-gray-100 text-gray-600'
            }`}
          >
            {reminder?.enabled ? '🔔 Đang bật nhắc' : '🔕 Đã tắt nhắc'}
          </span>
        </div>

        {reminder?.enabled && (
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <span>💧 Tưới mỗi {reminder.wateringIntervalDays} ngày</span>
            <span>🌱 Bón phân mỗi {reminder.fertilizingIntervalDays} ngày</span>
            <span className="col-span-2">⏰ Giờ nhắc: {reminder.notifyTime}</span>
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEditReminder(userPlant)}
            className="flex-1 rounded-full border border-green-300 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
          >
            Sửa nhắc nhở
          </button>
          <button
            type="button"
            onClick={() => onDelete(userPlant)}
            className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
