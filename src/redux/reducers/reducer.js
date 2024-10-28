import ActionTypes from "../constants/action_types";

export const StudentReducer = (state = [], { type, payload }) => {
   switch (type) {
      case ActionTypes.SET_STUDENTS:
         console.log(payload.length);
         return payload?.length ? [...payload] : [];

      default:
         return state;
   }
}

export const CategoryReducer = (state = [], { type, payload }) => {
   let newCategory;
   switch (type) {
      case ActionTypes.SET_CATEGORY:
         return payload?.length ? [...payload] : [];
      case ActionTypes.ADD_CATEGORY:
         return [payload, ...state];
      case ActionTypes.DELETE_CATEGORY: newCategory = state.filter((value) => value._id !== payload._id)
         return [...newCategory];
      case ActionTypes.MODIFY_CATEGORY: newCategory = state.filter((value) => value._id !== payload._id)
         return [payload, ...newCategory];
      default:
         return state;
   }
}

export const QuestionReducer = (state = [], { type, payload }) => {
   let newQuestion;
   switch (type) {
      case ActionTypes.SET_QUESTIONS:
         return payload?.length ? [...payload] : [];
      case ActionTypes.ADD_QUESTION:
         return [payload, ...state];
      case ActionTypes.DELETE_QUESTION: newQuestion = state.filter((value) => value._id !== payload._id)
         return [...newQuestion];
      case ActionTypes.MODIFY_QUESTION: newQuestion = state.filter((value) => value._id !== payload._id)
         return [payload, ...newQuestion];
      default:
         return state;
   }
}

export const ResultReducer = (state = [], { type, payload }) => {
   switch (type) {
      case ActionTypes.SET_RESULT:
         return payload?.length ? [...payload] : [];
      default:
         return state;
   }
}