// components/HtmlToPdf.js
import React, { useRef, useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';

const HtmlToPdf = () => {
  const contentRef = useRef(null);
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    // Convert image URL to Base64
    const url = 'https://picsum.photos/200';

    const urlToBase64 = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => {
            console.error('Error reading blob:', reader.error);
            reject(reader.error);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error fetching image:', error);
        return '';
      }
    };

    const fetchImage = async () => {
      const base64 = await urlToBase64(url);
      if (base64) {
        setBase64Image(base64);
      } else {
        console.error('Failed to set base64 image.');
      }
    };

    fetchImage();
  }, []);

  const generatePdf = () => {
    const element = contentRef.current;
    const options = {
      margin: 1,
      filename: 'document-with-image.pdf',
      image: { type: 'png' },  // Specify PNG format
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    if (element) {
      html2pdf().set(options).from(element).save();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div ref={contentRef} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Your PDF Content with Base64 Image</h2>
        <p>This is the content that will be converted to PDF.</p>
        {base64Image ? (
          <img 
            src={base64Image} 
            alt="Example" 
            style={{ width: '100%', maxWidth: '300px' }} 
          />
        ) : (
          <p>Loading image...</p>
        )}
        <p>Feel free to add any HTML content here, including images!</p>
      </div>
      <button onClick={generatePdf}>Download PDF</button>
    </div>
  );
};

export default HtmlToPdf;
