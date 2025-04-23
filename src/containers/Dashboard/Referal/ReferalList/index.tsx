import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { gutterBlobal } from "../../../User/constants";
import GenerateElements from "../../../../components/GenerateElements";
import { useDispatch } from "react-redux";
import { createReferal } from "../../../../store/actions/creators";
import localStorageContent from "../../../../utils/localstorage";
import axiosInstance from "../../../../utils/environment";
import moment from "moment";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

interface Data {
  name: String;
  email: String;
  phone: Number;
  created_at: String;
}

function ReferalList({ toggleModal }: any) {
  const [referalData, setReferalData] = useState([]);
  const LoadReferalList = async () => {
    try {
      const response: any = await axiosInstance.get(`/referral`);
      setReferalData(response?.data?.data);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    LoadReferalList();
  }, []);

  interface DataType {
    name: string;
    email: number;
    phone: string;
    created_dt: string;
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    // {
    //   title: "Date",
    //   key: "created_dt",
    //   dataIndex: "created_dt",
    //   render: (_, record) => moment(record["created_dt"]).format("YYYY-MM-DD"),
    // },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Table columns={columns} dataSource={referalData} />
    </div>
  );
}

export default ReferalList;
