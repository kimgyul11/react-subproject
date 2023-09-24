import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
