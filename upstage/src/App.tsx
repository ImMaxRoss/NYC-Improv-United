import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Performers } from './pages/Performers';
import { Exercises } from './pages/Exercises';
import { LessonPlanner } from './pages/LessonPlanner';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-practice/:lessonId" element={<LivePractice />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/performers" element={<Performers />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        {/* Redirect auth routes to dashboard for authenticated users */}
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;