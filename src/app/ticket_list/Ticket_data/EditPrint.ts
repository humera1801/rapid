// printUtils.ts

type FormData = {
    from_state_name: string;
    to_state_name: string;
    from_city_name: string;
    to_city_name: string;
    ticket_id: string,
    from_state: string,
    travel_from: string,
    to_state: string,
    travel_to: string,
    bus_type: string,
    ticket_no: string,
    bdate: string;
    jdate: string;
    mobile_no: string;
    name: string;
    cmp_name: string;
    cmp_mobile: string;
    booking_type: 'seater' | 'sleeper' | 'both';
    is_duplicate: boolean;
    is_extra: boolean;
    slr: number;
    slr_rate: number;
    slr_total_amount: number;
    slr_print_rate: number;
    slr_total_print_rate: number;
    st: number;
    st_rate: number;
    st_total_amount: number;
    st_print_rate: number;
    st_total_print_rate: number;
    ex: number; ex_rate: number;
    ex_total_amount: number;
    ex_print_rate: number;
    st_no: string;
    sI_no: string;
    ex_total_print_rate: number;
    rep_time: string;
    dep_time: string;
    bus_name: string;
    bus_no: string;
    boarding: string;
    payment_method: string;
    final_total_amount: number;
    ticket_actual_total: number;
    print_final_total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    print_paid_amount: number;
    print_remaining_amount: number;
    remarks: string;
    user_id: any;
    received: 'Get'
    tkt_no: string;
    added_by_name: string;
  };

const handleUpdatePrint = (row: FormData) => {


    const stNo = Number(row.slr);
    const siNo = Number(row.st);
    const ex = Number(row.ex);
    console.log("st", stNo);
    console.log("si", siNo);
    console.log("ex", ex);
    // Calculate the sum
    const totalSum = stNo + siNo + ex;

    const totalRate = Number(row.ex_rate) + Number(row.slr_rate) + Number(row.st_rate);


    console.log("data",row.from_city_name);
    


    const printableContent = `
        <style>
            td, th {
                padding: 0.6% 0.4%;
                font-size: 14px;
            }

            th {
                padding: 0.2% 0.4%;
            }

            table {
                border-spacing: 0;
                width: 100%;
                border-collapse: collapse;
            }

            .main {
                margin: 20px;
            }
        </style>

        <div class="main">
            <table border="1" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td width="30%" colspan="2" style="text-align: center;">
                            <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="" height="50px" width="160px">
                        </td>
                        <td width="40%" colspan="4" style="text-align: center;">
                            <h1 style="margin: 0;">RAPID GROUP</h1>
                            rapid4u.com / rapid4u.in<br>
                            G-12, Swastik Chembers, Besides Depot, Makarpura Road, Baroda
                        </td>
                        <td colspan="2" width="30%" style="text-align: center;">
                            9274919848 <br>
                            9276207147 <br>
                            8866396939 <br>
                            rapidgroupbaroda@gmail.com
                        </td>
                    </tr>
                    <tr>
                        <td><b>From:</b></td>
                        <td colspan="2">${row.from_state_name} - ${row.from_city_name}</td>
                        <td><b>To:</b></td>
                        <td colspan="2">${row.to_state_name} - ${row.to_city_name}</td>
                        <td><b>Ticket No:</b></td>
                        <td colspan="2">${row.tkt_no}</td>
                       
                    </tr>
                    <tr>
                        <td><b>Name:</b></td>
                        <td colspan="2">${row.name}</td>
                        <td><b>Firm Name:</b></td>
                        <td colspan="2">${row.cmp_name}</td>
                        <td><b>B. Date:</b></td>
                        <td>${row.bdate}</td>
                    </tr>
                    <tr>
                        <td><b>No:</b></td>
                        <td colspan="2">${row.mobile_no}</td>
                        <td><b>No:</b></td>
                        <td colspan="2">${row.cmp_mobile}</td>
                        <td><b>J. Date:</b></td>
                        <td>${row.jdate}</td>
                    </tr>
                    <tr>
                        <td><b>Bus Type:</b></td>
                        <td>${row.bus_type}</td>
                        <td><b>Bus Name:</b></td>
                        <td>${row.bus_name}</td>
                        <td><b>Bus No:</b></td>
                        <td>${row.bus_no}</td>
                        <td><b>Payment Mode:</b></td>
                        <td>${row.payment_method}</td>
                    </tr>
                    <tr>
                        <td><b>T. Pax:</b></td>
                        <td>${totalSum}</td>
                        <td><b>St. No:</b></td>
                        <td>${row.st_no}</td>
                        <td><b>Slr. No:</b></td>
                        <td colspan="3">${row.sI_no}</td>
                    </tr>
                    <tr>
                        <td><b>Rate:</b></td>
                        <td>${totalRate}</td>
                        <td><b>Total Amt:</b></td>
                        <td>${row.final_total_amount}</td>
                        <td><b>Adv:</b></td>
                        <td>${row.paid_amount}</td>
                        <td><b>Bal:</b></td>
                        <td>${row.remaining_amount}</td>
                    </tr>
                    <tr>
                        <td><b>Boarding at:</b></td>
                        <td colspan="2">${row.boarding}</td>
                        <td><b>Reporting Time:</b></td>
                        <td colspan="2">${row.rep_time}</td>
                        <td><b>Journey Time:</b></td>
                        <td>${row.jdate}</td>
                    </tr>
                    <tr>
                        <td><b>Remark:</b></td>
                        <td colspan="5">${row.remarks}</td>
                        <td><b>Booked by:</b></td>
                        <td>${row.added_by_name}</td>
                    </tr>
                </tbody>
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

export default handleUpdatePrint;
