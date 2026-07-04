import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import StudentLayout from './layouts/StudentLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loader from './components/ui/Loader';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Industries = lazy(() => import('./pages/Industries'));
const AIRecruitment = lazy(() => import('./pages/AIRecruitment'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));

// Auth
const Login = lazy(() => import('./pages/Login'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

// Client pages
const ClientLogin = lazy(() => import('./pages/client/ClientLogin'));
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const ClientJobs = lazy(() => import('./pages/client/ClientJobs'));
const ClientCandidates = lazy(() => import('./pages/client/ClientCandidates'));

// Student pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentJobs = lazy(() => import('./pages/student/StudentJobs'));
const StudentApplications = lazy(() => import('./pages/student/StudentApplications'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* ── Public Website ── */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/ai-recruitment" element={<AIRecruitment />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
            </Route>

            {/* ── Login (Firebase) for students/clients ── */}
            <Route path="/login" element={<Login />} />

            {/* ── Admin Portal ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>

            {/* ── Client Portal ── */}
            <Route path="/client/login" element={<ClientLogin />} />
            <Route
              path="/client"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientDashboard />} />
              <Route path="jobs" element={<ClientJobs />} />
              <Route path="candidates" element={<ClientCandidates />} />
            </Route>

            {/* ── Student Portal ── */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="jobs" element={<StudentJobs />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}