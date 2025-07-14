import React, { useState, useEffect } from 'react';
import { Form, Modal, Table, Input, Button, DatePicker, Select, Upload } from 'antd';
import axiosInstance from '../../instance';
import { baseURL } from "../../config";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Pencil, Trash2 } from 'lucide-react';

const { Option } = Select;

const ViewCategory = () => {
  const [category, setCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);



  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}/category/view`);
      setCategory(res.data.data);
    } catch (err) {
      console.error("Error fetching Category:", err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/category/delete/${id}`);
      setCategory(prev => prev.filter(item => item._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Category deletion failed");
      console.error("Error while deleting Category:", error);
    }
  };

  const handleEdit = (record) => {
    setIsModalOpen(true);
    setEditingUserId(record._id);

    form.setFieldsValue({
      cName: record.cName,
      description: record.description,
      orientation: record.orientation,
    });

    // Set fileList separately
    if (record.media) {
      setFileList([
        {
          uid: '-1',
          name: record.media,
          status: 'done',
          url: record.url,
        },
      ]);
    } else {
      setFileList([]);
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingUserId(null);
  };
  const onFinish = async (values) => {
    const formData = new FormData();

    formData.append('cName', values.cName);
    formData.append('description', values.description);
    formData.append('orientation', values.orientation); // ✅ ADD THIS LINE

    if (values.media && values.media.file && values.media.file.originFileObj) {
      formData.append('media', values.media.file.originFileObj);
    }

    try {
      await axiosInstance.put(`${baseURL}/category/update/${editingUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Category updated successfully');
      handleCancel();
      fetchCategory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };



  const columns = [
    {
      title: 'Sr No.',
      key: 'srNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Caregory Name',
      dataIndex: 'cName',
      key: 'cName',
    },
    {
      title: 'Orientation',
      dataIndex: 'orientation',
      key: 'orientation',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Media',
      dataIndex: 'url',
      className: 'w-1/4',
      key: 'url',
      render: (url) => {
        if (!url) return 'N/A';

        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

        return (
          <>
            {isImage && (
              <img
                src={url}
                alt="Media"
                style={{ width: 200, height: 100, borderRadius: 8, objectFit: 'cover' }}
              />
            )}
            {isVideo && (
              <video
                src={url}
                controls
                style={{ width: 200, height: 100, borderRadius: 8, objectFit: 'cover' }}
              />
            )}
            {!isImage && !isVideo && 'Unsupported format'}
          </>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <div className='flex gap-2'>
            <span
              style={{ color: 'blue', cursor: 'pointer', marginRight: 10 }}
              onClick={() => handleEdit(record)}
            >
              <Pencil color="#000000" strokeWidth={1.5} />
            </span><br />
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => handleDelete(record._id)}
            >
              <Trash2 color="#000000" strokeWidth={1.5} />
            </span>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        title='Edit Booking'
        width={500}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addCategory"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Category Name */}
          <Form.Item
            label="Category Name"
            name="cName"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a category">
              <Option value="Travel">Travel</Option>
              <Option value="Pre Wedding">Pre Wedding</Option>
              <Option value="Behind The Scene">Behind The Scene</Option>
              <Option value="Short Movies">Short Movies</Option>
              <Option value="Songs">Songs</Option>
              <Option value="Spiritual Captures">Spiritual Captures</Option>
              <Option value="Public Places">Public Places</Option>
            </Select>
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description!' }]}
          >
            <Input placeholder="Enter category description" />
          </Form.Item>

          {/* Category Image */}
          <Form.Item
            label="Category Media"
            name="media"
            rules={[{ message: "Please upload a category image or video" }]}
          >
            <Upload
              beforeUpload={() => false}
              accept="image/*,video/*"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Image or Video</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Orientation"
            name="orientation"
            rules={[{ required: true, message: 'Please select Orientation!' }]}
          >
            <Select placeholder="Select Orientation">
              <Option value="portrait">Portrait</Option>
              <Option value="landscape">Landscape</Option>

            </Select>
          </Form.Item>


          {/* Submit */}
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ overflowX: 'auto' }}>
        <Table
          className='m-5'
          columns={columns}
          dataSource={category}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ViewCategory;
