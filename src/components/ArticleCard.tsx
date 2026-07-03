import { Link } from 'react-router-dom';
import type { Article } from '../types';

const FALLBACK_IMAGE =
  'https://placehold.co/400x240/e2f0e2/1f2937?text=Bai+viet';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article._id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img
          src={article.coverImage || FALLBACK_IMAGE}
          alt={article.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
        <div className="flex flex-wrap gap-1">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
      </div>
    </Link>
  );
}
