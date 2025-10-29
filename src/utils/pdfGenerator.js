import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Colores del diseño
const COLOR_VERDE = rgb(0.2, 0.47, 0.31);
const COLOR_NEGRO = rgb(0, 0, 0);
const COLOR_GRIS = rgb(0.9, 0.9, 0.9);
const COLOR_ROJO = rgb(0.8, 0.1, 0.1);

export async function createPdf(analysisResults) {
  const pdfDoc = await PDFDocument.create();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const headsTable = ["Referencia", "Angulo Optimo", "Angulo medido", "Estado"];
  const recommendationsRows = analysisResults.recommendations.angle_details; 
  
  let imageEmbed = null;
  try {
    const imageUrl = analysisResults.data.image_url;
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());

    try {
      imageEmbed = await pdfDoc.embedJpg(imageBytes);
    } catch {
      imageEmbed = await pdfDoc.embedPng(imageBytes);
    }
  } catch (error) {
    console.error('Error cargando imagen:', error);
  }

  const aiAnalysis = analysisResults.data.ai_analysis;


  let page = pdfDoc.addPage([595, 842]); // A4
  let { width, height } = page.getSize();
  let yPosition = height - 50;


  page.drawText('REPORTE DE ANÁLISIS ERGONÓMICO', {
    x: 50,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 25;


  const fecha = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  yPosition -= 30;


  // Resumen Ejecutivo
  if (yPosition < 150) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('RESUMEN EJECUTIVO', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  const resumen = aiAnalysis.resumen_ejecutivo;
  const resumenLines = wrapText(resumen, 85);
  resumenLines.forEach(line => {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: COLOR_NEGRO,
    });
    yPosition -= 13;
  });

  yPosition -= 15;

  // Puntos Críticos
  if (yPosition < 100) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('PUNTOS CRÍTICOS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  aiAnalysis.puntos_criticos.forEach((punto) => {
    if (yPosition < 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const puntoLines = wrapText(`• ${punto}`, 82);
    puntoLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });
    yPosition -= 3;
  });

  yPosition -= 15;

  // Recomendaciones Inmediatas
  if (yPosition < 100) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('RECOMENDACIONES INMEDIATAS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  aiAnalysis.recomendaciones_inmediatas.forEach((rec, index) => {
    if (yPosition < 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const recLines = wrapText(`${index + 1}. ${rec}`, 82);
    recLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });
    yPosition -= 3;
  });

  yPosition -= 15;

  // Recomendaciones a Largo Plazo
  if (yPosition < 100) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('RECOMENDACIONES A LARGO PLAZO', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  aiAnalysis.recomendaciones_largo_plazo.forEach((rec, index) => {
    if (yPosition < 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const recLines = wrapText(`${index + 1}. ${rec}`, 82);
    recLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });
    yPosition -= 3;
  });

  yPosition -= 15;

  // Análisis del Espacio de Trabajo
  if (yPosition < 100) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('ANÁLISIS DEL ESPACIO DE TRABAJO', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  const espacioAnalisis = [
    { titulo: 'Mobiliario:', contenido: aiAnalysis.analisis_espacio_trabajo.mobiliario },
    { titulo: 'Equipamiento:', contenido: aiAnalysis.analisis_espacio_trabajo.equipamiento },
    { titulo: 'Iluminación:', contenido: aiAnalysis.analisis_espacio_trabajo.iluminacion_entorno },
  ];

  espacioAnalisis.forEach(item => {
    if (yPosition < 80) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    page.drawText(item.titulo, {
      x: 50,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: COLOR_NEGRO,
    });

    yPosition -= 14;

    const contenidoLines = wrapText(item.contenido, 85);
    contenidoLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });

    yPosition -= 8;
  });

  yPosition -= 10;

  // Riesgos Identificados
  if (yPosition < 80) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('RIESGOS IDENTIFICADOS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  aiAnalysis.riesgos_identificados.forEach((riesgo) => {
    if (yPosition < 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const riesgoLines = wrapText(`• ${riesgo}`, 82);
    riesgoLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });
    yPosition -= 3;
  });

  yPosition -= 15;

  if (yPosition < 100) {
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;
  }

  page.drawText('EJERCICIOS RECOMENDADOS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 18;

  aiAnalysis.ejercicios_recomendados.forEach((ejercicio, index) => {
    if (yPosition < 60) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const ejercicioLines = wrapText(`${index + 1}. ${ejercicio}`, 82);
    ejercicioLines.forEach(line => {
      page.drawText(line, {
        x: 55,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: COLOR_NEGRO,
      });
      yPosition -= 12;
    });
    yPosition -= 3;
  });

    if (imageEmbed) {
    const maxImgWidth = 350;
    const maxImgHeight = 280;
    const imgDims = imageEmbed.scale(1);
    const scale = Math.min(maxImgWidth / imgDims.width, maxImgHeight / imgDims.height);
    const imgWidth = imgDims.width * scale;
    const imgHeight = imgDims.height * scale;
    const imgX = (width - imgWidth) / 2;

    page.drawImage(imageEmbed, {
      x: imgX,
      y: yPosition - imgHeight,
      width: imgWidth,
      height: imgHeight,
    });
    yPosition -= imgHeight + 20;
  }
  yPosition -= 10;

  page.drawText('TABLA DE ÁNGULOS Y ESTADOS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: COLOR_VERDE,
  });

  yPosition -= 20;

  const margin = 50;
  const rowHeight = 25;
  const colWidths = [150, 150, 150, 75];
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const fontSize = 9;

  let y = yPosition;
  let x = margin;

  // Fondo de encabezado
  page.drawRectangle({
    x: margin,
    y: y - rowHeight,
    width: totalWidth,
    height: rowHeight,
    color: COLOR_GRIS,
  });

  // Encabezados
  headsTable.forEach((header, i) => {
    page.drawText(header, {
      x: x + 8,
      y: y - 17,
      size: fontSize + 1,
      font: boldFont,
      color: COLOR_NEGRO,
    });
    // Línea vertical separadora
    page.drawLine({
      start: { x, y: y - rowHeight },
      end: { x, y },
      thickness: 0.5,
      color: COLOR_NEGRO,
    });
    x += colWidths[i];
  });

  // Borde inferior y derecho del encabezado
  page.drawLine({
    start: { x: margin, y: y - rowHeight },
    end: { x: margin + totalWidth, y: y - rowHeight },
    thickness: 0.5,
    color: COLOR_NEGRO,
  });
  page.drawLine({
    start: { x: margin + totalWidth, y: y - rowHeight },
    end: { x: margin + totalWidth, y },
    thickness: 0.5,
    color: COLOR_NEGRO,
  });

  // 🔹 Filas dinámicas
  y -= rowHeight;
  recommendationsRows.forEach((row, index) => {
    if (y - rowHeight < 50) {
      page = pdfDoc.addPage([595, 842]);
      y = height - 100;
    }

    const fillColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.97);
    page.drawRectangle({
      x: margin,
      y: y - rowHeight,
      width: totalWidth,
      height: rowHeight,
      color: fillColor,
    });

    const cells = [
      row.segment || '',
      row.optimal_range || '',
      row.current_angle?.toString() || '',
      row.status === 'correcto' ? 'OK' : 'MAL',
    ];

    x = margin;
    cells.forEach((text, i) => {
      page.drawText(text, {
        x: x + 8,
        y: y - 17,
        size: fontSize,
        font: regularFont,
        color:
          i === 3
            ? row.status === 'correcto'
              ? COLOR_VERDE
              : COLOR_ROJO
            : COLOR_NEGRO,
      });

      // Líneas verticales
      page.drawLine({
        start: { x, y: y - rowHeight },
        end: { x, y },
        thickness: 0.5,
        color: COLOR_NEGRO,
      });
      x += colWidths[i];
    });

    // Línea inferior
    page.drawLine({
      start: { x: margin, y: y - rowHeight },
      end: { x: margin + totalWidth, y: y - rowHeight },
      thickness: 0.5,
      color: COLOR_NEGRO,
    });

    // Línea derecha
    page.drawLine({
      start: { x: margin + totalWidth, y: y - rowHeight },
      end: { x: margin + totalWidth, y },
      thickness: 0.5,
      color: COLOR_NEGRO,
    });

    y -= rowHeight;
  });

  yPosition -= 10;

  page.drawText('Sistema de Análisis Ergonómico - Reporte Generado Automáticamente', {
    x: 50,
    y: 30,
    size: 8,
    font: regularFont,
    color: COLOR_NEGRO,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function downloadPdf(pdfBytes, filename = 'reporte-analisis.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
