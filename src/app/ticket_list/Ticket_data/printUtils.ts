// printUtils.ts

export interface User {
    tkt_no: string;
    name: string;
    from_state_name: string;
    from_city_name: string;
    to_state_name: string;
    to_city_name: string;
    bdate: string;
    jdate: string;
    final_total_amount: string;
    print_final_total_amount: string;
    added_by_name: string;
    mobile: string;
    cmp_mobile: string;
    bus_type: string,
    bus_name: string;
    payment_method: string;
    bus_no: string;
    st_no: string;
    sI_no: string;
    ticket_actual_total: number;
    boarding: string;
    rep_time: string;
    remarks: string;
    slr: number;
    st: number;
    ex: number;
    cmp_name: string;
    ex_rate: number;
    slr_rate: number;
    st_rate: number;
    st_print_rate:any;
    slr_print_rate:any;
    ex_print_rate:any;
    paid_amount: number;
    remaining_amount: number;
    client_mobileNo:any;
    client_firstName:any;
    dep_time:any;
}

const handlePrint = (row: User) => {
    const stNo = Number(row.slr);
    const siNo = Number(row.st);
    const ex = Number(row.ex);
    console.log("st", stNo);
    console.log("si", siNo);
    console.log("ex", ex);
    // Calculate the sum
    const totalSum = stNo + siNo + ex;

    const totalRate = Number(row.ex_print_rate) + Number(row.slr_print_rate) + Number(row.st_print_rate);

    const logo = new Image();
    logo.src = "https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png";
    
    logo.onload = () => {
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
                                <img src="${logo.src}" alt="" height="50px" width="160px">
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
                            <td colspan="2">${row.client_firstName}</td>
                            <td><b>Company Name:</b></td>
                            <td colspan="2">${row.cmp_name}</td>
                            <td><b>B. Date:</b></td>
                            <td>${row.bdate}</td>
                        </tr>
                        <tr>
                            <td><b>No:</b></td>
                            <td colspan="2">${row.client_mobileNo}</td>
                            <td><b>Company No:</b></td>
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
                            <td>${row.print_final_total_amount}</td>
                        </tr>
                        <tr>
                            <td><b>Boarding at:</b></td>
                            <td colspan="2">${row.boarding}</td>
                            <td><b>Reporting Time:</b></td>
                            <td colspan="2">${row.rep_time}</td>
                            <td><b>Journey Time:</b></td>
                            <td>${row.dep_time}</td>
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

        // Create an iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        iframeDoc?.open();
        iframeDoc?.write(printableContent);
        iframeDoc?.close();

        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        iframe.remove();
    };

   

    
};

export default handlePrint;

