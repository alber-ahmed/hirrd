import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import './App.css';
import AppLayout from './layouts/app-layout';
import LandingPage from './pages/landing';
import Onboarding from './pages/Onboarding';
import PostJobs from './pages/post-job';
import SaveJobs from './pages/save-job';
import Job from './pages/job';
import JobListing from './pages/jobListing';
import MyJobs from './pages/myJobs';
import ProtectedRoute from './components/ui/protected-route';

const router = createBrowserRouter([
  {
    element: <AppLayout />, // This will handle the title updates
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/onboarding",
        element: <ProtectedRoute><Onboarding /></ProtectedRoute>
      },
      {
        path: "/jobs",
        element: <ProtectedRoute><JobListing /></ProtectedRoute>
      },
      {
        path: "/job/:id",
        element: <ProtectedRoute><Job /></ProtectedRoute>
      },
      {
        path: "/post-job",
        element: <ProtectedRoute><PostJobs /></ProtectedRoute>
      },
      {
        path: "/saved-jobs",
        element: <ProtectedRoute><SaveJobs /></ProtectedRoute>
      },
      {
        path: "/my-jobs",
        element: <ProtectedRoute><MyJobs /></ProtectedRoute>
      },
    ]
  }
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
