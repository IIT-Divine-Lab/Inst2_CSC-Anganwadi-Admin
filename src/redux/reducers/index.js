import { combineReducers } from "redux";
import { StudentReducer, CategoryReducer } from "./reducer";

const reducers = combineReducers({
   student: StudentReducer,
   categories: CategoryReducer
})

export default reducers