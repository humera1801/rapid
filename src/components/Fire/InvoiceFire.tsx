import { PDFDocument, rgb } from 'pdf-lib';
// import { FormData } from './FireDataForm'; // Adjust import path as per your project structure

export const createInvoice = async (formData: any) => {
    try {
        // Create PDF document using pdf-lib
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;

        // Title and Header
        const titleFont = await pdfDoc.embedFont('Helvetica-Bold');
        const headerFont = await pdfDoc.embedFont('Helvetica');

        // Title
        page.drawText('Invoice', {
            x: 50,
            y: height - 50,
            size: 30,
            font: titleFont,
            color: rgb(0, 0, 0),
        });

        // Invoice Information
        const invoiceHeaderY = height - 80;
        page.drawText(`Invoice No: ${formData.febking_invoice_no}`, {
            x: 400,
            y: invoiceHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
            x: 400,
            y: invoiceHeaderY - 20,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });

        // Bill To
        const billToY = height - 150;
        page.drawText(`Bill To:${formData.firstName}`, {
            x: 50,
            y: billToY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
     
        page.drawText(`Address:${formData.address}`, {
            x: 50,
            y: billToY - 20,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Email: ${formData.email}`, {
            x: 50,
            y: billToY - 40,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        page.drawText(`GST No: ${formData.gstNo}`, {
            x: 50,
            y: billToY - 60,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Mobile No: ${formData.mobileNo}`, {
            x: 50,
            y: billToY - 80,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        
        

        // Vendor Code, Certificate No, PO No
        page.drawText(`Vendor Code: ${formData.vendorCode}`, {
            x: 400,
            y: invoiceHeaderY - 40,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Certificate No: ${formData.certificateNo}`, {
            x: 400,
            y: invoiceHeaderY - 60,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`PO No: ${formData.poNo}`, {
            x: 400,
            y: invoiceHeaderY - 80,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });

        // Table Header
        const tableHeaderY = height - 300;
        page.drawText('Brand', {
            x: 50,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('Item', {
            x: 120,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });

        page.drawText('Qty', {
            x: 220,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('Capacity', {
            x: 260,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('Rate', {
            x: 320,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('CGST', {
            x: 380,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('SGST', {
            x: 430,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });
        page.drawText('Total', {
            x: 490,
            y: tableHeaderY,
            size: fontSize,
            font: headerFont,
            color: rgb(0, 0, 0),
        });

        // Table Rows (Product Data)
        let tableY = height - 330;
        formData.product_data.forEach((product:any, index:any) => {
            const rowY = tableY - (index * 20);
            page.drawText(product.feb_name.toString(), {
                x: 50,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.feit_name.toString(), {
                x: 120,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.qty.toString(), {
                x: 220,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.capacity, {
                x: 260,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.rate.toString(), {
                x: 320,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.febd_sgst.toString()+"%", {
                x: 380,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.febd_cgst.toString()+"%", {
                x: 430,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
            page.drawText(product.totalAmount.toString(), {
                x: 490,
                y: rowY,
                size: fontSize,
                font: headerFont,
                color: rgb(0, 0, 0),
            });
        });

        // Total Amount
        
        const totalAmountY = height - 400;
        page.drawText(`${formData.febking_total_cgst}`, {
            x: 380,
            y: totalAmountY,
            size: fontSize,
            font: titleFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`${formData.febking_total_sgst}`, {
            x: 430,
            y: totalAmountY,
            size: fontSize,
            font: titleFont,
            color: rgb(0, 0, 0),
        });
        page.drawText(`${formData.febking_total_amount}`, {
            x: 490,
            y: totalAmountY,
            size: fontSize,
            font: titleFont,
            color: rgb(0, 0, 0),
        });

        // Save or display the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Open the PDF in a new tab (you might want to handle this differently in a production app)
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error creating invoice:', error);
    }
};
