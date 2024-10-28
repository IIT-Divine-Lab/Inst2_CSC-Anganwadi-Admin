import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "./Result.css"
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import axios from 'axios';
import { setCategory, setResults } from '../redux/actions/actions';
import { TbRefresh } from 'react-icons/tb';

const Result = () => {
   const [pageInput, setPageInput] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
   const dispatch = useDispatch()

   const result = useSelector((state) => state?.result || []);
   const category = useSelector((state) => state?.categories || []);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(result?.length / recordsPerPage) || 1;
   const startIndex = (currentPage - 1) * recordsPerPage;
   // eslint-disable-next-line
   const currentRecords = result?.slice(startIndex, startIndex + recordsPerPage);

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

   const fetchResults = useCallback(async () => {
      await axios.get(apiUrl + "result")
         .then(({ data }) => {
            dispatch(setResults(data.result))
         })
         .catch((error) => {
            console.error(error)
         })
         .finally(() => {
            setContentRefresh(false);
         })
   }, [dispatch])

   const fetchCategories = useCallback(async () => {
      axios.get(adminApiUrl + "category")
         .then((({ data }) => {
            dispatch(setCategory(data.categories));
         }))
         .catch((error) => {
            console.log(error);
         })
         .finally(() => {
            setTimeout(() => {
               setContentRefresh(false);
            }, 3000);
         })
   }, [dispatch])

   const regrouping = (resQues) => {
      // console.log(resQues)
      let categories = [];
      for (let i = 0; i < resQues.length; i++) {
         let cat = resQues[i].quesId.quesCategory
         if (!(categories.includes(cat)))
            categories.push(cat)
      }
      let allQuestion = {}
      for (let j = 0; j < categories.length; j++) {
         let cat = categories[j];
         let data = [];
         for (let i = 0; i < resQues.length; i++) {
            let obj;
            if (cat === resQues[i].quesId.quesCategory) {
               console.log(resQues[i].quesId)
               obj = {
                  quesId: resQues[i].quesId._id,
                  answerMarked: resQues[i].AnswerMarked,
                  correctAnswer: resQues[i].quesId.question.correctAnswer,
                  questionType: resQues[i].quesId.question.questionType
               }
               data.push(obj);
            }
         }
         allQuestion[cat] = data;
      }
      return allQuestion;
   }

   const score = (category, resQues, total) => {
      let arr = new Array(total).fill("-");
      let cat = resQues[category];
      if (cat !== undefined) {
         for (let i = 0; i < cat.length; i++) {
            if (cat[i].questionType === "single") {
               if (cat[i].answerMarked.length === cat[i].correctAnswer.length) {
                  for (let j = 0; j < cat[i].correctAnswer.length; j++) {
                     if (!(cat[i].correctAnswer.includes(cat[i].answerMarked[j]))) {
                        arr[i] = 0;
                        console.log(cat[i].quesId)
                     }
                     else {
                        arr[i] = 1;
                     }
                  }
               }
               else {
                  arr[i] = 0;
               }
            }
            else {
               let a = 0;
               for (let j = 0; j < cat[i].correctAnswer.length; j++) {
                  if (!(cat[i].correctAnswer.includes(cat[i].answerMarked[j]))) {
                     a += 0;
                  }
                  else {
                     a += 1;
                  }
               }
               arr[i] = a;
            }
         }
      }
      return arr;
   }

   useEffect(() => {
      if (result.length === 0) {
         fetchResults();
      }
      if (category.length === 0) {
         fetchCategories()
      }
   }, [result, fetchResults, category, fetchCategories])

   return (
      <section>
         <div className="banner">
            <h1>Result
               <span style={{ border: "2px solid #333", cursor: "pointer" }} onClick={() => {
                  setContentRefresh(true);
                  fetchCategories();
                  fetchResults();
               }}>
                  <TbRefresh style={{ padding: "5px" }} className={contentRefresh ? 'spin2' : ''} />
               </span>
            </h1>
            <div className="pagination-top">
               <span>Go To</span>
               <input
                  type="number"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={(e) => setPageInput(e.target.value)}
               />
               <button onClick={handleGoToPage}>Go</button>
            </div>
            <div className='parentTableContainer'>
               <table className='table-container' style={{ width: `calc(600px * ` + (category.length + 1) + `)` }}>
                  <thead>
                     <tr>
                        <th rowSpan={2}>S. No</th>
                        <th rowSpan={2}>Name</th>
                        <th rowSpan={2}>Anganwadi Centre</th>
                        <th rowSpan={2}>Age Group</th>
                        {
                           category.map((headData, index) => {
                              if (headData?.totalQuestions)
                                 return <th key={index} style={{ textAlign: "center" }} colSpan={headData?.totalQuestions || 0}>{headData.categoryName}</th>
                              else
                                 return () => {
                                 }
                           })
                        }
                     </tr>
                     <tr>
                        {
                           category.flatMap((headData, index) => {
                              if (headData?.totalQuestions)
                                 return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                    <th style={{ textAlign: "center" }} key={`${index}-${i}`}>Trial {i + 1}</th>
                                 ))
                              else
                                 return () => {
                                 };
                           })
                        }
                     </tr>
                     {
                        result?.map((res, index) => {
                           let user = res.userId;
                           let resQuestion = regrouping(res.questions);
                           return (<tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.awcentre}</td>
                              <td>{user.age}</td>
                              {
                                 category.flatMap((headData, index) => {
                                    let categoryRecords = score(headData.categoryName, resQuestion, headData?.totalQuestions);

                                    if (headData?.totalQuestions)
                                       return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                          <td style={{ textAlign: "center" }} key={`${index}-${i}`}>{categoryRecords[i]}</td>
                                       ))
                                    else
                                       return () => {
                                       }
                                 })
                              }
                           </tr>)
                        })
                     }
                  </thead>
               </table>
            </div>
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
   )
}

export default Result