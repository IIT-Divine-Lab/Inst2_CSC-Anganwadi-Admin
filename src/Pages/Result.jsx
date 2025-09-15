import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./Result.css"
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import axios from 'axios';
import { setCategory, setResults } from '../redux/actions/actions';
import { TbRefresh } from 'react-icons/tb';
import * as XLSX from "xlsx"
import { useNavigate } from 'react-router-dom';

const Result = ({ loggedIn }) => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const result = useSelector((state) => state?.result || []);
  const category = useSelector((state) => state?.categories || []);
  const [contentRefresh, setContentRefresh] = useState(false);
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

  const fetchResults = useCallback(async () => {
    await axios.get(apiUrl + "result")
      .then(({ data }) => {
        if (data.message !== "No Record Found") {
          setLoading(false);
          dispatch(setResults(data.result))
        }
        console.log(data.result)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false);
        setContentRefresh(false);
      })
  }, [dispatch])

  const fetchCategories = useCallback(async () => {
    axios.get(adminApiUrl + "category")
      .then((({ data }) => {
        if (data.message !== "No Data") {
          setLoading(false);
          dispatch(setCategory(data.categories));
        }
      }))
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setContentRefresh(false);
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
            questionType: resQues[i].quesId?.question?.questionType
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
      for (let i = 0; i < cat?.length; i++) {
        console.log()
        if (cat[i]?.questionType === "single") {
          if (cat[i]?.answerMarked?.length === cat[i].correctAnswer?.length) {
            for (let j = 0; j < cat[i].correctAnswer?.length; j++) {
              if (!(cat[i].correctAnswer.includes(cat[i]?.answerMarked[j]?.split("o")[1]))) {
                arr[i] = 0;
              }
              else {
                arr[i] = 1;
              }
            }
          }
          else if (cat[i].correctAnswer?.length === 2) {
            arr[i] = cat[i].answerMarked[0] === ("o" + cat[i].correctAnswer[0]) ? 2 : cat[i].answerMarked[0] === ("o" + cat[i].correctAnswer[1]) ? 1 : 0
          }
          else {
            arr[i] = 0;
          }
        }
        else if (cat[i].questionType === "Draw" || cat[i].questionType === "draw") {
          for (let i = 0; i < cat.length; i++) {
            if (cat[i].answerMarked.length) {
              arr[i] = <img style={{ width: "150px" }} alt={cat[i]} src={cat[i].answerMarked[0]} />;
            }
          }
        }
        else {
          let a = 0;
          for (let j = 0; j < cat[i]?.correctAnswer[0]?.split(",")?.length; j++) {
            if (!(cat[i]?.correctAnswer[0]?.split(",").includes((Number(cat[i].answerMarked[j]?.split("o")[1]) - 1).toString()))) {
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

  const fetchTotalQuestions = () => {
    let a = 0;
    for (let i = 0; i < category.length; i++) {
      a += category[i].totalQuestions
    }
    return a + 6;
  }

  useEffect(() => {
    if (result.length === 0) {
      setLoading(true);
      fetchResults();
    }
    if (category.length === 0) {
      setLoading(true);
      fetchCategories()
    }
  }, [result, fetchResults, category, fetchCategories])

  const getRequiredAWCDetail = (awc, field) => {
    const awcDetails = awc?.split(" - ");
    if (awcDetails === undefined || awcDetails?.length <= 0) {
      return;
    }
    switch (field) {
      case "state": return awcDetails?.[0];
      case "district": return awcDetails?.[1];
      case "code": return awcDetails?.[2];
      case "block": return awcDetails?.[3];
      case "type": return awcDetails?.[4];
      default:
        break;
    }
  }

  return (
    <section>
      <div className="banner">
        <h1>Result
          <span style={{ display: "flex", alignItems: "center" }}>
            <span className="refreshBtn" onClick={() => {
              setContentRefresh(true);
              setLoading(true);
              fetchCategories()
              fetchResults()
            }}>
              <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
            </span>
            <button className='actionBtn' onClick={exportToXLSX}>Export</button>
          </span>
        </h1>
        <div style={loading ? { minHeight: "30vh" } : {}} className='parentTableContainer'>
          <table ref={tableRef} className='table-container' style={{ width: `calc(650px * ` + (category.length !== 0 ? category.length / 2 : 2) + `)` }}>
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
                loading ?
                  <tr>
                    <td colSpan={10}>
                      <div className="loadingContainer">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </td>
                  </tr>
                  :
                  <>
                    {
                      result.length !== 0 ?
                        result?.map((res, index) => {
                          let user = res.userId;
                          console.log(user);
                          let resQuestion = regrouping(res.questions);
                          return (<tr key={index}>
                            <td className='center'>{index + 1}</td>
                            <td className='center'>{user?.name}</td>
                            <td className='center'>{user?.rollno}</td>
                            <td className='center'>{user?.gender}</td>
                            <td className='center'>{getRequiredAWCDetail(user?.awcentre, "state")}</td>
                            <td className='center'>{getRequiredAWCDetail(user?.awcentre, "district")}</td>
                            <td className='center'>{getRequiredAWCDetail(user?.awcentre, "code")}</td>
                            <td className='center'>{getRequiredAWCDetail(user?.awcentre, "block")}</td>
                            <td className='center'>{getRequiredAWCDetail(user?.awcentre, "type")}</td>
                            <td className='center'>{user?.age}</td>
                            {
                              category.flatMap((headData, index) => {
                                if (headData?.categoryName.includes("Demo")) {
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
                              No Result Records Found!
                            </td>
                          </tr>
                        )
                    }
                  </>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Result