import { toWords } from 'number-to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePaymentReceiptPdf = (formData) => {
    try {
        const paidAmountInWords = toWords(formData.paid_amount);

        const html = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .receipt {
                    width: 100%; /* A4 width */

                    padding: 20mm; /* Inner padding */
                    box-sizing: border-box;
                }
                .logo {
                    max-height: 50px;
                }
                .contact-info {
                    text-align: right;
                    font-size: 30px;
                }
                .underline-text {
                    border-bottom: 1px solid black;

                    text-decoration: none;
                    font-weight: bold;
                }
                .section {
                    margin-bottom: 15px;
                }
                .sr-no, .engaged-by, .address, .place-visited {
                    font-size: 20px;
                }
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .address1 {
                    background-color: rgb(185, 186, 207);
                    padding: 10px;
                    text-align: center;
                    font-size: 25px;
                    margin-bottom: 15px;
                }
                .input-box {
                    display: inline-flex;
                    align-items: center;
                    border: 1px solid black;
                    padding: 10px;
                    font-size: 25px;
                    margin-top: 25px;
                }
                label {
                    font-size: 20px;
                    margin-right: 8px;
                }
                .account-input {
                    padding: 10px;
                    font-size: 25px;
                }
                h3 {
                    text-align: center;
                    margin: 10px 0;
                    font-size: 28px;
                }
                    .no-gutters {
        padding-left: 0;
        padding-right: 0;
    }
}

            </style>
            <div class="receipt">
                <div class="header">
                    <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="Logo" class="logo">
                    <div class="contact-info">
                        <div>8866396939 , 910607741</div>
                        <div>rapidgroupbaroda@gmail.com</div>
                    </div>
                </div>
                <div class="address1">G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.</div>
                <hr>
                <h3>Payment Receipt</h3>
                <div class="sr-no section">NO: <span>${formData.receipt_no}</span></div>
             
                <div class="row mb-3">
                   <div class="engaged-by section col-lg-3" style="padding-right: 0;">Received with thanks from M/s:</div>
                   <span class="underline-text col-lg-9" style="padding-left: 0;">${formData.name}</span>
                </div>
                   <div class="row mb-3">
                   <div class="engaged-by section col-lg-2" style="padding-right: 0;">Booking Of:</div>
                   <span class="underline-text col-lg-10" style="padding-left: 0;">${formData.booking_type}</span>
                </div>
                <div class="row mb-3 ">
                   <div class="address section col-lg-2" style="padding-right: 0;">The sum of Rupees: </div> <span class="underline-text col-lg-10" style="padding-left: 0;">${formData.total_amount}</span>

                </div>
                <div class="row mb-3 ">
                   <div class="engaged-by section col-lg-2" style="padding-right: 0;" >Paid Amount: </div> <span class="underline-text col-lg-10" style="padding-left: 0;">${paidAmountInWords} only</span>

                 </div>
                <div class="row mb-3 ">
                   <div class="place-visited section col-lg-2" style="padding-right: 0;" >Transaction Id: </div> <span class="underline-text col-lg-10" style="padding-left: 0;" >${formData.payment_details}</span>

                </div>
               
                <div class="input-box col-lg-3">
                    <label for="account-number">₹</label>
                    <span id="account-number" class="account-input">${formData.paid_amount}</span>
                </div>
            </div>
        `;

        // Create a div to hold the receipt for PDF generation
        const receiptDiv = document.createElement('div');
        receiptDiv.innerHTML = html;
        document.body.appendChild(receiptDiv);

        html2canvas(receiptDiv, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('payment_receipt.pdf');

            document.body.removeChild(receiptDiv);


            // const pdfBlob = pdf.output('blob');

            // const pdfUrl = URL.createObjectURL(pdfBlob);
    
            // const message = `Here is your invoice: ${pdfUrl}`;
            // const whatsappUrl = `https://wa.me/${formData.whatsup_no}?text=${encodeURIComponent(message)}`;
    
            // window.open(whatsappUrl, '_blank');
    
            // URL.revokeObjectURL(pdfUrl);
    
        });

    } catch (error) {
        console.error('Error generating PDF document:', error);
    }
};
