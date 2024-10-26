// printUtils.ts

export interface FormData {
    febking_id: any;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: 1;
    febking_created_by: any;
    febking_final_amount: any;
   
    febking_invoice_no: string;
    febking_total_amount: string;
    client_firstname: string;
    address: string;
    email: string;
    gstNo: string;
    client_mobileNo: string;
    vendorCode: string;
    client_id: any,
    invNo: string;
    certificateNo: string;
    poNo: string;
    product_data: ProductData[];
    fest_name: string,
    febking_certificate_no: string;
    date: string;
    duedate: string;
    Sr_no: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    Total_extingusher:string;

}

interface ProductData {
    id: any;
    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    capacity: string;
    feit_id: any;
    feit_name: any;
    feb_name: any
    febd_sgst: any;
    febd_cgst: any;
    febd_sgst_amount: any;
    febd_cgst_amount: any;
    feb_id: string;
    fest_id:any;
    fest_name:any;

}

const handleclientPrint = (formData: FormData) => {



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

    
    const generateservice = () => {
        let serviceInfo = '';
        formData.product_data.forEach((product, index) => {
            serviceInfo += `${product.fest_name}, `;
        });
        return serviceInfo.slice(0, -2); 
    };

    const serviceInfo = generateservice();

    

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
            fire extinguishers are Supplied <strong>${serviceInfo}</strong> by us. The Type, Capacity of extinguishers Supplied
     
            <strong>${serviceInfo}</strong> are as follows:</p>
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
                                       ${generateTableRows()} <!-- Dynamically generate rows here -->
                            </tbody>
        </table>
</div>
        <p>TOTAL NO. OF EXTINGUISHERS SUPPLIED <strong>${serviceInfo}</strong>: <strong>${formData.Total_extingusher}</strong></p>

        <p>Keep the extinguishers in proper place and properly serviced for better results at the time of emergency.
        </p>
        <p>Thanking you,</p>


        <div class="formate">
            <div style="width: 70%;">
                <p>
                    Yours Faithfully,
                </p>
                <div class="yours">
                    <div>RAPID Group</div>
                </div>
            </div>


            <div style="width: 30%;">

                <div>Date: <strong>${formData.date}</strong></div>
                <div>Next Due On: <strong>${formData.duedate}</strong></div>
                <div>Certificate No.:<strong>${formData.febking_certificate_no}</strong> </div>
                <div>Invoice No.: <strong>${formData.febking_invoice_no}</strong></div>
                <div>Extinguisher Sr. No.: <strong>${formData.Sr_no}</strong></div>


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

export default handleclientPrint;
