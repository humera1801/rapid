import * as XLSX from 'xlsx';

// Define the new User interface
export interface User {
    voucher_no: any;
    vp_id: any;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    vendor_no: any;
    created_by_name: string;
    vendor_name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_address: any;
    vendor_type: any;
    id: any;
}

// Function to export user details to Excel
export const exportVendorPaymentExcel = (data: User[]) => {
    // Format the data for Excel
    const formattedData = data.map(user => ({
        'Voucher No': user.voucher_no,
        'Payment Method': user.payment_method,
        'Booking Of': user.booking_type,
        'Vendor Name': user.vendor_name,
        'Paid Amount': user.paid_amount,
        'Payment Details': user.payment_details,
        'Mobile No': user.vendor_no,
        'Added By': user.created_by_name,
       
    }));

    // Convert the formatted data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Details');

    // Save the workbook to a file
    XLSX.writeFile(workbook, 'Payment.xlsx');
};
