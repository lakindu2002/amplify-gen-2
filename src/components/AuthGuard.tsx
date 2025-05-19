import { fetchAuthSession } from "aws-amplify/auth";
import { FC, useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await fetchAuthSession();
        console.log("User session:", user);
        if (!user.tokens) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated) {
    return children;
  }
};
