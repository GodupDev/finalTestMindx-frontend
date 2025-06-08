import React from "react";
import { Routes, Route } from "react-router-dom";
import TeacherListPage from "./pages/TeacherListPage";
import TeacherPositions from "./pages/TeacherPositions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherListPage />} />
      <Route path="/teacher-positions" element={<TeacherPositions />} />
      {/* Add other routes here if needed */}
    </Routes>
  );
}

export default App;
