import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import { SnapshotProvider } from './context/SnapshotContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load the pages for better performance
const LazyLibraryView = React.lazy(() => import('./pages/LibraryView'));
const LazyAssetDetailView = React.lazy(() => import('./pages/AssetDetailView'));
const LazyMoodBoardEditor = React.lazy(() => import('./pages/MoodBoardEditor'));
const LazyAnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));
const LazyUserGallery = React.lazy(() => import('./pages/UserGallery'));
const LazyLoginPage = React.lazy(() => import('./pages/LoginPage'));

function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider>
          <AuthProvider>
            <AssetProvider>
              <SnapshotProvider>
              <Routes>
                <Route path="/login" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <LazyLoginPage />
                  </React.Suspense>
                } />
                <Route path="/" element={<AppShell />}>
                  <Route index element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyLibraryView />
                    </React.Suspense>
                  } />
                  <Route path="assets/:assetId" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyAssetDetailView />
                    </React.Suspense>
                  } />
                  <Route path="moodboard/:moodboardId" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyMoodBoardEditor />
                    </React.Suspense>
                  } />
                  <Route path="moodboard/new" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyMoodBoardEditor />
                    </React.Suspense>
                  } />
                  <Route path="analytics" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyAnalyticsDashboard />
                    </React.Suspense>
                  } />
                  <Route path="gallery" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <LazyUserGallery />
                    </React.Suspense>
                  } />
                </Route>
              </Routes>
              </SnapshotProvider>
            </AssetProvider>
          </AuthProvider>
        </ThemeProvider>
      </DndProvider>
    </Router>
  );
}

export default App;