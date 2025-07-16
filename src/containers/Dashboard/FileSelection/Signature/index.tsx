import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import localStorageContent from "../../../../utils/localstorage";
import { dataURLToBlob } from "./constants";
import { useDispatch } from "react-redux";
import { initSignature } from "../../../../store/actions/creators";
import ModalPopUp from "../../../../components/Modal";
import { Button, Modal } from "antd";

const Signature = ({ show, toggleSignature, type, leadId, onSuccess }: any) => {
  console.log("ssssss", leadId);
  const signatureRef: any = useRef();
  const localUserData = localStorageContent.getUserData();
  const dispatch = useDispatch();

  const submitSignature = async () => {
    try {
      const canvas = signatureRef.current.getCanvas();
      const signatureData = canvas.toDataURL("image/png");

      if (signatureData === null || signatureData === undefined) {
        return;
      }

      const binarySignature = dataURLToBlob(signatureData);
      const formData = new FormData();
      formData.append("file", binarySignature, "signature.png");
      formData.append("type", type);

      await dispatch(initSignature(formData, leadId));
      if (onSuccess) {
        onSuccess(); // ✅ Call the parent's handler
        toggleSignature();
      }
    } catch (error) {
      console.error("Signature submit error:", error);
    }
  };

  return (
    <Modal
      title={`${type === 1 ? "signature" : "Spouse signature"}`}
      visible={show}
      onCancel={toggleSignature}
      footer={() => (
        <div style={{ display: "flex" }}>
          <Button onClick={toggleSignature}>Cancel</Button>
          <Button onClick={submitSignature} type="primary">
            Save Signature
          </Button>
        </div>
      )}
    >
      <div
        style={{
          border: "1px solid",
          width: "100%",
          padding: "22px",
          marginTop: "5px",
        }}
      >
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{ width: 570, height: 200, className: "sigCanvas" }}
        />
      </div>
    </Modal>
  );
};

export default Signature;
