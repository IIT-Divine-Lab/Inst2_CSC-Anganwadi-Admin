import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, setQuestion } from '../redux/actions/actions';
// import questionsData from '../data/QuestionData.json';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import "./Questions.css";
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
   const [currentPage, setCurrentPage] = useState(1);
   const [pageInput, setPageInput] = useState(1);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(questions.length / recordsPerPage);
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
      console.log(props);
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
            dispatch(setQuestion(data?.questions))
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

   const deleteFromUploadCare = (uuid) => {
      return fetch(`https://api.uploadcare.com/files/${uuid}/`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Uploadcare.Simple f0b48dbfeaff1298ebed:bc3d9f9926fcc6926aec'
         }
      })
   }

   const handleQuestionDelete = (id, question) => {
      let uuids = [];
      let option, uuid;
      if (question.structure !== 6 && question.structure !== 7) {
         for (let i = 0; i < question.totalOptions; i++) {
            option = question?.option["o" + (i + 1)]?.split("/");
            uuid = option[option?.length - 2];
            uuids.push(uuid);
         }
         if (question.structure === 1) {
            option = question.questionImage.before.split("/");
            uuid = option[option?.length - 2];
            uuids.push(uuid);
            option = question.questionImage.after.split("/");
            uuid = option[option?.length - 2];
            uuids.push(uuid);
         }
         else if (question.structure === 2) {
            option = question.questionImage.after.split("/");
            uuid = option[option?.length - 2];
            uuids.push(uuid);
         }
         else if (question.structure === 4) {
            option = question.questionSound.split("/");
            uuid = option[option?.length - 2];
            uuids.push(uuid);
         }
      }
      axios.delete(apiUrl + "assessment/" + id)
         .then(({ data }) => {
            dispatch(deleteQuestion(data?.question))
         })
         .catch((error) => {
            console.log(error);
         })
         .finally(() => {
            uuids.forEach(async (uuid) => {
               deleteFromUploadCare(uuid)
                  .then(() => {
                     toast.success("Deleted Successfully!!", {
                        autoClose: 1000
                     })
                  })
                  .catch((error) => {
                     console.error(error);
                  })
            })
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
                  <span style={{ border: "2px solid #333", marginRight: "12px", cursor: "pointer" }} onClick={() => {
                     setContentRefresh(true);
                     fetchQuestions()
                  }}>
                     <TbRefresh style={{ padding: "5px" }} className={contentRefresh ? 'spin2' : ''} />
                  </span>
                  <button onClick={handleAddQuestion} className="download-btn">Add Questions</button>
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
                           <td>{data.quesCategory.categoryName ? data.quesCategory.categoryName.includes("AAA") ? "Demo" : data.quesCategory.categoryName.split("Domain")[0].split(": ")[1] + "Domain" : ''}</td>
                           <td style={{ width: "250px" }}>{data.quesCategory.categoryName ? data.quesCategory.categoryName.includes("AAA") ? data.quesCategory.categoryName.split("Domain")[0].split(": ")[0] + ": Demo" : data.quesCategory.categoryName.split("Domain")[0].split(": ")[0] + ": " + data.quesCategory.categoryName.split("- ")[1] : ''}</td>
                           <td>{data.ageGroup}</td>
                           <td>{data.question.totalOptions}</td>
                           <td>
                              <FaEye className="action-icon" title="View" onClick={() => openModal(modalStructure(data.question?.structure), data, data.question?.structure)} />
                              {/* <CiEdit className="action-icon" title="Edit" onClick={() => { handleQuestionEdit(data._id) }} /> */}
                              <MdDelete className="action-icon" title="Delete" onClick={() => { handleQuestionDelete(data._id, data.question) }} />
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