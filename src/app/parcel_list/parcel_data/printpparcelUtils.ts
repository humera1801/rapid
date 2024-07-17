// printUtils.ts

interface User {
    id: string;
    token: number;

    from_state_name: string;
    to_state_name: string;
    from_city_name: string;
    to_city_name: string;
    sender_name: string;
    rec_name: string;
    dispatch_date: string;
    added_by_name: string;
    booking_date: string;
    payment_method: string;
    send_add: string;
    particulars: string;
    send_mob: string;
    rec_mob: string;
    rec_add: string;
    sender_proof_type: string;
    reciver_proof_type: string;
    sender_proof_detail: string;
    reciver_proof_detail: string
    pic_charge: number;
    dis_charge: number;
    total_print_rate: string;
    actual_total: string;
    print_total: string;
    gst_amount: string;
    print_gst_amount: string;
    bilty_charge: number;
    is_demurrage: boolean;
    actual_payable_amount: number;
    print_payable_amount: number;
    lr_no: number
    print_paid_amount: number;
    actual_bal_amount: number;
    print_bal_amount: number;
    total_demurrage_charges: number;
    demurrage_days: number;
    demurrage_charges: number;
    bill_detail: { e_way_bill_no: string; p_o_no: string; invoice_no: string; invoice_amount: string }[];
    parcel_detail: {
        parcel_type: string;
        weight: number;
        qty: number;
        rate: number;
        total_amount: number;
        print_rate: number;
        total_print_rate: number;
        QTYtotal: number;
    }[];

}

const handleParcelPrint = (row: User) => {
    const printableContent = `
  
           <style>
    td {
        padding: 0.2% 0.4%;
        font-size: 12px;
    }

    th {
        padding: 0.2% 0.4%;
        font-size: 15px;
    }

    table {
        border-spacing: 0;

    }
    </style>
    




        <body style="margin: 0;">
            <div class="main">
                <table border="1" width="100%" border-spacing="0" cellspacing="0" cellpadding="0" style="padding: 0;">
                    <tbody>
                        <tr>
                            <td colspan="4" width="60%" rowspan="3">
                                <table width="100%">
                                    <tr>
                                        <td width="30%">
                                            <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="" height="50px" width="160px">
                                        </td>
                                        <td width="70%" colspan="2" style="text-align: center;">
                                            <h1 style="margin: 0;">RAPID GROUP</h1>
                                            GST No: 24ABFFR4789P1ZB <br>
                                            Mobile: 9276207147, 9274919848 <br>
                                            G-12, Swastik chamber, Nr Makarpura bus depot, Makarpura, Vadodara, Gujarat 390013
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        
                        </tr>
                        <tr>
                            <td><b>Pick up Date</b></td>
                            <td>${row.booking_date}</td>
                        </tr>
                        <tr>
                            <td><b>Ship Date</b></td>
                            <td>${row.dispatch_date}</td>
                        </tr>
                        <tr>
                            <th colspan="2" width="30%" style="text-align: left;">SENDER</th>
                            <th colspan="2" width="30%" style="text-align: left;">RECEIVER</th>
                            <td><b>Mode Of Payment</b></td>
                            <td>${row.payment_method}</td>
                        </tr>
                        <tr>
                            <td colspan="2" rowspan="5">
                                <table>
                                    <tr><td>${row.sender_name}</td></tr>
                                    <tr><td>${row.send_add}</td></tr>
                                    <tr><td>${row.sender_proof_detail}</td></tr>
                                    <tr><td>${row.send_mob}</td></tr>
                                </table>
                            </td>
                            <td colspan="2" rowspan="5">
                                <table>
                                    <tr><td>${row.rec_name}</td></tr>
                                    <tr><td>${row.rec_add}</td></tr>
                                    <tr><td>${row.reciver_proof_detail}</td></tr>
                                    <tr><td>${row.rec_mob}</td></tr>
                                </table>
                            </td>
                            <td><b>No of Pkg</b></td>
                            <td>${row.parcel_detail}</td>
                        </tr>
                        <tr>
                            <td><b>Actual Weight</b></td>
                            <td>${row.parcel_detail}</td>
                        </tr>
                        <tr>
                            <td><b>Demurrage Charges</b></td>
                            <td>${row.demurrage_charges}</td>
                        </tr>
                        <tr>
                            <td><b>Pickup Charges</b></td>
                            <td>${row.pic_charge}</td>
                        </tr>
                        <tr>
                            <td><b>Dispatch Charges</b></td>
                            <td>${row.dis_charge}</td>
                        </tr>
                        <tr>
                            <td colspan="2" rowspan="2"><b>Ewaybills</b>: ${row.bill_detail}</td>
                            <td colspan=""><b>Freight</b></td>
                            <td colspan="">${row.print_total}</td>
                            <td><b>Bilty Charges</b></td>
                            <td>${row.bilty_charge}</td>
                        </tr>
                        <tr>
                            <td colspan=""><b>GST</b></td>
                            <td colspan="">${row.gst_amount}</td>
                            <th rowspan="5">Grand Total</th>
                            <td rowspan="4"></td>
                        </tr>
                        <tr>
                            <td colspan=""><b>Value / NoOflnv</b></td>
                            <td>${row.bill_detail}</td>
                            <td colspan=""><b>Total</b></td>
                            <td colspan=""></td>
                        </tr>
                        <tr>
                            <td colspan=""><b>Parcel Type</b></td>
                            <td colspan="3">${row.parcel_detail}</td>
                        </tr>
                        <tr>
                            <td colspan=""><b>Particulars</b></td>
                            <td colspan="3">${row.particulars}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <script>
                window.print();
            </script>
        </body>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printableContent);
        printWindow.document.close();
    } else {
        alert('Popup blocker is preventing printing. Please allow popups for this site.');
    }
};

export default handleParcelPrint;
