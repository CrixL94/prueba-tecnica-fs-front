import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import DataTable from '../components/DataTable';
import Loading from '../components/Loader';
import { transportistasAPI } from '../api/transportistasAPI';

const TransportistasScreen = () => {
    const [transportistas, setTransportistas] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const fetchTransportistas = async () => {
        try {
            setLoading(true);
            const data = await transportistasAPI.listarVista();
            setTransportistas(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los transportistas',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransportistas();
    }, []);

    const filteredData = transportistas.filter((item) => {
        const searchTerm = filter.toLowerCase();
        return (
            item.Nombre?.toLowerCase().includes(searchTerm)
        );
    });

    const columns = [
        { field: 'IdTransportista', header: 'ID', sortable: true, style: { width: '80px' } },
        { field: 'Nombre', header: 'Transportista', sortable: true },
        { 
            field: 'TarifaPorKm', 
            header: 'Tarifa por Km', 
            sortable: true,
            body: (rowData) => `L. ${rowData.TarifaPorKm.toFixed(2)}`
        },
        { 
            field: 'FechaCreacion', 
            header: 'Fecha Registro', 
            sortable: true,
            body: (rowData) => new Date(rowData.FechaCreacion).toLocaleDateString('es-HN', { timeZone: 'UTC' })
        },
        { 
            field: 'NombreEstado', 
            header: 'Estado',
            sortable: true,
            body: (rowData) => (
                <span 
                    className="px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: rowData.ColorFondo }}
                >
                    {rowData.NombreEstado}
                </span>
            )
        }
    ];

    return (
        <div className="flex flex-col bg-white shadow-md rounded-xl p-6 border border-gray-100 overflow-hidden">
            <Toast ref={toast} />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Transportistas</h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <InputText
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            placeholder="Buscar transportista..." 
                            className="pl-4 w-64 border-gray-200 focus:border-cyan-500 rounded-lg py-2"
                        />
                    </div>
                    
                    <Button icon="pi pi-sync" onClick={fetchTransportistas} loading={loading} className="p-button-text" />
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
        </div>
    );
};

export default TransportistasScreen;