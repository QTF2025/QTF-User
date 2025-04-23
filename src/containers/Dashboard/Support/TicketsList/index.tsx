import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/environment";
import { categoryList, priorityList } from '../CreateTicket/constants'
import moment from "moment";

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
      const response: any = await axiosInstance.get(`/tickets`);
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
      title: "Date",
      dataIndex: "created_dt",
      key: "created_dt",
      render: (text) => (
        <span>
          {new Date(text).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use `false` for 24-hour format
    timeZone: 'UTC', // Adjust this if you want to use a specific time zone
  })}
        </span>
      ),
    }
    ,
    {
      title: "Subject",
      dataIndex: "subject",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <a>{categoryList.filter((item) => item.value === text)[0].label}</a>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (text) => <a>{priorityList.filter((item) => item.value === text)[0].label}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
