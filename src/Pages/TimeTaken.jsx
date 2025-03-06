import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "./Result.css"
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import axios from 'axios';
import { setCategory, setResults } from '../redux/actions/actions';
import { TbRefresh } from 'react-icons/tb';
import * as XLSX from "xlsx"
import { useNavigate } from 'react-router-dom';

const TimeTaken = ({ loggedIn }) => {
   // eslint-disable-next-line
   const [pageInput, setPageInput] = useState(1);
   const dispatch = useDispatch()
   const navigate = useNavigate();

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

   useEffect(() => {
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate])

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
            console.log(data.result)
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
               obj = {
                  quesId: resQues[i].quesId?._id,
                  answerMarked: resQues[i].AnswerMarked,
                  correctAnswer: resQues[i].quesId?.question?.correctAnswer,
                  questionType: resQues[i].quesId?.question?.questionType,
                  timeTaken: resQues[i]?.timeTaken
               }
               data.push(obj);
            }
         }
         allQuestion[cat] = data;
      }
      return allQuestion;
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

   const getRequiredAWCDetail = (awc, field) => {
      const awcDetails = awc?.split(" - ");
      switch (field) {
         case "state": return awcDetails[0];
         case "district": return awcDetails[1];
         case "code": return awcDetails[2];
         case "block": return awcDetails[3];
         case "type": return awcDetails[4];
         default:
            break;

      }
   }

   const getTimeTaken = (time) => {
      // let a = typeof (time);
      const generalDate = {
         hours: new Date(0).getHours(),
         minutes: new Date(0).getMinutes(),
         seconds: new Date(0).getSeconds(),
         milliseconds: new Date(0).getMilliseconds()
      }
      const timeTaken = {
         hours: new Date(time).getHours(),
         minutes: new Date(time).getMinutes(),
         seconds: new Date(time).getSeconds(),
         milliseconds: new Date(time).getMilliseconds()
      }
      let a = "";
      if (timeTaken.milliseconds - generalDate.milliseconds > 0) {
         if (timeTaken.seconds - generalDate.seconds > 0) {
            if (timeTaken.minutes - generalDate.minutes > 0) {
               if (timeTaken.hours - generalDate.hours > 0)
                  a += timeTaken.hours + " hrs : "
               a += timeTaken.minutes + " min : "
            }
            a += timeTaken.seconds + " sec : "
         }
         a += timeTaken.milliseconds + " ms"
      }
      else {
         if (timeTaken.seconds - generalDate.seconds > 0) {
            if (timeTaken.minutes - generalDate.minutes > 0) {
               if (timeTaken.hours - generalDate.hours > 0)
                  a += timeTaken.hours + " hrs : "
               a += timeTaken.minutes + " min : "
            }
            a += timeTaken.seconds + " sec"
         }
         else {
            if (timeTaken.minutes - generalDate.minutes > 0) {
               a += timeTaken.minutes + " min"
            }
            else {
               if (timeTaken.hours - generalDate.hours > 0)
                  a += timeTaken.hours + " hrs"
               else
                  a = "-"
            }
         }
      }
      // return time;
      return a;
      // return a.getMinutes() + " : " + a.getSeconds() + " : " + a.getMilliseconds();
   }

   const calculateTotalTime = (data) => {
      // console.log(data);
      let time = 0;
      data?.forEach(element => {
         let cat = element?.quesCategory?.categoryName;
         if (!(cat.includes("Demo"))) time += element.timeTaken;
      });
      return getTimeTaken(time)
   }

   return (
      <section>
         <div className="banner">
            <h1>Time Taken
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
               <table ref={tableRef} className='table-container' style={{ width: `calc(500px * ` + (category.length !== 0 ? category.length / 2 : 2) + `)` }}>
                  <thead>
                     <tr>
                        <th className='center' rowSpan={2}>S. No</th>
                        <th className='center' rowSpan={2}>Name</th>
                        <th className='center' rowSpan={2}>Roll No</th>
                        <th className='center' rowSpan={2}>Gender</th>
                        <th className='center' rowSpan={2}>State</th>
                        <th className='center' rowSpan={2}>District</th>
                        <th className='center' rowSpan={2}>Centre Code</th>
                        <th className='center' rowSpan={2}>Block</th>
                        <th className='center' rowSpan={2}>School Type</th>
                        <th className='center' rowSpan={2}>Age Group</th>
                        <th className='center' rowSpan={2}>Total Time</th>
                        {
                           category.map((headData, index) => {
                              if (headData?.totalQuestions && !headData?.categoryName.includes("Demo"))
                                 return (
                                    <th
                                       key={index}
                                       style={{
                                          textAlign: "center",
                                          borderLeft: "10px solid var(--white)",
                                          borderBottom: "1px solid var(--primary-color)",
                                       }}
                                       colSpan={
                                          headData?.totalQuestions || 0
                                       }>
                                       {
                                          headData.categoryName?.split(" kush ")[0] + " - " + headData.categoryName?.split(" kush ")[1].split(" : ")[0]
                                       }
                                    </th>
                                 )
                              else
                                 return () => {
                                 }
                           })
                        }
                     </tr>
                     <tr>
                        {
                           category.flatMap((headData, index) => {
                              if (headData?.totalQuestions && !headData?.categoryName.includes("Demo"))
                                 return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                    <th
                                       style={{
                                          textAlign: "center",
                                          borderLeftColor: i === 0 ? "var(--white)" : "var(--primary-color)",
                                          borderLeftWidth: i === 0 ? "10px" : "1px",
                                          borderLeftStyle: "solid"
                                       }}
                                       key={`${index}-${i}`}
                                    >
                                       Trial {i + 1}
                                    </th>
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
                              let user = res?.userId;
                              let resQuestion = regrouping(res?.questions);
                              return (<tr key={index}>
                                 <td className='center'>{index + 1}</td>
                                 <td className='center'>{user?.name}</td>
                                 <td className='center'>{user?.rollno.toFixed(1)}</td>
                                 <td className='center'>{user?.gender}</td>
                                 <td className='center'>{getRequiredAWCDetail(user?.awcentre, "state")}</td>
                                 <td className='center'>{getRequiredAWCDetail(user?.awcentre, "district")}</td>
                                 <td className='center'>{getRequiredAWCDetail(user?.awcentre, "code")}</td>
                                 <td className='center'>{getRequiredAWCDetail(user?.awcentre, "block")}</td>
                                 <td className='center'>{getRequiredAWCDetail(user?.awcentre, "type")}</td>
                                 <td className='center'>{user?.age}</td>
                                 <td className='center'>{calculateTotalTime(res?.questions)}</td>
                                 {
                                    category.flatMap((headData, index) => {
                                       if (headData?.categoryName.includes("Demo")) {
                                          return () => {

                                          };
                                       }
                                       else {
                                          // console.log(headData)
                                          let newRecords = resQuestion[headData?.categoryName];

                                          if (headData?.totalQuestions)
                                             return Array.from({ length: headData?.totalQuestions || 0 }, (_, i) => (
                                                <td style={{ textAlign: "center" }} key={`${index}-${i}`}>
                                                   {
                                                      newRecords?.[i]?.timeTaken ?
                                                         getTimeTaken(newRecords[i].timeTaken)
                                                         : "-"
                                                   }
                                                </td>
                                                // newRecords?.[i]?.timeTaken
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

export default TimeTaken