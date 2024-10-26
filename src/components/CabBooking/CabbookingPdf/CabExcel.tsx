import * as XLSX from 'xlsx';

export interface User {
    cb_serial_no: any;
    client_firstName: string;
    client_state: string;
    client_city: string;
    cb_booking_date: string;
    client_mobileNo: string;
    created_by_name: string;
    // Include any other necessary fields from the User interface
}

export const exportCabExcel = (data: User[]) => {
    const formattedData = data.map(user => ({
        'Serial No': user.cb_serial_no,
        'Client First Name': user.client_firstName,
        'State': user.client_state,
        'City': user.client_city,
        'Booking Date': user.cb_booking_date,
        'Mobile No': user.client_mobileNo,
        'Created By ': user.created_by_name,
        // Add any other necessary fields here
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Details');
    
    XLSX.writeFile(workbook, 'Cab.xlsx');
};
