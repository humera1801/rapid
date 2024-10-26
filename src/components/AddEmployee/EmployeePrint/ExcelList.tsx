import * as XLSX from 'xlsx';

// Define the new User interface
export interface User {
    e_id: any;
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
}

// Function to export user details to Excel
export const exportEmployeeExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Employee ID': user.e_id,
        'Employee Name': user.e_name,
        'Mobile No': user.e_mobile_no,
        'Email': user.e_email,
        'Address': user.e_address,
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Details');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'Employees.xlsx');
};
