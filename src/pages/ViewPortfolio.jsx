import React, { useState, useEffect } from 'react';
import {
  Form, Modal, Table, Button, Select, Upload
} from 'antd';
import axios from 'axios';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ViewPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Fetch portfolio entries
  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${baseURL}/portfolio/view`);
      setPortfolio(res.data.data);
    } catch (err) {
      console.error('Error fetching Portfolio:', err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Delete portfolio
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/portfolio/delete/${id}`);
      setPortfolio((prev) => prev.filter((item) => item._id !== id));
      toast.success('Portfolio deleted successfully');
    } catch (error) {
      toast.error('Portfolio deletion failed');
      console.error('Error while deleting Portfolio:', error);
    }
  };

  // Edit portfolio
  const handleEdit = (record) => {
    setIsModalOpen(true);
    setEditingUserId(record._id);
    form.setFieldsValue({ orientation: record.orientation });

    setFileList([
      {
        uid: '-1',
        name: record.image,
        status: 'done',
        url: record.url,
      },
    ]);
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    setEditingUserId(null);
  };

  // Submit form
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('orientation', values.orientation);

    // only send new image if uploaded
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      await axios.put(`${baseURL}/portfolio/update/${editingUserId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Portfolio updated successfully');
      setFileList([])
      handleCancel();
      fetchPortfolio();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Sr No.',
      key: 'srNo',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Image',
      className: 'w-1/4',
      dataIndex: 'url',
      key: 'url',
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="Portfolio"
            style={{ width: 200, height: 100, borderRadius: 8, objectFit: 'fit' }}
          />
        ) : (
          'N/A'
        ),
    },
    {
      title: 'Orientation',
      dataIndex: 'orientation',
      key: 'orientation',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <span
            style={{ color: 'blue', cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </span>
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
      <Modal
        title="Edit Portfolio"
        width={500}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          name="editPortfolio"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Portfolio Image"
            name="image"
            rules={[{message: 'Please upload an image!' }]}
          >
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Orientation"
            name="orientation"
            rules={[{ required: true, message: 'Please select orientation!' }]}
          >
            <Select placeholder="Select Orientation Type">
              <Option value="landscape">Landscape</Option>
              <Option value="portrait">Portrait</Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" className="w-full">
              Update Portfolio
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ overflowX: 'auto' }}>
        <Table
          className="m-5"
          columns={columns}
          dataSource={portfolio}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ViewPortfolio;
