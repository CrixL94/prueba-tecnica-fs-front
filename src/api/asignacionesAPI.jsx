import api from './axios';

export const asignacionesAPI = {
    listar: async () => {
        const { data } = await api.get('/asignaciones');
        return data;
    },
    
    gestionar: async (payload) => {
        const { data } = await api.post('/asignaciones/procesar', payload);
        return data;
    }
};