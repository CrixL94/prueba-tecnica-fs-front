import api from './axios';

export const reportesAPI = {
        listar: async () => {
        const { data } = await api.get('/reportes');
        return data;
    },
};