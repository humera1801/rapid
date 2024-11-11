import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
}

export const exportVendorePaymentListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Voucher No', dataKey: 'voucher_no' },
        { header: 'Booking Type', dataKey: 'booking_type' },
        { header: 'Payment Method', dataKey: 'payment_method' },
        { header: 'Payment Details', dataKey: 'payment_details' },
        { header: 'Vendor Name', dataKey: 'vendor_name' },
        { header: 'Vendor No', dataKey: 'vendor_no' },
        { header: 'Paid Amount', dataKey: 'paid_amount' },      
       
    ];

    const formattedData: TableRow[] = data.map(row => ({
        voucher_no: row.voucher_no,     
        booking_type: row.booking_type,
        payment_method: row.payment_method,
        payment_details: row.payment_details,
        vendor_name: row.vendor_name,
        vendor_no: row.vendor_no,
        paid_amount: row.paid_amount,       
    
    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Payment Details', 14, 22);

    // Add table to the PDF with custom styles
    autoTable(doc, {
        head: [columns.map(col => col.header)],
        body: formattedData.map(row => columns.map(col => row[col.dataKey])),
        startY: 30,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 0, 128],
            textColor: [255, 255, 255],
            fontSize: 10,
        },
        styles: {
            fontSize: 10,
            cellPadding: 5,
            valign: 'middle',
            overflow: 'linebreak',
        },
        margin: { top: 30 },
        pageBreak: 'auto',
    });

    // Save the PDF
    doc.save('Payment_Details.pdf');
};
