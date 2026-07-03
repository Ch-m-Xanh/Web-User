import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-lg font-bold text-green-700">Chạm Xanh</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Nền tảng đồng hành cùng bạn khám phá cây trồng, chăm sóc khu vườn và
            nuôi dưỡng thói quen sống xanh mỗi ngày.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Liên kết nhanh
          </h3>
          <Link to="/" className="text-sm text-gray-600 hover:text-green-700 w-fit">
            Trang chủ
          </Link>
          <Link
            to="/articles"
            className="text-sm text-gray-600 hover:text-green-700 w-fit"
          >
            Bài viết & mẹo chăm sóc
          </Link>
          <Link
            to="/vuon-cua-toi"
            className="text-sm text-gray-600 hover:text-green-700 w-fit"
          >
            Vườn của tôi
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Về Chạm Xanh
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Chạm Xanh là hệ sinh thái quản lý cây trồng gồm ứng dụng di động và web,
            giúp bạn theo dõi lịch tưới nước, bón phân và học hỏi kiến thức chăm cây
            mỗi ngày.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Chạm Xanh. Mọi quyền được bảo lưu.</span>
          <span>Chăm cây mỗi ngày, sống xanh mỗi ngày 🌱</span>
        </div>
      </div>
    </footer>
  );
}
