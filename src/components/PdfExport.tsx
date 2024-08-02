// utils/pdfUtils.ts
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function generatePDF() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page to the document
  const page = pdfDoc.addPage([600, 400]);

  // Load an image from a URL
  const imageUrl = 'https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png'; // Replace with your image URL
  const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());

  // Embed PNG image
  const image = await pdfDoc.embedPng(imageBytes);

  // Get the dimensions of the image
  const { width, height } = image.scale(0.5); // Scale image to 50%

  // Draw the image onto the page
  page.drawImage(image, {
    x: 50,
    y: 200,
    width,
    height,
  });

  // Draw some text
  page.drawText('Hello, world!', {
    x: 50,
    y: 350,
    size: 30,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();

  // Use file-saver to save the PDF
  saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'example.pdf');
}
