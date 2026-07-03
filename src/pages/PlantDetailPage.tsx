import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPlantById } from '../api/plants';
import type { Plant } from '../types';
import CareLevelBadge from '../components/CareLevelBadge';
import Spinner from '../components/Spinner';

const FALLBACK_IMAGE =
  'https://placehold.co/600x450/e2f0e2/1f2937?text=Cham+Xanh';

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    setActiveImage(0);
    fetchPlantById(id)
      .then(setPlant)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <Spinner label="Đang tải thông tin cây..." />;
  }

  if (notFound || !plant) {
    return (
      <div className="text-center py-16 flex flex-col gap-3">
        <p className="text-gray-500">Không tìm thấy cây bạn cần xem.</p>
        <Link to="/" className="text-green-700 underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const images = plant.images?.length ? plant.images : [FALLBACK_IMAGE];

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm text-green-700 hover:underline w-fit">
        ← Quay lại
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={images[activeImage]}
              alt={plant.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                    index === activeImage ? 'border-green-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${plant.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{plant.name}</h1>
            <p className="italic text-gray-500">{plant.scientificName}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <CareLevelBadge level={plant.careLevel} />
            {plant.isMedicinal && (
              <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
                Cây thuốc
              </span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{plant.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 rounded-xl p-4">
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide">
                Ánh sáng
              </span>
              <span className="text-gray-800 font-medium">{plant.light}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide">
                Nước tưới
              </span>
              <span className="text-gray-800 font-medium">{plant.water}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide">
                Lượt xem
              </span>
              <span className="text-gray-800 font-medium">{plant.viewCount}</span>
            </div>
          </div>

          {plant.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plant.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
