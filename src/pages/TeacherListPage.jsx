import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Avatar,
  Layout,
  Pagination,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AddTeacherModal from "../components/AddTeacherModal";
import { teacherService } from "../services/teacherService";

const { Header, Content, Footer } = Layout;

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAllTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách giáo viên");
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    Object.values(teacher).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleReload = () => {
    fetchTeachers();
    setSearchTerm("");
    setCurrentPage(1);
    setPageSize(10);
  };

  const handleCreateNew = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      setLoading(true);
      await teacherService.createTeacher(values);
      message.success("Thêm giáo viên mới thành công");
      fetchTeachers(); // Refresh the list
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Không thể thêm giáo viên mới ${error.message}`);
      console.error("Error creating teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (_, record) => (
        <div className="flex justify-center">
          <div>{record.code}</div>
        </div>
      ),
    },
    {
      title: "Giáo viên",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={48} src={record.image} shape="circle" />
          <div>
            <div className="font-semibold text-base text-gray-800">
              {record.name}
            </div>
            <div className="text-sm">{record.phoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Trình độ (cao nhất)",
      key: "degree",
      render: (_, record) => (
        <div>
          <div className="font-medium">
            Bậc:{" "}
            {record.degrees && record.degrees.length > 0
              ? record.degrees[0].type
              : "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            Chuyên ngành:{" "}
            {record.degrees && record.degrees.length > 0
              ? record.degrees[0].major
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Bộ môn",
      dataIndex: "subject",
      key: "subject",
      render: (_, record) => (
        <div className="flex justify-center">
          <div className="text-gray-400 italic">{record.subject || "N/A"}</div>
        </div>
      ),
    },
    {
      title: (
        <div>
          TT Công tác (<a href="./teacher-positions">Xem Danh Sách Vị Trí</a>)
        </div>
      ),
      dataIndex: "position",
      key: "position",
      render: (_, record) => (
        <div className="flex justify-center">
          <div className="">
            {record.positions && record.positions.length > 0
              ? record.positions[0].name
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, record) => (
        <div className="flex justify-center">
          <div className="">{record.address}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tag className="!p-1 !rounded-md !text-sm !font-semibold !bg-green-500 !text-white !shadow-md">
            {record.isActive ? "Đang hoạt động" : "Đã bị ngừng hoạt động"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <div className="flex justify-center">
          {" "}
          <Button
            type="default" // This provides the default border
            icon={<EyeOutlined />}
            className="shadow-md hover:shadow-lg duration-300"
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header className="bg-white shadow-sm flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm thông tin"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReload}
            className="flex items-center text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-800"
          >
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            className="flex items-center bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
          >
            Tạo mới
          </Button>
        </div>
      </Header>
      <Content className="p-6">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={paginatedTeachers}
            rowKey="id"
            pagination={false}
            className="shadow-md rounded-lg overflow-hidden"
            headerClassName="bg-purple-50"
            locale={{
              emptyText: "Không có dữ liệu",
            }}
          />
        </Spin>
      </Content>
      <AddTeacherModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
      <Footer className="text-center bg-white shadow-sm mt-4 p-4 flex justify-end items-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredTeachers.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total) => `Tổng: ${total}`}
        />
      </Footer>
    </Layout>
  );
};

export default TeacherListPage;
