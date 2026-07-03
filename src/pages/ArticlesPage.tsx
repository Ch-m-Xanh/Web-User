import { useEffect, useMemo, useState } from 'react';
import { fetchArticles } from '../api/articles';
import { getSocket } from '../services/socket';
import type { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import CardSkeletonGrid from '../components/CardSkeleton';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setArticles(sorted);
      })
      .catch(() => setArticles([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Real-time sync: new/edited/removed articles show up without a refresh.
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (article: Article) => {
      setArticles((prev) =>
        prev.some((a) => a._id === article._id) ? prev : [article, ...prev],
      );
    };
    const handleUpdated = (article: Article) => {
      setArticles((prev) => prev.map((a) => (a._id === article._id ? article : a)));
    };
    const handleDeleted = (payload: { _id: string }) => {
      setArticles((prev) => prev.filter((a) => a._id !== payload._id));
    };

    socket.on('article:created', handleCreated);
    socket.on('article:updated', handleUpdated);
    socket.on('article:deleted', handleDeleted);

    return () => {
      socket.off('article:created', handleCreated);
      socket.off('article:updated', handleUpdated);
      socket.off('article:deleted', handleDeleted);
    };
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => article.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter((article) => article.tags?.includes(selectedTag));
  }, [articles, selectedTag]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Trung tâm kiến thức</h1>
        <p className="text-sm text-gray-500">
          Mẹo chăm sóc, kinh nghiệm và kiến thức cây trồng được cập nhật thường xuyên.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedTag === null
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
            }`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedTag === tag
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <CardSkeletonGrid count={6} aspect="aspect-[16/9]" />
      ) : filteredArticles.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          {selectedTag
            ? `Không có bài viết nào cho tag "#${selectedTag}".`
            : 'Chưa có bài viết nào.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
