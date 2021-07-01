import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  reducers as commonReducers,
  epics as commonEpics,
} from './modules/common';
import home from './modules/home';


export const rootReducers = combineReducers({
  home,
  ...commonReducers,
});

const allEpics = [
  ...commonEpics,
];

export const rootEpics = combineEpics(...allEpics);
