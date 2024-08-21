import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const DownloadPdf = () => {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
  
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add a blank page to the document
      const page = pdfDoc.addPage([600, 400]);
  
      // Load a logo image
      const logoUrl = 'https://prolificdemo.com/dev_rapid_group/assets/theme/admin/logo/rapid_logo_black.png';
      console.log(`Fetching image from: ${logoUrl}`);
      
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const logoImageBytes = await response.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const { width, height } = logoImage.scale(0.5); // Adjust the scale if needed
  
      // Draw the logo image on the page
      page.drawImage(logoImage, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() - height - 30, // Position the image
        width,
        height,
      });
  
      // Add some text to the PDF
      page.drawText('Hello, PDF with logo!', {
        x: page.getWidth() / 2 - 60,
        y: page.getHeight() / 2,
        size: 30,
        color: rgb(0, 0, 0),
      });
  
      // Serialize the document to bytes
      const pdfBytes = await pdfDoc.save();
      console.log('PDF bytes length:', pdfBytes.length); // Debug the PDF bytes
  
      // Create a Blob and trigger a download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log('PDF Blob URL:', url); // Debug the Blob URL
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'example.pdf';
      document.body.appendChild(a); // Append to body
      a.click();
      a.remove(); // Remove after clicking
      URL.revokeObjectURL(url); // Clean up the URL after download
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div>
      <h1>Generate and Download PDF</h1>
      <button onClick={generatePdf} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  );
};

export default DownloadPdf;
