import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    pay_id: any;
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
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

// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number | any;
}

export const exportTransactionListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Receipt No', dataKey: 'receipt_no' },
        { header: 'Client Name', dataKey: 'name' },
        { header: 'Booking Type', dataKey: 'booking_type' },
        { header: 'Total  Amount', dataKey: 'total_amount' },
        { header: 'Payment Method', dataKey: 'payment_method' },
        { header: 'Paid Amount', dataKey: 'paid_amount' },
    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
        receipt_no: row.receipt_no,
        name: row.name,
        booking_type: row.booking_type,
        total_amount: row.total_amount,
        payment_method: row.payment_method,
        paid_amount: row.paid_amount,
    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Transaction List', 14, 22);

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
        columnStyles: {
            pay_id: { halign: 'center' },
            e_name: { halign: 'left' },
            e_email: { halign: 'left' },
            e_mobile_no: { halign: 'center' },
            e_address: { halign: 'left' },
            booking_type: { halign: 'left' },
            total_paid_amount: { halign: 'right' },
            payment_method: { halign: 'left' },
            paid_amount: { halign: 'right' },
            receipt_no: { halign: 'left' },
        },
        margin: { top: 30 },
        pageBreak: 'auto',
    });

    // Save the PDF
    doc.save('Transaction List.pdf');
};
