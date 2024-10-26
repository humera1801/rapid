import * as XLSX from 'xlsx';

// Define the User interface
export interface User {
    client_gstNo: any;
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


// Function to export user details to Excel
export const exportToReceiverChallanExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Client GST No': user.client_gstNo,
        'Created At': user.ferc_created_by,
        'Client Email': user.client_email,
        'Challan No': user.ferc_challan_no,
        'Client First Name': user.client_firstName,
        'Client Address': user.client_address,
        'Client Mobile No': user.client_mobileNo,
        'Created By Name': user.created_by_name,
        'ferc Created By': user.ferc_created_by,       
        'First Name': user.client_firstName,
        'Address': user.client_address,
        'Client City': user.client_city,
        'Client State': user.client_state,
        'Client Pincode': user.client_pincode,
        'Email': user.client_email,
        'ferc Date': user.ferc_date,
        'Mobile No': user.client_mobileNo,
        'Vendor Code': user.vendorCode,        
        'PO No': user.poNo,      
        'WhatsApp No': user.ferc_whatsapp_no,
        'Vehicle No': user.ferc_vehicle_no,
        'Driver Mobile No': user.ferc_driver_mobile_no,
        'Driver Name': user.ferc_driver_name,
        'Dispatch Through': user.ferc_dispatch_through,
        'Order No': user.ferc_order_no,
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'user_details.xlsx');
};
