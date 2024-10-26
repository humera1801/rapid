import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    e_id: any;
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
}

// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
}

export const exportEmployeeListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Employee ID', dataKey: 'e_id' },
        { header: 'Name', dataKey: 'e_name' },
        { header: 'Mobile No', dataKey: 'e_mobile_no' },
        { header: 'Email', dataKey: 'e_email' },
        { header: 'Address', dataKey: 'e_address' },
    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
        e_id: row.e_id,
        e_name: row.e_name,
        e_mobile_no: row.e_mobile_no,
        e_email: row.e_email,
        e_address: row.e_address,
    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Employee List', 14, 22);

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
    doc.save('Employee List.pdf');
};
