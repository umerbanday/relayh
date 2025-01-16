import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const usePdfGenerator = () => {
  // Define more subtle colors
  const colors = {
    primary: [51, 105, 160],     // Subtle blue
    secondary: [80, 120, 160],   // Lighter blue
    alternate: [245, 247, 250],  // Very light blue-grey
    text: [70, 70, 70]          // Dark grey
  };

  const generatePdf = (results, relayModel, functionName) => {
    const doc = new jsPDF();
    
    // Add main title with website name
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.text('RelayH', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(...colors.text);
    doc.text('Protection Setting Report', 105, 25, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30);

    // Add report info table with subtle colors
    doc.autoTable({
      startY: 35,
      head: [[
        { content: 'Report Details', colSpan: 2, styles: { fillColor: colors.primary, textColor: 255 } }
      ]],
      body: [
        ['Relay Model', relayModel],
        ['Protection Function', functionName],
        ['Generated Date', new Date().toLocaleString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: colors.primary },
      bodyStyles: { textColor: colors.text },
      alternateRowStyles: { fillColor: colors.alternate },
      styles: { fontSize: 10 },
      margin: { left: 14 },
      tableWidth: 180
    });

    const processDataForTable = (data, parentKey = '') => {
      let tableData = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Create section header
          tableData.push([
            { content: key, colSpan: 2, styles: { fillColor: [52, 152, 219], textColor: 255 } }
          ]);
          // Process nested data
          tableData = [...tableData, ...processDataForTable(value, key)];
        } else {
          tableData.push([key, value]);
        }
      });
      
      return tableData;
    };

    // Generate settings table with updated colors
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        { content: 'Protection Settings', colSpan: 2, styles: { fillColor: colors.primary, textColor: 255 } }
      ]],
      body: processDataForTable(results),
      theme: 'grid',
      headStyles: { fillColor: colors.primary },
      bodyStyles: { textColor: colors.text },
      alternateRowStyles: { fillColor: colors.alternate },
      styles: { fontSize: 10 },
      margin: { left: 14 },
      tableWidth: 180
    });

    // Update footer with new colors
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(0.3);
      doc.line(14, 280, 196, 280);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(...colors.text);
      doc.text('Generated using RelayH - Protection Setting Calculator', 14, 285);
      doc.text('www.relayh.com', 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
      
      if (i === pageCount) {
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120); // Lighter grey for disclaimer
        doc.text(
          'Disclaimer: These calculations are provided as a reference. Always verify settings before implementation.',
          105,
          295,
          { align: 'center' }
        );
      }
    }

    return doc;
  };

  const downloadPdf = (results, relayModel, functionName) => {
    const doc = generatePdf(results, relayModel, functionName);
    doc.save(`${relayModel}_${functionName}_settings.pdf`);
  };

  return { downloadPdf };
};

export default usePdfGenerator;
