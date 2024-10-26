import * as XLSX from 'xlsx';

export interface User {
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    total_amount: any;
    created_by_name: string;
    name: string;
    payment_method: string;
    paid_amount: number;
    receipt_no: any;
}

export const exportTransactionExcel = (data: User[]) => {
   
    const formattedData = data.map(user => ({
        'Booking Type': user.booking_type,
        'Total Paid Amount': user.total_paid_amount,
        'Payment Details': user.payment_details,
        'Total Amount': user.total_amount,
        'Created By Name': user.created_by_name,
        'Name': user.name,
        'Payment Method': user.payment_method,
        'Paid Amount': user.paid_amount,
        'Receipt No': user.receipt_no
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Details');
    
    XLSX.writeFile(workbook, 'Transaction.xlsx');
};
