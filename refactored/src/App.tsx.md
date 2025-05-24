# src/App.tsx - Updated with new routes (teams, performers..etc)
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Performers } from './pages/Performers';
import { LessonPlanner } from './pages/LessonPlanner';
import { Login } from './pages/Login';
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
    return <Login />;
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
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```

# src/App.tsx - Updated with routing for Live Practice
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Login } from './pages/Login';
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
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-practice/:lessonId" element={<LivePractice />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

```

# src/App.tsx - Updated with Exercises route
```tsx
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
    return <Login />;
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```


# src/App.tsx - Updated with Analytics route
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Performers } from './pages/Performers';
import { Exercises } from './pages/Exercises';
import { Analytics } from './pages/Analytics';
import { LessonPlanner } from './pages/LessonPlanner';
import { Login } from './pages/Login';
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
    return <Login />;
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
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```