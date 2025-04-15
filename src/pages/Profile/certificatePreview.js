import React from 'react';
import {CertificateIcon, Verify} from '../../common/Icons';


const CertificatePreview = ({subSkill,data}) => {
    const handleCertificateClick = () => {
        if (!subSkill?.certificate) return;

        const certificatePath = subSkill?.certificate;

        // Check if the certificate is a PDF or image by checking the file extension
        const isPDF = certificatePath.toLowerCase().endsWith('.pdf');
        const isImage = certificatePath.match(/\.(jpeg|jpg|png|gif)$/i);

        // Build the full URL to the certificate
        // const certificateUrl = `${process.env.REACT_APP_FILE_URL}/${certificatePath.replace(/\\/g, '/')}`;

        // Open the certificate in a new tab
        if (isPDF || isImage) {
            window.open(certificatePath, '_blank');
        } else {
            alert('Unsupported certificate type');
        }
    };

    return (
        <div className="2xl:text-base md:text-sm text-xs capitalize flex items-center gap-x-1">
            {subSkill?.sub_skills.trim()}
            {subSkill?.certificate && (
                <span className="cursor-pointer" onClick={handleCertificateClick}>
          <CertificateIcon/>
        </span>
            )}
            {data?.basicDetails?.is_experience_verified && <Verify/>}
        </div>
    );
};

export default CertificatePreview;
