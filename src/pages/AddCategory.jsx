import React from 'react'
import { Link, useNavigate } from 'react-router';
import { baseURL } from '../../config';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Button, Form, Input, Upload, Select } from 'antd';

const { Option } = Select;


import { InboxOutlined, UploadOutlined } from '@ant-design/icons';


const AddCategory = () => {
    const navigate = useNavigate()

    const onFinish = async (values) => {

        const formData = new FormData()

        if (values.media && values.media.fileList?.[0]?.originFileObj) {
            formData.append("media", values.media.fileList?.[0]?.originFileObj)
        }
        else {
            toast.error("please upload Profile Picture")
            return
        }

        formData.append("cName", values.cName)
        formData.append("description", values.description)

        axios.post(`${baseURL}/category/add`, formData)
            .then((res) => {
                {
                    toast.success(res.data.msg);
                    navigate("/category/view");
                }
            })
            .catch((err) => {
                console.log(err.message);
                toast.error(err.message)
            })
    };
    return (
        <>
            <div className='signup h-[auto]  flex justify-center items-center my-5 py-5 '>
                <div className=' py-5 lg:py-[10px] h-[auto]  lg:px-[40px] px-[20px] shadow-2xl rounded-2xl flex flex-col justify-center items-center border-t-4 border-[#F25F4F]'>
                    <h1 className='text-2xl font-bold pb-5 '>Add Category</h1>
                    <Form
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
                            valuePropName="file"
                            getValueFromEvent={(e) => e?.fileList?.[0] ? e : null}
                            rules={[{ required: true, message: "Please upload a category image or video" }]}
                        >
                            <Upload
                                beforeUpload={() => false}
                                accept="image/*,video/*"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image or Video</Button>
                            </Upload>
                        </Form.Item>
                        {/* Submit */}
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button type="primary" htmlType="submit" className="w-full">
                                Add Category
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default AddCategory
