import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const toast = useRef(null);
    
    const [values, setValues] = useState({ usuario: '', password: '' });
    const [error, setError] = useState({ usuario: false, password: false });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        setError({ ...error, [name]: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación
        const usuarioError = !values.usuario;
        const passwordError = !values.password;
        
        if (usuarioError || passwordError) {
            setError({ usuario: usuarioError, password: passwordError });
            return;
        }

        setLoading(true);
        try {
            await login(values.usuario, values.password);
        } catch (err) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error de acceso', 
                detail: err, 
                life: 3000 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Toast ref={toast} />
            <form
                onSubmit={handleSubmit}
                className="sm:bg-white p-8 rounded-b-md sm:shadow-md w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-sm">
                        <i className="pi pi-truck text-cyan-700" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-700 mt-2">Transportes FS</h2>
                    <p className="text-gray-500 text-sm">Control de Asignaciones</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="usuario" className="block mb-1 font-semibold">
                            Usuario
                        </label>
                        <InputText
                            id="usuario"
                            name="usuario"
                            type="usuario"
                            value={values?.usuario}
                            onChange={handleInputChange}
                            placeholder="Usuario"
                            className={`w-full ${
                                error?.usuario ? "border-red-500 border-2" : ""
                            }`}
                            keyfilter="usuario"
                        />
                        {error.usuario && (
                            <small className="text-red-500 text-sm">
                                Campo obligatorio.
                            </small>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 font-semibold">
                            Contraseña
                        </label>
                        <IconField>
                            <InputIcon
                                className={`cursor-pointer ${
                                    showPassword ? "pi pi-eye-slash" : "pi pi-eye"
                                }`}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <InputText
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={values?.password}
                                onChange={handleInputChange}
                                placeholder="Contraseña"
                                className={`w-full ${
                                    error?.password ? "border-red-500 border-2" : ""
                                }`}
                            />
                        </IconField>
                        {error.password && (
                            <small className="text-red-500 text-sm">
                                Campo obligatorio.
                            </small>
                        )}
                    </div>

                    <Button
                        unstyled
                        label={loading ? "Iniciando..." : "Iniciar Sesión"}
                        type="submit"
                        className="w-full mt-2 bg-cyan-600 text-white hover:bg-cyan-700 p-2 rounded-sm transition-colors"
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
};

export default Login;