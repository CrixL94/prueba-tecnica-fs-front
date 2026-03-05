import api from './axios';

export const sucursalesAPI = {
    listar: async () => {
        const { data } = await api.get('/sucursales');
        return data;
    }
};