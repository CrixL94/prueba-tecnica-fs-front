import { useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const menuDesktop = useRef(null);
    const menuMobile = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => logout();

    //navegar y cerrar el sidebar
    const handleNavigation = (path) => {
        navigate(path);
        if (sidebarOpen) setSidebarOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all ${
            isActive 
            ? "bg-cyan-50 text-cyan-700 font-bold shadow-sm" 
            : "text-gray-600 hover:bg-gray-50 hover:text-cyan-600"
        }`;

    const configItems = [
        {
            label: "Sucursales",
            icon: "pi pi-building",
            command: () => handleNavigation("/sucursales"),
        },
        {
            label: "Colaboradores",
            icon: "pi pi-users",
            command: () => handleNavigation("/colaboradores"),
        },
        {
            label: "Transportistas",
            icon: "pi pi-truck",
            command: () => handleNavigation("/transportistas"),
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/*Escritorio */}
            <aside className="hidden md:flex flex-col w-72 bg-white shadow-lg p-4 justify-between border-r border-gray-200">
                <div>
                    <div className="flex flex-col items-center mb-8 mt-4">
                        <i className="pi pi-truck text-cyan-700" style={{ fontSize: '2.5rem' }}></i>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full text-center">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Usuario Conectado</p>
                            <p className="text-sm font-semibold text-gray-700">{user?.nombre}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <NavLink to="/asignaciones" className={navLinkClass}>
                            <i className="pi pi-map-marker mr-3 text-lg" /> Asignaciones
                        </NavLink>
                        <NavLink to="/viajes" className={navLinkClass}>
                            <i className="pi pi-send mr-3 text-lg" /> Registro de Viajes
                        </NavLink>
                        <NavLink to="/reportes" className={navLinkClass}>
                            <i className="pi pi-chart-bar mr-3 text-lg" /> Reportes
                        </NavLink>

                        <Divider />

                        <Button
                            className="w-full flex items-center justify-between p-3 text-gray-600 hover:text-cyan-600 font-normal unstyled hover:bg-gray-50 rounded-lg"
                            onClick={(e) => menuDesktop.current?.toggle(e)}
                        >
                            <span className="flex items-center gap-3">
                                <i className="pi pi-cog text-lg" /> Mantenimientos
                            </span>
                            <i className="pi pi-chevron-down text-xs" />
                        </Button>
                        <Menu model={configItems} popup ref={menuDesktop} />
                    </nav>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <Button 
                        label="Cerrar Sesión" icon="pi pi-power-off" 
                        className="p-button-danger p-button-text w-full flex justify-start font-bold"
                        onClick={handleLogout}
                    />
                </div>
            </aside>

            {/* Sidebar móvil */}
            <Sidebar
                visible={sidebarOpen}
                position="left"
                onHide={() => setSidebarOpen(false)}
                className="w-72"
            >
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="flex flex-col items-center mb-6">
                            <i className="pi pi-truck text-cyan-700" style={{ fontSize: '2.5rem' }}></i>
                            <p className="text-sm font-semibold text-gray-700 mt-2">{user?.nombre}</p>
                        </div>
                        <nav className="space-y-2">
                            <NavLink to="/asignaciones" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                                <i className="pi pi-map-marker mr-3" /> Asignaciones
                            </NavLink>
                            <NavLink to="/viajes" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                                <i className="pi pi-send mr-3" /> Registro de Viajes
                            </NavLink>
                            <NavLink to="/reportes" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                                <i className="pi pi-chart-bar mr-3" /> Reportes
                            </NavLink>
                            
                            <Divider />

                            <Button
                                className="w-full flex items-center justify-between p-3 text-gray-600 font-normal unstyled hover:bg-gray-50 rounded-lg"
                                onClick={(e) => menuMobile.current?.toggle(e)}
                            >
                                <span className="flex items-center gap-3">
                                    <i className="pi pi-cog text-lg" /> Mantenimientos
                                </span>
                                <i className="pi pi-chevron-down text-xs" />
                            </Button>
                            <Menu model={configItems} popup ref={menuMobile} appendTo="self" />
                        </nav>
                    </div>
                    <Button 
                        label="Cerrar Sesión" icon="pi pi-power-off" 
                        className="p-button-danger w-full mt-4" 
                        onClick={handleLogout}
                    />
                </div>
            </Sidebar>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow-sm">
                    <i className="pi pi-truck text-cyan-700" style={{ fontSize: '1.5rem' }}></i>
                    <Button icon="pi pi-bars" onClick={() => setSidebarOpen(true)} className="p-button-text p-button-secondary" />
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;