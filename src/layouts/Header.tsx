import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalPopup } from '../context/GlobalPopupContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-green-700' : 'text-gray-600 hover:text-green-700'
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const { showInfo } = useGlobalPopup();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showInfo('Bạn đã đăng xuất.');
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌿</span>
          <span className="text-lg font-bold text-green-700">Chạm Xanh</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 order-3 w-full sm:order-none sm:w-auto">
          <NavLink to="/" className={navLinkClass} end>
            Trang chủ
          </NavLink>
          <NavLink to="/articles" className={navLinkClass}>
            Bài viết
          </NavLink>
          {user && (
            <NavLink to="/vuon-cua-toi" className={navLinkClass}>
              Vườn của tôi
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                Xin chào, {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-full px-3 py-1.5 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-green-700 px-3 py-1.5"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-green-600 text-white rounded-full px-4 py-1.5 hover:bg-green-700 transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
