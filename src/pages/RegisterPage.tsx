import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useGlobalPopup } from '../context/GlobalPopupContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithResponse } = useAuth();
  const { showSuccess } = useGlobalPopup();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await register({ name, email, password });
      loginWithResponse(response);
      showSuccess(`Chào mừng ${response.user.name} đến với Chạm Xanh!`);
      navigate('/');
    } catch {
      // Error toast already shown by the axios interceptor.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Đăng ký</h1>
        <p className="text-gray-500 text-sm">
          Tạo tài khoản để bắt đầu hành trình trồng cây cùng Chạm Xanh.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Họ và tên</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Nguyễn Văn A"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="ban@email.com"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Mật khẩu</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Tối thiểu 6 ký tự"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white rounded-full py-2 font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-green-700 font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
