// eslint-disable-next-line
import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import { toast } from 'react-toastify';
// eslint-disable-next-line
import * as XLSX from 'xlsx';
// eslint-disable-next-line
import { saveAs } from 'file-saver';
// eslint-disable-next-line
import questionsData from '../data/QuestionData.json';
// eslint-disable-next-line
import { RxCross2 } from "react-icons/rx";
// eslint-disable-next-line
import { TiTick } from "react-icons/ti";
import "./Questions.css"
// eslint-disable-next-line
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line
import { setQuestions } from '../redux/actions/actions.js';
// eslint-disable-next-line
import { useNavigate } from "react-router-dom";


const Questions = () => {
   // const questions = useSelector((state) => state.questions);
   // const [currentPage, setCurrentPage] = useState(1);
   // const [pageInput, setPageInput] = useState(1);
   // const recordsPerPage = 10;
   // // const totalPages = Math.ceil(categories.length / recordsPerPage);
   // const navigate = useNavigate();
   return (
      <>
      </>
   )
}
export default Questions;