// printUtils.ts
import { toWords } from 'number-to-words';

interface User {
    particulars: any;
    voucher_no: any;
    vp_id: any;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    vendor_no: any;
    created_by_name: string;
    vendor_name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_address: any;
    vendor_type: any;
    id: any;

}

const handlevendorPrint = (row: User) => {

    const paidAmountInWords = toWords(row.paid_amount);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;


    const printableContent = `



         <style>
            body {
              
               
            }
            .main {
                width:180mm;
                                font-family: Arial, sans-serif;

                padding: 17px;
                border: 1.5px solid #000;
                margin: auto;
                box-sizing: border-box;
            }
            .header, .footer, .content {
                text-align: center;
            }
            .header {
                display: flex;            
                margin-bottom: 10px;
                border-bottom: 2px solid #000;
                padding-bottom: 5px;
            }
            .voucher{
            margin-left:60px;
            font-size:20px;
            }
            .header img {
                height: 50px;
                margin-right: 15px;
            }
            .header h1 {
                font-size: 18px;
                margin: 0;
                font-weight: bold;
                color: #000;
            }
            .header p {
                margin: 0;
                font-size: 10px;
                color: #000;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            td, th {
                border: 1px solid #000;
                padding: 5px;
                text-align: left;
                color: #000;
            }
            th {
                font-size: 14px;
                font-weight: bold;
                text-align: center;
            }
            .label {
                font-weight: bold;
                font-size: 12px;
            }
            .totals td {
                font-weight: bold;
                font-size: 12px;
                text-align: right;
            }
           .signature {
  font-weight: bold;
  padding-right: 10px;
  /* Customize as per your design */
}

.box {
  text-align: center;
  padding:40px; 
}

.stamp-box {
  width: 270px;
  height: 100px;
  border: 2px solid black;
margin: 0 auto;
}

        </style>

                <div class="main">
                <div class="header">
                    <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="Logo" />
                    <div>
                        <h1>RAPID GROUP</h1>
                        <p>Regd. Office: F-14, Priyadarshini Complex, Opp. Novino, Makarpura, Baroda-390010, Gujarat.</p>
                        <p>G-12, Swastik Chambers, Beside Depot, Makarpura Road, Vadodara</p>
                        <p>Call 24x7: 08863669339, 0927620747, 09274919848</p>
                    </div>
                    <div class="voucher">
                         <h1>VOUCHER</h1>
                    </div>
                </div>

                <table>
                    <tr>
                        <td class="label" style="width:120px">PAID TO:</td>
                        <td style="width:320px">${row.vendor_name}</td>
                        <td class="label" style="width:70px">NO:</td>
                        <td>${row.voucher_no}</td>
                    </tr>
                   
                    <tr>
                        <td class="label">ON A/C OF</td>
                        <td>${row.booking_type}</td>
                           <td class="label" style="width:70px">Date:</td>
                        <td>${formattedDate}</td>
                    </tr>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>PARTICULARS</th>
                            <th style="text-align: left;">Rs.</th>
                            <th>P.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowspan="3" style="height:120px; vertical-align:top; text-align:left ">${row.particulars}</td>
                            <td  rowspan="3"  style="width:120px; vertical-align:top; text-align:right">${row.paid_amount}</td>
                            <td  rowspan="3" style="width:20px"></td>
                        </tr>
                        <tr>
                           
                        </tr>
                        <tr>
                            
                        </tr>
                        <tr class="totals"><td style="text-align: left;">Rs:   ${paidAmountInWords} <span style="float: right;">Total</span></td>
                            <td>${row.paid_amount}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <table>
                        <tr>
                            <td class="label">Authorised By</td>
                            <td style="width:200px">${row.created_by_name}</td>
                            <td class="label">Passed By</td>
                            <td  style="width:200px"></td>
                        </tr>
                        <tr>
                            <td class="label">Payment Method</td>
                            <td colspan="3">${row.payment_method}</td>
                        </tr>
                        <tr>
                            <td class="label">Transaction Details</td>
                            <td>${row.payment_details}</td>
                            <td class="label">Date</td>
                            <td>${formattedDate}</td>
                        </tr>
                      <tr>
  <td colspan="2" class="signature">
    Receiver's Sign:
  </td>

  <td colspan="2" class="box">
   
     
   
  </td>
</tr>

                    </table>
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

export default handlevendorPrint;
