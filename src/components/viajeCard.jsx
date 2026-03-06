import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

const ViajeCard = ({ viaje }) => {
    if (!viaje) return null;

    const totalPagar = viaje.PagoTotalViaje;
    const distanciaTotal = viaje.DistanciaTotalViaje;
    const tarifa = viaje.TarifaPorKm;

    return (
        <Card className="shadow-2 border-left-3 border-cyan-500 h-full">
            <div className="flex justify-content-between align-items-start mb-3">
                <div className="text-left">
                    <span className="text-sm text-gray-500 font-medium">
                        <i className="pi pi-calendar mr-1"></i>
                        {viaje.FechaViaje ? new Date(viaje.FechaViaje).toLocaleDateString('es-HN', { timeZone: 'UTC' }) : 'N/A'}
                    </span>
                    <div className="text-xl font-bold text-gray-800 mt-1">
                        {viaje.Transportista}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block text-left">
                        {viaje.Sucursal}
                    </span>
                </div>
                <Badge value={`L. ${Number(totalPagar).toFixed(2)}`} severity="success" className="p-2 text-sm"></Badge>
            </div>

            <div className="bg-gray-100 p-3 border-round-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block text-left">
                    Pasajeros del Viaje
                </span>
                {viaje.Colaboradores && viaje.Colaboradores.map((col, idx) => (
                    <div key={idx} className="flex justify-content-between align-items-center gap-3 border-bottom-1 border-gray-200 last:border-none">
                        <span className="text-gray-700 font-medium">{col.Nombre}</span>
                        <span className="text-cyan-600 font-bold">{Number(col.Distancia || 0).toFixed(2)} KM</span>
                    </div>
                ))}
            </div>

            <Divider />

            <div className="flex justify-content-between gap-2 text-xs font-medium text-gray-500">
                <span><i className="pi pi-map mr-1"></i> {Number(distanciaTotal).toFixed(2)} KM Totales</span>
                <span><i className="pi pi-tag mr-1"></i> Tarifa: L. {Number(tarifa).toFixed(2)}/KM</span>
            </div>
        </Card>
    );
};

export default ViajeCard;