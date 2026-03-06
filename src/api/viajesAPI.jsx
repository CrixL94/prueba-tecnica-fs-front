import api from './axios';

export const viajesAPI = {
    listar: async () => {
        const { data } = await api.get('/viajes');
        return data;
    },

    registrar: async (payload) => {
        console.log(payload)
        const { data } = await api.post('/viajes/registrar', payload);
        return data;
    },
};