import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    return token ? { accessToken: token, email, role } : {};
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.accessToken) {
      localStorage.setItem("accessToken", auth.accessToken);
      if (auth.email) localStorage.setItem("email", auth.email);
      if (auth.role) localStorage.setItem("role", auth.role);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    }
  }, [auth]);

  const login = (data) => {
    setAuth({
      accessToken: data.accessToken,
      email: data.email,
      role: data.role,
      level : data.user.academiclevel,
      teacher: data.user.subjects?.[0]?.teacherId || null,
      id:data.user.subjects._id
    });
  };

  const logout = () => {
    setAuth({});
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, loading, setLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
