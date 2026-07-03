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

function excerpt(content: string, maxLength = 120): string {
  const plain = content.replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-gray-400">
          {formatDate(article.createdAt)}
        </span>
        <h3 className="font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{excerpt(article.content)}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
