import * as XLSX from 'xlsx';

// Define the new User interface
export interface User {
    id: string;
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
    poNo: string;
    vendorCode: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    client_id_proof: any;
}

// Function to export user details to Excel
export const exportClientExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        // 'Created By Name': user.created_by_name,
        'Client First Name': user.client_firstName,
        'Client Mobile No': user.client_mobileNo,
        'Email': user.client_email,
        'Gst No': user.client_gstNo,
        'Client Address': user.client_address,       
        'Client City': user.client_city,
        'Client State': user.client_state,        
        'Pincode': user.client_pincode,
 
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Details');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'Clients.xlsx');
};
