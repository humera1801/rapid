
export const generateReceiverChallanPrint = (formData, bankDetails) => {
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

        

       let overallIndex = 1; // Initialize overall index

const productRows = typeof formData.service_data === 'object' && formData.service_data !== null
    ? Object.values(formData.service_data).flatMap(productGroup =>
        productGroup.map(product => {
            // Use overallIndex for the current product and then increment it
            const currentIndex = overallIndex++;
            return `
    <tr>
        <td>${currentIndex}</td>
        <td>${product.fest_name}, ${product.feit_name} Fire Extinguisher ${product.capacity} Capacity (${product.feb_name})</td>
        <td>${product.qty}</td>
        <td></td>
    </tr>
`;
        })
    ).join('')
    : '';



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
                <h2 style="text-align: center;">Receiver Challan</h2>
                <table>
                    <tr>
                        <td rowspan=8 class="top-align">
                            To, ${formData.firstName}<br>
                            ${formData.client_address}<br>
                            ${formData.client_city} - ${formData.client_state}<br>
                            ${formData.client_pincode}
                        </td>
                        <td>Receiver Challan No:</td>
                        <td>${formData.ferc_challan_no}</td>
                    </tr>

                    <tr><td>Order No:</td><td>${formData.ferc_order_no}</td></tr>
                    <tr><td>Po.No Date:</td><td>${formData.po_no_date}</td></tr>
                    <tr><td>Vendor Code:</td><td>${formData.vendorCode}</td></tr>
                    <tr><td>Contact Person:</td><td>${formData.firstName}</td></tr>
                    <tr><td>Contact No:</td><td>${formData.mobileNo}</td></tr>
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
                         <tr><td colspan="6" class="no-border">Received DETAILS:</td></tr>
        <tr><td colspan="6" class="no-border">Received Through:${formData.ferc_dispatch_through}</td></tr>
        <tr><td colspan="6" class="no-border">Vehicle No: ${formData.ferc_vehicle_no} </td></tr>
        <tr><td colspan="6" class="no-border">Driver Name:${formData.ferc_driver_name}</td></tr>
        <tr><td colspan="6" class="no-border">Driver Mobile No: ${formData.ferc_driver_mobile_no}</td></tr>
        <tr><td colspan="6" class="no-border">Please collect receive About Extingushers for riffiling by our representative</td></tr>
                        <tr>
 <td colspan="2" class="align-top" style="text-align: left;">Checked By  <br> <img src=${formData.employee_signature_url} alt="Logo" class="logo">
                               <br>${formData.employee_name}
</td>            <td colspan="2" class="align-top" style="text-align: left;">Received By</td>
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

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        iframe.remove();
    } catch (error) {
        console.error('Error generating print document:', error);
    }
};
