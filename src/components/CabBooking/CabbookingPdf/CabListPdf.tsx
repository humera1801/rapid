import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface User {
    cb_serial_no: any;
    client_firstName: string;
    client_state: string;
    client_city: string;
    cb_booking_date: string;
    client_mobileNo: string;
    created_by_name: string;
}

interface TableRow {
    [key: string]: string | number | any;
}

export const exportCabListPDF = (data: User[]) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    const columns = [
        { header: 'Serial No', dataKey: 'cb_serial_no' },
        { header: 'Client First Name', dataKey: 'client_firstName' },
        { header: 'State', dataKey: 'client_state' },
        { header: 'City', dataKey: 'client_city' },
        { header: 'Booking Date', dataKey: 'cb_booking_date' },
        { header: 'Mobile No', dataKey: 'client_mobileNo' },
    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
        cb_serial_no: row.cb_serial_no,
        client_firstName: row.client_firstName,
        client_state: row.client_state,
        client_city: row.client_city,
        cb_booking_date: row.cb_booking_date,
        client_mobileNo: row.client_mobileNo,
    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Cab Booking List', 14, 22);

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
            cb_serial_no: { halign: 'center' },
            client_firstName: { halign: 'left' },
            client_state: { halign: 'left' },
            client_city: { halign: 'left' },
            cb_booking_date: { halign: 'center' },
            client_mobileNo: { halign: 'center' },
        },
        margin: { top: 30 },
        pageBreak: 'auto',
    });

    doc.save('Cab Booking List.pdf');
};
