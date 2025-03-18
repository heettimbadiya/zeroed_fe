import React from 'react';
import PDFIcon from "../../assets/pdfIcon.svg"

const CertificatePreview = ({ subSkill }) => {
  const certificate = subSkill.certificate; 
  const isPDF = (fileName) => {
    return fileName && fileName.toLowerCase().endsWith('.pdf');
  };

  // Helper function to get the certificate URL (whether it's a file or string path)
  const getCertificateUrl = (certificate) => {
    if (certificate instanceof File) {
      return URL.createObjectURL(certificate); // For file object
    }
    return `${process.env.REACT_APP_FILE_URL}/${certificate.replace(/\\/g, '/')}`; // For file path (URL)
  };

  return (
    <div>
      {certificate && (
        <div>
          <p>Uploaded Certificate</p>
          {/* Wrap certificate in anchor tag to make it clickable */}
          <a href={getCertificateUrl(certificate)} target="_blank" rel="noopener noreferrer">
            {certificate instanceof File ? (
              // If it's a File object (uploading directly)
              isPDF(certificate.name) ? (
                // If it's a PDF, show a PDF icon
                <img src={PDFIcon} alt="PDF" className='h-[100px] w-[100px]' />
              ) : (
                // Otherwise, show image preview
                <img
                  src={URL.createObjectURL(certificate)}
                  alt="Certificate Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover', // Keeps image ratio intact
                  }}
                />
              )
            ) : (
              // If certificate is a string (URL path)
              isPDF(certificate) ? (
                // If it's a PDF URL, show a PDF icon
                <img src={PDFIcon} alt="PDF" className='h-[100px] w-[100px]' />
              ) : (
                // Otherwise, show image preview
                <img
                  src={`${process.env.REACT_APP_FILE_URL}/${certificate.replace(/\\/g, '/')}`}
                  alt="Certificate Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover', // Keeps image ratio intact
                  }}
                />
              )
            )}
          </a>
        </div>
      )}
    </div>
  );
};

export default CertificatePreview;
