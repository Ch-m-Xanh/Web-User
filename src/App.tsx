import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalPopupProvider } from './context/GlobalPopupContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PlantDetailPage from './pages/PlantDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import MyGardenPage from './pages/MyGardenPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GlobalPopupProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="plants/:id" element={<PlantDetailPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/:id" element={<ArticleDetailPage />} />
              <Route
                path="vuon-cua-toi"
                element={
                  <ProtectedRoute>
                    <MyGardenPage />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GlobalPopupProvider>
  );
}

export default App;
