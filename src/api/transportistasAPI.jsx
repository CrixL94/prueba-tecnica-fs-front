import api from './axios';

export const transportistasAPI = {
    listar: async () => {
        const { data } = await api.get('/transportistas');
        return data;
    },

    listarVista: async () => {
        const { data } = await api.get('/transportistas/view');
        return data;
    },
};