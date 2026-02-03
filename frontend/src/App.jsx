import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Courses from './components/Courses.jsx';
import CourseDetail from './components/CourseDetail.jsx';
import MyCourses from './components/MyCourses.jsx';
import AddCourse from './components/AddCourse.jsx';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import CourseManage from './components/CourseManage.jsx';
import CourseContentView from './components/CourseContentView.jsx';
import Checkout from './components/Checkout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeacherRoute from './components/TeacherRoute.jsx';
import StudentRoute from './components/StudentRoute.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-zinc-800 transition-colors duration-200 flex flex-col overflow-x-hidden">
          <Routes>
            {/* Public Routes - No login required */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Landing Page - Public */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Hero />
                  </main>
                  <Footer />
                </>
              }
            />
            
            {/* Courses List - Public (can browse without login) */}
            <Route
              path="/courses"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Courses />
                  </main>
                  <Footer />
                </>
              }
            />
            
            {/* Course Detail - Public (can view, but subscribe requires login) */}
            <Route
              path="/courses/:id"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <CourseDetail />
                  </main>
                  <Footer />
                </>
              }
            />
            {/* Checkout (dummy payment) - Protected */}
            <Route
              path="/courses/:id/checkout"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Checkout />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            
            {/* Enrolled Courses - Students Only */}
            <Route
              path="/my-courses"
              element={
                <StudentRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <MyCourses />
                    </main>
                    <Footer />
                  </>
                </StudentRoute>
              }
            />
            
            {/* Teacher Only Routes */}
            <Route
              path="/add-course"
              element={
                <TeacherRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <AddCourse />
                    </main>
                    <Footer />
                  </>
                </TeacherRoute>
              }
            />
            
            <Route
              path="/teacher-dashboard"
              element={
                <TeacherRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <TeacherDashboard />
                    </main>
                    <Footer />
                  </>
                </TeacherRoute>
              }
            />
            
            <Route
              path="/course-manage/:id"
              element={
                <TeacherRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <CourseManage />
                    </main>
                    <Footer />
                  </>
                </TeacherRoute>
              }
            />
            
            {/* Course Content View - For enrolled students/course owners */}
            <Route
              path="/course/:courseId/content"
              element={
                <ProtectedRoute>
                  <CourseContentView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/content/:contentId"
              element={
                <ProtectedRoute>
                  <CourseContentView />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;


