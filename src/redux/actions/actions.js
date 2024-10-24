import ActionTypes from "../constants/action_types";

export const setStudents = (students) => {
   return {
      type: ActionTypes.SET_STUDENTS,
      payload: students
   }
} 

export const setCategory = (categories) => {
   return {
      type: ActionTypes.SET_CATEGORY,
      payload: categories
   }
}

export const addCategory = (category) => {
   return {
      type: ActionTypes.ADD_CATEGORY,
      payload: category
   }
}

export const deleteCategory = (category) => {
   return {
      type: ActionTypes.DELETE_CATEGORY,
      payload: category
   }
}

export const modifyCategory = (category) => {
   return {
      type: ActionTypes.MODIFY_CATEGORY,
      payload: category
   }
}

export const setQuestion = (Questions) => {
      return{
      type: ActionTypes.SET_QUESTIONS,
      payload: Questions
      }
   }
   
   export const addQuestion = (Questions) => {
   return {
      type: ActionTypes.ADD_QUESTIONS,
      payload: Questions
   }
}

   export const deleteQuestion = (Questions) => {
   return {
      type: ActionTypes.DELETE_QUESTIONS,
      payload: Questions
   }
}

   export const modifyQuestions = (Questions) => {
   return {
      type: ActionTypes.MODIFY_QUESTIONS,
      payload: Questions
   }
}