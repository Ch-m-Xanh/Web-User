import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlants } from '../api/plants';
import { fetchCategories } from '../api/categories';
import { fetchArticles } from '../api/articles';
import { getSocket } from '../services/socket';
import type { Article, CategoryOption, Plant } from '../types';
import CategoryChips from '../components/CategoryChips';
import PlantCard from '../components/PlantCard';
import ArticleCard from '../components/ArticleCard';
import Spinner from '../components/Spinner';
import CardSkeletonGrid from '../components/CardSkeleton';

const FALLBACK_CATEGORIES: CategoryOption[] = [
  { value: 'phong-ngu', label: 'Phòng ngủ' },
  { value: 'ban-lam-viec', label: 'Bàn làm việc' },
  { value: 'phong-bep', label: 'Phòng bếp' },
  { value: 'phong-khach', label: 'Phòng khách' },
  { value: 'san-nha', label: 'Sân nhà' },
  { value: 'ban-cong', label: 'Ban công' },
  { value: 'rau-cu-chua-benh', label: 'Rau củ / Chữa bệnh' },
];

const LATEST_ARTICLES_COUNT = 4;

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryOption[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

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

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setLatestArticles(sorted.slice(0, LATEST_ARTICLES_COUNT));
      })
      .catch(() => setLatestArticles([]))
      .finally(() => setIsLoadingArticles(false));
  }, []);

  // Real-time sync: reflect catalog changes made by admins without a refresh.
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (plant: Plant) => {
      setPlants((prev) =>
        prev.some((p) => p._id === plant._id) ? prev : [plant, ...prev],
      );
    };
    const handleUpdated = (plant: Plant) => {
      setPlants((prev) => prev.map((p) => (p._id === plant._id ? plant : p)));
    };
    const handleDeleted = (payload: { _id: string }) => {
      setPlants((prev) => prev.filter((p) => p._id !== payload._id));
    };

    socket.on('plant:created', handleCreated);
    socket.on('plant:updated', handleUpdated);
    socket.on('plant:deleted', handleDeleted);

    return () => {
      socket.off('plant:created', handleCreated);
      socket.off('plant:updated', handleUpdated);
      socket.off('plant:deleted', handleDeleted);
    };
  }, []);

  const emptyMessage = useMemo(() => {
    if (search) return `Không tìm thấy cây phù hợp với "${search}".`;
    return 'Chưa có cây nào trong danh mục này.';
  }, [search]);

  return (
    <div className="flex flex-col gap-14">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-14 text-center text-white sm:px-10">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            🌿 Hệ sinh thái chăm cây Chạm Xanh
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Chào mừng đến với Chạm Xanh
          </h1>
          <p className="max-w-2xl text-green-50/90 sm:text-lg">
            Khám phá thế giới cây trồng, tìm loại cây phù hợp với không gian sống của
            bạn, xây dựng khu vườn riêng và học cách chăm sóc chúng mỗi ngày.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/vuon-cua-toi"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-transform hover:scale-105"
            >
              Vào vườn của tôi
            </Link>
            <Link
              to="/articles"
              className="rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Đọc mẹo chăm cây
            </Link>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-2xl"
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Khám phá cây trồng</h2>
          <p className="text-sm text-gray-500">
            Lọc theo danh mục hoặc tìm kiếm để chọn cây phù hợp nhất với bạn.
          </p>
        </div>

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

        {isLoading ? (
          <CardSkeletonGrid />
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

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-900">
              Mẹo chăm sóc mới nhất
            </h2>
            <p className="text-sm text-gray-500">
              Kiến thức mới cập nhật từ đội ngũ Chạm Xanh để khu vườn của bạn luôn
              khoẻ mạnh.
            </p>
          </div>
          <Link
            to="/articles"
            className="shrink-0 text-sm font-medium text-green-700 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        {isLoadingArticles ? (
          <Spinner label="Đang tải mẹo chăm sóc..." />
        ) : latestArticles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có bài viết nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {latestArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
