import { useState, useEffect, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { useForm } from '../hooks/useForm';
import { colaboradoresAPI } from '../api/colaboradoresAPI';
import { viajesAPI } from '../api/viajesAPI';
import { sucursalesAPI } from '../api/sucursalesAPI';
import { transportistasAPI } from '../api/transportistasAPI';
import { useAuth } from '../context/AuthContext';
import { InputText } from 'primereact/inputtext';

const ViajeModal = ({ visible, onHide, onSuccess, toast }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [catalogos, setCatalogos] = useState({ sucursales: [], transportistas: [] });
    const [colaboradores, setColaboradores] = useState([]);

    const { values, handleChange, resetForm, setValues } = useForm({
        idSucursal: null,
        idTransportista: null,
        asignaciones: []
    });

    useEffect(() => {
        if (visible) {
            cargarCatalogos();
        } else {
            resetForm();
            setColaboradores([]);
        }
    }, [visible]);

    //console.log(catalogos)

    //carga sucursales y transportistas
    const cargarCatalogos = async () => {
        const [resSucu, resTrans] = await Promise.all([
            sucursalesAPI.listar(),
            transportistasAPI.listar()
        ]);
        setCatalogos({ sucursales: resSucu, transportistas: resTrans });
    };

    //cambia la sucursal
    const cambioSucursal = async (e) => {
        const idSucu = e.value;
        setValues(prev => ({ ...prev, idSucursal: idSucu, asignaciones: [] }));
        
        try {
            const resColaboradores = await colaboradoresAPI.obtenerPorSucursal(idSucu);
            setColaboradores(resColaboradores);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se cargaron colaboradores' });
        }
    };

    //calculo a pagar
    const calculos = useMemo(() => {
        //Obtener tarifa del transportista seleccionado
        const transportista = catalogos.transportistas.find(t => t.IdTransportista === values.idTransportista);
        const tarifa = transportista ? parseFloat(transportista.TarifaPorKm) : 0;

        //Sumar KM de colaboradores seleccionados
        const totalKm = colaboradores
            .filter(c => values.asignaciones.includes(c.IdAsignacion))
            .reduce((acc, curr) => acc + curr.DistanciaKm, 0);

        //Calcular Total
        return {
            tarifa,
            totalKm,
            totalPagar: (tarifa * totalKm).toFixed(2)
        };
    }, [values.idTransportista, values.asignaciones, colaboradores, catalogos.transportistas]);

    const guardarViaje = async () => {
        const { idSucursal, idTransportista, asignaciones } = values;

        if (!idSucursal || !idTransportista || asignaciones.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Atención', detail: 'Faltan campos obligatorios' });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...values, idUsuario: user.idusuario};
            const res = await viajesAPI.registrar(payload);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: res.message });
            onSuccess();
            onHide();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            header="Nuevo Viaje" 
            visible={visible} 
            modal 
            onHide={onHide}
            style={{ width: '60vw' }}
            footer={(
                <div>
                    <Button label="Cancelar" icon="pi pi-times" text onClick={onHide} />
                    <Button label="Guardar" icon="pi pi-check" onClick={guardarViaje} loading={loading} />
                </div>
            )}
        >
            <div>
                <div className="sm:flex flex-row gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Transportista</label>
                        <Dropdown 
                            value={values.idTransportista} 
                            options={catalogos.transportistas} 
                            onChange={(e) => handleChange(e.value, 'idTransportista')}
                            optionLabel="Nombre" 
                            optionValue="IdTransportista" 
                            placeholder="Seleccione transportista" 
                            className="w-full"
                            filter
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Tarifa por KM</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">Lps.</span>
                            <InputText
                                value={catalogos.transportistas.find(t => t.IdTransportista === values.idTransportista)?.TarifaPorKm || '0.00'} 
                                disabled 
                                className="bg-gray-100 font-bold text-cyan-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:flex flex-row gap-4 mt-4">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Sucursal</label>
                        <Dropdown 
                            value={values.idSucursal} 
                            options={catalogos.sucursales} 
                            onChange={cambioSucursal}
                            optionLabel="NombreSucursal" 
                            optionValue="IdSucursal" 
                            placeholder="Seleccione sucursal" 
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Colaboradores</label>
                        <MultiSelect 
                            value={values.asignaciones} 
                            options={colaboradores} 
                            onChange={(e) => handleChange(e.value, 'asignaciones')}
                            optionLabel="NombreColaborador" 
                            optionValue="IdAsignacion" 
                            placeholder={values.idSucursal ? "Seleccione los pasajeros" : "Primero elija una sucursal"} 
                            disabled={!values.idSucursal} 
                            className="w-full"
                            display="chip"
                            //maxSelectedLabels={3}
                            filter
                        />
                    </div>
                </div>

                <div className="sm:flex flex-row gap-4 mt-4">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Total KM</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">KM</span>
                            <InputText
                                value={Number(calculos.totalKm).toFixed(2)} 
                                disabled 
                                className="bg-gray-100 font-bold text-cyan-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold text-gray-700">Total a pagar</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">Lps.</span>
                            <InputText
                                value={calculos.totalPagar} 
                                disabled 
                                className="bg-gray-100 font-bold text-cyan-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ViajeModal;