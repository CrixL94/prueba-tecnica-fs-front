import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';

const SucursalForm = ({ visible, onHide, onSave, editData }) => {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    
    const { values, handleChange, resetForm, setValues } = useForm({
        Nombre: '',
        Direccion: ''
    });

    useEffect(() => {
        if (editData) {
            setValues({
                IdSucursal: editData.IdSucursal,
                Nombre: editData.NombreSucursal || editData.Nombre,
                Direccion: editData.Direccion,
                IdEstado: editData.IdEstado,
                IdUsuario: user?.idusuario
            });
        } else {
            resetForm();
        }
        setSubmitted(false);
    }, [editData, visible]);

    const handleConfirmSave = () => {
        setSubmitted(true);

        if (values.Nombre?.trim() && values.Direccion?.trim()) {
            onSave(values);
        }
    };

    const footer = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button 
                label={editData ? "Actualizar" : "Guardar"} 
                icon="pi pi-check" 
                className="bg-cyan-600 border-none" 
                onClick={handleConfirmSave} 
            />
        </div>
    );

    return (
        <Dialog 
            header={editData ? "Editar Sucursal" : "Nueva Sucursal"} 
            visible={visible} 
            style={{ width: '400px' }} 
            footer={footer} 
            onHide={onHide}
            className="p-fluid"
            draggable={false}
            resizable={false}
        >
            <div className="flex flex-col gap-4 pt-2">
                
                {/* Nombre de la Sucursal */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Nombre de Sucursal</label>
                    <InputText 
                        value={values.Nombre} 
                        onChange={(e) => handleChange(e.target.value, 'Nombre')} 
                        placeholder="Ej. Sucursal Central San Pedro Sula"
                        className={submitted && !values.Nombre?.trim() ? 'p-invalid' : ''}
                        autoFocus
                    />
                    {submitted && !values.Nombre?.trim() && (
                        <small className="p-error text-xs">Campo obligatorio</small>
                    )}
                </div>

                {/* Dirección */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Dirección Completa</label>
                    <InputText 
                        value={values.Direccion} 
                        onChange={(e) => handleChange(e.target.value, 'Direccion')} 
                        placeholder="Bo. Centro, 1ra calle..."
                        className={submitted && !values.Direccion?.trim() ? 'p-invalid' : ''}
                    />
                    {submitted && !values.Direccion?.trim() && (
                        <small className="p-error text-xs">Campo obligatorio</small>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default SucursalForm;