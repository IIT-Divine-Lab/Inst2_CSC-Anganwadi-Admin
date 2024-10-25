import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setQuestion } from '../redux/actions/actions';
import questionsData from '../data/QuestionData.json';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import "./Questions.css";

const Questions = () => {
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.questions || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState(1);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(questions.length / recordsPerPage);
    const navigate = useNavigate();

    useEffect(() => {
        if (questions.length === 0) {
            dispatch(setQuestion(questionsData)); // Load questions data
        }
    }, [dispatch, questions]);

    const handleAddQuestion = () => {
        navigate("./AddQuestion");
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
    const currentRecords = questions.slice(startIndex, startIndex + recordsPerPage);

    return (
        <section>
            <div className="banner">
                <h1>Questions Data</h1>
                <button onClick={handleAddQuestion} className="add-question-btn">
                    Add Question
                </button>
                <div className="pagination-top">
                    <span>Go To </span>
                    <input
                        type="number"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && handleGoToPage()}
                    />
                    <button onClick={handleGoToPage}>Go</button>
                </div>

                <table className="table-container">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Question Text</th>
                            <th>Type</th>
                            <th>Total Options</th>
                            <th>Structure</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((question, index) => (
                                <tr key={index}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{question.questionText}</td>
                                    <td>{question.questionType}</td>
                                    <td>{question.totalOptions}</td>
                                    <td>{question.structure}</td>
                                    <td>
                                        <FaEye className="action-icon" title="View" />
                                        <CiEdit className="action-icon" title="Edit" />
                                        <MdDelete className="action-icon" title="Delete" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No Questions Found!</td>
                            </tr>
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

export default Questions;