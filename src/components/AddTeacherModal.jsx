import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Table,
  Space, // Space was imported but not used, so I'll keep it but note it.
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { teacherPositionService } from "../services/teacherPositionService";

const { Option } = Select;

const AddTeacherModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [educationForm] = Form.useForm();
  const [educationModalVisible, setEducationModalVisible] = useState(false);
  const [educationRecords, setEducationRecords] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false); // More descriptive name

  // Fetches teacher positions from the service
  const fetchPositions = async () => {
    setLoadingPositions(true);
    try {
      const response = await teacherPositionService.getAllPositions();
      // Ensure response.data is an array or default to an empty array
      const data = Array.isArray(response.data) ? response.data : [];
      setPositions(data);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      // Optionally show a notification to the user about the error
      setPositions([]); // Clear positions on error
    } finally {
      setLoadingPositions(false);
    }
  };

  // Fetch positions on component mount
  useEffect(() => {
    if (visible) {
      // Only fetch when modal becomes visible
      fetchPositions();
    }
  }, [visible]); // Re-fetch if modal visibility changes (e.g., if it's closed and reopened)

  // Normalizes file list for Ant Design Upload
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList; // Use optional chaining for safety
  };

  // Handles adding an education record to the table
  const handleAddEducation = () => {
    educationForm
      .validateFields()
      .then((values) => {
        const newRecord = {
          key: Date.now(), // Unique key for Ant Design Table
          ...values,
          graduated: values.graduated.format("DD/MM/YYYY"), // Format date for display
        };
        setEducationRecords((prevRecords) => [...prevRecords, newRecord]);
        educationForm.resetFields();
        setEducationModalVisible(false);
      })
      .catch((info) => {
        console.error("Education form validation failed:", info);
      });
  };

  // Handles deleting an education record from the table
  const handleDeleteEducation = (key) => {
    setEducationRecords((prevRecords) =>
      prevRecords.filter((record) => record.key !== key),
    );
  };

  // Handles the main form submission
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Prepare data for submission, including education records
        const submitData = {
          ...values,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : undefined, // Format date for backend
          image:
            values.image && values.image.length > 0
              ? values.image[0].originFileObj
              : null, // Get raw file object
          degrees: educationRecords, // Attach education records
          teacherPositionsId: [values.position],
        };
        console.log("Submitting teacher data:", submitData);
        onOk(submitData); // Pass the prepared data to the onOk prop
        form.resetFields(); // Reset main form fields after successful submission
        setEducationRecords([]); // Clear education records as well
      })
      .catch((info) => {
        console.error("Main form validation failed:", info);
      });
  };

  // Columns for the education records table
  const educationColumns = [
    {
      title: "Bậc",
      dataIndex: "type",
      key: "type",
      align: "center", // Center align content
    },
    {
      title: "Trường",
      dataIndex: "school",
      key: "school",
      align: "center",
    },
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Ngày tốt nghiệp",
      dataIndex: "graduated",
      key: "graduated",
      align: "center",
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteEducation(record.key)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <span className="text-xl font-semibold text-gray-800">
            Tạo thông tin giáo viên
          </span>
        }
        open={visible} // Use 'open' instead of 'visible' for Ant Design v5+
        onCancel={onCancel}
        width={1200}
        className="teacher-modal"
        footer={[
          <Button key="cancel" onClick={onCancel} className="px-6">
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleFormSubmit}
            icon={<SaveOutlined />}
            className="px-6 bg-purple-600 hover:bg-purple-700" // Tailwind classes
          >
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="teacher_form"
          initialValues={{ status: "Đang công tác" }}
          className="p-4"
        >
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="col-span-1 flex flex-col items-center bg-gray-50 p-6 rounded-lg">
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false} // Prevent automatic upload
                  style={{ width: "300px", height: "300px" }}
                >
                  {form.getFieldValue("image") &&
                  form.getFieldValue("image").length > 0 ? (
                    <img
                      src={URL.createObjectURL(
                        form.getFieldValue("image")[0].originFileObj,
                      )}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg w-full h-full text-center hover:border-purple-400 transition-colors">
                      <UploadOutlined className="text-5xl text-purple-400" />
                      <div className="text-lg text-gray-600 mt-4 font-medium">
                        Tải ảnh lên
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Chọn ảnh đại diện
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              {form.getFieldValue("image") &&
                form.getFieldValue("image").length > 0 && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => form.setFieldsValue({ image: null })}
                    className="mt-4 text-red-500 hover:text-red-600"
                  >
                    Xóa ảnh
                  </Button>
                )}
            </div>
            <div className="col-span-2">
              <div className="w-full mb-6">
                <div className="flex items-center justify-end gap-2">
                  <div className="border-t-2 border-gray-200 flex-grow"></div>{" "}
                  {/* flex-grow for better centering */}
                  <h3 className="text-xl font-semibold text-gray-800 px-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="flex-grow border-t-2 border-gray-200"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 !mt-5">
                <Form.Item
                  name="name"
                  label={
                    <span className="text-gray-700 font-medium">Họ và tên</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input
                    placeholder="VD: Nguyễn Văn A"
                    className="rounded-md"
                  />
                </Form.Item>
                <Form.Item
                  name="dob"
                  label={
                    <span className="text-gray-700 font-medium">Ngày sinh</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    className="rounded-md"
                  />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label={
                    <span className="text-gray-700 font-medium">
                      Số điện thoại
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    }, // Basic phone number validation
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    className="rounded-md"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={
                    <span className="text-gray-700 font-medium">Email</span>
                  }
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Vui lòng nhập email hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    placeholder="example@school.edu.vn"
                    className="rounded-md"
                  />
                </Form.Item>
                <Form.Item
                  name="identity"
                  label={
                    <span className="text-gray-700 font-medium">Số CCCD</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập số CCCD!" },
                  ]}
                >
                  <Input placeholder="Nhập số CCCD" className="rounded-md" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label={
                    <span className="text-gray-700 font-medium">Địa chỉ</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" },
                  ]}
                >
                  <Input
                    placeholder="Địa chỉ thường trú"
                    className="rounded-md"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="flex items-center gap-2">
              <div className="border-t-2 border-gray-200 w-15 flex-grow"></div>
              <h3 className="text-xl font-semibold text-gray-800 px-4">
                Thông tin công tác
              </h3>
              <div className="flex-grow border-t-2 border-gray-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 !mt-5">
            <Form.Item
              name="position"
              label={
                <span className="text-gray-700 font-medium">
                  Vị trí công tác
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng chọn vị trí công tác!" },
              ]}
            >
              <Select
                placeholder="Chọn các vị trí công tác"
                className="rounded-md"
                loading={loadingPositions} // Use the specific loading state
              >
                {positions.map((position) => (
                  <Option key={position._id} value={position._id}>
                    {position.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="w-full mb-6">
            <div className="flex items-center gap-2">
              <div className="border-t-2 border-gray-200 w-28 flex-grow"></div>
              <h3 className="text-xl font-semibold text-gray-800 px-4">
                Học vị
              </h3>
              <div className="flex-grow border-t-2 border-gray-200"></div>
            </div>
          </div>
          <div className="!mt-5">
            <div className="flex justify-end mb-4">
              {" "}
              {/* Added mb-4 for spacing */}
              <Button
                onClick={() => setEducationModalVisible(true)}
                className="border-gray-200 text-purple-600 hover:text-purple-700 hover:border-purple-400"
                icon={<PlusOutlined />}
              >
                Thêm học vị
              </Button>
            </div>

            <Table
              columns={educationColumns}
              dataSource={educationRecords}
              pagination={false}
              locale={{
                emptyText: "Chưa có dữ liệu học vị", // More specific empty text
              }}
              className="rounded-lg overflow-hidden !mt-2 !mb-8"
            />
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <span className="text-lg font-semibold text-gray-800">
            Thêm học vị
          </span>
        }
        open={educationModalVisible}
        onOk={handleAddEducation}
        onCancel={() => {
          setEducationModalVisible(false);
          // educationForm.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form
          form={educationForm}
          layout="vertical"
          name="education_form"
          preserve={false}
        >
          <Form.Item
            name="type"
            label="Bậc"
            rules={[{ required: true, message: "Vui lòng chọn bậc học!" }]}
          >
            <Select placeholder="Chọn bậc học">
              <Option value="Cử nhân">Cử nhân</Option>
              <Option value="Thạc sĩ">Thạc sĩ</Option>
              <Option value="Tiến sĩ">Tiến sĩ</Option>
              <Option value="Phó Giáo sư">Phó Giáo sư</Option>
              <Option value="Giáo sư">Giáo sư</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="school"
            label="Trường"
            rules={[{ required: true, message: "Vui lòng nhập tên trường!" }]}
          >
            <Input placeholder="Nhập tên trường" />
          </Form.Item>
          <Form.Item
            name="major"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Vui lòng nhập chuyên ngành!" }]}
          >
            <Input placeholder="Nhập chuyên ngành" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Đã tốt nghiệp">Đã tốt nghiệp</Option>
              <Option value="Đang học">Đang học</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="graduated"
            label="Ngày tốt nghiệp"
            rules={[
              { required: true, message: "Vui lòng chọn ngày tốt nghiệp!" },
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddTeacherModal;
