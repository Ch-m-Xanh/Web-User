# Chạm Xanh — Web User

Web app người dùng cuối cho hệ sinh thái Chạm Xanh (quản lý cây trồng). Bản web song
song với luồng "Khám phá" trên mobile app: xem danh sách cây theo danh mục, tìm kiếm,
xem chi tiết cây, đọc bài viết, đăng nhập/đăng ký.

## Stack

- React + Vite + TypeScript (strict mode)
- React Router (react-router-dom)
- Axios (kèm interceptor gắn Bearer token và bắt lỗi API)
- Tailwind CSS v4 (qua `@tailwindcss/vite`)

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Ứng dụng mặc định chạy tại `http://localhost:5173`.

## Biến môi trường

Tạo file `.env` (copy từ `.env.example`):

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Nếu không set, mặc định API base URL là `http://localhost:4000/api`.

## Build & kiểm tra kiểu

```bash
npm run build      # chạy tsc -b && vite build
npx tsc --noEmit    # chỉ kiểm tra type, không build
```

## Cấu trúc thư mục

```
src/
  api/          axios client + các hàm gọi API (auth, plants, categories, articles)
  components/   component tái sử dụng (PlantCard, ArticleCard, CategoryChips, ...)
  context/      GlobalPopupContext (toast), AuthContext (trạng thái đăng nhập)
  layouts/      Header, Footer, MainLayout (Outlet)
  pages/        HomePage, PlantDetailPage, ArticlesPage, ArticleDetailPage,
                LoginPage, RegisterPage, NotFoundPage
  types/        Plant, User, Article, ApiError, AuthResponse, ...
```

## Ghi chú tích hợp API

- Mọi lỗi API được kỳ vọng có dạng `{ error: { message, code } }`. Interceptor axios
  trong `src/api/client.ts` bắt lỗi này (và cả lỗi mạng) rồi gọi popup lỗi toàn cục.
- Token đăng nhập được lưu ở `localStorage` (key `chamxanh_token`) và tự động gắn vào
  header `Authorization: Bearer <token>` cho mọi request.
- `GET /api/categories` được code phòng thủ cho cả hai dạng response: `string[]` hoặc
  `{ value, label }[]`. Nếu endpoint lỗi hoặc rỗng, trang chủ dùng danh sách category
  mặc định (phòng ngủ, bàn làm việc, phòng bếp, rau củ chữa bệnh).
- `POST /api/auth/register` được gọi với body `{ name, email, password }` — đây là giả
  định vì spec không chắc chắn field. Nếu endpoint trả 404 hoặc lỗi khác, UI vẫn hoạt
  động bình thường và chỉ hiển thị lỗi qua popup.
