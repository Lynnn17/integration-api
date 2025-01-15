import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditUser from "./pages/EditUser";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import Loading from "./components/Loading.jsx";

const App = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // State untuk loading aplikasi

  // Menggunakan useEffect untuk mengatur loading menjadi false setelah data selesai dimuat
  useEffect(() => {
    setLoading(false); // Set loading ke false setelah data selesai dimuat
  }, []);

  // ProtectedRoute untuk menangani route yang membutuhkan autentikasi
  const ProtectedRoute = ({ children }) => {
    if (authLoading || loading) {
      // Tampilkan loading screen jika data masih dimuat
      return <Loading />;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navbar hanya ditampilkan jika pengguna sudah login */}
            {user && <Navbar />}
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-user"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />

              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
