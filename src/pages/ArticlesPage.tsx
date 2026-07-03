import { useEffect, useState } from 'react';
import { fetchArticles } from '../api/articles';
import type { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import Spinner from '../components/Spinner';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Bài viết</h1>
      {isLoading ? (
        <Spinner label="Đang tải bài viết..." />
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
