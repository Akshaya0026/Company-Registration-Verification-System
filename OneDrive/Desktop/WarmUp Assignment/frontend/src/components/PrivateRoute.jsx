import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { token } = useSelector((state) => state.auth);

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
