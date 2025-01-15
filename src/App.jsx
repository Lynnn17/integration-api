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
import { ThemeProvider } from "./context/ThemeContext";
import Loading from "./components/Loading.jsx";

const App = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (authLoading || loading) {
      return <Loading />;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          {user && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path={"/"}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
