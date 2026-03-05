import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="flex justify-center mt-20"><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i></div>;
    return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            
            <Route path="/asignaciones" element={
                <ProtectedRoute>
                    
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;