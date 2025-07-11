import React, { useState, useEffect } from "react";
import { Checkbox, Space } from "antd";
import Icon, {
  CustomerServiceOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import Stepper from "./Steps";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import CommentBox from "./CommentBox";
import ReopenLead from "./ReopenLead";
import { IInitialState } from "../../store/reducers/models";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import {
  getComments,
  getReviews,
  initGetLead,
} from "../../store/actions/creators";
import localStorageContent from "../../utils/localstorage";
import FileSelection from "./FileSelection";
import { FaShareAltSquare } from "react-icons/fa";
import ModalPopUp from "../../components/Modal";
import Referal from "./Referal";
import TaxesList from "./TaxesList";
import Support from "./Support";

const Dashboard = () => {
  const [checkedReopenLead, setCheckedReOpenLead] = useState<boolean>(false);
  const [showReferalModal, setShowReferalModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [leadStatusId, setLeadStatusId] = useState<string>("");
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { leadData, comments }: IInitialState = gloablStore;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleReopenLeadCheckbox = () => {
    setCheckedReOpenLead(!checkedReopenLead);
  };

  const generateTaxYear = () => {
    const month = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const prevYear = currentYear - 1;
    if (month > 2) {
      return `${currentYear} - ${nextYear}`;
    } else {
      return `${prevYear} - ${currentYear}`;
    }
  };

  const toggleReferealModal = () => {
    setShowReferalModal(!showReferalModal);
  };
  const toggleSupportModal = () => {
    setShowSupportModal(!showSupportModal);
  };

  useEffect(() => {
    if (leadData && localStoreData) {
      const { lead_status } = leadData;
      if (lead_status) {
        setLeadStatusId(lead_status);

        if (lead_status === "4") {
          dispatch(getReviews(localStoreData.leadId));
        } else {
          dispatch(getComments(localStoreData.leadId));
        }
      } else {
        setLeadStatusId("-1");
      }
    }
  }, [leadData]);

  useEffect(() => {
    if (localStoreData) {
      if (
        localStoreData.leadId === "" ||
        localStorage.getItem("newapplication")
      ) {
        navigate("/user");
      } else {
        dispatch(initGetLead(localStoreData.leadId));
      }
    }
  }, []);

  const newApplication = () => {
    localStorage.setItem("newapplication", "newapplication");
    navigate("/user");
  };

  if (!localStoreData) {
    return <></>;
  }

  return (
    <div className="dashboard">
      {showReferalModal && (
        <ModalPopUp
          showFooter={false}
          title="Refer a friend"
          show={showReferalModal}
          toggle={toggleReferealModal}
        >
          <Referal toggleModal={toggleReferealModal} />
        </ModalPopUp>
      )}
      {showSupportModal && (
        <ModalPopUp
          showFooter={false}
          title="Escalation"
          show={showSupportModal}
          toggle={toggleSupportModal}
          width="50%"
        >
          <Support toggleModal={toggleSupportModal} />
        </ModalPopUp>
      )}
      <div className="dashboard__header">
        <div className="dashboard__header--title">
          <p>Application status</p>
        </div>
        <div className="dashboard__header--reopen">
          <p style={{ cursor: "pointer" }} onClick={newApplication}>
            New Application
          </p>
        </div>
      </div>
      <hr />
      <TaxesList />
      <Stepper leadStatusId={leadStatusId} />
      <div className="dashboard__title">
        <p>
          {generateTaxYear()} Tax Information -{" "}
          <span
            onClick={() => navigate(`/user?lead_id=${localStoreData.leadId}`)}
          >
            Click here to find your application
          </span>
        </p>
        <div>
          <Space onClick={toggleReferealModal}>
            <UsergroupAddOutlined
              size={40}
              style={{ color: "red", fontSize: "24px" }}
            />
            <span>Refer a friend</span>
          </Space>
          <Space onClick={toggleSupportModal}>
            <CustomerServiceOutlined
              title="Escalation"
              size={40}
              style={{ color: "red", marginLeft: "10px", fontSize: "24px" }}
            />

            <span>Support team</span>
          </Space>
        </div>
      </div>
      <FileSelection
        component="selectedReview"
        leadStatusId={leadStatusId}
        leadData={leadData}
      />
      <FileSelection
        component="taxFile"
        leadStatusId={leadStatusId}
        leadData={leadData}
      />
      <FileSelection
        component="finaltaxFile"
        leadStatusId={leadStatusId}
        leadData={leadData}
      />

      <FileSelection
        component="finalofftaxFile"
        leadStatusId={leadStatusId}
        leadData={leadData}
      />

      <Comments comments={comments} />
      <CommentBox leadStatusId={leadStatusId} leadId={localStoreData.leadId} />
      <ReopenLead
        isChecked={checkedReopenLead}
        toggleReopenLeadCheckbox={toggleReopenLeadCheckbox}
      />
    </div>
  );
};

export default Dashboard;
