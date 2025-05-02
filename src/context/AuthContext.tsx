"use client";
import { createContext, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({ user: {}, accessToken: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jsonString = localStorage.getItem("userInfor");
      const userStorage = jsonString ? JSON.parse(jsonString) : null;
      const storedAccessToken = userStorage?.accessToken;

      if (storedAccessToken) {
        try {
          const decoded = jwtDecode(storedAccessToken);
          setAuth({ user: decoded, accessToken: storedAccessToken });
        } catch (error) {
          console.error("Lỗi giải mã token:", error);
          setAuth({ user: {}, accessToken: "" });
        }
      }
    }
  }, []); // Chạy một lần sau khi component mount

  // useEffect(() => {
  //   if (!auth.accessToken) {
  //     redirect("/");
  //   }
  // }, [auth.accessToken]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
