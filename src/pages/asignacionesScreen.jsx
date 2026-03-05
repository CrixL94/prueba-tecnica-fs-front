import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import DataTable from '../components/DataTable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Loading from '../components/Loader';
import { asignacionesAPI } from '../api/asignacionesAPI';
import { useAuth } from '../context/AuthContext';
import AsignacionForm from '../formularios/AsignacionForm';
import { sucursalesAPI } from '../api/sucursalesAPI';
import { colaboradoresAPI } from '../api/colaboradoresAPI';

const AsignacionesScreen = () => {
    const { user } = useAuth();
    const [asignaciones, setAsignaciones] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAsignacion, setSelectedAsignacion] = useState(null);

    const fetchAsignaciones = async () => {
        try {
            setLoading(true);
            const data = await asignacionesAPI.listar();
            const dataSucursales = await sucursalesAPI.listar();
            const dataColaboradores = await colaboradoresAPI.listar();
            const filtrarData = data.filter(e => e.IdEstado === 1) //Estado Activo
            setAsignaciones(filtrarData);
            setSucursales(dataSucursales);
            setColaboradores(dataColaboradores);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar la lista',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    //Agregar o editar
    const handleSave = async (formData) => {
        try {
            const payload = {
                ...formData,
                accion: selectedAsignacion ? 'UPDATE' : 'INSERT',
                idUsuario: user?.idusuario
            };

            const res = await asignacionesAPI.gestionar(payload);
            
            if (res.success) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: res.message });
                setShowModal(false);
                fetchAsignaciones();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            toast.current.show({ severity: 'error', summary: 'Error de Validación', detail: errorMsg, life: 5000 });
        }
    };

    //Eliminar
    const eliminarRegistro = (data) => {
        confirmDialog({
            message: `¿Estás seguro de eliminar la asignación de ${data.NombreColaborador} en ${data.NombreSucursal}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    const payload = {
                        accion: 'DELETE',
                        idAsignacion: data.IdAsignacion,
                        idUsuario: user.idusuario
                    };

                    const res = await asignacionesAPI.gestionar(payload);
                    
                    if (res.success) {
                        toast.current.show({ 
                            severity: 'success', 
                            summary: 'Eliminado', 
                            detail: res.message, 
                            life: 3000 
                        });
                        fetchAsignaciones();
                    }
                } catch (error) {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'No se pudo eliminar el registro', 
                        life: 3000 
                    });
                }
            }
        });
    };

    //Editar
    const editarRegistro = (data) => {
        setSelectedAsignacion(data);
        setShowModal(true);
    };

    //Nuevo
    const nuevoRegistro = () => {
        setSelectedAsignacion(null);
        setShowModal(true);
    };

    useEffect(() => {
        fetchAsignaciones();
    }, []);

    const filteredData = asignaciones.filter((item) => {
        const searchTerm = filter.toLowerCase();
        return (
            item.NombreColaborador?.toLowerCase().includes(searchTerm) ||
            item.NombreSucursal?.toLowerCase().includes(searchTerm)
        );
    });

    const columns = [
        { field: 'IdAsignacion', header: 'ID', sortable: true },
        { field: 'NombreColaborador', header: 'Colaborador', sortable: true },
        { field: 'NombreSucursal', header: 'Sucursal', sortable: true },
        { 
            field: 'DistanciaKm', 
            header: 'Distancia', 
            body: (rowData) => `${rowData.DistanciaKm} KM` 
        },
        { 
            field: 'NombreEstado', 
            header: 'Estado',
            body: (rowData) => (
                <span 
                    className="px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: rowData.ColorFondo }}
                >
                    {rowData.NombreEstado}
                </span>
            )
        },
        //visible solo para idRol 1 gerente de tienda
        ...(user?.idrol === 1 ? [{
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
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Asignaciones</h1>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <InputText
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            placeholder="Buscar por colaborador o sucursal..." 
                            className="pl-10 w-64 md:w-80 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg py-2"
                        />
                    </div>
                    
                    <Button
                        icon="pi pi-sync"
                        onClick={fetchAsignaciones}
                        loading={loading}
                    />

                    {user?.idrol === 1 && (
                        <Button
                            icon="pi pi-plus" 
                            severity="success"
                            onClick={nuevoRegistro}
                        />
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
                        rows={8}
                        scrollable 
                        scrollHeight="flex"
                        className="h-screen"
                    />
                )}
                
                <AsignacionForm
                    visible={showModal}
                    onHide={() => setShowModal(false)}
                    onSave={handleSave}
                    sucursales={sucursales}
                    colaboradores={colaboradores}
                    editData={selectedAsignacion}
                />
            </div>
        </div>
    );
};

export default AsignacionesScreen;