import React, { useState, useEffect } from 'react';
import { Form, Modal, Table, Input, Button, DatePicker, Select } from 'antd';
import axiosInstance from '../../instance';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';

const { Option } = Select;

const ViewIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  

  const fetchIdeas = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/story/viewall`);
      setIdeas(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/story/delete/${id}`);
      setIdeas(prev => prev.filter(item => item._id !== id));
      toast.success("Idea deleted successfully");
    } catch (error) {
      toast.error("Idea deletion failed");
      console.error("Error while deleting Idea:", error);
    }
  };

  const columns = [
    {
      title: 'Sr No.',
      key: 'srNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'service',
    },
    {
      title: 'Phone No.',
      dataIndex: 'phone',
      key: 'date',
    },
    {
      title: 'Idea',
      dataIndex: 'idea',
      key: 'location',
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
            <Trash2 color="#000000" strokeWidth={1.5} />
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
          dataSource={ideas}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ViewIdeas;
