import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export const handleticketPDF = async (row) => {



    console.log("parcel", row.mobile);

    try {

        const margin = 10; // Margin in mm
        const pageWidth = 200; // A4 width in mm
        const stNo = Number(row.slr);
        const siNo = Number(row.st);
        const ex = Number(row.ex);

        // Calculate the sum
        const totalSum = stNo + siNo + ex;
        const totalRate = Number(row.ex_rate) + Number(row.slr_rate) + Number(row.st_rate);

        // HTML template
        const html = `
            <html>
                <head>
                   <style>
                        body {
                            margin: 0;
                            font-family: Arial, sans-serif;
                            font-size:20px
                        }
                        .container {
                            padding: 20px;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                        }
                        table, th, td {
                            border: 1px solid #000;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        td {
                            background-color: #fff;
                        }
                        .header img {
                            max-height: 50px;
                            width: auto;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .section {
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="main">
                            <table border="1" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td width="30%" colspan="2" style="text-align: center;">
                                            <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="Logo" height="50px" width="160px">
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
                        <td colspan="2" ><b>Bus No:</b></td>
                        <td colspan="2" >${row.bus_no}</td>
                       
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
                    </div>
                </body>
            </html>
        `;

        const tempElement = document.createElement('div');
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        tempElement.innerHTML = html;
        document.body.appendChild(tempElement);

        const canvas = await html2canvas(tempElement, {
            scrollY: -window.scrollY,
            scrollX: -window.scrollX,
            useCORS: true,
        });

        document.body.removeChild(tempElement);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, 10, pageWidth - 2 * margin, canvas.height * (pageWidth - 2 * margin) / canvas.width);


                pdf.save('ticket.pdf');


        const pdfBlob = pdf.output('blob');

        const pdfUrl = URL.createObjectURL(pdfBlob);

        const message = `Here is your invoice: ${pdfUrl}`;
        const whatsappUrl = `https://wa.me/${row.whatsapp_no}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');

        URL.revokeObjectURL(pdfUrl);

        
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
