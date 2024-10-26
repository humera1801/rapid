import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape of your data based on the new User interface
export interface User {
    created_by_name: any;
    cb_journey_end_date: any;
    cb_journey_start_date: any;
    cb_serial_no: any;
    cb_place_visit: any;
    cb_id: any;
    cb_created_by: any;
    client_mobileNo: any;
    client_firstName: any;
    client_city: any;
    client_state: any;
    vehicle_no: any;
    driver_name: any;
    cb_booking_date: any;
    engaged_by: any;
    address: any;
    client_address:any
    place_visit: any;
    closing_kms: any;
    closing_time: any;
    closing_date: any;
    starting_time: any;
    starting_kms: any;
    waiting_date: any;
    starting_date: any;
    total_kms: any;
    waiting: any;
    rate_8hrs_80kms: any;
    rate_12hrs_300kms: any;
    extra_kms: any;
    extra_hrs: any;
    driver_allowance: any;
    night_charges: any;
    advance_rs: any;
    balance_rs: any;
}

// Define the shape of the data used by autoTable
interface TableRow {
    [key: string]: string | number;
}

export const exportToCabListPDF = (data: User[]) => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [350, 304]
    });

    // Define table columns with headers and data keys
    const columns = [
        { header: 'Serial No', dataKey: 'cb_serial_no' },
        { header: 'Booking Date', dataKey: 'cb_booking_date' },
        { header: 'Journey Start Date', dataKey: 'cb_journey_start_date' },
        { header: 'Journey End Date', dataKey: 'cb_journey_end_date' },
        { header: 'Place Visit', dataKey: 'cb_place_visit' },
        // { header: 'Vehicle No', dataKey: 'vehicle_no' },
        // { header: 'Driver Name', dataKey: 'driver_name' },
        { header: 'Client Name', dataKey: 'client_firstName' },
        { header: 'Mobile No', dataKey: 'client_mobileNo' },
        { header: 'City', dataKey: 'client_city' },        
        { header: 'Address', dataKey: 'client_address' },
        // { header: 'Total Kms', dataKey: 'total_kms' },
    
    ];

    // Format data for PDF
    const formattedData: TableRow[] = data.map(row => ({
        cb_serial_no: row.cb_serial_no,
        cb_booking_date: row.cb_booking_date,
        cb_journey_start_date: row.cb_journey_start_date,
        cb_journey_end_date: row.cb_journey_end_date,
        cb_place_visit: row.cb_place_visit,
        // vehicle_no: row.vehicle_no,
        // driver_name: row.driver_name,
        client_firstName: row.client_firstName,
        client_mobileNo: row.client_mobileNo,
        client_city: row.client_city,
        client_state: row.client_state,
        client_address: row.client_address,
        // total_kms: row.total_kms,
      
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
    doc.save('Cab Booking List.pdf');
};
