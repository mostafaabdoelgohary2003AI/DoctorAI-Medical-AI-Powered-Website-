import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages with code splitting
const Home = lazy(() => import('./pages/Home'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const ImageAnalysis = lazy(() => import('./pages/ImageAnalysis'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Components
import Loading from './components/common/Loading';
import ErrorFallback from './components/common/ErrorFallback';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="diagnostics" element={<Diagnostics />} />
                <Route path="image-analysis" element={<ImageAnalysis />} />
                <Route path="symptom-checker" element={<SymptomChecker />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;