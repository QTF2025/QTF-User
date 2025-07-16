import React, { useEffect, useState } from "react";
import { Collapse, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import GeneralInformation from "./GeneralInformation";
import Residency from "./Residency";
import BankAccountDetails from "./BankAccountDetails";
import DayCareExpense from "./DayCareExpense";
import RentalIncomeExpense from "./RentalIncomeExpense";
import SelfEmployment from "./SelfEmployment";
import EstimatedTaxPayments from "./EstimatedTaxPayments";
import FbarFatca from "./FbarFatca";
import OtherIncome from "./OtherIncome";
import AdjustmentIncome from "./AdjustmentIncome";
import MedicalExpenses from "./MedicalExpenses";
import TaxPaid from "./TaxPaid";
import Documents from "./Document's";
import localStorageContent from "../../utils/localstorage";
import {
  initGetLead,
  getComments,
  getReviews,
} from "../../store/actions/creators";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import IncomeInformation from "./IncomeInformation";
import { IInitialState } from "../../store/reducers/models";
import FileSelection from "../Dashboard/FileSelection";
import Stepper from "../Dashboard/Steps";
import Comments from "../Dashboard/Comments";
import CommentBox from "../Dashboard/CommentBox";
import ReopenLead from "../Dashboard/ReopenLead";
import Icon, { CustomerServiceOutlined } from "@ant-design/icons";
import ModalPopUp from "../../components/Modal";
import Support from "../Dashboard/Support";

const { Panel } = Collapse;

const User = () => {
  const [checkedReopenLead, setCheckedReOpenLead] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData, comments }: IInitialState =
    gloablStore;
  const location = useLocation();
  const localStoreData = localStorageContent.getUserData();
  const [leadStatusId, setLeadStatusId] = useState<string>("");
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [isNewApplication, setIsNewApplication] = useState(false);
  const toggleReopenLeadCheckbox = () => {
    setCheckedReOpenLead(!checkedReopenLead);
  };

  const panelItems: any = [
    {
      key: "1",
      Component: GeneralInformation,
      header: "General Information",
    },
    {
      key: "1",
      Component: Residency,
      header: "States (US) of Residency",
    },
    {
      key: "1",
      Component: BankAccountDetails,
      header: "Bank Account Details",
    },

    {
      key: "2",
      Component: IncomeInformation,
      header: "Income Information",
    },
    {
      key: "2",
      Component: RentalIncomeExpense,
      header: "Rental Income and Expenses",
    },
    {
      key: "2",
      Component: SelfEmployment,
      header: "Self Employment Information",
    },
    {
      key: "2",
      Component: OtherIncome,
      header: "Other Income",
    },

    {
      key: "4",
      Component: FbarFatca,
      header: "FBAR / FATCA",
    },
    {
      key: "3",
      Component: MedicalExpenses,
      header: "Itemized Deductions",
    },
    {
      key: `${leadData && leadData?.dependentDetails?.length > 0 ? "3" : ""}`,
      Component: DayCareExpense,
      header: "Day Care Expense",
    },
    {
      key: "3",
      Component: EstimatedTaxPayments,
      header: "Estimated Tax Payments",
    },
    {
      key: "3",
      Component: AdjustmentIncome,
      header: "Adjustments Income",
    },
    {
      key: "3",
      Component: TaxPaid,
      header: "Taxes Paid",
    },
    {
      key: "5",
      Component: Documents,
      header: "Documents",
    },
  ];

  const tabItems: any = [
    {
      key: "1",
      label: "General Information",
      children: (
        <>
          {
            <Collapse accordion defaultActiveKey={["0"]}>
              {panelItems.map(
                ({ key, header, Component }: any, index: any) =>
                  key === "1" && (
                    <Panel
                      header={header}
                      key={index}
                      disabled={!leadData && header !== "General Information"}
                    >
                      <Component />
                    </Panel>
                  )
              )}
            </Collapse>
          }
        </>
      ),
    },
    {
      key: "2",
      label: "Income Details",
      children: (
        <>
          {
            <Collapse accordion defaultActiveKey={[leadData ? "3" : ""]}>
              {panelItems.map(
                ({ key, header, Component }: any, index: any) =>
                  key === "2" && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  )
              )}
            </Collapse>
          }
        </>
      ),
    },
    {
      key: "3",
      label: "Expenses or Deductions",
      children: (
        <>
          {
            <Collapse accordion defaultActiveKey={[leadData ? "8" : ""]}>
              {panelItems.map(
                ({ key, header, Component }: any, index: any) =>
                  key === "3" && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  )
              )}
            </Collapse>
          }
        </>
      ),
    },
    {
      key: "4",
      label: "Misc (FBAR and Foreign Info)",
      children: (
        <>
          {
            <Collapse accordion defaultActiveKey={[leadData ? "7" : ""]}>
              {panelItems.map(
                ({ key, header, Component }: any, index: any) =>
                  key === "4" && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  )
              )}
            </Collapse>
          }
        </>
      ),
    },
    {
      key: "5",
      label: "Documents",
      children: (
        <>
          {
            <Collapse accordion defaultActiveKey={[leadData ? "13" : ""]}>
              {panelItems.map(
                ({ key, header, Component }: any, index: any) =>
                  key === "5" && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  )
              )}
            </Collapse>
          }
        </>
      ),
    },
  ];

  const toggleSupportModal = () => {
    setShowSupportModal(!showSupportModal);
  };

  useEffect(() => {
    const isNew = localStorage.getItem("newapplication") === "true";
    setIsNewApplication(isNew);
    const userData = localStorageContent.getUserData();
    const queryPrams = new URLSearchParams(location.search);
    const leadId = queryPrams.get("lead_id");
    const leadStatusId = queryPrams.get("lead_id");
    console.log("veeru", leadId);
    if (localStorage.getItem("newapplication")) {
      dispatch(initGetLead(sessionStorage.getItem("newappleadid")));
    } else if (leadId && typeof Number(leadId) === "number") {
      dispatch(initGetLead(leadId));
    } else {
      if (userData && userData.leadId) {
        dispatch(initGetLead(userData.leadId));
      }
    }
  }, []);

  useEffect(() => {
    if (leadData) {
      const { lead_status, lead_id } = leadData;
      console.log("allcomment", getComments(lead_id));
      if (lead_status) {
        setLeadStatusId(lead_status);

        if (lead_status === "4") {
          dispatch(getReviews(lead_id)); // If reviews are needed
        } else {
          dispatch(getComments(lead_id)); // ✅ Use correct leadId
        }
      } else {
        setLeadStatusId("-1");
      }
    }
  }, [leadData]);

  return (
    <div className="user-details">
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
      <div className="user-details__collapses-menu">
        <div className="user-details__collapses-menu">
          <span
            className="user-details__collapses-menu__header--link backtodashboard"
            onClick={() => {
              localStorage.removeItem("newapplication"); // ✅ Clear flag
              navigate("/dashboard");
            }}
          >
            Back to dashboard
          </span>
          <p className="user-details__collapses-menu__header--title">
            Fill Your Tax Information
            <span onClick={toggleSupportModal} className="escalation">
              <CustomerServiceOutlined
                title="Escalation"
                size={40}
                style={{ color: "red", marginLeft: "10px", fontSize: "24px" }}
              />

              <span>Escalation</span>
            </span>
          </p>
          {!isNewApplication && (
            <>
              <Stepper leadStatusId={leadStatusId} />
              <FileSelection
                component="selectedReview"
                leadStatusId={leadData.lead_status}
                leadId={leadData?.lead_id}
              />
              <FileSelection
                component="taxFile"
                leadStatusId={leadData.lead_status}
                leadData={leadData}
              />
              <FileSelection
                component="finaltaxFile"
                leadStatusId={leadData.lead_status}
                leadData={leadData}
              />
              <FileSelection
                component="finalofftaxFile"
                leadStatusId={leadData.lead_status}
                leadData={leadData}
              />

              <Comments comments={comments} leadId={leadData?.lead_id} />
              <CommentBox
                leadStatusId={leadData.lead_status}
                leadId={leadData?.lead_id}
              />
              <ReopenLead
                isChecked={checkedReopenLead}
                toggleReopenLeadCheckbox={toggleReopenLeadCheckbox}
              />
            </>
          )}
        </div>
        <Tabs defaultActiveKey={"1"} items={tabItems} />
      </div>
    </div>
  );
};

export default User;
