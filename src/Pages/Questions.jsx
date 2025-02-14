import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, setQuestion } from '../redux/actions/actions';
// import questionsData from '../data/QuestionData.json';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
import { MdDelete, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
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

ReactModal.setAppElement('#root');

const Questions = () => {
   const dispatch = useDispatch();
   const questions = useSelector((state) => state.questions || []);
   const [pageInput, setPageInput] = useState(1);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(questions.length / recordsPerPage);
   const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);
   const navigate = useNavigate();

   const [modalContent, setModalContent] = useState(null);

   const handleAddQuestion = () => {
      navigate("./addquestion");
   };

   const openModal = (Component, data, structure) => {
      setModalContent({ component: Component, data, structure });
   };

   const renderContent = () => {
      if (!modalContent) return null;
      const { component: Component, data, structure } = modalContent;
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
            option: data.question?.option,
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
            selected: data.question?.correctAnswer[0]
         }
            break;
         case 6: props = {
            ...props,
            questionImageAfter: data.question?.questionImage.after,
            activeOption: data.question?.correctAnswer[0],
            answerImage: data.question?.answerImage,
            active: data.question?.option.active,
            inactive: data.question?.option.inactive
         }
            break;
         case 7: return Structure7;
         case 8:
            break;
         default: console.log("Error");
      }
      // console.log(props);
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
         case 8:
            break;
         default: console.log("Error");
      }
   }

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

   const fetchQuestions = useCallback(async () => {
      axios.get(apiUrl + "assessment")
         .then(({ data }) => {
            if (data.message !== "No questions found.") {
               dispatch(setQuestion(data?.questions))
               // console.log(data?.questions)
            }
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => {
            setTimeout(() => {
               setContentRefresh(false);
            }, 3000);
         })
   }, [dispatch])

   const handleQuestionDelete = (id, question) => {
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
         fetchQuestions(); // Load questions data
      }
   }, [fetchQuestions, questions]);

   return (
      <section>
         <div style={{
            width: "800px",
            backgroundColor: "red"
         }}>
            <ReactModal isOpen={!!modalContent} style={{
               content: {
                  width: "45%",
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
                     <th>Question Category</th>
                     <th>Question Sub Category</th>
                     <th className="center">Question Type</th>
                     <th className="center">Age Group</th>
                     <th className="center">Total Options</th>
                     <th className="center">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {currentRecords.length > 0 ? (
                     currentRecords.map((data, index) => (
                        <tr key={index}>
                           <td>{startIndex + index + 1}</td>
                           <td style={{ width: "350px" }}>{data.question.questionText}</td>
                           <td>{data?.quesCategory?.categoryName?.split(" kush ")[0]}</td>
                           <td>{data?.quesCategory?.categoryName?.split(" kush ")[1].split(" : ")[0]}</td>
                           <td className="center">{data?.quesCategory?.categoryName?.split(" kush ")[1].split(" : ")[1]}</td>
                           <td className="center">{data.ageGroup}</td>
                           <td className="center">{data.question.totalOptions}</td>
                           <td className="center">
                              <FaEye className="action-icon view" title="View" onClick={() => openModal(modalStructure(data.question?.structure), data, data.question?.structure)} />
                              <FiEdit3 className="action-icon edit" title="Edit" onClick={() => handleQuestionEdit()} />
                              <HiOutlineTrash className="action-icon delete" title="Delete" onClick={() => handleQuestionDelete(data._id, data.question)} />
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="7">No Questions Found!</td>
                     </tr>
                  )}
               </tbody>
            </table>
            <div className="pagination">
               <div className="paginationSubCont">
                  <span className="pageCount">{totalPages ? currentPage + "-" + totalPages : 0} of {totalPages}</span>
                  <div className="pagination-top">
                     <span>Page </span>
                     <select className="pageNavDrop" value={currentPage} name="pages" id="page" onChange={(e) => {
                        handleGoToPage(e.target.value)
                     }}
                        onKeyUp={(e) => e.key === 'Enter' && handleGoToPage()}
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