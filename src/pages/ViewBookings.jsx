import React, { useState, useEffect } from 'react';
import { Table, Select } from 'antd';
import axiosInstance from '../../instance';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';
import { Check, Trash2, X } from 'lucide-react';

const { Option } = Select;

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/booking/viewall`);
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
      const res = await axiosInstance.put(`${baseURL}/booking/update/${record._id}`, {
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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/booking/delete/${id}`)
      setBookings(prev => prev.filter(item => item._id !== id));
      toast.success("Booking deleted successfully");
    }
    catch (err) {
      toast.error("Booking deleted Failed");
    }
  }

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
          <Select.Option value="accepted">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check color="#04ff00" size={16} />
              Accepted
            </span>
          </Select.Option>
          <Select.Option value="rejected">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <X color="#ff0000" size={16} />
              Rejected
            </span>
          </Select.Option>
        </Select>
      )
    },
    {
      title: 'Delete',
      key: 'delete',
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
