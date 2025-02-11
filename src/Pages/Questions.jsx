import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, setQuestion } from '../redux/actions/actions';
// import questionsData from '../data/QuestionData.json';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { apiUrl } from "../adminApiUrl";
import { TbRefresh } from "react-icons/tb";
import Structure1to4 from '../Components/Structure1-4';
import Structure5 from '../Components/Structure5';
import Structure6 from '../Components/Structure6';
import Structure7 from '../Components/Structure7';
import ReactModal from "react-modal";

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

   // eslint-disable-next-line
   const deleteFromUploadCare = (uuid) => {
      return fetch(`https://api.uploadcare.com/files/${uuid}/`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Uploadcare.Simple f0b48dbfeaff1298ebed:bc3d9f9926fcc6926aec'
         }
      })
   }

   // eslint-disable-next-line
   // const handleQuestionDelete = (id, question) => {
   //    let uuids = [];
   //    let option, uuid;
   //    if (question.structure !== 6 && question.structure !== 7) {
   //       for (let i = 0; i < question.totalOptions; i++) {
   //          option = question?.option["o" + (i + 1)]?.split("/");
   //          uuid = option[option?.length - 2];
   //          uuids.push(uuid);
   //       }
   //       if (question.structure === 1) {
   //          option = question.questionImage.before.split("/");
   //          uuid = option[option?.length - 2];
   //          uuids.push(uuid);
   //          option = question.questionImage.after.split("/");
   //          uuid = option[option?.length - 2];
   //          uuids.push(uuid);
   //       }
   //       else if (question.structure === 2) {
   //          option = question.questionImage.after.split("/");
   //          uuid = option[option?.length - 2];
   //          uuids.push(uuid);
   //       }
   //       else if (question.structure === 4) {
   //          option = question.questionSound.split("/");
   //          uuid = option[option?.length - 2];
   //          uuids.push(uuid);
   //       }
   //    }
   //    axios.delete(apiUrl + "assessment/" + id)
   //       .then(({ data }) => {
   //          dispatch(deleteQuestion(data?.question))
   //       })
   //       .catch((error) => {
   //          console.log(error);
   //       })
   //       .finally(() => {
   //          uuids.forEach(async (uuid) => {
   //             deleteFromUploadCare(uuid)
   //                .then(() => {
   //                   toast.success("Deleted Successfully!!", {
   //                      autoClose: 1000
   //                   })
   //                })
   //                .catch((error) => {
   //                   console.error(error);
   //                })
   //          })
   //       })
   // }

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
            <div className="pagination-top">
               <span>Go To </span>
               <input
                  type="number"
                  min={1}
                  max={totalPages}
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
                     <th>Question Category</th>
                     <th>Question Sub Category</th>
                     <th>Question Type</th>
                     <th>Age Group</th>
                     <th>Total Options</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {currentRecords.length > 0 ? (
                     currentRecords.map((data, index) => (
                        <tr key={index}>
                           <td>{startIndex + index + 1}</td>
                           <td style={{ width: "350px" }}>{data.question.questionText}</td>
                           <td>{data.quesCategory.categoryName.split(" kush ")[0]}</td>
                           <td>{data.quesCategory.categoryName.split(" kush ")[1].split(" : ")[0]}</td>
                           <td>{data.quesCategory.categoryName.split(" kush ")[1].split(" : ")[1]}</td>
                           <td>{data.ageGroup}</td>
                           <td>{data.question.totalOptions}</td>
                           <td>
                              <FaEye className="action-icon" title="View" onClick={() => openModal(modalStructure(data.question?.structure), data, data.question?.structure)} />
                              {/* <CiEdit className="action-icon" title="Edit" onClick={() => { handleQuestionEdit(data._id) }} /> */}
                              <MdDelete className="action-icon" title="Delete" onClick={() => { handleQuestionDelete(data._id, data.question) }} />
                              {/* <MdDelete className="action-icon" title="Delete" onClick={() => { handleQuestionDelete(data._id, data.question) }} /> */}
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
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)}
               >
                  Previous
               </button>
               <span>Page {totalPages ? currentPage : 0} of {totalPages}</span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!totalPages || currentPage === totalPages}
               >
                  Next
               </button>
            </div>
         </div>
      </section>
   );
};

export default Questions;