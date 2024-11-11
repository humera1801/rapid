import { toWords } from 'number-to-words';



export const generateCabPaymentReceiptPrint = (formData) => {
    try {
        const margin = 10; // Margin in mm

        const paidAmountInWords = toWords(formData.paid_amount);





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
            top:180px;
            position: relative;
            width: 600px;
            height: 500px;
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
            text-align: left;
            font-size: 20PX;
            border: 1px solid black;
            padding: 10px;
            width:150px;
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
           .input-box {
    display: inline-flex;
    align-items: center;
    border: 1px solid black; /* Outer border */
    padding: 10px;
    font-size: 20px;
    width: 200px; /* Adjust width to fit the content */
    margin-top: 50px;
}

label {
    font-size: 20px;
    margin-right: 8px;
    vertical-align: middle;
}

.separator {
    height: 30px; 
    width: 1px;
    background-color: black;
    margin-right: 8px; 
}

.account-input {
    padding: 4px;
    font-size: 20px;
}

.account-input:focus {
    outline: none;
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

        <h3 style="text-align: center;">Payment Receipt</h3>

        <div class="sr-no section"> NO: <span >${formData.receipt_no}</span></div>
        
       



     

        <div class="engaged-by section">Received with thanks from M/s: <span class="underline-text" style="width: 70.2%;">${formData.firstName}</span>
        </div>

        <div class="address section">The sum of Rupees: <span class="underline-text" style="width: 79.8%;">${formData.total_amount} 
        </div>

          <div class="engaged-by section">Paid Amount: <span class="underline-text" style="width: 85.2%;">${paidAmountInWords} only</span>
        </div>
        
        
        
        
        
        
        
        </span>

        <div class="place-visited section">By Cheque / D.D. No: <span class="underline-text"
                style="width: 78.4%;">${formData.payment_details}</span></div>

               
             <div class="input-box">
    <label for="account-number">₹</label>
    <div class="separator"></div>
    <span id="account-number" class="account-input">
        ${formData.paid_amount}
    </span>
</div>

</body>
            </html>
        `;

        // const printWindow = window.open('', '_blank');
        // if (printWindow) {
        //     printWindow.document.open();
        //     printWindow.document.write(html);
        //     printWindow.document.close();
        //     printWindow.focus();
        //     printWindow.print();
        // } else {
        //     alert('Popup blocker is preventing printing. Please allow popups for this site.');
        // }


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
