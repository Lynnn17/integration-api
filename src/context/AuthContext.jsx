import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (name, fullName) => {
    const userData = { name, fullName };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const editName = (fullName) => {
    const userData = { ...user, fullName };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, editName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
