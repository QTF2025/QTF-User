import React, { useEffect, useState } from "react";
import localStorageContent from "../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Table } from "antd";
import { setError } from "../../../store/reducers";
import axiosInstance from "../../../utils/environment/index";
import "./styles.scss";
import { getLeadStatus } from "../../../utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import ReopenLead from "../ReopenLead";
import { IInitialState } from "../../../store/reducers/models";

function TaxesList() {
  const [taxesList, setTaxesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadId, setLeadId] = useState(Number);
  const [showTaxList, setShowTaxList] = useState(true);
  const [leadStatusId, setLeadStatusId] = useState<string>("");
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { leadData, comments }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkedReopenLead, setCheckedReOpenLead] = useState<boolean>(false);
  const toggleReopenLeadCheckbox = (_boolean: boolean, id=Number) => {
    setLeadId(id)
    setCheckedReOpenLead(!checkedReopenLead);
    console.log('veeru', id)  
  };
  const columns: any = [
    {
      title: "Tax Year",
      dataIndex: "itr_year",
      key: "itr_year",
    },
    {
      title: "Lead Id",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/user?lead_id=${leadId}`);
          }}
        >
          Lead #{leadId}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "updated_dt",
      key: "updated_dt",
      render: (date: any) => (date ? moment(date).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Status",
      dataIndex: "lead_status",
      key: "lead_status",
      render: (leadStatus: any) => getLeadStatus(leadStatus),
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",

        render: (rowItem:any, row:any) => (
          <div className="dashboard__header--reopen">
            {row.lead_status === "7" && (
              <>
              <p style={{fontSize:'small', padding:0}}>{row.reopen_request === "1" ? 'Re-Open Processing':<Checkbox
                  checked={checkedReopenLead}
                  onChange={(e) => toggleReopenLeadCheckbox(true, row.lead_id)}
                >Re-Open</Checkbox>    }</p>
              </>
            )}
          </div>
        ),
      },
  ];

  const fetchTaxesList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/leads`);
      const data = response.data;
      const taxyears = data.data.map((item:any) => {
        return item.itr_year
      })
      sessionStorage.setItem('taxyears', JSON.stringify(Object.values(taxyears)))
      const datas = data.data.filter((item:any) => item.lead_status > 2)
      if(datas.length > 0) {
        sessionStorage.setItem('newappleadid', datas[0].lead_id)
      }
      if (data && response?.data?.data?.length > 0) {
        setTaxesList(response?.data?.data);
      } else {
        setShowTaxList(false);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  useEffect(() => {
    if (localStoreData && localStoreData?.leadId) {
      fetchTaxesList();
    }
  }, []);

  useEffect(() => {
    if (leadData && localStoreData) {
      const { lead_status } = leadData;
      if (lead_status) {
        setLeadStatusId(lead_status);
      } else {
        setLeadStatusId("-1");
      }
    }
  }, [leadData]);

  if (!showTaxList) {
    return <></>;
  }

  return (
    <div className="taxListTable">
      <p>Recent Tax Claims</p>
      <hr />
      <Table
        pagination={false}
        columns={columns}
        dataSource={taxesList}
        loading={isLoading}
      />
      <ReopenLead
        isChecked={checkedReopenLead}
        leadId={leadId}  // Use row.lead_id here
        toggleReopenLeadCheckbox={toggleReopenLeadCheckbox}
      />
    </div>
  );
}

export default TaxesList;
