import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, loading, children }) {
  // Loading animation till we get data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8fc}] ">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user not found, then navigate to login
  if (!user) return <Navigate to="/login" replace />;

// If user found, then return the children (the page user requested)
  return children;

}

export default ProtectedRoute;
