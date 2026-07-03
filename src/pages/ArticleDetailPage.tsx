import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchArticleById } from '../api/articles';
import type { Article } from '../types';
import Spinner from '../components/Spinner';

const FALLBACK_IMAGE =
  'https://placehold.co/800x400/e2f0e2/1f2937?text=Bai+viet';

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    fetchArticleById(id)
      .then(setArticle)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <Spinner label="Đang tải bài viết..." />;
  }

  if (notFound || !article) {
    return (
      <div className="text-center py-16 flex flex-col gap-3">
        <p className="text-gray-500">Không tìm thấy bài viết bạn cần xem.</p>
        <Link to="/articles" className="text-green-700 underline">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-5 max-w-3xl mx-auto">
      <Link to="/articles" className="text-sm text-green-700 hover:underline w-fit">
        ← Quay lại
      </Link>

      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        <img
          src={article.coverImage || FALLBACK_IMAGE}
          alt={article.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
        <span className="text-sm text-gray-400">{formatDate(article.createdAt)}</span>
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
      </div>

      <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
    </article>
  );
}
