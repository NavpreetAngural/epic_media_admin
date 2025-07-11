import React, { useState, useEffect } from 'react';
import { Table, Select } from 'antd';
import axios from 'axios';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';

const { Option } = Select;

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${baseURL}/booking/viewall`);
      setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (value, record) => {
    try {
      const res = await axios.put(`${baseURL}/booking/update/${record._id}`, {
        status: value
      });

      if (res.status === 200) {
        setBookings(prev =>
          prev.map(item =>
            item._id === record._id ? { ...item, status: value } : item
          )
        );
        toast.success(`Booking ${value} successfully & email sent`);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
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
      key: 'email',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record)}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="accepted">Accepted</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      )
    }

  ];

  return (
    <>

      <div style={{ overflowX: 'auto' }}>
        <Table
          className='m-5'
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ViewBookings;
