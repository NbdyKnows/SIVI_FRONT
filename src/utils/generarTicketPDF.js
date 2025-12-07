/**
 * Generador de Ticket de Venta en PDF
 * Genera un comprobante de pago en formato ticket (80mm)
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';


export const generarTicketPDF = (ventaData) => {
  // Crear documento PDF en tamaño de ticket (80mm x altura variable)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 297] // Ancho 80mm, alto ajustable
  });

  const pageWidth = 80;
  let yPos = 10;

  // ===== ENCABEZADO =====
  
  // Logo y nombre del negocio
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titulo = 'MINIMARKET LOS ROBLES';
  const tituloWidth = doc.getTextWidth(titulo);
  doc.text(titulo, (pageWidth - tituloWidth) / 2, yPos);
  yPos += 7;

  // Información del negocio
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const info = [
    'RUC: 20123456789',
    'Jr Arica - Chosica, Lima',
    'Tel: (01) 234-5678',
    'www.losrobles.com'
  ];

  info.forEach(line => {
    const lineWidth = doc.getTextWidth(line);
    doc.text(line, (pageWidth - lineWidth) / 2, yPos);
    yPos += 4;
  });

  yPos += 2;
  
  // Línea divisoria
  doc.setLineWidth(0.3);
  doc.line(5, yPos, pageWidth - 5, yPos);
  yPos += 5;

  // ===== TIPO DE COMPROBANTE =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const comprobante = 'COMPROBANTE DE VENTA';
  const comprobanteWidth = doc.getTextWidth(comprobante);
  doc.text(comprobante, (pageWidth - comprobanteWidth) / 2, yPos);
  yPos += 5;

  doc.setFontSize(10);
  const numBoleta = `N° ${ventaData.codigo}`;
  const boletaWidth = doc.getTextWidth(numBoleta);
  doc.text(numBoleta, (pageWidth - boletaWidth) / 2, yPos);
  yPos += 7;

  // ===== INFORMACIÓN DE LA VENTA =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const fecha = new Date(ventaData.fecha).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const infoVenta = [
    `Fecha: ${fecha}`,
    `Cajero: ${ventaData.vendedor}`,
  ];

  if (ventaData.clienteNombre && ventaData.clienteNombre !== 'Sin registro') {
    infoVenta.push(`Cliente: ${ventaData.clienteNombre}`);
    if (ventaData.clienteDNI) {
      infoVenta.push(`DNI: ${ventaData.clienteDNI}`);
    }
  }

  infoVenta.forEach(line => {
    doc.text(line, 5, yPos);
    yPos += 4;
  });

  yPos += 2;

  // Línea divisoria
  doc.line(5, yPos, pageWidth - 5, yPos);
  yPos += 5;

  // ===== PRODUCTOS =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('DESCRIPCIÓN', 5, yPos);
  doc.text('CANT', 42, yPos, { align: 'center' });
  doc.text('P.UNIT', 54, yPos, { align: 'center' });
  doc.text('TOTAL', 75, yPos, { align: 'right' });
  yPos += 3;

  doc.line(5, yPos, pageWidth - 5, yPos);
  yPos += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  ventaData.productos.forEach((producto) => {
    // Nombre del producto (con wrap si es muy largo)
    const nombre = producto.nombre;
    const maxWidth = 34;
    const nombreLines = doc.splitTextToSize(nombre, maxWidth);
    
    nombreLines.forEach((line, lineIndex) => {
      doc.text(line, 5, yPos);
      
      // Solo mostrar cantidad, precio y total en la primera línea
      if (lineIndex === 0) {
        // Cantidad (centrada)
        const cantText = String(producto.cantidad);
        doc.text(cantText, 42, yPos, { align: 'center' });
        
        // Precio unitario (alineado a la derecha)
        const precioText = producto.precio_unitario.toFixed(2);
        doc.text(precioText, 62, yPos, { align: 'right' });
        
        // Total (alineado a la derecha)
        const totalText = (producto.precio_unitario * producto.cantidad).toFixed(2);
        doc.text(totalText, 75, yPos, { align: 'right' });
      }
      
      yPos += 3.5;
    });

    // Mostrar descuento si aplica
    if (producto.descuento_aplicado) {
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(6.5);
      doc.text(`  Desc: ${producto.descuento_aplicado.nombre}`, 5, yPos);
      const descText = ((producto.precio_unitario - producto.precio_con_descuento) * producto.cantidad).toFixed(2);
      doc.text(`-${descText}`, 75, yPos, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      yPos += 3.5;
    }

    yPos += 1;
  });

  yPos += 2;

  // ===== TOTALES =====
  doc.line(5, yPos, pageWidth - 5, yPos);
  yPos += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  // Subtotal
  doc.text('Subtotal:', 5, yPos);
  doc.text(`S/ ${ventaData.subtotal.toFixed(2)}`, 75, yPos, { align: 'right' });
  yPos += 4;

  // IGV
  doc.text('IGV (18%):', 5, yPos);
  doc.text(`S/ ${ventaData.igv.toFixed(2)}`, 75, yPos, { align: 'right' });
  yPos += 4;

  // Descuentos por productos
  if (ventaData.descuento_productos > 0) {
    doc.setTextColor(200, 0, 0);
    doc.text('Desc. Productos:', 5, yPos);
    doc.text(`-S/ ${ventaData.descuento_productos.toFixed(2)}`, 75, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    yPos += 4;
  }

  // Descuento de fidelidad
  if (ventaData.descuento_fidelidad?.monto > 0) {
    doc.setTextColor(200, 0, 0);
    doc.text(`Desc. Fidelidad (${ventaData.descuento_fidelidad.porcentaje}%):`, 5, yPos);
    doc.text(`-S/ ${ventaData.descuento_fidelidad.monto.toFixed(2)}`, 75, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    yPos += 4;
  }

  yPos += 2;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', 5, yPos);
  doc.text(`S/ ${ventaData.total.toFixed(2)}`, 75, yPos, { align: 'right' });
  yPos += 7;

  // Método de pago
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Método de Pago: ${ventaData.metodoPago}`, 5, yPos);
  yPos += 7;

  // ===== PIE DE PÁGINA =====
  doc.line(5, yPos, pageWidth - 5, yPos);
  yPos += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  
  const mensajes = [
    '¡Gracias por su compra!',
    'Vuelva pronto',
    '',
    'Sistema SIVI - Ventas e Inventario'
  ];

  mensajes.forEach(msg => {
    const msgWidth = doc.getTextWidth(msg);
    doc.text(msg, (pageWidth - msgWidth) / 2, yPos);
    yPos += 3.5;
  });

  // Fecha de impresión
  yPos += 2;
  doc.setFontSize(6);
  const fechaImpresion = `Impreso: ${new Date().toLocaleString('es-PE')}`;
  const fechaWidth = doc.getTextWidth(fechaImpresion);
  doc.text(fechaImpresion, (pageWidth - fechaWidth) / 2, yPos);

  // Guardar PDF
  const nombreArchivo = `${ventaData.codigo}_${ventaData.fechaFormato}.pdf`;
  doc.save(nombreArchivo);

  return doc;
};
