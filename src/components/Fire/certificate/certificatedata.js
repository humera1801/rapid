// printUtils.ts




export const handlecertificateprint = (formData) => {

    console.log('formData.service_data:', formData.service_data);
    console.log('Type of formData.service_data:', typeof formData.service_data);

    // Ensure formData.service_data is an object
    if (typeof formData.service_data !== 'object' || formData.service_data === null) {
        throw new Error('formData.service_data is not an object');
    }
    let totalQty = 0; // Initialize total quantity

    const groupedData = Object.entries(formData.service_data).reduce((acc, [key, products]) => {

        products.forEach(product => {
            const festName = product.fest_name;
            const srNo = product.feqd_sr_no;
           
            if (!acc[festName]) acc[festName] = [];
            acc[festName].push(product);

        });
        return acc;
    }, {});

    const festNames = Object.keys(groupedData).join(', ');

//-----------------------------------------------------------------------------------------------------------
    const groupedddData = Object.entries(formData.service_data).reduce((acc, [key, products]) => {

        products.forEach(product => {
            const srNo = product.feqd_sr_no;
            if (!acc[srNo]) acc[srNo] = [];
            acc[srNo].push(product);


        });
        return acc;
    }, {});

    const srNos = Object.keys(groupedddData).join('');
//----------------------------------------------------------------------------------------------------------------




    const generateTableRows = Object.entries(groupedData).map(([festName, products]) => {

        const groupQty = products.reduce((sum, product) => sum + (product.qty || 0), 0);
        totalQty += groupQty; 
        
        console.log(totalQty);

        return `
            <tr>
                <td colspan="7" style="text-align: left; font-weight: bold;">${festName}</td>
            </tr>
            ${products.map(product => `
                <tr>
                    <td>${product.feit_name}</td>
                    <td>${product.capacity}</td>
                    <td>${product.qty}</td>
                </tr>
            `).join('')}
            
        `;
        
    }).join('');





    const printableContent = `
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
           
            /* Adjusted to take up equal space */
            font-size: 18px;
            font-weight:500;
              margin-right:10px;
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

        <p>This is to Certify that <strong>${formData.client_firstname}</strong>,<strong>${formData.client_mobileNo}</strong>,<strong>${formData.address}</strong>,<strong>${formData.client_city}</strong>
        ,<strong>${formData.client_state}</strong>,<strong>${formData.client_pincode}</strong> is one of our clients and their
            fire extinguishers are Supplied  by us. <strong>${festNames}</strong> The Type, Capacity of extinguishers Supplied
     
            are as follows:</p>
<div style="min-height: 400px;">
        <table>
            <thead>
                <tr>
                    <th>Type of Fire Extinguishers</th>
                    <th>Capacity</th>
                    <th>Quantity</th>
                </tr>
            </thead>
                            <tbody>
                                       ${generateTableRows} <!-- Dynamically generate rows here -->
                            </tbody>
        </table>
</div>
        <p>TOTAL NO. OF EXTINGUISHERS SUPPLIED <strong></strong>: <strong>${totalQty}</strong></p>

        <p>Keep the extinguishers in proper place and properly serviced for better results at the time of emergency.
        </p>
        <p>Thanking you,</p>


        <div class="formate">
            <div style="width: 60%;">
                <p>
                    Yours Faithfully,
                </p>
                <div class="yours">
                    <div>RAPID Group</div>
                </div>
            </div>


            <div style="width: 40%;">

                <div>Date: <strong>${formData.date}</strong></div>
                <div>Next Due On: <strong>${formData.duedate}</strong></div>
                <div>Certificate No.:<strong>${formData.febking_certificate_no}</strong> </div>
                <div>Invoice No.: <strong>${formData.febking_invoice_no}</strong></div>
                <div>Extinguisher Sr. No.: <strong>${srNos}</strong></div>


            </div>
        </div>



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

