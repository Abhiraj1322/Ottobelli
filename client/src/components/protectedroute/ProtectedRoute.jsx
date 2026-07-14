import useAuthStore from "../../store/userAuthStore";


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) return <div className="flex items-center justify-center h-screen">
    <p className="text-white">Loading...</p>
  </div>;

  return isLoggedIn ? children : <Navigate to="/login" />;
};
export default ProtectedRoute