import * as html2pdf from 'html2pdf.js';

export const generateclientPDF = async (formData) => {
    try {

        const generateTableRows = () => {
            let rowsHtml = '';
            formData.product_data.forEach((product, index) => {
                rowsHtml += `
                    <tr>
                       
                        <td>${product.feit_name}</td>
                        <td>${product.capacity}</td>
                        <td>${product.qty}</td>
                       
                    </tr>
                `;
            });
            return rowsHtml;
        };

        const htmlTemplate = `
            <html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
          
            padding: 20px;
           
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            /* Added margin bottom for spacing */
        }

        .logo {
            flex: 1;
            /* Takes up 1 part of the available space */
        }

        .logo img {
            height: 80px;
            width: auto;
        }

        .address {
            flex: 1;
            /* Adjusted to take up equal space */
            font-size: 18px;
            font-weight:500;
        }

        .address>div {
            margin-bottom: 5px;
        }

        .separator {
            border-top: 1px solid #ddd;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 24px;
            margin-top: 0;
            text-align: center;
            color: #221b1a;
            margin-bottom: 20px;
        }

        p {
            line-height: 1.6;
            font-size: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            margin-top: 30px;
        }

        .add {
            text-align: center;
            background-color: #b9bacf;
            padding: 5px;
            font-size: 14px;
            margin-top: 5px;
        }

        /* Style for the PDF button */
        .pdf-button {
            text-align: center;
            margin-top: 20px;
        }

        .pdf-button button {
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
        }
        .formate{
            display: flex;
            align-items: center;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="header">
            <div class="logo">
                <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png"
                    alt="RAPID GROUP Logo">
            </div>
            <div class="address">
                <div>8866396939, 9106077411</div>
                <div>rapidgroupbaroda@gmail.com</div>
            

            </div>
        </div>
        <div class="" style="text-align: center;">SUPPLIER OF FIRE FIGHTING, SAFETY & SECURITY EQUIPMENTS.</div>
        <div class="add">G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.</div>
        <div class="separator"></div>

        <h1>CERTIFICATE</h1>

        <p>This is to Certify that <strong>${formData.firstName}</strong> is one of our clients and their
            fire extinguishers are Supplied Refilled & Serviced by us. The Type, Capacity of extinguishers Supplied
            Refilled & Serviced are as follows:</p>

        <table>
            <thead>
                <tr>
                    <th>Type of Fire Extinguishers</th>
                    <th>Capacity</th>
                    <th>Quantity</th>
                </tr>
            </thead>
          <tbody>
                                ${generateTableRows()} <!-- Dynamically generate rows here -->
                            </tbody>
        </table>

        <p>TOTAL NO. OF EXTINGUISHERS SUPPLIED REFILLED & SERVICED: <strong>1 NO</strong></p>

        <p>Keep the extinguishers in proper place and properly serviced for better results at the time of emergency.
        </p>
        <p>Thanking you,</p>


        <div class="formate">
            <div style="width: 50%;">
                <p>
                    Yours Faithfully,
                </p>
                <div class="yours">
                                       <div>RAPID Group</div>

                </div>
            </div>


            <div style="width: 50%;">

                <div>Supplier, Refitted & Serviced On: <strong>16/7/2024</strong></div>
                <div>Next Due On: <strong>15/7/2025</strong></div>
                <div>Certificate No.: </div>
                <div>Invoice No.: <strong>825</strong></div>
                <div>Extinguisher Sr. No.: <strong>1188</strong></div>


            </div>
        </div>



    </div>




</body>

</html>
        `;

        const pdf = await html2pdf().from(htmlTemplate).toPdf().output('blob');

        const url = URL.createObjectURL(pdf);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};