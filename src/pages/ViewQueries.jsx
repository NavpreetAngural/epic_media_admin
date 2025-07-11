import React, { useState, useEffect } from 'react';
import { Form, Modal, Table, Input, Button, DatePicker, Select } from 'antd';
import axios from 'axios';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Option } = Select;

const ViewQueries = () => {
  const [queries, setQueries] = useState([]);

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${baseURL}/contact/viewall`);
      setQueries(res.data.data);
    } catch (err) {
      console.error("Error fetching Queries:", err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/contact/delete/${id}`);
      setQueries(prev => prev.filter(item => item._id !== id));
      toast.success("Queries deleted successfully");
    } catch (error) {
      toast.error("Queries deletion failed");
      console.error("Error while deleting Queries:", error);
    }
  };

  const columns = [
    {
      title: 'Sr No.',
      key: 'srNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'fullName',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'service',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>

          <span
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </span>
        </>
      ),
    },
  ];

  return (
    <>

      <div style={{ overflowX: 'auto' }}>
        <Table
          className='m-5'
          columns={columns}
          dataSource={queries}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ViewQueries;
