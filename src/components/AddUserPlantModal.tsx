import { useEffect, useState, type FormEvent } from 'react';
import { fetchPlants } from '../api/plants';
import { SPACE_OPTIONS } from '../constants/spaces';
import type { CreateUserPlantPayload, Plant } from '../types';

interface AddUserPlantModalProps {
  isSubmitting: boolean;
  onSubmit: (payload: CreateUserPlantPayload) => void;
  onCancel: () => void;
}

type SourceMode = 'catalog' | 'custom';

export default function AddUserPlantModal({
  isSubmitting,
  onSubmit,
  onCancel,
}: AddUserPlantModalProps) {
  const [mode, setMode] = useState<SourceMode>('catalog');
  const [catalog, setCatalog] = useState<Plant[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [customName, setCustomName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [space, setSpace] = useState(SPACE_OPTIONS[0].value);

  useEffect(() => {
    fetchPlants()
      .then((data) => {
        setCatalog(data);
        if (data.length > 0) setSelectedPlantId(data[0]._id);
      })
      .catch(() => setCatalog([]))
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (mode === 'catalog') {
      const plant = catalog.find((p) => p._id === selectedPlantId);
      if (!plant) return;
      onSubmit({
        plantId: plant._id,
        customName: plant.name,
        photoUrl: photoUrl || plant.images?.[0] || undefined,
        space,
      });
    } else {
      if (!customName.trim()) return;
      onSubmit({
        plantId: null,
        customName: customName.trim(),
        photoUrl: photoUrl || undefined,
        space,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">Thêm cây vào vườn</h2>

        <div className="flex gap-2 rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('catalog')}
            className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
              mode === 'catalog' ? 'bg-white shadow text-green-700' : 'text-gray-500'
            }`}
          >
            Chọn từ danh mục
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
              mode === 'custom' ? 'bg-white shadow text-green-700' : 'text-gray-500'
            }`}
          >
            Nhập tuỳ ý
          </button>
        </div>

        {mode === 'catalog' ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Chọn cây</span>
            {isLoadingCatalog ? (
              <span className="text-sm text-gray-400">Đang tải danh mục...</span>
            ) : catalog.length === 0 ? (
              <span className="text-sm text-gray-400">
                Không có cây nào trong danh mục.
              </span>
            ) : (
              <select
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {catalog.map((plant) => (
                  <option key={plant._id} value={plant._id}>
                    {plant.name}
                  </option>
                ))}
              </select>
            )}
          </label>
        ) : (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Tên cây</span>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ví dụ: Cây lưỡi hổ của mẹ"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Vị trí đặt cây</span>
          <select
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {SPACE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">
            URL ảnh {mode === 'catalog' ? '(tuỳ chọn, mặc định dùng ảnh danh mục)' : '(tuỳ chọn)'}
          </span>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
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
            disabled={isSubmitting || (mode === 'catalog' && catalog.length === 0)}
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm vào vườn'}
          </button>
        </div>
      </form>
    </div>
  );
}
