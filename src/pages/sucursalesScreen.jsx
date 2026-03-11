import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import DataTable from '../components/DataTable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Loading from '../components/Loader';
import { sucursalesAPI } from '../api/sucursalesAPI';
import { useAuth } from '../context/AuthContext';
import SucursalForm from '../formularios/sucursalForm';

const SucursalesScreen = () => {
    const { user } = useAuth();
    const [sucursales, setSucursales] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSucursal, setSelectedSucursal] = useState(null);

    const fetchSucursales = async () => {
        try {
            setLoading(true);
            const data = await sucursalesAPI.listarVista();
            setSucursales(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar las sucursales',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            const payload = {
                ...formData,
                Accion: selectedSucursal ? 'UPDATE' : 'INSERT',
                IdUsuario: user?.idusuario
            };

            const res = await sucursalesAPI.gestionar(payload);

            if (res.success) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: res.message });
                setShowModal(false);
                fetchSucursales();
            } 
            else {
                toast.current.show({ 
                    severity: 'warn', 
                    summary: 'Validación', 
                    detail: res.message,
                    life: 5000 
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMsg, life: 5000 });
        }
    };

    const eliminarRegistro = (data) => {
        confirmDialog({
            message: `¿Estás seguro de desactivar la sucursal ${data.NombreSucursal}?`,
            header: 'Confirmar Acción',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, desactivar',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const payload = {
                        Accion: 'DELETE',
                        IdSucursal: data.IdSucursal,
                        IdUsuario: user.idusuario
                    };

                    const res = await sucursalesAPI.gestionar(payload);
                    
                    if (res.success) {
                        toast.current.show({ severity: 'success', summary: 'Desactivada', detail: res.message });
                        fetchSucursales();
                    }
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la acción' });
                }
            }
        });
    };

    const editarRegistro = (data) => {
        setSelectedSucursal({
            ...data,
            Nombre: data.NombreSucursal,
            Direccion:data.Direccion
        });
        setShowModal(true);
    };

    const nuevoRegistro = () => {
        setSelectedSucursal(null);
        setShowModal(true);
    };

    useEffect(() => {
        fetchSucursales();
    }, []);

    const filteredData = sucursales.filter((item) => {
        const searchTerm = filter.toLowerCase();
        return (
            item.NombreSucursal?.toLowerCase().includes(searchTerm) ||
            item.Direccion?.toLowerCase().includes(searchTerm)
        );
    });

    const columns = [
        { field: 'IdSucursal', header: 'ID', sortable: true },
        { field: 'NombreSucursal', header: 'Nombre', sortable: true },
        { field: 'Direccion', header: 'Dirección', sortable: true },
        { 
            field: 'NombreEstado', 
            header: 'Estado',
            body: (rowData) => (
                <span 
                    className="px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: rowData.EstadoColor || rowData.ColorFondo }}
                >
                    {rowData.NombreEstado}
                </span>
            )
        },
        // Acciones solo para Admin (idrol === 2)
        ...(user?.idrol === 2 ? [{
            header: 'Acciones',
            body: (rowData) => (
                <div className="flex gap-2">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-info"
                        onClick={() => editarRegistro(rowData)}/>
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" 
                        onClick={() => eliminarRegistro(rowData)}/>
                </div>
            )
        }] : [])
    ];

    return (
        <div className="flex flex-col bg-white shadow-md rounded-xl p-6 border border-gray-100 overflow-hidden">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Sucursales</h1>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <InputText
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            placeholder="Buscar sucursal..." 
                            className="pl-10 w-64 md:w-80 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg py-2"
                        />
                    </div>
                    
                    <Button icon="pi pi-sync" onClick={fetchSucursales} loading={loading} />

                    {user?.idrol === 2 && (
                        <Button icon="pi pi-plus" severity="success" onClick={nuevoRegistro} />
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <Loading loading={loading} />
                ) : (
                    <DataTable 
                        data={filteredData} 
                        columns={columns} 
                        paginator 
                        rows={10}
                        scrollable 
                        scrollHeight="flex"
                    />
                )}
            </div>

            <SucursalForm 
                visible={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSave}
                editData={selectedSucursal}
            />
        </div>
    );
};

export default SucursalesScreen;