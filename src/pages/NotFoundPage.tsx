import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20 flex flex-col gap-3">
      <h1 className="text-3xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500">Không tìm thấy trang bạn yêu cầu.</p>
      <Link to="/" className="text-green-700 underline w-fit mx-auto">
        Về trang chủ
      </Link>
    </div>
  );
}
