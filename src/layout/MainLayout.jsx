import { Suspense, lazy } from 'react';
import {
  Routes, Route, Navigate,
} from 'react-router-dom';

/**
 * Arquivos importadas utilizando a técnica de lazy/Suspense do React.
 * Docs: https://pt-br.react.dev/reference/react/Suspense
 *
 * Isso permite que os arquivos sejam carregados apenas quando as páginas foram acessadas
 * pelo usuário.
 */
const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage'));
const ProductPage = lazy(() => import ('../pages/ProductPage'));
const FavoritePage = lazy(() => import ('../pages/FavoritePage'));

const AppLayout = lazy(() => import('./AppLayout'));

function MainLayout() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Navigate to="/product" />} />
        <Route
          path="/product"
          element={(
            <PrivateRoute>
              <AppLayout>
                <ProductPage/>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="favorite/"
          element={(
            <PrivateRoute>
              <AppLayout>
                <FavoritePage/>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="favorite"
          element={(
            <PrivateRoute>
              <AppLayout>
                <FavoritePage/>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </Suspense>
  );
}

export default MainLayout;
