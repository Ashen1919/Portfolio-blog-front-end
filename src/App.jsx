import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home           from './pages/Home';
import Blog           from './pages/Blog';
import BlogDetail     from './pages/BlogDetail';
import Login          from './pages/Login';
import Register       from './pages/Register';
import CreateEditPost from './pages/CreateEditPost';
import NotFound       from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1d30',
              color:      '#f1f5f9',
              border:     '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize:   '0.875rem',
              boxShadow:  '0 4px 24px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#6370f6', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#fff' },
            },
          }}
        />

        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/"         element={<Home />}     />
              <Route path="/blog"     element={<Blog />}     />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />

              {/* Protected routes (require authentication) */}
              <Route
                path="/blog/create"
                element={
                  <ProtectedRoute>
                    <CreateEditPost mode="create" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id/edit"
                element={
                  <ProtectedRoute>
                    <CreateEditPost mode="edit" />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
