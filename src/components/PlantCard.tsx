import { Link } from 'react-router-dom';
import type { Plant } from '../types';
import CareLevelBadge from './CareLevelBadge';

const FALLBACK_IMAGE =
  'https://placehold.co/400x300/e2f0e2/1f2937?text=Cham+Xanh';

export default function PlantCard({ plant }: { plant: Plant }) {
  const image = plant.images?.[0] || FALLBACK_IMAGE;

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={plant.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 truncate">{plant.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <CareLevelBadge level={plant.careLevel} />
          {plant.isMedicinal && (
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
              Cây thuốc
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
