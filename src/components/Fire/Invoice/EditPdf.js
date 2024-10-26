import { toWords } from 'number-to-words';

export const generateUpdatePDF = (formData, bankDetails) => {
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







        console.log("bankdata", formData.bank_details.bnk_acc_no);





        // Check and log the type of service_data
        console.log('formData.service_data:', formData.service_data);
        console.log('Type of formData.service_data:', typeof formData.service_data);

        // Ensure formData.service_data is an object
        if (typeof formData.service_data !== 'object' || formData.service_data === null) {
            throw new Error('formData.service_data is not an object');
        }

        // Group data by fest_name
        const groupedData = Object.entries(formData.service_data).reduce((acc, [key, products]) => {
            products.forEach(product => {
                const festName = product.fest_name; // Extract fest_name
                if (!acc[festName]) acc[festName] = [];
                acc[festName].push(product);
            });
            return acc;
        }, {});


        let serialNumber = 1; // Initialize serial number counter

        // Create HTML for product rows
        const productRows = Object.entries(groupedData).map(([festName, products]) => `
          
           <tr>
                <td  colspan="7" style="text-align: left; font-weight: bold;">${festName}</td>
            </tr>
                   
               
                    ${products.map((product, index) => `
                        <tr>
                            <td>${serialNumber++}</td>
                            
                            <td>  
                                 Fire Extinguisher ${product.capacity} Capacity<br>
                                 (WITH Pressure Gauge, Safety pin, Valve, Wall clamp, Warranty seal, Instruction Sticker)<br>
                                 ${product.febd_sr_no ? `Extinguisher Sr.No: ${product.febd_sr_no}` : ''}
                            </td>
                            <td>${product.feit_hsn_code}</td>
                            <td>${product.qty} Nos.</td>
                            <td>${product.rate}</td>
                            <td>Each</td>
                            <td>${product.totalAmount}</td>
                        </tr>
                    `).join('')}
               
           
        `).join('');

        
        <hr />
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
                        // margin: ${margin}mm;
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
                <h2 style="text-align: center;">Tax Invoice</h2>
                <table>
                    <tr><td rowspan=8 class="top-align">To, ${formData.client_firstName}<br>${formData.client_address}<br>${formData.client_city} - ${formData.client_state}<br>${formData.client_pincode}<br>Gst-No:${formData.gst_no}</td><td>Invoice No:</td><td>${formData.febking_invoice_no}</td></tr>
                    <tr><td>Receiver Challan Date:</td><td>${formData.ferc_date}</td></tr>
                    <tr><td>Delivery Challan Date:</td><td>${formData.fedc_date}</td></tr>
                    <tr><td>Vendor Code:</td><td>${formData.vendorCode}</td></tr>
                    <tr><td>Contact Person:</td><td>${formData.client_firstName}</td></tr>
                    <tr><td>Contact No:</td><td>${formData.client_mobileNo}</td></tr>
                </table>
                 <table>
                    <thead>
                        <tr>
                            <th>SR.</th>
                            <th>PARTICULARS</th>
                            <th>HSN CODE</th>
                            <th>QTY</th>
                            <th>RATE</th>
                            <th>PER</th>
                            <th>AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
               
                <div class="footer">
                    <table>
                        <tr><td colspan="4">OUR GST NO: ${formData.bank_details.gst_no || 'N/A'}</td></tr>
                        <tr><td colspan="4">Our Bank Name: ${formData.bank_details.bnk_name} , Branch: ${formData.bank_details.bnk_branch}</td></tr>
                        <tr><td colspan="4">Account No: ${formData.bank_details.bnk_acc_no} , IFSC Code: ${formData.bank_details.bnk_ifsc_code}</td></tr>
                        <tr><td colspan="4">${toWords(formData.q_final_amount)} Only</td></tr>
                        <tr>
                            <td colspan="3"></td>
                            <td colspan="4" style="text-align: right;">Grand Total: ${formData.q_final_amount}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: left;">Thank You<br>Prevention Is Better Than Cure</td>
                            <td colspan="3" style="text-align: right;">RAPID GROUP<br><br><br>Proprietor</td>
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
