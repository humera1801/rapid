import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
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

// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
}

export const exportPaymentListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Receipt No', dataKey: 'receipt_no' },
        { header: 'Name', dataKey: 'name' },        
        { header: 'Booking Type', dataKey: 'booking_type' },
        { header: 'Total Amount', dataKey: 'total_amount' },
        { header: 'Total Paid Amount', dataKey: 'total_paid_amount' },
        { header: 'Payment Method', dataKey: 'payment_method' },
        { header: 'Payment Details', dataKey: 'payment_details' },      
        { header: 'Created By', dataKey: 'created_by_name' },
      
      
        
    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
        receipt_no: row.receipt_no,
        booking_type: row.booking_type,
        total_paid_amount: row.paid_amount,
        payment_method: row.payment_method,
        payment_details: row.payment_details,
        total_amount: row.total_amount,
        created_by_name: row.created_by_name,
        name: row.name,
     
      
      
       
    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('payment Details', 14, 22);

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
    doc.save('Payment Details.pdf');
};
