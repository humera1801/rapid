import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const handleparcelPDF = async (row) => {

    console.log("parcel", row.token);

    try {

        const margin = 10; // Margin in mm
        const pageWidth = 200; // A4 width in mm
        const totalRate = Number(row.gst_amount) + Number(row.print_total);
        const finalRate = totalRate + Number(row.total_demurrage_charges) + Number(row.pic_charge) + Number(row.dis_charge) + Number(row.bilty_charge);

        const parcelTypeCounts = row.parcel_detail.reduce((counts, parcel) => {
            const type = parcel.parcel_type;
            counts[type] = (counts[type] || 0) + 1;
            return counts;
        }, {});

        const parcelTypes = Object.entries(parcelTypeCounts)
            .map(([type, count]) => `${type} (${count})`)
            .join(', ');

        const totalQuantity = row.parcel_detail.reduce((total, parcel) => {
            const quantity = Number(parcel.qty);
            return total + quantity;
        }, 0);

        const totalWeight = row.parcel_detail.reduce((total, parcel) => {
            const weight = Number(parcel.weight);
            return total + weight;
        }, 0);

        const eWayBillNos = row.parcel_bill_detail.map(bill => bill.e_way_bill_no).join(', ');
        const totalInvoiceAmount = row.parcel_bill_detail.reduce((total, bill) => {
            return total + Number(bill.invoice_amount);
        }, 0);
        const invoiceNos = row.parcel_bill_detail.map(bill => bill.invoice_no).join(', ');

        const combinedInvoiceInfo = `${totalInvoiceAmount}, ${invoiceNos}`;

        const html = `
            <html>
                <head>
                    <style>
                        body {
                            margin: 0;
                            font-family: Arial, sans-serif;
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
                        
                        <div class="section">
                          <table border="1" width="100%" border-spacing="0" cellspacing="0" cellpadding="0" style="padding: 0;">
                  
                           
                              
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
                               
                          
                        
                        
                                <tbody>
                                    <tr>
                                      <th>Mode Of Payment</th>
                                        <td colspan="">${row.payment_method}</td>
                                        <th >Pick up Date</th>
                                        <td colspan="2">${row.booking_date}</td>
                                        <th>Ship Date</th>
                                        <td colspan="">${row.dispatch_date}</td>
                                        
                                    </tr>
                                    <tr>
                                        <th colspan="3">SENDER</th>
                                        <th colspan="4">RECEIVER</th>
                                      
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            ${row.sender_name}<br>
                                            ${row.send_add}<br>
                                            ${row.sender_proof_detail}<br>
                                            ${row.send_mob}
                                        </td>
                                        <td colspan="4">
                                            ${row.rec_name}<br>
                                            ${row.rec_add}<br>
                                            ${row.reciver_proof_detail}<br>
                                            ${row.rec_mob}
                                        </td>
                                       
                                    </tr>
                                    <tr>
                                     <td>No of Pkg</td>
                                        <td>${totalQuantity}</td>
                                        <td>Actual Weight</td>
                                        <td colspan="2">${totalWeight}</td>
                                        <td><b>Freight</b></td>
                                        <td>${row.print_total}</td>
                                       
                                    </tr>
                                    <tr>
                                        <td colspan="2"><b>Parcel Type</b></td>
                                        <td colspan="3">${parcelTypes}</td>
                                        <td><b>GST</b></td>
                                        <td>${row.gst_amount}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="5"><b>Ewaybills</b>: ${eWayBillNos}</td>
                                         <td><b>Total</b></td>
                                        <td>${totalRate}</td>
                                    </tr>
                                    <tr>
                                      <td colspan="2"><b>Value / NoOflnv</b></td>
                                        <td colspan="3">${combinedInvoiceInfo}</td>
                                       
                                         <td>Demurrage Charges</td>
                                        <td>${row.total_demurrage_charges}</td>
                                     
                                    </tr>
                                    <tr>
                                    
                                         <td>Pickup Charges</td>
                                        <td>${row.pic_charge}</td>
                                        <td>Dispatch Charges</td>
                                        <td  colspan="2">${row.dis_charge}</td>
                                       <td><b>Bilty Charges</b></td>
                                        <td>${row.bilty_charge}</td>
                                      
                                    </tr>
                                    <tr>
                                        <td><b>Particulars</b></td>
                                        <td colspan="4">${row.particulars}</td>
                                           <th colspan="0">Grand Total</th>
                                          <td colspan="0">${finalRate}</td>
                                    </tr>
                                    <tr>
                                       
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


                pdf.save('parcel.pdf');


        const pdfBlob = pdf.output('blob');

        const pdfUrl = URL.createObjectURL(pdfBlob);

        const message = `Here is your invoice: ${pdfUrl}`;
        const whatsappUrl = `https://wa.me/${row.sender_whatsapp_no}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');

        URL.revokeObjectURL(pdfUrl);


    } catch (error) {
        console.error('Error generating PDF:', error);
    }




};
