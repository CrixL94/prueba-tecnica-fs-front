import api from './axios';

export const colaboradoresAPI = {
    listar: async () => {
        const { data } = await api.get('/colaboradores');
        return data;
    }
};