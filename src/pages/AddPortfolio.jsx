import React from 'react'
import { Button, Checkbox, DatePicker, Form, Input, Select, Upload } from 'antd';
import { Link, useNavigate } from 'react-router';
// import { baseURL } from '../../config';
import axiosInstance from '../../instance';
import { toast } from 'react-toastify';
import { baseURL } from "../../config";

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

const AddPortfolio = () => {
    const navigate = useNavigate()

    const onFinish = async (values) => {
        const formData = new FormData();

        // ✅ image is already an array
        if (values.image && values.image[0]?.originFileObj) {
            formData.append("image", values.image[0].originFileObj); // ✅ correct
        } else {
            toast.error("Please upload Portfolio Image");
            return;
        }

        formData.append("orientation", values.orientation);

        try {
            const res = await axiosInstance.post(`${baseURL}/portfolio/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(res.data.msg);
            navigate("/portfolio/view");
        } catch (err) {
            console.log(err.response?.data || err);
            toast.error("Upload failed");
        }
    };

const { Option } = Select;

return (
    <>
        <div className='signup h-[auto]  flex justify-center items-center my-5 py-5 '>
            <div className=' py-5 lg:py-[10px] h-[auto]  lg:px-[40px] px-[20px] shadow-2xl rounded-2xl flex flex-col justify-center items-center border-t-4 border-[#F25F4F]'>
                <h1 className='text-2xl font-bold py-3 '>Add Portfolio</h1>
                <Form
                    className=' w-full '
                    name="basic"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label=" Portfolio Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                        rules={[{ required: true, message: "Please upload Portfolio Picture " }]}
                    >
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Orientation"
                        name="orientation"
                        rules={[{ required: true, message: 'Please select a Orientation Type!' }]}
                    >
                        <Select placeholder="Select Orientation Type">
                            <Option value="landscape">Landscape</Option>
                            <Option value="portrait">Portrait</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label={null} wrapperCol={{ span: 24 }} >
                        <Button type="primary" htmlType="submit" className='w-full'>
                            Add Portfolio
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </>
)
}

export default AddPortfolio
