interface User {
    id: string;
    token: number;
    receipt_no: any;
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
    total_pickup_charge: any;
    total_dispatch_charge: any;
    demurrage_charges: number;
    parcel_bill_detail: { e_way_bill_no: string; p_o_no: string; invoice_no: string; invoice_amount: string }[];
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

export const handlebedgePrint = (row: User) => {
    console.log("data", row.parcel_detail);

    const totalQuantity = row.parcel_detail.reduce((total, parcel) => {
        return total + Number(parcel.qty);
    }, 0);

    let printableContent = '';

    for (let i = 1; i <= totalQuantity; i++) {
        const sequence = `${i}/${totalQuantity}`;

        const content = `
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

                body {
                    margin: 10px;
                }
            </style>

            <div class="main">
                <table border="1" width="100%" border-spacing="0" cellspacing="0" cellpadding="0" style="padding: 0;">
                    <tbody>
                        <tr>
                            <td colspan="4" width="80%">
                                <table width="100%">
                                    <tr>
                                        <td width="30%">
                                            <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png"
                                                 alt="" height="50px" width="160px">
                                        </td>
                                        <td width="70%" colspan="2" style="text-align: center;">
                                            <h1 style="margin: 0;">RAPID GROUP</h1>
                                            GST No: 24ABFFR4789P1ZB <br>
                                            Mobile: 9276207147, 9274919848 <br>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="2" width="20%">
                                <div style="text-align: center;">
                                    <h1>${sequence}</h1>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="25%" style="font-size:16px; font-weight:bold">Receipt No:</td>
                            <td width="20%" style="font-size:16px; font-weight:bold">${row.receipt_no}</td>
                            <td colspan="4" style="text-align: center;">Topay / Paid / On Account</td>
                        </tr>
                        <tr>
                            <td>Sender Name</td>
                            <td>${row.sender_name}</td>
                            <td width="20%">Sender Mobile-No</td>
                            <td width="15%">${row.send_mob}</td>
                            <td width="5%">From:</td>
                            <td>${row.from_city_name}</td>
                        </tr>
                        <tr style="font-size:16px; font-weight:bold">
                            <td style="font-size:16px; font-weight:bold">Receiver Name</td>
                            <td style="font-size:16px; font-weight:bold">${row.rec_name}</td>
                            <td width="20%">Receiver Mobile-No</td>
                            <td width="15%">${row.rec_mob}</td>
                            <td width="5%">To</td>
                            <td>${row.to_city_name}</td>
                        </tr>
                        <tr style="text-align: center;">
                            <td colspan="6">OFFICE : Vadodara , Ahmedabad , Pune , Nashik , Udaipur</td>
                        </tr>
                          <tr style="text-align: center;">
                <td colspan="6">rapidgroupbaroda@gmail.com</td>
                

            </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <br>
        `;

        printableContent += content;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    ${printableContent}
                    <script>
                        window.print();
                        window.onafterprint = function() {
                            document.body.innerHTML = "";
                            document.body.removeChild(iframe);
                        };
                    </script>
                </body>
            </html>
        `);
        iframeDoc.close();
    }
};



