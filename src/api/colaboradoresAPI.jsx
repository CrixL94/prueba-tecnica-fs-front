import api from './axios';

export const colaboradoresAPI = {
    listar: async () => {
        const { data } = await api.get('/colaboradores');
        return data;
    },

    obtenerPorSucursal: async (idSucursal) => {
        const { data } = await api.get(`/colaboradores/${idSucursal}`);
        return data;
    }
};