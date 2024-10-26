import { toWords } from 'number-to-words';

export const generateDeliveryChallanPDF = (formData, bankDetails) => {
    try {
        const pageWidth = 210; // A4 width in mm
        const margin = 10; // Margin in mm
        const headerStyle = `text-align: right; font-size: 14px; margin-bottom: 5px;`;
        const rectStyle = ` text-align: center; font-size: 12px; margin-bottom: 3px;`;
        const addressStyle = `background-color: rgb(185, 186, 207);  padding: 10px; text-align: center; font-size: 10px; margin-bottom: 5px;`;
        const tableStyle = `width: 100%; border-collapse: collapse; margin-top: 1px;`;
        const tdStyle = `border: 1px solid #ddd; padding: 8px;`;
        const thStyle = `border: 1px solid #ddd; padding: 8px; background-color: rgb(185, 186, 207); text-align: center;`;
        const footerStyle = `margin-top: 1px; font-size: 12px;`;

        // Check and log the type of service_data
        console.log('formData.service_data:', formData.service_data);
        console.log('Type of formData.service_data:', typeof formData.service_data);

        // Ensure service_data is an array and process it
        const productRows = Array.isArray(formData.service_data) ? formData.service_data.map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.feit_name} Fire Extinguisher ${product.fedcd_capacity} Capacity</td>
                <td>${product.fedcd_quantity}</td>
                <td></td>
            </tr>
        `).join('') : '';


        const drivingLicenseStatus = formData.fedc_driving_license === "1" ? 'Yes' : 'No';


        const html = `
            <html>
            <head>
                <style>
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: ${margin}mm;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        ${headerStyle}
                    }
                    .logo {
                        max-height: 50px;
                        margin-right: 10px;
                    }
                    .header-info {
                        text-align: right;
                    }
                    .rect {
                        ${rectStyle}
                    }
                    .address {
                        ${addressStyle}
                    }
                    table {
                        ${tableStyle}
                    }
                    td {
                        ${tdStyle}
                    }
                    th {
                        ${thStyle}
                    }
                    .footer {
                        ${footerStyle}
                    }
                    .top-align {
                        vertical-align: top;
                    }
                         .no-border td {
                         border: none;
                    }
                   .no-border {
                        border: none;
                    }
                    .align-top {
                       vertical-align: top;
                    }
                   .align-bottom {
                       vertical-align: bottom;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="Logo" class="logo">
                    <div class="header-info">
                        <div>8866396939 , 910607741</div>
                        <div>rapidgroupbaroda@gmail.com</div>
                    </div>
                </div>
                <div class="rect">SUPPLIER OF FIRE FIGHTING, SAFETY & SECURITY EQUIPMENTS.</div>
                <div class="address">G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.</div>
                <hr>
                <h2 style="text-align: center;">Delivery Challan</h2>
                <table>
                    <tr>
                        <td rowspan=8 class="top-align">
                            To, ${formData.client_firstName}<br>
                            ${formData.client_address}<br>
                            ${formData.client_city} - ${formData.client_state}<br>
                            ${formData.client_pincode}
                        </td>
                        <td>Delivery Challan No:</td>
                        <td>${formData.fedc_challan_no}</td>
                    </tr>
                    <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
                    <tr><td>Challan Date:</td><td>${formData.fedc_created_at}</td></tr>
                    <tr><td>Order No:</td><td>${formData.fedc_order_no}</td></tr>
                    <tr><td>Vendor Code:</td><td>${formData.vendorCode}</td></tr>
                    <tr><td>Contact Person:</td><td>${formData.client_firstName}</td></tr>
                    <tr><td>Contact No:</td><td>${formData.client_mobileNo}</td></tr>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>SR.</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
                <div class="footer">
                    <table>
                         <tr><td colspan="6" class="no-border">DISPATCH DETAILS:</td></tr>
        <tr><td colspan="6" class="no-border">Dispatch Through:</td></tr>
        <tr><td colspan="6" class="no-border">Vehicle No: ${formData.fedc_vehicle_no} </td></tr>
        <tr><td colspan="6" class="no-border">Driver Name:${formData.fedc_driver_name}</td></tr>
        <tr><td colspan="6" class="no-border">Driver Mobile No: ${formData.fedc_driver_mobile_no}</td></tr>
        <tr><td colspan="6" class="no-border">Driving License :  ${drivingLicenseStatus}</td></tr>
        <tr><td colspan="6" class="no-border">Please Collect Above mentioned extinguishers and give signed copy of Delivery Challan to Our Representative</td></tr>
                        <tr>
                               <td colspan="2" class="align-top" style="text-align: left;">Checked By</td>
            <td colspan="2" class="align-top" style="text-align: left;">Received By</td>
            <td colspan="2" class="align-bottom" style="text-align: right;">RAPID GROUP<br><br><br>Proprietor</td>
                        </tr>
                          <tr>
                            <td colspan="2" style="text-align: left;"><br><br><br>Date/Time              Sign&Stamp</td>
                            <td colspan="2" style="text-align: left;"><br><br><br>Date/Time              Sign&Stamp</td>
                            <td colspan="2" style="text-align: right;"></td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        `;

        // Open the print dialog
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        } else {
            alert('Popup blocker is preventing printing. Please allow popups for this site.');
        }
    } catch (error) {
        console.error('Error generating print document:', error);
    }
};
