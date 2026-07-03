import { useEffect, useMemo, useState } from 'react';
import { fetchPlants } from '../api/plants';
import { fetchCategories } from '../api/categories';
import type { CategoryOption, Plant } from '../types';
import CategoryChips from '../components/CategoryChips';
import PlantCard from '../components/PlantCard';
import Spinner from '../components/Spinner';

const FALLBACK_CATEGORIES: CategoryOption[] = [
  { value: 'phong-ngu', label: 'Phòng ngủ' },
  { value: 'ban-lam-viec', label: 'Bàn làm việc' },
  { value: 'phong-bep', label: 'Phòng bếp' },
  { value: 'rau-cu-chua-benh', label: 'Rau củ chữa bệnh' },
];

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryOption[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search input.
  useEffect(() => {
    const handle = window.setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (data.length > 0) setCategories(data);
      })
      .catch(() => {
        // Keep fallback categories if the endpoint is unavailable.
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPlants({
      category: selectedCategory ?? undefined,
      search: search || undefined,
    })
      .then(setPlants)
      .catch(() => setPlants([]))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, search]);

  const emptyMessage = useMemo(() => {
    if (search) return `Không tìm thấy cây phù hợp với "${search}".`;
    return 'Chưa có cây nào trong danh mục này.';
  }, [search]);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800">
          Chào mừng đến với Chạm Xanh 🌿
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Khám phá thế giới cây trồng, tìm loại cây phù hợp với không gian sống của bạn
          và học cách chăm sóc chúng mỗi ngày.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm kiếm tên cây..."
          className="w-full sm:max-w-md rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <CategoryChips
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      <section>
        {isLoading ? (
          <Spinner label="Đang tải danh sách cây..." />
        ) : plants.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
