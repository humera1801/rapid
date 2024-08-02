import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toWords } from 'number-to-words';

export const FirePdf = async (formData, bankDetails) => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');

        // Header with Background Color
        doc.setFontSize(14);
        const headerLines = [
            '8866396939 , 910607741',
            'rapidgroupbaroda@gmail.com'
        ];

        // Calculate the right-aligned X position
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10; // 10 mm margin from the right edge

        // Set the starting Y position for the text
        const startY = 12;
        const lineHeight = 5; // Adjust this value to control vertical spacing

        headerLines.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line);
            const xPosition = pageWidth - textWidth - margin;
            const yPosition = startY + (index * lineHeight); // Calculate Y position for each line
            doc.text(line, xPosition, yPosition);
        });
        // Draw a rectangle with background color behind the text
        doc.setFillColor(185, 186, 207); // Set fill color (RGB format)
        doc.rect(10, 33, 190, 8, 'F'); // Draw filled rectangle (x, y, width, height, style)

        doc.setFontSize(12);
        doc.text('SUPPLIER OF FIRE FIGHTING, SAFETY & SECURITY EQUIPMENTS.', 105, 30, { align: 'center' });

        // Address line with styled background
        doc.setFontSize(10); // Increase font size
        doc.setTextColor(0, 0, 0); // Set text color to black
        doc.text('G/12, Swastik Chambers, Nr. Makarpura Bus Depot, Makarpura Road, Vadodara-390 010.', 105, 39, { align: 'center' });
        doc.line(10, 42, 200, 42);  // Horizontal line under header
        doc.setFontSize(14);
        doc.text('BILL TO SUPPLY', 105, 49, { align: 'center' });

        // Details Table
        const detailsData = [
            [
                { content: `To, ${formData.firstName}\n${formData.address}\n${formData.client_city} - ${formData.client_state}\n${formData.client_pincode}`, rowSpan: 8 },
                'Invoice No:', formData.febking_invoice_no
            ],
            ['Date:', new Date().toLocaleDateString()],
            ['Certificate No:', '132'],
            ['Order Date:', formData.febking_created_at],
            ['Order No:', formData.poNo],
            ['Vendor Code:', formData.vendorCode],
            ['Contact Person:', formData.firstName],
            ['Contact No:', formData.mobileNo]
        ];

        autoTable(doc, {
            startY: 55,
            body: detailsData,
            columnStyles: {
                0: { cellWidth: 90 },
                1: { cellWidth: 65 },
                2: { cellWidth: 35 },
                3: { cellWidth: 65 }
            },
            styles: { fontSize: 10, valign: 'top', overflow: 'linebreak' },
            margin: { top: 10 },
            theme: 'grid'
        });

        // Product Table
        const productRows = formData.product_data.map((product, index) => [
            index + 1,
            `${product.feit_name} Fire Extinguisher ${product.capacity} Capacity\n(WITH Pressure Gauge, Safety pin, Valve, Wall clamp, Warranty seal, Instruction Sticker)`,
            product.feit_hsn_code,
            `${product.qty} Nos.`,
            product.rate,
            'Each',
            product.totalAmount
        ]);

        autoTable(doc, {
            startY: doc.autoTable.previous.finalY,
            head: [['SR.', 'PARTICULARS', 'HSN CODE', 'QTY', 'RATE', 'PER', 'AMOUNT']],
            body: productRows,
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 80 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 20 },
                6: { cellWidth: 20 }
            },
            styles: { fontSize: 10, valign: 'middle', overflow: 'linebreak' },
            theme: 'grid',
            headStyles: { fillColor: [185, 186, 207], textColor: [0, 0, 0] } // RGB color for background and black text
        });

        // Footer
        const finalAmountWords = toWords(formData.febking_final_amount);
        const footerStartY = doc.autoTable.previous.finalY + 0;

        const bankData = [
            [{ content: `Composite Dealer:` || 'N/A', colSpan: 4 }, '', '',],
            [{ content: `OUR GST NO: ${formData.bank_details[0]?.gst_no}` || 'N/A', colSpan: 4 }, '', '', ''],
            [{ content: `Our Bank Name: ${formData.bank_details[0]?.bnk_name} , Branch: ${formData.bank_details[0]?.bnk_branch} ` || 'N/A', colSpan: 4 }, '', '',],
            [{ content: `Account No: ${formData.bank_details[0]?.bnk_acc_no} , IFSC Code: ${formData.bank_details[0]?.bnk_ifsc_code} ` || 'N/A', colSpan: 4 }, '', '', ''],
            [{ content: `${finalAmountWords} Only`, colSpan: 4, styles: { halign: 'center' } }, '', '', ''],
            [
                { content: '', hideBorder: true, colSpan: 4 },
                { content: `Grand Total: ${formData.febking_final_amount}`, colSpan: 2 },
            ],
            [
                { 
                    content: `Thank You\nPrevention Is Better Than Cure`, colSpan: 3, styles: { halign: 'left', fontSize: 12, cellPadding: 5 }, 
                    margin: { top: 20, bottom: 20 }
                },                { 
                    content: `For Rapid Fire Prevention\n\n\nProprietor`, colSpan: 3, styles: { halign: 'right', fontSize: 12, cellPadding: 5 },
                    margin: { top: 20, bottom: 20 }
                }
            ]        ];
        autoTable(doc, {
            startY: footerStartY,
            body: bankData,
            columnStyles: {
                0: { cellWidth: 90 },
                1: { cellWidth: 20 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 20 }
            },
            styles: { fontSize: 10, align: 'center', fontStyle: 'bold', valign: 'top', overflow: 'linebreak' },
            margin: { top: 10 },
            theme: 'grid',


        });

        // Additional Footer Text
        const additionalFooterText = `\nThank You\nPrevention Is Better Than Cure\n\nfor Rapid Fire Prevention\nProprietor`;
        doc.setFontSize(10);
        doc.text(additionalFooterText, 14, doc.autoTable.previous.finalY + 30);

        // Create a Blob and URL, then open it in a new tab
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url);

        // Optional: Revoke the Object URL after some time
        setTimeout(() => URL.revokeObjectURL(url), 10000);

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
