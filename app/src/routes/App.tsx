import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import '@/styles/global.scss';
import Login from '@/pages/Auth/Login/Login.tsx';
import Register from '@/pages/Auth/Register/Register.tsx';
import ForgotPassword from '@/pages/Auth/ForgotPassword/ForgotPassword.tsx';
import ResetPassword from '@/pages/Auth/ResetPassword/ResetPassword.tsx';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import Home from '@/pages/Home/Home.tsx';
import ProgramForm from '@/pages/Program/ProgramForm/ProgramForm.tsx';
import Profile from '@/pages/Profile/Profile.tsx';
import History from '@/pages/History/History.tsx';
import ListPrograms from '@/pages/Program/ProgramsPage.tsx';
import SessionForm from '@/pages/Session/SessionForm/SessionForm.tsx';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop.tsx';
import ExerciseForm from '@/pages/Exercise/ExerciseForm.tsx';
import RepSetForm from '@/pages/Exercise/RepSet/RepSet.tsx';
import MuscleManager from '@/pages/Muscle/MuscleManager.tsx';
import TagManager from '@/pages/Tag/TagManager.tsx';
import ActiveSession from '@/pages/ActiveSession/ActiveSession.tsx';
import Recapitulatif from '@/pages/ActiveSession/Recapitulatif.tsx';
import AppStateHandler from '@/components/AppStateHandler/AppStateHandler.tsx';
import VerifyEmail from '@/pages/Auth/VerifyEmail/VerifyEmail';
import VerifyMagicLink from '@/pages/Auth/VerifyMagicLink/VerifyMagicLink';
import { useTheme } from '@/context/ThemeContext';
import Weight from '@/pages/Weight/Weight';

const App: React.FC = () => {
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppStateHandler />
        <Toaster
          position="top-center"
          containerStyle={{
            margin: 'auto',
          }}
          toastOptions={{
            duration: 5000,
            style: {
              fontSize: '.9rem',
              background: 'var(--background-color)',
              color: 'var(--text-color)',
              fontFamily: 'var(--font-family), sans-serif',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-magic-link" element={<VerifyMagicLink />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            {/* Programs */}
            <Route path="/my-program" element={<ListPrograms />} />
            <Route path="/programs/create" element={<ProgramForm />} />
            <Route path="/programs/edit/:id" element={<ProgramForm />} />

            {/* Sessions */}
            <Route path="/session/create" element={<SessionForm />} />
            <Route path="/sessions/:id" element={<SessionForm />} />

            {/* Exercises */}
            <Route path="/exercise/create" element={<ExerciseForm />} />
            <Route
              path="/exercise/edit/:exerciseId"
              element={<ExerciseForm />}
            />

            {/* Sets */}
            <Route path="/exercise/:exerciseId/reps" element={<RepSetForm />} />
            <Route
              path="/exercise/:exerciseId/reps/:repSetId"
              element={<RepSetForm />}
            />

            <Route path="/muscles" element={<MuscleManager />} />
            <Route path="/tags" element={<TagManager />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/weight" element={<Weight />} />

            <Route path="/workout/:id" element={<ActiveSession />} />
            <Route path="/workout/:id/recap" element={<Recapitulatif />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
