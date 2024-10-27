import { combineReducers } from "redux";
import { StudentReducer, CategoryReducer, QuestionReducer, ResultReducer } from "./reducer";

const reducers = combineReducers({
   student: StudentReducer,
   categories: CategoryReducer,
   questions: QuestionReducer,
   result: ResultReducer
})

export default reducers