import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import studentData from '../data/StudentData.json';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(students.length / recordsPerPage);

  useEffect(() => {
    setStudents(studentData);
  }, []);

  const handleDownloadExcel = () => {
    if (students.length === 0) {
      toast.error("No student data to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(students.map((student, index) => ({
      "S.No": index + 1,
      "Name": student.name,
      "Roll No": student.rollno,
      "Age Group": student.age,
      "Anganwadi Centre": student.awcentre,
      "Assessment Submitted": student.assessmentId ? '✔️' : '❌'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentData");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'StudentData.xlsx');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = students.slice(startIndex, startIndex + recordsPerPage);

  return (
    <section className="dashboard page">
      <div className="banner">
        <h1>
          Student Data
          <button onClick={handleDownloadExcel} className="download-btn">Download Excel</button>
        </h1>
        
        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Age Group</th>
              <th>Anganwadi Centre</th>
              <th>Assessment Submitted</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((student, index) => (
                <tr key={index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.rollno}</td>
                  <td>{student.age}</td>
                  <td>{student.awcentre}</td>
                  <td>{student.assessmentId ? '✔️' : '❌'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No Student Records Found!</td></tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Student;