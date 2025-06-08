import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Dropdown,
  Menu,
  Input,
  Layout,
  message,
  Spin,
} from "antd";
import {
  SettingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddPositionModal from "../components/AddPositionModal";
import { teacherPositionService } from "../services/teacherPositionService";

const { Header, Content } = Layout;

const TeacherPositions = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await teacherPositionService.getAllPositions();
      // Ensure we have an array of data
      const data = Array.isArray(response) ? response : response.data || [];
      setPositions(data);
    } catch (error) {
      message.error("Không thể tải danh sách vị trí");
      console.error("Error fetching positions:", error);
      setPositions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReload = () => {
    fetchPositions();
    setSearchTerm("");
  };

  const handleCreateNew = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalOk = async (values) => {
    try {
      setLoading(true);
      const newPosition = {
        ...values,
      };
      await teacherPositionService.createPosition(newPosition);
      message.success("Thêm vị trí mới thành công");
      fetchPositions(); // Refresh the list
      setIsModalVisible(false);
    } catch (error) {
      message.error("Không thể thêm vị trí mới");
      console.error("Error creating position:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await teacherPositionService.deletePosition(record.id);
      message.success("Xóa vị trí thành công");
      fetchPositions(); // Refresh the list
    } catch (error) {
      message.error("Không thể xóa vị trí");
      console.error("Error deleting position:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => (
        <div className="flex justify-center">
          <div>{index + 1}</div>
        </div>
      ),
    },
    {
      title: "Mã",
      dataIndex: "Code",
      key: "Code",
      render: (_, record) => (
        <div className="flex justify-center">
          <div>{record.code}</div>
        </div>
      ),
    },
    { title: "Tên", dataIndex: "name", key: "Name" },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tag className="!p-1 !rounded-md !text-sm !font-semibold !bg-green-500 !text-white !shadow-md">
            {record.isActive ? "Đang hoạt động" : "Đã bị ngừng hoạt động"}
          </Tag>
        </div>
      ),
      filters: [
        { text: "Hoạt động", value: "Hoạt động" },
        { text: "Không hoạt động", value: "Không hoạt động" },
      ],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
    },
    { title: "Mô tả", dataIndex: "des", key: "Description" },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <div className="flex justify-center">
          <Space size="middle">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "edit",
                    label: "Chỉnh sửa",
                    onClick: () => console.log("Chỉnh sửa", record),
                  },
                  {
                    key: "delete",
                    label: "Xóa",
                    onClick: () => handleDelete(record),
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm thông tin"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
          <Button
            icon={<ReloadOutlined />}
            className="flex items-center text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-800"
            onClick={handleReload}
          >
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="flex items-center bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            onClick={handleCreateNew}
          >
            Tạo mới
          </Button>
        </div>
      </Header>
      <Content className="p-6">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={positions}
            rowKey="_id"
            className="shadow-md rounded-lg overflow-hidden"
            locale={{
              emptyText: "Không có dữ liệu",
            }}
            pagination={false}
          />
        </Spin>
      </Content>
      <AddPositionModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      />
    </Layout>
  );
};

export default TeacherPositions;
