import React, { useState, useEffect } from 'react';
import {
  Table
} from 'antd';
import axiosInstance from '../../instance';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/auth/viewall`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/auth/delete/${id}`);
      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("User deletion failed");
      console.error("Error while deleting user:", error);
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (phone ? phone : 'N/A'),
    },

    {
      title: 'Profile Picture',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        url ? (
          <img
            src={url}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: '50%' }}
          />
        ) : 'N/A'
      ),
    },

    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (city) => (city ? city : 'N/A'),
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
          dataSource={users}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default Users;
