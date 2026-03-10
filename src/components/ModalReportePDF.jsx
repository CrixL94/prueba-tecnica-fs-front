import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const ModalReportePDF = ({ visible, onHide, viajes }) => {
    //console.log('>>>>>>>>>>>>>>>>>>>>>',viajes)
    
    if (!viajes || viajes.length === 0) return null;

    const nombreTransportista = viajes[0].NombreTransportista;
    const tarifa = viajes[0].TarifaAplicada;
    const totalMonto = viajes.reduce((acc, v) => acc + v.TotalPagarViaje, 0);
    const totalKm = viajes.reduce((acc, v) => acc + v.TotalKmViaje, 0);
    const cantidadViajes = viajes.length;

    const parsearColaboradores = (colaboradoresString) => {
        const lista = colaboradoresString.split('), ').map(s => s.endsWith(')') ? s : s + ')');
        
        return lista.map(item => {
            const nombre = item.split(' (')[0];
            const id = item.match(/ID:\s*(\d+)/)?.[1] || 'N/A';
            const km = item.match(/-\s*([\d.]+)\s*KM/)?.[1] || '0.00';
            
            return [
                { text: id, fontSize: 8, alignment: 'center' },
                { text: nombre, fontSize: 8 },
                { text: km, fontSize: 8, alignment: 'center' }
            ];
        });
    };

    const descargarReporte = () => {
    const tarifa = viajes[0]?.TarifaAplicada || 0;

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: [
            {
                columns: [
                    { text: 'CONTROL DE TRANSPORTES', style: 'header' },
                    { text: `Fecha: ${new Date().toLocaleDateString('es-HN')}`, alignment: 'right', fontSize: 10 }
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#0891b2' }] },
            { text: `\nLIQUIDACIÓN DE SERVICIOS: ${nombreTransportista}`, bold: true, fontSize: 11, margin: [0, 10, 0, 5] },
            { text: `Tarifa por KM: L. ${tarifa.toFixed(2)}`, fontSize: 10, margin: [0, 0, 0, 10] },
            
            {
                margin: [0, 10, 0, 15],
                table: {
                    headerRows: 1,
                    widths: [35, 55, '*', 65, 45, 75], 
                    body: [
                        [
                            { text: 'ID', style: 'tableHeader' },
                            { text: 'FECHA', style: 'tableHeader' },
                            { text: 'SUCURSAL', style: 'tableHeader' },
                            { text: '# PASAJEROS', style: 'tableHeader', alignment: 'center' },
                            { text: 'KM', style: 'tableHeader', alignment: 'center' },
                            { text: 'TOTAL LPS', style: 'tableHeader', alignment: 'right' }
                        ],
                        ...viajes.map(v => {
                            const numPasajeros = v.Colaboradores ? v.Colaboradores.split('),').length : 0;
                            return [
                                { text: v.IdViaje, fontSize: 9 },
                                { text: new Date(v.FechaViaje).toLocaleDateString('es-HN', {timeZone: 'UTC'}), fontSize: 9 },
                                { text: v.NombreSucursal, fontSize: 9 },
                                { text: numPasajeros, fontSize: 9, alignment: 'center' },
                                { text: v.TotalKmViaje.toFixed(2), fontSize: 9, alignment: 'center' },
                                { text: v.TotalPagarViaje.toFixed(2), fontSize: 9, alignment: 'right' }
                            ];
                        }),
                        [
                            { text: 'TOTALES', colSpan: 3, bold: true, fillColor: '#f8fafc' },
                            {},
                            {},
                            { text: '', bold: true, alignment: 'center', fillColor: '#f8fafc' }, // Celda 4
                            { text: totalKm.toFixed(2), bold: true, alignment: 'center', fillColor: '#f8fafc' }, // Celda 5
                            { text: `L. ${totalMonto.toFixed(2)}`, bold: true, alignment: 'right', fillColor: '#f8fafc', color: '#0891b2' } // Celda 6
                        ]
                    ]
                },
                layout: 'lightHorizontalLines'
            },

            //DETALLE DE COLABORADORES POR VIAJE
            { text: 'DETALLE DE PASAJEROS Y DISTANCIAS:', style: 'subHeader' },
            
            ...viajes.map(v => ([
                { text: `Viaje #${v.IdViaje} - ${v.NombreSucursal}`, style: 'viajeTitulo' },
                {
                    margin: [20, 0, 0, 15],
                    table: {
                        headerRows: 1,
                        widths: [40, '*', 60],
                        body: [
                            [
                                { text: 'ID COLAB.', style: 'colabHeader' },
                                { text: 'NOMBRE COMPLETO', style: 'colabHeader' },
                                { text: 'DISTANCIA KM', style: 'colabHeader', alignment: 'center' }
                            ],
                            ...parsearColaboradores(v.Colaboradores),
                            [
                                { text: 'TOTAL KM VIAJE', colSpan: 2, bold: true, fontSize: 8, alignment: 'right', fillColor: '#f8fafc' },
                                {},
                                { 
                                    text: v.TotalKmViaje.toFixed(2), 
                                    bold: true, 
                                    fontSize: 8, 
                                    alignment: 'center', 
                                    fillColor: '#f1f5f9' 
                                }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 0.5 : 0.2,
                        vLineWidth: () => 0,
                        hLineColor: (i, node) => (i === node.table.body.length - 1) ? '#0891b2' : '#e2e8f0'
                    }
                }
            ])).flat(),

            {
                margin: [0, 40, 0, 0],
                columns: [
                    { stack: [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 130, y2: 0 }] }, { text: 'Firma Transportista', fontSize: 9, margin: [0, 5] }], alignment: 'center' },
                    { stack: [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 130, y2: 0 }] }, { text: 'Revisado por RRHH', fontSize: 9, margin: [0, 5] }], alignment: 'center' }
                ]
            }
        ],

        
            styles: {
                header: { fontSize: 14, bold: true, color: '#1e293b' },
                subHeader: { fontSize: 10, bold: true, color: '#0891b2', margin: [0, 10, 0, 5] },
                viajeTitulo: { fontSize: 9, bold: true, margin: [0, 5, 0, 2], color: '#475569' },
                tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#0891b2', margin: [0, 3, 0, 3] },
                colabHeader: { bold: true, fontSize: 8, fillColor: '#f1f5f9', color: '#475569' }
            }
        };

        pdfMake.createPdf(docDefinition).download(`Liquidacion_${nombreTransportista.replace(/ /g, '_')}.pdf`);
        onHide();
    };

    return (
        <Dialog 
            header="Resumen de Liquidación" 
            visible={visible} 
            style={{ width: '450px' }} 
            onHide={onHide}
            draggable={false}
        >
            <div className="flex flex-col gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-600">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Transportista</p>
                    <p className="text-lg font-bold text-gray-800">{nombreTransportista}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-md text-center">
                        <p className="text-xs text-gray-400 uppercase">Viajes</p>
                        <p className="text-xl font-bold text-gray-700">{cantidadViajes}</p>
                    </div>
                    <div className="p-3 border rounded-md text-center">
                        <p className="text-xs text-gray-400 uppercase">Total KM</p>
                        <p className="text-xl font-bold text-gray-700">{totalKm.toFixed(1)}</p>
                    </div>
                </div>

                <div className="bg-cyan-50 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-cyan-800 font-bold">Monto a Liquidar:</span>
                    <span className="text-2xl font-black text-cyan-900">L. {totalMonto.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" severity="success" onClick={descargarReporte} className="p-3" />
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text text-gray-400" />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalReportePDF;