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
  api/          axios client + các hàm gọi API (auth, plants, categories, articles,
                userPlants)
  components/   component tái sử dụng (PlantCard, ArticleCard, CategoryChips,
                UserPlantCard, AddUserPlantModal, ReminderModal, ConfirmDialog,
                CardSkeletonGrid, ProtectedRoute, ...)
  context/      GlobalPopupContext (toast), AuthContext (trạng thái đăng nhập)
  layouts/      Header, Footer, MainLayout (Outlet)
  pages/        HomePage, PlantDetailPage, ArticlesPage, ArticleDetailPage,
                MyGardenPage (Vườn của tôi), LoginPage, RegisterPage, NotFoundPage
  services/     socket.ts (singleton Socket.IO client)
  types/        Plant, User, Article, UserPlant, ApiError, AuthResponse, ...
```

## Vườn của tôi (`/vuon-cua-toi`)

Trang này là "vườn cá nhân" của người dùng, dùng chung dữ liệu `UserPlant` với Mobile
app (cùng database qua các API `/api/user-plants`). Trang yêu cầu đăng nhập (redirect
`/login` nếu chưa), cho phép xem/thêm/xoá cây và chỉnh sửa nhắc nhở tưới/bón phân.
Khi thêm cây tuỳ ý (không có trong danh mục Plant), người dùng dán URL ảnh thay vì
upload file vì bản web không có camera.

## Real-time với Socket.IO

`src/services/socket.ts` tạo một singleton client Socket.IO, kết nối tới cùng host
với REST API nhưng bỏ hậu tố `/api` (ví dụ API base `https://api.example.com/api` thì
Socket.IO connect tới `https://api.example.com`). Khi người dùng đăng nhập/đăng xuất,
socket được yêu cầu kết nối lại (`reconnectSocket`) để server đọc đúng JWT mới nhất
qua `socket.handshake.auth.token` và join phòng `user:<userId>`.

Các sự kiện đang lắng nghe:
- `plant:created` / `plant:updated` / `plant:deleted` — HomePage (grid cây công khai).
- `article:created` / `article:updated` / `article:deleted` — HomePage & ArticlesPage.
- `user-plant:created` / `user-plant:updated` / `user-plant:deleted` — MyGardenPage,
  đồng bộ với thao tác từ Mobile app của cùng tài khoản.

## Deploy lên Render (Web Service)

Ứng dụng là Vite SPA (build ra file tĩnh trong `dist/`), nên không dùng loại
"Static Site" mặc định của Render mà deploy dạng **Web Service** chạy gói `serve`:

1. Tạo Web Service mới trên Render, trỏ tới repo này (thư mục `Web User`).
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm run start` (chạy `serve -s dist -l $PORT`, dùng cổng do
   Render cấp qua biến môi trường `$PORT`).
4. **Environment Variables**: thêm `VITE_API_BASE_URL` trỏ tới URL API backend, ví dụ
   `https://api.chamxanh.example.com/api`.
   - Lưu ý: đây là biến **build-time** (Vite nhúng giá trị vào bundle lúc `vite build`),
     không phải biến runtime. Nếu đổi giá trị `VITE_API_BASE_URL`, phải **deploy lại**
     (trigger build mới) thì thay đổi mới có hiệu lực — chỉ restart service sẽ không
     đủ vì file tĩnh trong `dist/` đã được build sẵn với giá trị cũ.

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
