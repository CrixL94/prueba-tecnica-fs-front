import api from './axios';

export const reportesAPI = {
        listar: async () => {
        const { data } = await api.get('/reportes');
        return data;
    },

    // filtros = { idTransportista, fechaInicio, fechaFin }
    filtrar: async (filtros) => {
        console.log('>>>>>>', filtros)
        const { data } = await api.get('/reportes/filtrar', { 
            params: filtros 
        });
        return data;
    }
};