import { useState, useEffect, useRef } from 'react';
import { transportistasAPI } from '../api/transportistasAPI';
import { reportesAPI } from '../api/reportesAPI';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Loading from '../components/Loader';
import DataTable from '../components/DataTable';

const ReporteViajesScreen = () => {
    const toast = useRef(null);
    const [viajes, setViajes] = useState([]);
    const [transportistas, setTransportistas] = useState([]);
    const [loading, setLoading] = useState(false);


    const cargarDatos = async () => {
        setLoading(true);
            const [dataViajes, dataTrans] = await Promise.all([
                reportesAPI.listar(),
                transportistasAPI.listar()
            ]);
            console.log('>>>>>>>>>>',dataViajes)
            console.log('>>>>>>>>>>',dataTrans)

            setViajes(dataViajes);
            setTransportistas(dataTrans);
        setLoading(false)
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { field: 'IdViaje', header: 'ID', sortable: true },
        { 
            field: 'FechaViaje', 
            header: 'Fecha', 
            body: (rowData) => new Date(rowData.FechaViaje).toLocaleDateString(),
            sortable: true 
        },
        { field: 'NombreTransportista', header: 'Transportista', sortable: true },
        { field: 'NombreSucursal', header: 'Sucursal' },
        { field: 'Colaboradores', header: 'Pasajeros' },
        { 
            field: 'TotalKmViaje', 
            header: 'KM', 
            body: (rowData) => `${rowData.TotalKmViaje.toFixed(2)}` 
        },
        { 
            field: 'TotalPagarViaje', 
            header: 'Monto Lps.', 
            body: (rowData) => (
                <span className="font-bold text-cyan-700">
                    {rowData.TotalPagarViaje.toFixed(2)}
                </span>
            ) 
        }
    ];

    return (
        <div className="flex flex-col bg-white shadow-md rounded-xl p-6 border border-gray-100 overflow-hidden">
            <Toast ref={toast} />
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Reportes</h1>
                
                <div className="flex items-center gap-3">                    
                    <Button
                        icon="pi pi-sync"
                        onClick={cargarDatos}
                        loading={loading}
                    />
                </div>
            </div>


            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <Loading loading={loading} />
                ) : (
                    <DataTable 
                        data={viajes} 
                        columns={columns} 
                        paginator 
                        rows={8}
                        scrollable 
                        scrollHeight="flex"
                        className="h-screen"
                    />
                )}
            </div>
        </div>
    );
};

export default ReporteViajesScreen;