import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of the data used by autoTable
interface User {
    receipt_no: string; // Renamed from tkt_no
    booking_date: string; // Renamed from bdate
    from_state_name: string;
    from_city_name: string;
    to_state_name: string;
    to_city_name: string;
    sender_name: string; // Added
    rec_name: string; // Added
    dispatch_date: string; // Renamed from jdate    
    added_by_name: string;
  }
  
interface TableRow {
  [key: string]: string | number;
}

export const exportToParcelPDF = (data: User[]) => {
  // Create a new jsPDF instance with a larger page size
  const doc = new jsPDF({
    orientation: 'portrait', // or 'landscape' if preferred
    unit: 'mm',
    format: [350, 304] 
  });

  // Define table columns with headers and data keys
  const columns = [
    { header: 'Receipt No', dataKey: 'receipt_no' },
    { header: 'Booking Date', dataKey: 'booking_date' },
    { header: 'From', dataKey: 'from' },
    { header: 'To', dataKey: 'to' },
    { header: 'Sender Name', dataKey: 'sender_name' },
    { header: 'Receiver Name', dataKey: 'rec_name' },
    { header: 'Date', dataKey: 'dispatch_date' },
    { header: 'Added By', dataKey: 'added_by_name' }
  ];

  // Format data for PDF
  const formattedData: TableRow[] = data.map(row => ({
    receipt_no: row.receipt_no,
    booking_date: row.booking_date,
    from: `${row.from_state_name}, ${row.from_city_name}`,
    to: `${row.to_state_name}, ${row.to_city_name}`,
    sender_name: row.sender_name,
    rec_name: row.rec_name,
    dispatch_date: row.dispatch_date,
    added_by_name: row.added_by_name,
  }));

  // Add a title
  doc.setFontSize(18);
  doc.text('Parcel Booking List', 14, 22);

  // Add table to the PDF with custom styles
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: formattedData.map(row => columns.map(col => row[col.dataKey])),
    startY: 30,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 128], 
      textColor: [255, 255, 255], 
      fontSize: 10, 
    },
    styles: {
      fontSize: 10, 
      cellPadding: 5,
      valign: 'middle', 
      overflow: 'linebreak', 
    },
    columnStyles: {
      receipt_no: { halign: 'center' }, 
      booking_date: { halign: 'center' },
      from: { halign: 'left' }, 
      to: { halign: 'left' },
      sender_name: { halign: 'left' },
      rec_name: { halign: 'left' },
      dispatch_date: { halign: 'center' },
      added_by_name: { halign: 'left' },
    },
    margin: { top: 30 }, // Margin around the table
    pageBreak: 'auto', // Automatically handle page breaks
  });

  // Save the PDF
  doc.save('data.pdf');
};
