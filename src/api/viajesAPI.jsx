import api from './axios';

export const viajesAPI = {
    listar: async () => {
        const { data } = await api.get('/viajes');
        return data;
    }
};