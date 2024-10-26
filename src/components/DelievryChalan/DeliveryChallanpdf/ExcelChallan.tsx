import * as XLSX from 'xlsx';

// Define the User interface
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

// Function to export user details to Excel
export const exportToChallanExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Created At': user.fedc_created_at,
        'Client Email': user.client_email,
        'Challan No': user.fedc_challan_no,
        'Client First Name': user.client_firstName,
        'Client Address': user.client_address,
        'Client Mobile No': user.client_mobileNo,
        'Created By Name': user.created_by_name,
        'FEDC Created By': user.fedc_created_by,       
        'First Name': user.client_firstName,
        'Address': user.client_address,
        'Client City': user.client_city,
        'Client State': user.client_state,
        'Client Pincode': user.client_pincode,
        'Email': user.client_email,
        'FEDC Date': user.fedc_date,
        'GST No': user.client_gstNo,
        'Mobile No': user.client_mobileNo,
        'Vendor Code': user.vendorCode,        
        'PO No': user.poNo,      
        'WhatsApp No': user.fedc_whatsapp_no,
        'Vehicle No': user.fedc_vehicle_no,
        'Driver Mobile No': user.fedc_driver_mobile_no,
        'Driver Name': user.fedc_driver_name,
        'Dispatch Through': user.fedc_dispatch_through,
        'Order No': user.fedc_order_no,
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'user_details.xlsx');
};
