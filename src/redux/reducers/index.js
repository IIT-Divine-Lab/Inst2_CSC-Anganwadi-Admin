import { combineReducers } from "redux";
import { StudentReducer, CategoryReducer, QuestionReducer } from "./reducer";

const reducers = combineReducers({
   student: StudentReducer,
   categories: CategoryReducer,
   questions: QuestionReducer
})

export default reducers