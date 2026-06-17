import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Routes, Route} from 'react-router-dom';
import AppLayout from './pages/AppLayout';
import HomePage from './pages/HomePage';
import App from './App';
import ProfilePage from './pages/ProfilePage';
import CareerMapPage from './pages/CareerMapPage';
import IndustryPage from './pages/IndustryPage';
import JobPage from './pages/JobPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import ReportPage from './pages/ReportPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trial" element={<App />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<CareerMapPage />} />
          <Route path="/industry/:id" element={<IndustryPage />} />
          <Route path="/job/:id" element={<JobPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
