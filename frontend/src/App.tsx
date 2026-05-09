import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from '@/components/layout/Shell';
import LoadingScreen from '@/components/layout/LoadingScreen';

const HomePage = lazy(() => import('@/pages/Home'));
const VisualizerPage = lazy(() => import('@/pages/Visualizer'));
const EducationPage = lazy(() => import('@/pages/Education'));
const EducationTaskPage = lazy(() => import('@/pages/EducationTask'));
const AboutPage = lazy(() => import('@/pages/About'));

export default function App() {
  return (
    <Shell>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/:taskId" element={<EducationTaskPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Shell>
  );
}
