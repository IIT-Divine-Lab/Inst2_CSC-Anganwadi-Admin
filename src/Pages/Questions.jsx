import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, setQuestion } from '../redux/actions/actions';
// import questionsData from '../data/QuestionData.json';
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
// import { CiEdit } from "react-icons/ci";
import { MdOutlineCancel, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { apiUrl } from "../adminApiUrl";
import { TbRefresh } from "react-icons/tb";
import Structure1to4 from '../Components/Structure1-4';
import Structure5 from '../Components/Structure5';
import Structure6 from '../Components/Structure6';
import Structure7 from '../Components/Structure7';
import ReactModal from "react-modal";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import Structure8 from "../Components/Structure8";

ReactModal.setAppElement('#root');

const Questions = ({ loggedIn }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions || []);
  const [contentRefresh, setContentRefresh] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(questions.length / recordsPerPage);
  const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);
  const navigate = useNavigate();

  const [modalContent, setModalContent] = useState(null);
  const [deleteModalView, setDeleteModalView] = useState(false);
  const [deleteQuesId, setDeleteQuesId] = useState(undefined);

  useEffect(() => {
    if (!loggedIn)
      navigate("/");
  }, [loggedIn, navigate])

  const handleAddQuestion = () => {
    navigate("./addquestion");
  };

  const openModal = (Component, data, structure) => {
    setModalContent({ component: Component, data, structure });
  };

  const openDeleteModal = (id) => {
    setDeleteQuesId(id);
    setDeleteModalView(true);
  }

  const renderContent = () => {
    if (!modalContent) return null;
    const { component: Component, data, structure } = modalContent;
    console.log(data)
    let props = {
      view: true,
      structure,
      questionText: data.question?.questionText,
      totalOptions: data.question?.totalOptions,
    };
    switch (structure) {
      case 1:
      case 2:
      case 3:
      case 4: props = {
        ...props,
        questionImageBefore: data.question?.questionImage?.before,
        options: data.question?.option,
        questionImageAfter: data.question?.questionImage?.after,
        enabledSound: data.question?.questionSound ? true : false,
        enabledText: data.question?.questionOnlyText || data.question?.questionSoundText ? true : false,
        questionSound: data.question?.questionSound,
        questionOnlyText: data.question?.questionOnlyText,
        questionSoundText: data.question?.questionSoundText,
        correctAnswer: data.question?.correctAnswer
      }
        break;
      case 5: props = {
        ...props,
        options: data.question?.option,
        selected: data.question?.correctAnswer[0].split(",")
      }
        break;
      case 6: props = {
        ...props,
        questionImageAfter: data.question?.questionImage?.after,
        activeOption: data.question?.correctAnswer[0],
        answerImage: data.question?.answerImage,
        active: data.question?.option[0].key === "active" ? data.question.option[0] : data.question?.option[1],
        inactive: data.question?.option[1].key === "inactive" ? data.question.option[1] : data.question?.option[0]
      }
        break;
      case 7: return Structure7;
      case 8:
        props = {
          ...props,
          questionImageAfter: data.question?.questionImage?.after
        }
        break;
      default: console.log("Error");
    }
    return <Component {...props} />;
  };

  const modalStructure = (struct) => {
    switch (struct) {
      case 1:
      case 2:
      case 3:
      case 4: return Structure1to4;
      case 5: return Structure5;
      case 6: return Structure6;
      case 7: return Structure7;
      case 8: return Structure8;
      default: console.log("Error");
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGoToPage = (value) => {
    const pageNum = parseInt(value);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      toast.error("Invalid page number.");
    }
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = questions.slice(startIndex, startIndex + recordsPerPage);

  const fetchQuestions = useCallback(async () => {
    axios.get(apiUrl + "assessment")
      .then(({ data }) => {
        if (data.message !== "No questions found.") {
          dispatch(setQuestion(data?.questions))
          setLoading(false);
          setCurrentPage(1);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setContentRefresh(false);
        setLoading(false);
      })
  }, [dispatch])

  const handleQuestionDelete = (id) => {
    setDeleteModalView(false);
    axios.delete(apiUrl + "assessment/" + id)
      .then(({ data }) => {
        dispatch(deleteQuestion(data?.question))
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // eslint-disable-next-line
  const handleQuestionEdit = (id) => {
    navigate("./editquestion", { state: { id } })
  }

  useEffect(() => {
    if (questions.length === 0) {
      setLoading(true);
      fetchQuestions(); // Load questions data
    }
  }, [fetchQuestions, questions]);

  return (
    <section>
      <div style={{
        width: "400px",
        backgroundColor: "red",
      }}>
        <ReactModal isOpen={!!deleteModalView} style={{
          content: {
            width: "450px",
            height: "300px",
            marginLeft: 0,
            marginRight: 0,
            display: "flex",
            justifySelf: "center",
            alignSelf: "center"
          }
        }} onRequestClose={() => setDeleteModalView(false)}>
          <div style={{ width: "100%", textAlign: "center", justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "100px", color: "var(--danger-red)" }}><MdOutlineCancel /></div>
            <div>Do you really want to delete this record? This process cannot be undone.</div>
            <div style={{ marginTop: "20px" }}>
              <button style={{ backgroundColor: "var(--light-grey)", border: "none", outline: "none", width: "120px", height: "40px", cursor: "pointer", borderRadius: "10px", fontSize: "16px" }} onClick={() => setDeleteModalView(false)}>Cancel</button>
              <button style={{ backgroundColor: "var(--danger-red)", marginLeft: "20px", border: "none", outline: "none", width: "120px", cursor: "pointer", height: "40px", borderRadius: "10px", fontSize: "16px", color: "var(--white)" }} onClick={() => handleQuestionDelete(deleteQuesId)}>Delete</button>
            </div>
          </div>
        </ReactModal>
      </div>
      <div style={{
        width: "800px",
        backgroundColor: "red"
      }}>
        <ReactModal isOpen={!!modalContent} style={{
          content: {
            width: "700px",
            marginLeft: 0,
            marginRight: 0,
            display: "flex",
            justifySelf: "center"
          }
        }} onRequestClose={() => setModalContent(null)}>
          {renderContent()}
        </ReactModal>
      </div>
      <div className="banner">
        <h1>
          Questions Data
          <span style={{ display: "flex", alignItems: "center" }}>
            <span className="refreshBtn" onClick={() => {
              setContentRefresh(true);
              setLoading(true);
              fetchQuestions()
            }}>
              <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
            </span>
            <button onClick={handleAddQuestion} className="actionBtn">Add Questions</button>
          </span>
        </h1>

        <table className="table-container">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Question Text</th>
              <th>Domain</th>
              <th>Category</th>
              <th className="center">Type</th>
              <th className="center">Age Group</th>
              <th className="center">Total Options</th>
              <th className="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ?
                <tr>
                  <td colSpan={8}>
                    <div className="loadingContainer">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </td>
                </tr>
                :
                currentRecords.length > 0 ? (
                  currentRecords.map((data, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td style={{ width: "350px" }}>{data?.question?.questionText}</td>
                      <td>{data?.quesCategory?.categoryName?.split(" kush ")[0]}</td>
                      <td>{data?.quesCategory?.categoryName?.split(" kush ")[1].split(" : ")[0]}</td>
                      <td className="center">{data?.quesCategory?.categoryName?.split(" kush ")[1].split(" : ")[1]}</td>
                      <td className="center">{data?.ageGroup}</td>
                      <td className="center">{data?.question?.totalOptions}</td>
                      <td className="center flex">
                        <IoEyeOutline className="action-icon view" title="View" onClick={() => openModal(modalStructure(data?.question?.structure), data, data?.question?.structure)} />
                        {data.question.structure !== 5 && <FiEdit3 className="action-icon edit" title="Edit" onClick={() => handleQuestionEdit(data?._id)} />}
                        <HiOutlineTrash className="action-icon delete" title="Delete" onClick={() => openDeleteModal(data?._id, data?.question)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No Questions Found!</td>
                  </tr>
                )
            }
          </tbody>
        </table>
        <div className="pagination">
          <div className="paginationSubCont">
            <span className="pageCount">{totalPages ? currentPage : 0} of {totalPages}</span>
            <div className="pagination-top">
              <span>Page </span>
              <select className="pageNavDrop" value={currentPage} name="pages" id="page" onChange={(e) => {
                handleGoToPage(e.target.value)
              }}
              >
                {
                  Array(totalPages).fill(" ").map((_, index) => {
                    return <option key={index} value={index + 1}>{index + 1}</option>
                  })
                }
              </select>
            </div>
            <div className="movementIcons">

              <MdOutlineKeyboardArrowLeft
                className={(!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)) ? 'prev disabled' : 'prev'}
                onClick={
                  () => {
                    if (!(!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)))
                      handlePageChange(currentPage - 1)
                  }
                }
              />
              <MdOutlineKeyboardArrowRight
                className={(!totalPages || currentPage === totalPages) ? 'next disabled' : 'next'}
                onClick={
                  () => {
                    if (!(!totalPages || currentPage === totalPages))
                      handlePageChange(currentPage + 1)
                  }
                }
                disabled={!totalPages || currentPage === totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Questions;