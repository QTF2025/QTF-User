import React, { useState, useEffect } from "react";
import { Checkbox, Space } from "antd";
import Icon, {
  CustomerServiceOutlined,
  UsergroupAddOutlined,
  FileAddOutlined,
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
    //console.log("ssss", localStoreData.leadId);
    if (localStoreData) {
      if (
        localStoreData.leadId === "" ||
        localStorage.getItem("newapplication")
      ) {
        navigate("/user");
      } else {
        dispatch(initGetLead(localStoreData.leadId));
        navigate("/dashboard");
      }
    }
  }, []);

  const newApplication = () => {
    localStorage.setItem("newapplication", "true");
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
          <Space onClick={newApplication} className="userclickcursos">
            <FileAddOutlined
              size={40}
              style={{ color: "red", fontSize: "24px", marginLeft: "20px" }}
            />
            <span>New Application</span>
          </Space>

          <Space onClick={toggleReferealModal} className="userclickcursos">
            <UsergroupAddOutlined
              size={40}
              style={{ color: "red", fontSize: "24px", marginLeft: "20px" }}
            />
            <span>Referral</span>
          </Space>
        </div>
      </div>
      <hr />
      <TaxesList />
    </div>
  );
};

export default Dashboard;
