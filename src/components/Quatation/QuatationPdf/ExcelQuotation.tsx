import * as XLSX from 'xlsx';

// Define the shape of your new data
export interface User {
    q_id: any;
    client_email: any;
    febking_created_by: any;
    client_gstNo: any;
    fest_id: any;
    q_final_amount: string;
    client_firstName: string;
    client_address: string;
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
    created_by_name: any;
    fest_name: string;
    q_quotation_no: string;
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


export const exportToQuotationExcel = (data: User[]) => {
  // Format data for Excel excluding product_data
  const formattedData = data.map(row => ({
    'Added By': row.created_by_name,
    'Client GST No': row.client_gstNo,
    'Febking Final Amount': row.q_final_amount,
    'Client First Name': row.client_firstName,
    'Client Address': row.client_address,
    'Email': row.client_email,
    'Client Mobile No': row.client_mobileNo,
    'Vendor Code': row.vendorCode,
    'Address': row.address,
    'Client City': row.client_city,
    'Client State': row.client_state,
    'Client Pincode': row.client_pincode,
    'Quotation No': row.q_quotation_no,
  }));

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Save the file
  XLSX.writeFile(workbook, 'data.xlsx');
};
