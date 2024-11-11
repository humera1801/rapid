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

export const VendorListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
      
        { header: 'Vendor Name', dataKey: 'vendor_name' },      
        { header: 'GST No', dataKey: 'gst_no' },
        { header: 'Bank Name', dataKey: 'bank_name' },
        { header: 'Account No', dataKey: 'ac_no' },
        { header: 'Account Type', dataKey: 'ac_type' },
        { header: 'IFSC Code', dataKey: 'ifsc_code' },
        { header: 'Bank Branch', dataKey: 'bank_branch' },
        { header: 'Vendor Address', dataKey: 'vendor_address' },
        { header: 'Created By', dataKey: 'created_by_name' },

    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
      
        vendor_name: row.vendor_name,
        gst_no: row.gst_no,
        bank_name: row.bank_name,
        ac_no: row.ac_no,
        ac_type: row.ac_type,
        ifsc_code: row.ifsc_code,
        bank_branch: row.bank_branch,
        vendor_address: row.vendor_address,
        created_by_name: row.created_by_name,

    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Vendor Details', 14, 22);

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
