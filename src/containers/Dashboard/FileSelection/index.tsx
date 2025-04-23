import React, { useState, useEffect, useRef } from 'react';
import Signature from './Signature';
import './styles.scss';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { initManully } from '../../../store/actions/creators';
import localStorageContent from '../../../utils/localstorage';

function FileSelection({ leadData, leadStatusId, component }: any) {
  const [showSignatureComp, setShowSignatureComp] = useState<boolean>(false);
  const [showSignatureSpouseComp, setShowSignatureSpouseComp] = useState<boolean>(false);
  const [showSignatureSpouseCheckBox, setShowSignatureSpouseCheckBox] = useState<boolean>(false);
  const [serviceCost, setServiceCost] = useState<number | string>('');
  const [file, setFile] = useState<string>('');
  const [finalfile, setFinalFile] = useState<string>('');
  const [leadType, setLeadType] = useState<string | undefined | null>(null);
  const [fileOption, setFileOption] = useState<string>('eFile'); // New state for radio buttons
  const dispatch = useDispatch();

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSignature = () => {
    setShowSignatureComp(!showSignatureComp);
  };

  const toggleSpouseSignature = () => {
    setShowSignatureSpouseComp(!showSignatureSpouseComp);
  };

  const localUserData = localStorageContent.getUserData();

  const submitSignature = async () => {
    try {
      // Access the file input element via the ref
      const fileInput = fileInputRef.current;

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
      }

      // Get the selected file
      const selectedFile = fileInput.files[0];

      // Prepare FormData
      const formData = new FormData();
      formData.append('file', selectedFile); // Attach the actual file
      formData.append('type', 'manual'); // Add type or other required data

      // Dispatch the API call
      await dispatch(initManully(formData, localUserData.leadId));

      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error sending signature to the backend:', error);
    }
  };

  useEffect(() => {
    if (leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)) {
      const { lead_type, service_charge, online_offline_attachments, selected_review, marital_status, online_final_attachments } = leadData;
      
      if (component === 'taxFile' && online_offline_attachments) {
        setFile(online_offline_attachments);
      }
      if (component === 'finaltaxFile' && online_final_attachments) {
        setFile(online_final_attachments);
      }
      if (component === 'finalofftaxFile' && online_offline_attachments) {
        setFile(online_offline_attachments);
      }
      
      if (component === 'selectedReview' && selected_review) {
        setFile(selected_review);
      }
      if (lead_type) {
        setLeadType(lead_type);
      }
      if (service_charge) {
        setServiceCost(service_charge);
      }
      setShowSignatureSpouseCheckBox(marital_status === '2');
    }
  }, [leadData, component]);

  return (
    <div className="file-selection">
      {leadStatusId > 3 && (
        <>
          {leadType === '1' && component === 'taxFile' && file && (
            <div className="file-selection__online">
              <p className="file-selection__online--header">E-filing Authentication</p>
              <hr />
              <p className="file-selection__online--title1">
                File:{' '}
                <a href={file || undefined} target="_blank" rel="noopener noreferrer">
                  {file ? file.split('/').pop() : 'Null'}
                </a>
              </p>
              <div className="file-selection__radio-options">
                <label style={{ marginRight: '20px' }}>
                  <input
                    type="radio"
                    name="fileOption"
                    value="eFile"
                    checked={fileOption === 'eFile'}
                    onChange={() => setFileOption('eFile')}
                    style={{ marginRight: '10px' }}
                  />
                  E-file
                </label>
                <label>
                  <input
                    type="radio"
                    name="fileOption"
                    value="manualFile"
                    checked={fileOption === 'manualFile'}
                    onChange={() => setFileOption('manualFile')}
                    style={{ marginRight: '10px' }}
                  />
                  Manual File
                </label>
              </div>
              {fileOption === 'eFile' && (
                <div id="efile">
                  <div className="file-selection__online--sign">
                    <p>Please Authenticate tax file:</p>
                    <input type="checkbox" checked={showSignatureComp} onChange={toggleSignature} />
                  </div>
                  {showSignatureSpouseCheckBox && (
                    <div className="file-selection__online--sign">
                      <p>Please Authenticate Spouse tax file:</p>
                      <input type="checkbox" checked={showSignatureSpouseComp} onChange={toggleSpouseSignature} />
                    </div>
                  )}
                  {showSignatureComp && <Signature show={showSignatureComp} toggleSignature={toggleSignature} type={1} />}
                  {showSignatureSpouseComp && (
                    <Signature show={showSignatureSpouseComp} toggleSignature={toggleSpouseSignature} type={2} />
                  )}
                </div>
              )}
              {fileOption === 'manualFile' && (
                <div id="manualfile">
                  <p>File upload section for Manual File:</p>
                  {/* File upload input */}
                  <label htmlFor="manualFileInput" style={{ display: 'block', marginBottom: '8px' }}>
                    Choose a file:
                  </label>
                  <input
                    type="file"
                    id="manualFileInput"
                    ref={fileInputRef} // Attach the ref here
                    style={{ marginBottom: '12px' }}
                  />
                  <button type="button" onClick={submitSignature}>
                    Upload File
                  </button>
                </div>
              )}
            </div>
          )}


          {console.log ("veeru1", component)}


          {leadType === '1' && component === 'finaltaxFile' &&  (
            <div className="file-selection__offline">
              <p className="file-selection__offline--title">Online final Tax File</p>
              <hr />
              {file &&
                file.split(',').map((online_final_attachments: any, i: number) => (
                  <p key={i} className="file-selection__online--title1">
                    File-{i + 1}:{' '}
                    <a href={online_final_attachments || undefined} target="_blank" rel="noopener noreferrer">
                      {online_final_attachments ? online_final_attachments.split('/').pop() : 'Null'}
                    </a>
                  </p>
                ))}
            </div>
          )}
          {leadType === '2' && component === 'finalofftaxFile' &&  (
            <div className="file-selection__offline">
              <p className="file-selection__offline--title">Offline Tax File</p>
              <hr />
              {file &&
                file.split(',').map((online_offline_attachments: any, i: number) => (
                  <p key={i} className="file-selection__online--title1">
                    File-{i + 1}:{' '}
                    <a href={online_offline_attachments || undefined} target="_blank" rel="noopener noreferrer">
                      {online_offline_attachments ? online_offline_attachments.split('/').pop() : 'Null'}
                    </a>
                  </p>
                ))}
            </div>
          )}
        </>
      )}
      {component === 'selectedReview' && leadStatusId >= 3 && serviceCost && (
        <div className="file-selection__Selected-file">
          <p className="file-selection__Selected-file--title">Selected Review File</p>
          <hr />
          <p className="file-selection__Selected-file--title1">
            File:{' '}
            <a href={file || undefined} target="_blank" rel="noopener noreferrer">
              {file ? file.split('/').pop() : 'Null'}
            </a>
          </p>
          <p className="file-selection__Selected-file--title2">Service Charge: {serviceCost}</p>
        </div>
      )}
      
    </div>
  );
}

export default FileSelection;
