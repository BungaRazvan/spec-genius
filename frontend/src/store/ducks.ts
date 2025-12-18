import { combineReducers } from "reslice";

import { bindReducer } from "reslice";

const actions = {};

function _reducer(state = {}, action: any) {
  return state;
}

const reducer = combineReducers({
  todo: _reducer,
});

export default reducer;
