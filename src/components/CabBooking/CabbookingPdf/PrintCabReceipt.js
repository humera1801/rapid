export const generateCabReceiptPrint = (formData) => {
    try {
        const margin = 10; // Margin in mm

        const endJourneyDetails = formData.endJourneyDetails || {};
        const startJourneyDetails = formData.startJourneyDetails || {};

       
        const closingKms = endJourneyDetails.closing_kms || '';
        const journeyEndTime = endJourneyDetails.journey_end_time || '';
        const journeyEndDate = endJourneyDetails.journey_end_date || '';



        const productRows = formData.extraCharges.map((product, index) => `
     <div class="kms-info1 section">
            <div>EXTRA CHARGES: <span class="underline-text" style="width: 290px;">${product.extra_charges}</span></div>
            <div>RS : <span class="underline-text" style="width: 145px;">${product.extra_charges_rate}</span></div>
        </div >
 `).join('');


        const html = `
            <html>
            <head>
             <style>
        .cab {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
        }

        .logo {
            max-height: 50px;
            margin-right: 10px;
        }

        .container {
                  

            margin:auto;
            top:18px;
            position: relative;
            width: 600px;
            height: 950px;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 30px;
        }

        .logo {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 30px;
            color: #d13d72;
            font-weight: bold;
        }

        .contact-info {
            position: absolute;
            top: 30px;
            right: 20px;
            text-align: right;
            font-size: 14px;
            text-align: right;

        }

        .underline-text {
            border-bottom: 1px solid black;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            width: 121px;

        }



        .section {
            margin-bottom: 15px;
        }

        .sr-no,
        .vehicle-no,
        .engaged-by,
        .address,
        .place-visited,
        .kms-info,
        .rates,
        .extra-info,
        .footer {
            font-size: 12px;
        }

        .sr-no {
            margin-top: 10px;
        }

        .vehicle-no {
            display: flex;
            gap: 12px;
            margin-top: 40px;
        }

        .kms-info {
            display: flex;

            /* justify-content: space-between; */
            gap: 12px;
        }

        .kms-info1 {
            display: flex;
            margin-top: 10px;
            font-size: 12px;

            /* justify-content: space-between; */
            gap: 5px;
        }

        .kms-info,
        .rates {
            margin-top: 10px;
        }

        .rates {
            margin-top: 20px;
        }

        .extra-info {
            margin-top: 50px;
            text-align: center;
            font-size: 20PX;
            background-color: rgb(185, 186, 207);
            padding: 10px;
        }

        .extra-info1 {
            font-size: 15px;
            font-weight: bold;
            text-align: center;
        }



        .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }

        .footer .underline-text {
            width: 200px;
            /* Wider for signature fields */
        }

        .extra-info1 p {
            margin: 0;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 50px;

        }

        .logo {
            max-height: 50px;
            margin-right: 10px;
        }

        .header-info {
            text-align: right;
        }

        .rect {
            text-align: center;
            font-size: 12px;
            margin-bottom: 3px;
        }

        .address1 {
            background-color: rgb(185, 186, 207);
            padding: 10px;
            text-align: center;
            font-size: 10px;
            margin-bottom: 5px;
        }
    </style>
            </head>
            <body class="cab">

    <div class="container">
        <div class="header">
            <img src="https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png" alt="Logo"
                class="logo">
            <div  class="contact-info">
                <div>8866396939 , 910607741</div>
                <div>rapidgroupbaroda@gmail.com</div>
            </div>
        </div>
        <div class="address1">G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.</div>
        <hr>

        <h3 style="text-align: center;">Cab Booking</h3>

        <div class="sr-no section">SR. NO: <span >${formData.cb_serial_no}</span></div>

        <div class="vehicle-no section">
            <div>Vehical No: <span class="underline-text" style="width: 130px;">${startJourneyDetails.vehicle_no || '' }</span></div>
            <div>Driver: <span class="underline-text" style="width: 150px;">${startJourneyDetails.d_name || '' }</span></div>
            <div>DATE: <span class="underline-text" style="width: 135px;">${formData.booking_date}</span></div>
        </div>

        <div class="engaged-by section">ENGAGED BY: <span class="underline-text" style="width: 85.2%;">${formData.engaged_by}</span>
        </div>

        <div class="address section">ADDRESS: <span class="underline-text" style="width: 88.8%;">${formData.client_address},${formData.client_city},${formData.client_state},${formData.client_pincode},</span></div>

        <div class="place-visited section">PLACE VISITED: <span class="underline-text"
                style="width: 83.4%;">${formData.place_visit}</span></div>

                <div class="kms-info section">

            <div>STARTING KMS: <span class="underline-text" style="width: 125px;">${startJourneyDetails.starting_kms || ''}</span></div>
            <div>TIME: <span class="underline-text" style="width: 125px;">${startJourneyDetails.journey_start_time || '' }</span></div>
            <div>DATE: <span class="underline-text" style="width: 137px;">${startJourneyDetails.journey_start_date || '' }</span></div>
        </div>

         <div class="kms-info section">
            <div>CLOSING KMS: <span class="underline-text" style="width: 130px;">${closingKms}</span></div>
            <div>TIME: <span class="underline-text" style="width: 125px;">${journeyEndTime}</span></div>
            <div>DATE: <span class="underline-text" style="width: 137.5px;">${journeyEndDate}</span></div>
        </div>
        
         <div class="kms-info1 section">
            <div>TOTAL USED KMS: <span class="underline-text" style="width: 105px;">${endJourneyDetails.total_used_kms || ''}</span></div>
            <div>WAITING: <span class="underline-text" style="width: 123px;">${endJourneyDetails.waiting || ''}</span></div>
            <div>DATE: <span class="underline-text" style="width: 135px;">${endJourneyDetails.journey_end_date || ''}</span></div>
        </div>
      <div class="kms-info1 section">
    <div>
        RATE / 8 HRS / 80 KMS: 
        <span class="underline-text" style="width: 265px;">
            ${formData.rate === '8 Hrs/80 KMs' ? formData.rate : ''}
        </span>
    </div>
    <div>
        RS: 
        <span class="underline-text" style="width: 145px;">
            ${formData.rate === '8 Hrs/80 KMs' ? formData.rate_text : ''}
        </span>
    </div>
</div>

<div class="kms-info1 section">
    <div class="rate-row">
        RATE / 12 HRS / 300 KMS: 
        <span class="underline-text" style="width: 251px;">
            ${formData.rate === '12 Hrs / 300 KMS' ? formData.rate : ''}
        </span>
    </div>
    <div>
        RS: 
        <span class="underline-text" style="width: 149px;">
            ${formData.rate === '12 Hrs / 300 KMS' ? formData.rate_text : ''}
        </span>
    </div>
</div>

        <div class="kms-info1 section">
            <div>EXTRA KMS: <span class="underline-text" style="width: 170px;">${endJourneyDetails.extra_kms || ''}</span> @ <span class="underline-text"
                    style="width: 142px;">${endJourneyDetails.cb_extra_km_charges || ''}</span>RS : <span class="underline-text" style="width: 146px;">${endJourneyDetails.extra_km_total_rate || ''}</span>
            </div>
        </div>
        <div class="kms-info1 section">
            <div>EXTRA HRS: <span class="underline-text" style="width: 170px;">${endJourneyDetails.extra_hrs || ''}</span> @ <span class="underline-text"
                    style="width: 142px;">${endJourneyDetails.cb_extra_hrs_charges || ''}</span>RS : <span class="underline-text" style="width: 146px;">${endJourneyDetails.extra_hrs_total_rate || ''}</span>
            </div>
        </div>
         ${productRows}
        <div class="kms-info1 section">
            <div class="rate-row">DRIVER ALLOWANCE: <span class="underline-text" style="width: 115px;">${endJourneyDetails.driver_allowance || ''}</span> @ <span
                    class="underline-text" style="width: 142px;">${endJourneyDetails.driver_allowance_charge || ''}</span>RS : <span class="underline-text"
                    style="width: 146px;">${endJourneyDetails.driver_allowance_total_rate || ''}</span>

            </div>
        </div>

        <div class="kms-info1 section">
            <div class="rate-row">NIGHT CHARGES: <span class="underline-text" style="width: 137px;">${endJourneyDetails.total_night || '' }</span> @ <span
                    class="underline-text" style="width: 142px;">${endJourneyDetails.night_charge || ''}</span>RS : <span class="underline-text"
                    style="width: 146px;">${endJourneyDetails.night_charges_total_rate || '' }</span>
            </div>
        </div>

        <div class="engaged-by section" style="margine-right:5px";>TOTAL AMOUNT: <span class="underline-text" style="width: 488px;">${formData.final_total || ''}</span>
        </div>







        <div class="extra-info section">Extra to be paid by Customer</div>

        <div class="extra-info1 section">
            <p><strong>Extras to be paid by Customer:</strong> TOLL TAX • PERMIT • TAX • ENTRY • PARKING</p>
        </div>

        <div class="footer">
            <div>Prepared by:<span class="underline-text" style="width: 150px;">${formData.created_by_name}</span></div>
            <div>Customer Signature: <span class="underline-text" style="width: 150px;"></span></div>
        </div>
    </div>

</body>
            </html>
        `;

        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.style.display = 'none'; 

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        iframe.onload = () => {
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 100);
        };
    } catch (error) {
        console.error('Error generating print document:', error);
    }
};
