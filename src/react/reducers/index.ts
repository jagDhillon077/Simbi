import { combineReducers } from 'redux'
import { ListResourceResponse } from '../../services/resources';
import { AccessibilityContentCookies, AccessibilityStyleCookies, ColorSelect } from '../components/AccessibilityPage';
import { DataObject, User } from '../Data';
import { CategoryObject, View } from '../types';

const searchReducer = (search = "", action: { type: string, payload: string }) => {
  if (action.type === 'SEARCH') {
    return action.payload;
  }
  return search;
}

const userReducer = (user = {}, action: { type: string, payload: User }) =>
{
  if(action.type === 'USER')
  {
    return action.payload;
  }
  return user;
}

const userListReducer = (userList = [], action: { type: string, payload: User[] }) =>
{
  if(action.type === 'USERLIST')
  {
    return [...action.payload];
  }
  return userList;
}

const pincodeReducer = (pincode = 513814, action: { type: string, payload: number }) => {
  if (action.type === 'PINCODE') {
    return action.payload;
  }
  return pincode;
}

const contentCookieReducer = (contentSettings = {fontSize: 0, lineGap: 0,  charGap: 0}, action: { type: string, payload: AccessibilityContentCookies }) => {
  if (action.type === 'CONTENTSETTINGS') {
    return action.payload;
  }
  return contentSettings;
}

const styleCookieReducer = (styleSettings = {highlightLink: false, readableFont: false, highlightHeading: false, headingsCol: ColorSelect.BLACK, 
  copyCol: ColorSelect.BLACK, backgroundCol: ColorSelect.WHITE, linkCol: ColorSelect.BLUE}, action: { type: string, payload: AccessibilityStyleCookies }) => {
  if (action.type === 'STYLESETTINGS') {
    return action.payload;
  }
  return styleSettings;
}

const viewReducer = (view = View.HOME, action: { type: string, payload: View }) => {
  if (action.type === 'VIEW') {
    return action.payload;
  }
  return view;
}

const categoryReducer = (category = '', action: { type: string, payload: CategoryObject }) => {
  if (action.type === 'CATEGORY') {
    return action.payload;
  }
  return category;
}

const resultsReducer = (results = [], action: { type: string, payload: DataObject[] }) => {
  if (action.type === 'RESULTS') {
    return action.payload;
  }
  return results;
}

const resourceReducer = (results = { resources: [], count: 0 }, action: { type: string, payload: ListResourceResponse }): ListResourceResponse => {
  if (action.type === 'RESOURCES') {
    return action.payload;
  } else if (action.type === 'APPEND_RESOURCES') {
    return {
      ...action.payload,
      resources: [...results.resources, ...action.payload.resources],
    }
  }
  return results;
}

const allReducers = combineReducers({
  search: searchReducer,
  view: viewReducer,
  category: categoryReducer,
  results: resultsReducer,
  resourceList: resourceReducer,
  user: userReducer,
  userList: userListReducer,
  pincode: pincodeReducer,
  contentSettings: contentCookieReducer,
  styleSettings: styleCookieReducer
})


export default allReducers