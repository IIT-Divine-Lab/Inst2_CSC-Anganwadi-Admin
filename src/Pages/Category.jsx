import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import categoryData from '../data/CategoryData.json'; // Assuming this contains the necessary data
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(categories.length / recordsPerPage);

  useEffect(() => {
    setCategories(categoryData); // Load category data
  }, []);

  const handleDownloadExcel = () => {
    if (categories.length === 0) {
      toast.error("No category data to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(categories.map((category, index) => ({
      "S.No": index + 1,
      "Category": category.Category,
      "Total Questions": category.totalQuestions, 
      "Action": category.assessmentId ? '✔️' : '❌'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CategoryData");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'CategoryData.xlsx');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(pageInput); 
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      toast.error("Invalid page number.");
    }
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = categories.slice(startIndex, startIndex + recordsPerPage);

  return (
    <section className="dashboard page">
      <div className="banner">
        <h1>
          Category Data
          <button onClick={handleDownloadExcel} className="download-btn">Add Category</button>
        </h1>

        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Category</th>
              <th>Total Questions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((category, index) => (
                <tr key={index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{category.Category}</td> 
                  <td>{category.totalQuestions}</td> 
                  <td>{category.assessmentId ? <TiTick className="tick" /> : <RxCross2 className="cross"/>}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No Category Records Found!</td></tr>
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
  )}