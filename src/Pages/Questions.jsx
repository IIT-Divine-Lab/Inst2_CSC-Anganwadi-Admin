import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import questionsData from '../data/QuestionData.json';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import "./Questions.css"
import { useDispatch, useSelector } from 'react-redux';
import { setQuestions } from '../redux/actions/actions.js';
import { useNavigate } from "react-router-dom";


   const Questions = () => {
   const questions = useSelector((state) => state.questions);
   const [currentPage, setCurrentPage] = useState(1);
   const [pageInput, setPageInput] = useState(1);
   const recordsPerPage = 10;
   // const totalPages = Math.ceil(categories.length / recordsPerPage);
   const navigate = useNavigate();

   }
export default Questions;