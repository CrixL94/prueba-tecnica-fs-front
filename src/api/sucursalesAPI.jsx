import api from './axios';

export const sucursalesAPI = {
    listar: async () => {
        const { data } = await api.get('/sucursales');
        return data;
    },

    listarVista: async () => {
        const { data } = await api.get('/sucursales/view');
        return data;
    },

    //(Insert, Update, Delete)
    gestionar: async (payload) => {
        // { Accion, IdSucursal, Nombre, Direccion, IdUsuario }
        const { data } = await api.post('/sucursales/gestionar', payload);
        return data;
    }
};