// printUtils.ts

import { User } from "./FireExtinguisherList";



const handleFirePrint = (row: User) => {



    const generateTableRows = () => {
        if (!row.product_data || !Array.isArray(row.product_data) || row.product_data.length === 0) {
            return ''; // Return an empty string if product_data is not valid
        }

        return row.product_data.map(product => `
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
        `).join('');
    };










    const printableContent = `


   
       <style>
                        body {
                            font-family: "Times New Roman", Times, serif;
                            font-size: 18px;
                            line-height: 1.5;
                            color: #070606;
                            background-color: #f9f9f9;
                        }

                         .header p {
            margin: 0;
            line-height: 1.6;
        }

      

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .logo {
            flex: 1;
        }

        .logo img {
            height: 80px;
            width: auto;
        }

        .address {
            font-size: 14px;
            font-weight: 500;
            margin-right: 10px;
        }

        .address>div {
            margin-bottom: 5px;
        }

        .separator {
            border-top: 1px solid #ddd;
            margin-top: 20px;
            margin-bottom: 20px;
        }

     

    

     
        .add {
            text-align: center;
            background-color: #b9bacf;
            padding: 5px;
            font-size: 14px;
            margin-top: 5px;
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

        <div class="main">
            <table border="1" cellspacing="0" cellpadding="0">
                 <body>
                    <div class="invoice-header">
            <div class="header">
                <div class="logo">
                    <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png"
                        alt="Rapid Fire Prevention Logo">
                </div>
                <div class="address">
                    <div>8866396939, 9106077411</div>
                    <div>rapidgroupbaroda@gmail.com</div>
                </div>
            </div>
            <div class="" style="text-align: center;">SUPPLIER OF FIRE FIGHTING, SAFETY & SECURITY EQUIPMENTS.</div>
            <div class="add">G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.</div>
            <div class="separator"></div>
        </div>
                    <div class="invoice-data">
                        <div class="invoice-detail">
                            <div>Client Name: ${row.firstName}</div>
                            <div>Address: ${row.address}</div>
                            <div>Email: ${row.email}</div>
                            <div>Mobile No: ${row.mobileNo}</div>
                        </div>
                        <div class="client">
                            <div>Invoice No: ${row.febking_invoice_no}</div>
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                            <div>Vendor Code: ${row.vendorCode}</div>
                            <div>P.O.No: ${row.poNo}</div>
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
                                    <td>${row.febking_total_sgst}</td>
                                    <td>${row.febking_total_cgst}</td>
                                    <td>${row.febking_total_amount}</td>
                                </tr>
                                 <tr>
                                    <td colspan="5" style="text-align:end">Final Amount:</td>
                                    <td colspan="3" style="text-align:end">${row.febking_final_amount}</td>
                                 
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                   
                </body>
            </table>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printableContent);
        printWindow.document.close();
        printWindow.print();
    } else {
        alert('Popup blocker is preventing printing. Please allow popups for this site.');
    }
};

export default handleFirePrint;
