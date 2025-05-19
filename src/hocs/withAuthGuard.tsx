import { AuthGuard } from "@/components/AuthGuard";
import { NextPage } from "next";

export const withAuthGuard = (
  WrappedComponent: React.ComponentType
): NextPage => {
  const AuthGuardedComponent: NextPage = (props) => {
    return (
      <AuthGuard>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthGuardedComponent;
};
