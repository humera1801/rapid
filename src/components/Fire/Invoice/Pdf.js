import * as html2pdf from 'html2pdf.js';

export const generateInvoicePDF = async (formData) => {
    try {
        // Function to generate table rows dynamically based on formData.product_data
        const generateTableRows = () => {
            let rowsHtml = '';
            formData.product_data.forEach((product, index) => {
                rowsHtml += `
                    <tr>
                        <td>${product.feb_name}</td>
                        <td>${product.feit_name}</td>
                        <td>${product.capacity}</td>
                        <td>${product.qty}</td>
                        <td>${product.rate}</td>
                        <td>${product.febd_sgst}%</td>
                        <td>${product.febd_cgst}%</td>
                        <td>${product.totalAmount}</td>
                    </tr>
                `;
            });
            return rowsHtml;
        };

        // Replace placeholders in the HTML template with actual data
        const htmlTemplate = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: "Times New Roman", Times, serif;
                            font-size: 18px;
                            line-height: 1.5;
                            color: #070606;
                            background-color: #f9f9f9;
                        }

                        .invoice-header {
                            display: flex;
                            padding: 20px;
                            border-bottom: 1px solid #ddd;
                            justify-content: space-between;
                            align-items: center;
                        }

                        .invoice-header h2 {
                            margin-top: 0;
                            text-align: center;
                            margin-bottom: 0;
                        }

                        .logo img {
                            height: 50px;
                        }

                        .actions .btn {
                            background-color: #337ab7;
                            color: #fff;
                            border: none;
                            padding: 10px 20px;
                            font-size: 14px;
                            cursor: pointer;
                        }

                        .actions .btn:hover {
                            background-color: #23527c;
                        }

                        .invoice-body {
                            padding: 20px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th, td {
                            border: 1px solid #ddd;
                            padding: 10px;
                            text-align: left;
                        }

                        th {
                            background-color: #f0f0f0;
                        }

                        .invoice-footer {
                            padding: 20px;
                            border-top: 1px solid #ddd;
                        }

                        .invoice-footer p {
                            margin-bottom: 10px;
                        }

                        .invoice-data {
                            display: flex;
                            justify-content: space-between;
                            padding: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <div class="logo" style="width:33.33%">
                            <img src="/img/logo_page-0001-removebg-preview.png" alt="Logo">
                        </div>
                        <div style="width:33.33%">
                            <h2>Invoice</h2>
                        </div>
                        <div class="actions" style="width:33.33%">
                            <!-- Actions if needed -->
                        </div>
                    </div>
                    <div class="invoice-data">
                        <div class="invoice-detail">
                            <div>Bill TO: ${formData.firstName}</div>
                            <div>Address: ${formData.address}</div>
                            <div>Email: ${formData.email}</div>
                            <div>Mobile No: ${formData.mobileNo}</div>
                        </div>
                        <div class="client">
                            <div>Invoice No: ${formData.febking_invoice_no}</div>
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                            <div>Vendor Code: ${formData.vendorCode}</div>
                            <div>P.O.No: ${formData.poNo}</div>
                        </div>
                    </div>
                    <div class="invoice-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Brand</th>
                                    <th>Item</th>
                                    <th>Capacity</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>SGST</th>
                                    <th>CGST</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${generateTableRows()} <!-- Dynamically generate rows here -->
                            </tbody>
                             <tfoot>
                                <tr>
                                    <td colspan="5"></td>
                                    <td>${formData.febking_total_sgst}</td>
                                    <td>${formData.febking_total_cgst}</td>
                                    <td>${formData.febking_total_amount}</td>
                                </tr>
                                 <tr>
                                    <td colspan="5" style="text-align:end">Final Amount:</td>
                                    <td colspan="3" style="text-align:end">${formData.febking_final_amount}</td>
                                 
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                   
                </body>
            </html>
        `;

        // Generate PDF from HTML template
        const pdf = await html2pdf().from(htmlTemplate).toPdf().output('blob');

        // Open the PDF in a new tab (you might want to handle this differently in a production app)
        const url = URL.createObjectURL(pdf);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};