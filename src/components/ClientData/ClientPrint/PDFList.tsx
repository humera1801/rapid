import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    id: string;
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
    poNo: string;
    vendorCode: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    client_id_proof: any;
}


// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
}

export const exportClientListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Client Name', dataKey: 'client_firstName' },
        { header: 'Mobile No', dataKey: 'client_mobileNo' },
        { header: 'Email', dataKey: 'client_email' },
        { header: 'Gst No', dataKey: 'client_gstNo' },
        { header: 'Address', dataKey: 'client_address' },
        { header: 'City', dataKey: 'client_city' },
        { header: 'State', dataKey: 'client_state' },
        { header: 'Pin-code', dataKey: 'client_pincode' },



    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({




        client_firstName: row.client_firstName,
        client_mobileNo: row.client_mobileNo,
        client_email: row.client_email,
        client_gstNo: row.client_gstNo,
        client_city: row.client_city,
        client_state: row.client_state,
        client_address: row.client_address,
        client_pincode: row.client_pincode,

    }));

    // Add a title
    doc.setFontSize(18);
    doc.text('Client List', 14, 22);

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
            vehicle_no: { halign: 'center' },
            driver_name: { halign: 'left' },
            client_firstName: { halign: 'left' },
            address: { halign: 'left' },
            client_city: { halign: 'left' },
            client_state: { halign: 'left' },
            total_kms: { halign: 'center' },
            starting_kms: { halign: 'center' },
            closing_kms: { halign: 'center' },
            starting_date: { halign: 'center' },
            closing_date: { halign: 'center' },
            starting_time: { halign: 'center' },
            closing_time: { halign: 'center' },
            waiting_date: { halign: 'center' },
            waiting: { halign: 'center' },
            rate_8hrs_80kms: { halign: 'right' },
            rate_12hrs_300kms: { halign: 'right' },
            extra_kms: { halign: 'right' },
            extra_hrs: { halign: 'right' },
            driver_allowance: { halign: 'right' },
            night_charges: { halign: 'right' },
            advance_rs: { halign: 'right' },
            balance_rs: { halign: 'right' },
        },
        margin: { top: 30 },
        pageBreak: 'auto',
    });

    // Save the PDF
    doc.save('Client List.pdf');
};
