import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "./Result.css"
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import axios from 'axios';
import { setCategory, setResults } from '../redux/actions/actions';
import { TbRefresh } from 'react-icons/tb';
import * as XLSX from "xlsx"

const Result = () => {
   // eslint-disable-next-line
   const [pageInput, setPageInput] = useState(1);
   const dispatch = useDispatch()

   const result = useSelector((state) => state?.result || []);
   const category = useSelector((state) => state?.categories || []);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(result?.length / recordsPerPage) || 1;
   const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);
   const startIndex = (currentPage - 1) * recordsPerPage;
   // eslint-disable-next-line
   const currentRecords = result?.slice(startIndex, startIndex + recordsPerPage);
   const tableRef = useRef();

   // Export function
   const exportToXLSX = () => {
      // Create a workbook from the HTML table using `table_to_book`
      const workbook = XLSX.utils.table_to_book(tableRef.current, { sheet: "Sheet1" });

      // Generate a downloadable Excel file
      XLSX.writeFile(workbook, "exported_table.xlsx");
   };

   // eslint-disable-next-line
   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   // eslint-disable-next-line
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
            if (data.message !== "No Record Found")
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
            if (data.message !== "No Data")
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
      for (let i = 0; i < resQues?.length; i++) {
         let cat = resQues[i]?.quesCategory?.categoryName
         if (!(categories.includes(cat)))
            categories.push(cat)
      }
      let allQuestion = {}
      for (let j = 0; j < categories?.length; j++) {
         let cat = categories[j];
         let data = [];
         for (let i = 0; i < resQues?.length; i++) {
            let obj;
            if (cat === resQues[i]?.quesCategory?.categoryName) {
               // console.log(resQues[i]?.quesId)
               obj = {
                  quesId: resQues[i].quesId?._id,
                  answerMarked: resQues[i].AnswerMarked,
                  correctAnswer: resQues[i].quesId?.question.correctAnswer,
                  questionType: resQues[i].quesId?.question.questionType
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
      if (cat !== undefined && !category.includes("Draw")) {
         for (let i = 0; i < cat?.length; i++) {
            if (cat[i].questionType === "single") {
               if (cat[i].answerMarked?.length === cat[i].correctAnswer?.length) {
                  for (let j = 0; j < cat[i].correctAnswer?.length; j++) {
                     if (!(cat[i].correctAnswer.includes(cat[i].answerMarked[j]))) {
                        arr[i] = 0;
                     }
                     else {
                        arr[i] = 1;
                     }
                  }
               }
               else if (cat[i].correctAnswer?.length === 2) {
                  arr[i] = cat[i].answerMarked[0] === cat[i].correctAnswer[0] ? 2 : cat[i].answerMarked[0] === cat[i].correctAnswer[1] ? 1 : 0
               }
               else {
                  arr[i] = 0;
               }
            }
            else {
               let a = 0;
               for (let j = 0; j < cat[i].correctAnswer?.length; j++) {
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
      if (category.includes("Draw") && cat !== undefined) {
         for (let i = 0; i < cat.length; i++) {
            if (cat[i].answerMarked.length) {
               arr[i] = <img style={{ width: "150px" }} alt={cat[i]} src={cat[i].answerMarked[0]} />;
            }
         }
      }
      return arr;
   }

   const fetchTotalQuestions = () => {
      let a = 0;
      for (let i = 0; i < category.length; i++) {
         a += category[i].totalQuestions
      }
      return a + 6;
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
               <span style={{ display: "flex", alignItems: "center" }}>
                  <span className="refreshBtn" onClick={() => {
                     setContentRefresh(true);
                     fetchCategories()
                     fetchResults()
                  }}>
                     <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
                  </span>
                  <button className='actionBtn' onClick={exportToXLSX}>Export</button>
               </span>
            </h1>
            {/* <div className="pagination-top">
               <span>Go To</span>
               <input
                  type="number"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={(e) => setPageInput(e.target.value)}
               />
               <button onClick={handleGoToPage}>Go</button>
            </div> */}
            <div className='parentTableContainer'>
               <table ref={tableRef} className='table-container' style={{ width: `calc(600px * ` + (category.length / 2 + 1) + `)` }}>
                  <thead>
                     <tr>
                        <th rowSpan={2}>S. No</th>
                        <th rowSpan={2}>Name</th>
                        <th rowSpan={2}>Roll No</th>
                        <th rowSpan={2}>Gender</th>
                        <th rowSpan={2}>Anganwadi Centre</th>
                        <th rowSpan={2}>Age Group</th>
                        {
                           category.map((headData, index) => {
                              if (headData?.totalQuestions && !headData?.categoryName.includes("AAA"))
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
                              if (headData?.totalQuestions && !headData?.categoryName.includes("AAA"))
                                 return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                    <th style={{ textAlign: "center" }} key={`${index}-${i}`}>Trial {i + 1}</th>
                                 ))
                              else
                                 return () => {
                                 };
                           })
                        }
                     </tr>
                  </thead>
                  <tbody>
                     {
                        result.length !== 0 ?
                           result?.map((res, index) => {
                              let user = res.userId;
                              let resQuestion = regrouping(res.questions);
                              return (<tr key={index}>
                                 <td>{index + 1}</td>
                                 <td>{user.name}</td>
                                 <td>{user.rollno}</td>
                                 <td>{user.gender}</td>
                                 <td>{user.awcentre}</td>
                                 <td>{user.age}</td>
                                 {
                                    category.flatMap((headData, index) => {
                                       if (headData?.categoryName.includes("AAA")) {
                                          return () => {

                                          };
                                       }
                                       else {
                                          let categoryRecords = score(headData?.categoryName, resQuestion, headData?.totalQuestions);

                                          if (headData?.totalQuestions)
                                             return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                                <td style={{ textAlign: "center" }} key={`${index}-${i}`}>{categoryRecords[i]}</td>
                                             ))
                                          else
                                             return () => {
                                             }
                                       }
                                    })
                                 }
                              </tr>)
                           })
                           : (
                              <tr>
                                 <td colSpan={fetchTotalQuestions()}>
                                    No Student Records Found!
                                 </td>
                              </tr>
                           )
                     }
                  </tbody>
               </table>
            </div>
            {/* <div className="pagination">
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!totalPages && (currentPage === 0 || currentPage === 1)}
               >
                  Previous
               </button>
               <span>Page {totalPages ? currentPage : 0} of {totalPages}</span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!totalPages && currentPage === totalPages}
               >
                  Next
               </button>
            </div> */}
         </div>
      </section>
   )
}

export default Result