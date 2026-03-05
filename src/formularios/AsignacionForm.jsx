import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';

const AsignacionForm = ({ visible, onHide, onSave, sucursales, colaboradores, editData }) => {
    const { user } = useAuth();
    
    const { values, handleChange, setNumber, resetForm, setValues } = useForm({
        idColaborador: null,
        idSucursal: null,
        distanciaKm: 0
    });

    useEffect(() => {
        if (editData) {
            setValues({
                idAsignacion: editData.IdAsignacion,
                idColaborador: editData.IdColaborador,
                idSucursal: editData.IdSucursal,
                distanciaKm: editData.DistanciaKm,
                idUsuario: user.idusuario
            });
        } else {
            resetForm();
        }
    }, [editData, visible]);

    const footer = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button 
                label={editData ? "Actualizar" : "Guardar"} 
                icon="pi pi-check" 
                className="bg-cyan-600 border-none" 
                onClick={() => onSave(values)} 
            />
        </div>
    );

    return (
        <Dialog 
            header={editData ? "Editar Asignación" : "Nueva Asignación"} 
            visible={visible} 
            style={{ width: '400px' }} 
            footer={footer} 
            onHide={onHide}
            className="p-fluid"
            draggable={false}
            resizable={false}
        >
            <div className="flex flex-col gap-4 pt-2">
                {/* Sucursal */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Sucursal</label>
                    <Dropdown 
                        value={values.idSucursal} 
                        options={sucursales} 
                        onChange={(e) => handleChange(e.value, 'idSucursal')} 
                        optionLabel="NombreSucursal"
                        optionValue="IdSucursal"
                        placeholder="Seleccione Sucursal"
                        disabled={!!editData}
                        filter
                    />
                </div>

                {/* Colaborador */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Colaborador</label>
                    <Dropdown 
                        value={values.idColaborador} 
                        options={colaboradores} 
                        onChange={(e) => handleChange(e.value, 'idColaborador')} 
                        optionLabel="Nombre"
                        optionValue="IdColaborador"
                        placeholder="Seleccione Colaborador"
                        disabled={!!editData}
                        filter
                    />
                </div>

                {/* Distancia */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Distancia (0 - 50 km)</label>
                    <InputNumber 
                        value={values.distanciaKm} 
                        onValueChange={(e) => setNumber(e, 'distanciaKm')} 
                        //min={0} 
                        //max={50} 
                        mode="decimal" 
                        minFractionDigits={1}
                        maxFractionDigits={2}
                        placeholder="Ej. 12.5"
                        suffix=" km"
                        showButtons
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default AsignacionForm;