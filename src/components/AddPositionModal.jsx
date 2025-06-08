import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const AddPositionModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Transform the data to match backend expectations
        const transformedData = {
          code: values.code,
          name: values.name,
          des: values.description,
        };
        onOk(transformedData);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Thêm vị trí mới"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Thêm"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" name="addPositionForm">
        <Form.Item
          name="code"
          label="Mã vị trí"
          rules={[{ required: true, message: "Vui lòng nhập mã vị trí!" }]}
        >
          <Input placeholder="Nhập mã vị trí" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên vị trí"
          rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        >
          <Input placeholder="Nhập tên vị trí" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả vị trí" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPositionModal;
