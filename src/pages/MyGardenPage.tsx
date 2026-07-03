import { useEffect, useState } from 'react';
import {
  createUserPlant,
  deleteUserPlant,
  fetchUserPlants,
  updateUserPlantReminder,
} from '../api/userPlants';
import { getSocket } from '../services/socket';
import { useGlobalPopup } from '../context/GlobalPopupContext';
import type { CreateUserPlantPayload, UserPlant, UserPlantReminder } from '../types';
import Spinner from '../components/Spinner';
import UserPlantCard from '../components/UserPlantCard';
import ReminderModal from '../components/ReminderModal';
import AddUserPlantModal from '../components/AddUserPlantModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MyGardenPage() {
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reminderTarget, setReminderTarget] = useState<UserPlant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserPlant | null>(null);
  const { showSuccess, showError } = useGlobalPopup();

  useEffect(() => {
    setIsLoading(true);
    fetchUserPlants()
      .then(setUserPlants)
      .catch(() => setUserPlants([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Real-time sync: when the same user adds/edits/removes plants from the
  // Mobile app, this page updates instantly without a refresh.
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (plant: UserPlant) => {
      setUserPlants((prev) =>
        prev.some((p) => p._id === plant._id) ? prev : [plant, ...prev],
      );
    };
    const handleUpdated = (plant: UserPlant) => {
      setUserPlants((prev) =>
        prev.map((p) => (p._id === plant._id ? plant : p)),
      );
    };
    const handleDeleted = (payload: { _id: string }) => {
      setUserPlants((prev) => prev.filter((p) => p._id !== payload._id));
    };

    socket.on('user-plant:created', handleCreated);
    socket.on('user-plant:updated', handleUpdated);
    socket.on('user-plant:deleted', handleDeleted);

    return () => {
      socket.off('user-plant:created', handleCreated);
      socket.off('user-plant:updated', handleUpdated);
      socket.off('user-plant:deleted', handleDeleted);
    };
  }, []);

  const handleAddSubmit = async (payload: CreateUserPlantPayload) => {
    setIsSubmitting(true);
    try {
      const created = await createUserPlant(payload);
      setUserPlants((prev) =>
        prev.some((p) => p._id === created._id) ? prev : [created, ...prev],
      );
      showSuccess(`Đã thêm "${created.customName}" vào vườn của bạn.`);
      setIsAddOpen(false);
    } catch {
      // Error toast already shown by the axios interceptor.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReminderSubmit = async (reminder: UserPlantReminder) => {
    if (!reminderTarget) return;
    setIsSubmitting(true);
    try {
      const updated = await updateUserPlantReminder(reminderTarget._id, reminder);
      setUserPlants((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p)),
      );
      showSuccess('Đã cập nhật nhắc nhở.');
      setReminderTarget(null);
    } catch {
      // Error toast already shown by the axios interceptor.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteUserPlant(deleteTarget._id);
      setUserPlants((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showSuccess(`Đã xoá "${deleteTarget.customName}" khỏi vườn.`);
      setDeleteTarget(null);
    } catch {
      showError('Không thể xoá cây này, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vườn của tôi</h1>
          <p className="text-sm text-gray-500">
            Theo dõi và nhắc nhở chăm sóc các cây bạn đã thêm — đồng bộ với ứng dụng
            di động.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="w-fit rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          + Thêm cây
        </button>
      </div>

      {isLoading ? (
        <Spinner label="Đang tải khu vườn của bạn..." />
      ) : userPlants.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <span className="text-4xl">🌱</span>
          <p className="text-gray-500">
            Vườn của bạn đang trống. Hãy thêm cây đầu tiên để bắt đầu nhận nhắc nhở
            chăm sóc.
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            + Thêm cây
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {userPlants.map((userPlant) => (
            <UserPlantCard
              key={userPlant._id}
              userPlant={userPlant}
              onEditReminder={setReminderTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {isAddOpen && (
        <AddUserPlantModal
          isSubmitting={isSubmitting}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddOpen(false)}
        />
      )}

      {reminderTarget && (
        <ReminderModal
          plant={reminderTarget}
          isSubmitting={isSubmitting}
          onSubmit={handleReminderSubmit}
          onCancel={() => setReminderTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Xoá cây khỏi vườn?"
          message={`Bạn có chắc muốn xoá "${deleteTarget.customName}" khỏi vườn của mình? Hành động này không thể hoàn tác.`}
          confirmLabel="Xoá"
          isDangerous
          isSubmitting={isSubmitting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
