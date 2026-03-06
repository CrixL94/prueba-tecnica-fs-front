import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Layout from '../components/Layout';
import AsignacionesScreen from '../pages/asignacionesScreen';
import ViajesScreen from "../pages/viajesScreen";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return (
        <div className="flex justify-center mt-20">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        </div>
    );
    
    return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                {/*AdminLayout */}
                <Route path="/asignaciones" element={<AsignacionesScreen/>} />
                
                <Route path="/viajes" element={<ViajesScreen/>} />
                <Route path="/reportes" element={<div>Página de Reportes</div>} />

                <Route path="/sucursales" element={<div>Página de sucursales</div>} />
                <Route path="/colaboradores" element={<div>Página de colaboradores</div>} />
                <Route path="/transportistas" element={<div>Página de transportistas</div>} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;