import React, { createContext, useContext, useState } from "react";

const TeacherContext = createContext();

const dummyTeachers = [
  {
    id: "0798333082",
    name: "Phạm Đức Trung",
    email: "phductrung@school.edu.vn",
    phone: "07854933433",
    degree: "Bậc: Thạc sĩ",
    major: "Chuyên ngành: Y Đa Khoa",
    department: "N/A",
    workplace: "Cán Bộ Y Tế",
    address: "Hà nội",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "1031019996",
    name: "Nguyễn Minh Trung",
    email: "minhtrung@school.edu.vn",
    phone: "07756367450",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Kỹ Thuật Xây Dựng",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Thanh Hóa",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "2246882558",
    name: "Trần Thiên Kim",
    email: "thienkim@school.edu.vn",
    phone: "08756367449",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Tiếng Anh",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Quảng Bình",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "2621511601",
    name: "Hoàng Nam",
    email: "hoangnam@school.edu.vn",
    phone: "09756367448",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Y Học Cổ Truyền",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Sơn La",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "3781215661",
    name: "Phạm Thùy Dương",
    email: "thuyduong@school.edu.vn",
    phone: "07756367447",
    degree: "Bậc: Thạc sĩ",
    major: "Chuyên ngành: Kế Toán",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Hà Nam",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "4215858843",
    name: "Nguyễn Minh Tuấn",
    email: "minhtuan@school.edu.vn",
    phone: "09756367446",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Toán Học",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Ninh Bình",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "1864716387",
    name: "Trần Anh Thư",
    email: "anhthu@school.edu.vn",
    phone: "09756367445",
    degree: "Bậc: Thạc sĩ",
    major: "Chuyên ngành: Khoa Học Môi Trường",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Đồng Nai",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "3664683813",
    name: "Nguyễn Hoàng Minh",
    email: "hoangminh@school.edu.vn",
    phone: "09756367443",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Công Nghệ Thông Tin",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Bình Dương",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "0399962044",
    name: "Lê Khánh Linh",
    email: "khanhlinh@school.edu.vn",
    phone: "08756367444",
    degree: "Bậc: Thạc sĩ",
    major: "Chuyên ngành: Du Lịch",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Lâm Đồng",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: "1952101718",
    name: "Lê Thanh",
    email: "lethang@school.edu.vn",
    phone: "08756367442",
    degree: "Bậc: Cử nhân",
    major: "Chuyên ngành: Khoa Học Cây Trồng",
    department: "N/A",
    workplace: "Giáo viên bộ môn",
    address: "Bắc Giang",
    status: "Đang công tác",
    avatar: "https://via.placeholder.com/40",
  },
];

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState(dummyTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.includes(searchTerm) ||
      teacher.id.includes(searchTerm),
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const totalTeachers = filteredTeachers.length;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleReload = () => {
    setTeachers(dummyTeachers); // Reset to original dummy data
    setSearchTerm("");
    setCurrentPage(1);
    setPageSize(10);
  };

  const handleCreateNew = () => {
    console.log("Creating new teacher...");
    // Implement actual creation logic
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <TeacherContext.Provider
      value={{
        teachers: paginatedTeachers,
        totalTeachers,
        searchTerm,
        handleSearchChange,
        handleSearch: () => {},
        handleReload,
        handleCreateNew,
        currentPage,
        pageSize,
        handlePageChange,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacherContext = () => useContext(TeacherContext);
