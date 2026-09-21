import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';

const ProtectedRoute = () => {
  const { token, initialized } = useAppSelector((state: RootState) => state.auth);

  if (!initialized) {
    // Defensive loading spinner (in normal use, initialized is always true
    // because rehydration is synchronous)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
