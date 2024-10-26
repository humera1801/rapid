import * as XLSX from 'xlsx';

// Define the new User interface
export interface User {
    id: string;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    total_amount: any;
    created_by_name: string;
    name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
}

// Function to export user details to Excel
export const exportPaymentExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Receipt No': user.receipt_no,
        'Name': user.name,
        'Booking Type': user.booking_type,
        'Total Amount': user.total_amount,
        'Total Paid Amount': user.paid_amount,   
        'Payment Method': user.payment_method,
        'Payment Details': user.payment_details,           
        'Created By': user.created_by_name,
       
       
        
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Details');
    
    // Save the workbook to a file
    XLSX.writeFile(workbook, 'Payment.xlsx');
};
