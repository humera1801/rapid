import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    client_email: any;
    ferc_id: any;
    created_by_name: any;
    client_mobileNo: any;
    client_address: any;
    client_firstName: any;
    ferc_challan_no: any;
    ferc_created_by: any;
    q_final_amount: string;
    q_total_amount: string;
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    ferc_date: any;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    ferc_dispatch_through: any;
    ferc_driver_name: any;
    ferc_driver_mobile_no: any;
    ferc_vehicle_no: any;
    ferc_driving_license: any;
    client_id: any;
    invNo: string;
    certificateNo: string;
    poNo: string;
    discount: string;
    discount_amount: string;
    ferc_whatsapp_no: string;
    employee: any;
    ferc_order_no: any;
    service_data: {
        fercd_quantity: any;
        fercd_capacity: string;
        feit_id: any;
        feb_id: string;
    }[];
}


// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
  }
  
  export const exportToReceiverChallanListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [350, 304]
    });

  // Define table columns with headers and data keys
  const columns = [
    { header: 'Challan No', dataKey: 'ferc_challan_no' },
    { header: 'Added By', dataKey: 'created_by_name' },
    { header: 'Client Name', dataKey: 'client_firstName' },
    { header: 'Mobile No', dataKey: 'client_mobileNo' },
    { header: 'Client Address', dataKey: 'client_address' },
    { header: 'Client City', dataKey: 'client_city' },
    { header: 'Driver Mobile No', dataKey: 'ferc_driver_mobile_no' },
    { header: 'Vehicle No', dataKey: 'ferc_vehicle_no' },
    { header: 'Order No', dataKey: 'ferc_order_no' }
  ];

  // Format data for PDF
  const formattedData: TableRow[] = data.map(row => ({
    ferc_challan_no: row.ferc_challan_no,  // Assuming ferc_id is used as Quotation No
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
    ferc_driver_mobile_no: row.ferc_driver_mobile_no,
    ferc_vehicle_no: row.ferc_vehicle_no,
    ferc_dispatch_through: row.ferc_dispatch_through,
    ferc_order_no: row.ferc_order_no
  }));

 // Add a title
 doc.setFontSize(18);
 doc.text('Receiver Challan List', 14, 22);

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
