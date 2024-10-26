import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    client_gstNo: any;
    fedc_created_at: any;
    client_email: any;
    fedc_challan_no: any;
    client_firstName: any;
    client_address: any;
    q_quotation_no: any;
    client_mobileNo: any;
    created_by_name: any;
    fedc_created_by: any;
 
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    fedc_date: any;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    fedc_driving_license: any;
    client_id: any;  
    poNo: string;  
    fedc_whatsapp_no: string;
    employee: any;
    fedc_vehicle_no: any;
    fedc_driver_mobile_no: any;
    fedc_driver_name: any;
    fedc_dispatch_through: any;
    fedc_order_no: any;
}


// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
  }
  
  export const exportToChallanListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [350, 304]
    });

  // Define table columns with headers and data keys
  const columns = [
    { header: 'Challan No', dataKey: 'fedc_challan_no' },
    { header: 'Added By', dataKey: 'created_by_name' },
    { header: 'Client Name', dataKey: 'client_firstName' },
    { header: 'Mobile No', dataKey: 'client_mobileNo' },
    { header: 'Client Address', dataKey: 'client_address' },
    { header: 'Client City', dataKey: 'client_city' },
    { header: 'Driver Mobile No', dataKey: 'fedc_driver_mobile_no' },
    { header: 'Vehicle No', dataKey: 'fedc_vehicle_no' },
    { header: 'Order No', dataKey: 'fedc_order_no' }
  ];

  // Format data for PDF
  const formattedData: TableRow[] = data.map(row => ({
    fedc_challan_no: row.fedc_challan_no,  // Assuming fedc_id is used as Quotation No
    created_by_name: row.created_by_name,
    client_firstName: row.client_firstName,
    client_email: row.client_email,
    client_mobileNo: row.client_mobileNo,
    client_address: row.client_address,
    client_city: row.client_city,
    client_state: row.client_state,
    client_pincode: row.client_pincode,  
    poNo: row.poNo,   
    vendorCode: row.vendorCode,
    fedc_driver_mobile_no: row.fedc_driver_mobile_no,
    fedc_vehicle_no: row.fedc_vehicle_no,
    fedc_dispatch_through: row.fedc_dispatch_through,
    fedc_order_no: row.fedc_order_no
  }));

 // Add a title
 doc.setFontSize(18);
 doc.text('Delivery Challan List', 14, 22);

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
