import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import DataTable from '../components/DataTable';
import Loading from '../components/Loader';
import { colaboradoresAPI } from '../api/colaboradoresAPI';

const ColaboradoresScreen = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const fetchColaboradores = async () => {
        try {
            setLoading(true);
            const data = await colaboradoresAPI.listar();
            setColaboradores(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los colaboradores',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColaboradores();
    }, []);

    const filteredData = colaboradores.filter((item) => {
        const searchTerm = filter.toLowerCase();
        return (
            item.Nombre?.toLowerCase().includes(searchTerm) ||
            item.Telefono?.includes(searchTerm)
        );
    });

    const columns = [
        { field: 'IdColaborador', header: 'ID', sortable: true, style: { width: '80px' } },
        { field: 'Nombre', header: 'Nombre Completo', sortable: true },
        { field: 'Telefono', header: 'Teléfono', sortable: true },
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
        },
    ];

    return (
        <div className="flex flex-col bg-white shadow-md rounded-xl p-6 border border-gray-100 overflow-hidden">
            <Toast ref={toast} />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Colaboradores</h1>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <InputText
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            placeholder="Buscar..." 
                            className="pl-4 w-64 border-gray-200 focus:border-cyan-500 rounded-lg py-2"
                        />
                    </div>
                    
                    <Button icon="pi pi-sync" onClick={fetchColaboradores} loading={loading} className="p-button-text" />
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
                        className="p-datatable-sm"
                    />
                )}
            </div>
        </div>
    );
};

export default ColaboradoresScreen;