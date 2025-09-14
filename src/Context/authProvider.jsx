import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const level = localStorage.getItem("level");
    const teacher = localStorage.getItem("teacher");
    const id = localStorage.getItem("id");
    const accepter = localStorage.getItem("accepter");
    const fullname = localStorage.getItem("fullname"); // Add this line
    
    return token ? { 
      accessToken: token, 
      email, 
      role, 
      level, 
      teacher,
      id,
      accepter: accepter === "true", // Convert string to boolean
      fullname // Add this line
    } : {};
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Auth state changed, updating localStorage:", auth);
    
    if (auth?.accessToken) {
      localStorage.setItem("accessToken", auth.accessToken);
      if (auth.email) localStorage.setItem("email", auth.email);
      if (auth.role) localStorage.setItem("role", auth.role);
      if (auth.level) localStorage.setItem("level", auth.level);
      if (auth.teacher) localStorage.setItem("teacher", auth.teacher);
      if (auth.id) localStorage.setItem("id", auth.id);
      if (auth.fullname) localStorage.setItem("fullname", auth.fullname);
      
      // Fix the accepter storage - make sure it's stored as a proper boolean string
      const accepterValue = auth.accepter === undefined ? "false" : String(Boolean(auth.accepter));
      localStorage.setItem("accepter", accepterValue);
      console.log("Storing accepter as:", accepterValue);
    } else {
      // Clear all localStorage when logging out
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("level");
      localStorage.removeItem("teacher");
      localStorage.removeItem("id");
      localStorage.removeItem("accepter");
      localStorage.removeItem("fullname");
      console.log("Cleared localStorage");
    }
  }, [auth]);

  const login = (data) => {
    setAuth({
      accessToken: data.accessToken,
      email: data.email,
      role: data.role,
      level: data.level,
      teacher: data.teacher,
      id: data.id,
      accepter: Boolean(data.accepter),
      mdp: data.mdp,
      fullname: data.fullname
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