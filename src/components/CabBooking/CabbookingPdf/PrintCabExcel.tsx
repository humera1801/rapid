import * as XLSX from 'xlsx';

// Define the new User interface
export interface User {
    created_by_name: any;
    cb_journey_end_date: any;
    cb_journey_start_date: any;
    cb_serial_no: any;
    cb_place_visit: any;
    cb_id: any;
    client_address: any;
    cb_created_by: any;
    client_mobileNo: any;
    client_firstName: any;
    client_city: any;
    client_state: any;
    vehicle_no: any;
    driver_name: any;
    cb_booking_date: any;
    engaged_by: any;
    address: any;
    place_visit: any;
    closing_kms: any;
    closing_time: any;
    closing_date: any;
    starting_time: any;
    starting_kms: any;
    waiting_date: any;
    starting_date: any;
    total_kms: any;
    waiting: any;
    rate_8hrs_80kms: any;
    rate_12hrs_300kms: any;
    extra_kms: any;
    extra_hrs: any;
    driver_allowance: any;
    night_charges: any;
    advance_rs: any;
    balance_rs: any;
}

// Function to export user details to Excel
export const exportToCabUserExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Created By Name': user.created_by_name,
        'Journey End Date': user.cb_journey_end_date,
        'Journey Start Date': user.cb_journey_start_date,
        'Serial No': user.cb_serial_no,
        'Place Visit': user.cb_place_visit,
        'Client Address': user.client_address,
        'Client Mobile No': user.client_mobileNo,
        'Client First Name': user.client_firstName,
        'Client City': user.client_city,
        'Client State': user.client_state,        
        'Booking Date': user.cb_booking_date,
        'Address': user.client_address,
 
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Details');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'user_details.xlsx');
};
