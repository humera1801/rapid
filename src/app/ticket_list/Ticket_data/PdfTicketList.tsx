import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data
interface User {
  tkt_no: string;
  name: string;
  from_state_name: string;
  from_city_name: string;
  to_state_name: string;
  to_city_name: string;
  bdate: string;
  mobile_no: string;
  mobile: string;  // Assuming this is the correct field for mobile number
  jdate: string;
  final_total_amount: number;
  print_final_total_amount: number;
  added_by_name: string;
}

// Define the shape of the data used by autoTable
interface TableRow {
  [key: string]: string | number;
}

export const exportToPDF = (data: User[]) => {
  // Create a new jsPDF instance with a larger page size
  const doc = new jsPDF({
    orientation: 'portrait', // or 'landscape' if preferred
    unit: 'mm',
    format: [350, 304] 
  });

  // Define table columns with headers and data keys
  const columns = [
    { header: 'Receipt No', dataKey: 'tkt_no' },
    { header: 'Customer Name', dataKey: 'name' },
    { header: 'From', dataKey: 'from' },
    { header: 'To', dataKey: 'to' },
    { header: 'Booking Date', dataKey: 'bdate' },
    { header: 'Journey Date', dataKey: 'jdate' },
    { header: 'Amount', dataKey: 'final_total_amount' },
    { header: 'Print Amount', dataKey: 'print_final_total_amount' },
    { header: 'Mobile No', dataKey: 'mobile_no' },  // Corrected key
    { header: 'Added By', dataKey: 'added_by_name' },
  ];

  // Format data for PDF
  const formattedData: TableRow[] = data.map(row => ({
    tkt_no: row.tkt_no,
    name: row.name,
    from: `${row.from_state_name}, ${row.from_city_name}`,
    to: `${row.to_state_name}, ${row.to_city_name}`,
    bdate: row.bdate,
    jdate: row.jdate,
    final_total_amount: row.final_total_amount,
    print_final_total_amount: row.print_final_total_amount,
    mobile_no: row.mobile,  // Added mobile_no to formatted data
    added_by_name: row.added_by_name,
  }));

  // Add a title
  doc.setFontSize(18);
  doc.text('Ticket Booking List', 14, 22);

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
      tkt_no: { halign: 'center' }, 
      name: { halign: 'left' },
      from: { halign: 'left' }, 
      to: { halign: 'left' },
      bdate: { halign: 'center' },
      jdate: { halign: 'center' },
      final_total_amount: { halign: 'right' }, 
      print_final_total_amount: { halign: 'right' },
      mobile_no: { halign: 'center' },
      added_by_name: { halign: 'left' },
    },
    margin: { top: 30 }, // Margin around the table
    pageBreak: 'auto', // Automatically handle page breaks
  });

  // Save the PDF
  doc.save('data.pdf');
};
