import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
interface User {
  febking_id: any;
  febking_created_by: any;
  fest_id: any;
  created_by_name:any;
  febking_final_amount: string;
  client_firstName: string;
  client_address: string;
  client_gstNo: any;
  email: string;
  gstNo: string;
  client_mobileNo: string;
  vendorCode: string;
  invNo: string;
  certificateNo: string;
  poNo: string;
  febking_total_sgst: any;
  febking_total_cgst: any;
  febking_entry_type: 1;
  febking_total_amount: string;
  firstName: string;
  address: string;
  client_city: string;
  client_state: string;
  client_pincode: string;
  mobileNo: string;
  client_id: any;
  fest_name: string;
  febking_invoice_no: string;
  product_data: {
    feit_hsn_code: any;
    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    capacity: string;
    feit_id: any;
    febd_sgst: any;
    feb_name: any;
    feit_name: any;
    febd_cgst: any;
    febd_sgst_amount: any;
    febd_cgst_amount: any;
    feb_id: string;
  }[];
}

// Define the shape of the data used by autoTable
interface TableRow {
  [key: string]: string | number;
}

export const exportToFireListPDF = (data: User[]) => {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [350, 304]
  });

  // Define table columns with headers and data keys
  const columns = [
    { header: 'Invoice No', dataKey: 'febking_invoice_no' },
    { header: 'Added By', dataKey: 'created_by_name' },
    { header: 'Client Name', dataKey: 'client_firstName' },
    { header: 'Mobile No', dataKey: 'client_mobileNo' },
    { header: 'Client City', dataKey: 'client_city' },
    { header: 'Client State', dataKey: 'client_state' },
    { header: 'Client Pincode', dataKey: 'client_pincode' },
    { header: 'Final Amount', dataKey: 'febking_final_amount' },

    // Add more columns as needed for the product_data
  ];

  // Format data for PDF
  const formattedData: TableRow[] = data.map(row => ({
    febking_invoice_no: row.febking_invoice_no,
    created_by_name: row.created_by_name,
    client_firstName: row.client_firstName,
    client_mobileNo: row.client_mobileNo,
    client_city: row.client_city,
    client_state: row.client_state,
    client_pincode: row.client_pincode,
    mobileNo: row.mobileNo,
    febking_final_amount: row.febking_final_amount,

    // Add more fields as needed
  }));

  // Add a title
  doc.setFontSize(18);
  doc.text('Fire Booking List', 14, 22);

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
      febking_id: { halign: 'center' },
      client_firstName: { halign: 'left' },
      client_address: { halign: 'left' },
      email: { halign: 'left' },
      gstNo: { halign: 'center' },
      client_mobileNo: { halign: 'center' },
      // Add styles for other columns as needed
    },
    margin: { top: 30 },
    pageBreak: 'auto',
  });

  // Save the PDF
  doc.save('data.pdf');
};
