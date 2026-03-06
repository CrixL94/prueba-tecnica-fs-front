import { useState, useEffect, useRef, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Loading from '../components/Loader';
import ViajeCard from '../components/viajeCard';
import { viajesAPI } from '../api/viajesAPI';

const ViajesScreen = () => {
    const [viajesPlanos, setViajesPlanos] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const fetchViajes = async () => {
        try {
            setLoading(true);
            const res = await viajesAPI.listar(); 
            setViajesPlanos(Array.isArray(res) ? res : res.data || []);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar el historial',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViajes();
    }, []);

    //agrupacion
    const procesarDatos = (datos = []) => {
        if (!Array.isArray(datos)) return [];

        return datos.reduce((acc, curr) => {
            let viaje = acc.find(v => v.IdViaje === curr.IdViaje);
            if (!viaje) {
                viaje = { 
                    ...curr, 
                    Colaboradores: [] 
                };
                acc.push(viaje);
            }
            viaje.Colaboradores.push({ 
                Nombre: curr.Colaborador, 
                Distancia: curr.DistanciaKm 
            });
            return acc;
        }, []);
    };

    //agrupar y filtrar
    const filteredData = useMemo(() => {
        const agrupados = procesarDatos(viajesPlanos);
        
        if (!filter.trim()) return agrupados;

        const query = filter.toLowerCase();
        return agrupados.filter(v => 
            v.Transportista?.toLowerCase().includes(query) ||
            v.Colaboradores.some(c => c.Nombre?.toLowerCase().includes(query))
        );
    }, [viajesPlanos, filter]);

    return (
        <div className="p-4">
            <Toast ref={toast} />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 m-0 text-left">Historial de Viajes</h1>
                    <p className="text-gray-500 m-0 text-left">Visualización detallada por transportista y colaboradores</p>
                </div>
                
                <div className="flex gap-2">
                    <span className="p-input-icon-left">
                        <InputText
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            placeholder="Buscar por transportista o colaborador" 
                            className="pl-10 w-64 md:w-80 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg py-2"
                        />
                    </span>
                    <Button
                        icon="pi pi-sync"
                        onClick={fetchViajes}
                        loading={loading}
                    />
                </div>
            </div>

            {loading ? (
                <Loading loading={loading} />
            ) : (
                <div className="flex flex-wrap w-full">
                    {filteredData.length > 0 ? (
                        filteredData.map(viaje => (
                        <div key={viaje.IdViaje} className="col-12 md:col-6 p-3">
                            <ViajeCard viaje={viaje} />
                        </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-8">
                            <i className="pi pi-filter-slash text-4xl text-gray-300 mb-3 block"></i>
                            <span className="text-gray-500 font-medium">No se encontraron viajes con ese criterio</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViajesScreen;