import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    loggedIn: boolean;
    children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ loggedIn }) => {
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;