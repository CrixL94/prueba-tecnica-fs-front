import { useState, useEffect, useRef } from 'react';
import { transportistasAPI } from '../api/transportistasAPI';
import { reportesAPI } from '../api/reportesAPI';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Loading from '../components/Loader';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import DataTable from '../components/DataTable';

const ReporteViajesScreen = () => {
    const toast = useRef(null);
    const [viajes, setViajes] = useState([]);
    const [transportistas, setTransportistas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idTransportista, setIdTransportista] = useState(null);
    const [rangoFechas, setRangoFechas] = useState(null);
    const [viajesSeleccionados, setViajesSeleccionados] = useState([]);

    const cargarDatos = async () => {
        setLoading(true);
            const [dataViajes, dataTrans] = await Promise.all([
                reportesAPI.listar(),
                transportistasAPI.listar()
            ]);
            //console.log('>>>>>>>>>>',dataViajes)
            //console.log('>>>>>>>>>>',dataTrans)

            setViajes(dataViajes);
            setTransportistas(dataTrans);
            setViajesSeleccionados([]);
        setLoading(false)
    };

    //aplicar filtros
    const aplicarFiltros = async () => {
        setLoading(true);
        try {
            const params = {
                idTransportista,
                fechaInicio: rangoFechas?.[0]?.toISOString().split('T')[0] || null,
                fechaFin: rangoFechas?.[1]?.toISOString().split('T')[0] || null
            };
            const data = await reportesAPI.filtrar(params); 
            setViajes(data); 
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo al filtrar' });
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setIdTransportista(null);
        setRangoFechas(null);
        setViajesSeleccionados([]);
        cargarDatos();
    };

    useEffect(() => {
        if (!idTransportista && !rangoFechas) {
            cargarDatos();
            return;
        }

        if (rangoFechas && rangoFechas[0] && !rangoFechas[1]) {
            return;
        }

        aplicarFiltros();
    }, [idTransportista, rangoFechas]);

    const columns = [
        { selectionMode: 'multiple', headerStyle: { width: '3rem' } },
        { field: 'IdViaje', header: 'ID', sortable: true },
        { 
            field: 'FechaViaje', 
            header: 'Fecha', 
            body: (rowData) => new Date(rowData.FechaViaje).toLocaleDateString('es-HN', { timeZone: 'UTC' }),
            sortable: true 
        },
        { field: 'NombreTransportista', header: 'Transportista', sortable: true },
        { field: 'NombreSucursal', header: 'Sucursal' },
        //{ field: 'Colaboradores', header: 'Pasajeros' },
        { 
        field: 'Colaboradores', 
        header: 'Pasajeros',
        body: (rowData) => {
                const lista = rowData.Colaboradores ? rowData.Colaboradores.split(', ') : [];
                const cantidad = lista.length;
                return (
                    <div className="flex items-center gap-2">
                        <i className="pi pi-users text-cyan-600"></i>
                        <span>
                            {cantidad} {cantidad === 1 ? 'Pasajero' : 'Pasajeros'}
                        </span>
                    </div>
                );
            },
            sortable: true
        },
        { 
            field: 'TarifaAplicada',
            header: 'Tarifa * KM', 
            body: (rowData) => `${rowData.TarifaAplicada.toFixed(2)}` 
        },
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

    const generarReportePDF = () => {
        if (viajesSeleccionados.length === 0) return;

        const primerId = viajesSeleccionados[0].IdTransportista;
        const errorMezcla = viajesSeleccionados.some(v => v.IdTransportista !== primerId);

        if (errorMezcla) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Seleccione viajes de un solo transportista.',
                life: 5000 
            });
            return;
        }
        console.log(viajesSeleccionados)
    };

    return (
        <div className="flex flex-col bg-white shadow-md rounded-xl p-6 border border-gray-100 overflow-hidden">
            <Toast ref={toast} />
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Reportes</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <Dropdown 
                        value={idTransportista} 
                        options={transportistas} 
                        onChange={(e) => setIdTransportista(e.value)}
                        optionLabel="Nombre" 
                        optionValue="IdTransportista" 
                        placeholder="Transportista"
                        className="w-full md:w-56"
                        showClear
                        filter
                    />

                    <Calendar 
                        value={rangoFechas} 
                        onChange={(e) => setRangoFechas(e.value)} 
                        selectionMode="range" 
                        readOnlyInput 
                        placeholder="Rango de fechas"
                        className="w-full md:w-64"
                        showIcon
                    />

                    <Button icon="pi pi-filter-slash" onClick={limpiarFiltros} severity="danger"/>
                    
                    <Button
                        icon="pi pi-sync"
                        onClick={cargarDatos}
                        loading={loading}
                    />

                    <Button 
                        label="Generar Reporte"
                        icon="pi pi-file-pdf" 
                        onClick={generarReportePDF} 
                        severity="success" 
                        disabled={viajesSeleccionados.length === 0}
                        className="ml-2"
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
                        selectionMode="multiple" 
                        selection={viajesSeleccionados} 
                        onSelectionChange={(e) => setViajesSeleccionados(e.value)}
                        dataKey="IdViaje"
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