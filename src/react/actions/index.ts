import { FullUser, matchesKeyword, matchesSubjectKeyword, Module, User, ParentName, Display} from '../Data'
import { CategoryObject, CategoryPayload, View } from '../types'
import { Dispatch } from "redux";
import ModuleService, { ModuleListParams, ModuleListSubmodulesParams } from '../../services/modules';
import ResourceService, { ListResourceParams, ListResourceResponse } from '../../services/resources';
import { AccessibilityContentCookies, AccessibilityStyleCookies, ColorSelect } from '../components/AccessibilityPage';
import UserService, {UserParams} from '../../services/users';
import FeedbackService from '../../services/feedback';
import CookieService, { CookieKeys } from '../../services/cookie';
import createHttpError from 'http-errors'; 
import PincodeService from '../../services/pincode';
import { stringify } from 'qs';

export interface PincodeChangeType {
  pincode: number;
  reEnterPincode: number;
}


export const changeSearch = (payload: string) => {
  return {
    type: 'SEARCH',
    payload: payload

  }
}

export const loadSearchResults = (payload: string) => (dispatch: Dispatch) => {
  const source = matchesKeyword(payload);
  const subject = matchesSubjectKeyword(payload);
  let query: ModuleListParams = { search: payload }
  if (source) {
    query = { source }
  }
  if (subject) {
    query = { subject }
  }

  ModuleService.list(query).then(modules => {
    //const orginalResults = [...modules];
    //console.log(orginalResults);
    for (let i = modules.length - 1; i >= 0; i--) {
      if (modules[i].source === 'Curriculum Guides') { // Removing content from curriculum guides
        modules.splice(i, 1);
      } else if (modules[i].display === 'secondary') {
        const segments = modules[i].url.split('/');

        if (ParentName[segments[2] as string]) modules[i].name = ParentName[segments[2] as string].concat(" / ", modules[i].name);
        else {
          const uppercased = segments[2] && segments[2][0].toUpperCase() + segments[2].slice(1);
          modules[i].name = uppercased.concat(" / ", modules[i].name);
        }
      }
    }
    //console.log(modules);

    dispatch(setResults(modules));
    dispatch(changeSearch(payload));
    dispatch(setView(View.SEARCH));
  });
}

export const setUserLogin = (payload: User) => async (dispatch: Dispatch) => {

  let user: User = payload;
  let responce = { success: false, username: '', isAdmin: false };
 
  await UserService.login(user).then((userData) => {
      dispatch(setUser(userData));
      responce.success = true;
      responce.isAdmin = userData.isAdmin? true : false;
      responce.username = userData.username;
      if (userData.token) CookieService.set(CookieKeys.TOKEN, userData.token, {path: '/'}, true);
    }
  ).catch(() => {
    responce.success = false;
  })
  
  return responce;
}

export const createUser = (payload: User) => async (dispatch: Dispatch) => {

  let user: User = payload;
  let responce: string = "Success";
  
  await UserService.signUp(user).then(userData => {
      dispatch(setUser(userData));
      responce = JSON.stringify(userData);
    }
  ).catch(() => {
    responce = JSON.stringify({token:"Server Error"});
  })

  return responce;
}


export const deleteUser = (payload: number) => async (dispatch: Dispatch) => {
  
  await UserService.deleteUser(payload);

  UserService.getUserList().then(userListData => {
      dispatch(setUserList(userListData));
    }
  )
}

export const changeUserPassword = (payload: any) => async (dispatch: Dispatch) => {
  
  await UserService.updateUserPassword(payload).catch(() => {});

}


export const getPincode = () => async (dispatch: Dispatch) => {
  
  await PincodeService.getPincode().then(data => {
    dispatch(setPincode(data));
  })

}

export const updatePincode = (payload: PincodeChangeType) => async (dispatch: Dispatch) => {
  
  await PincodeService.updatePincode(payload).then(newPincode => {
    dispatch(setPincode(newPincode));
  }).catch(() => {})

}

// Tries to validate stored token to automatically login. If validation fails set to empty user.
export const authUser = () => (dispatch: Dispatch) => {
  const token = CookieService.get(CookieKeys.TOKEN, true);
  let notFoundUser = {username: '', password: ''}

  if (token) {
    UserService.validateUser(token).then(userData => {
        dispatch(setUser(userData));
      }
    ).catch(() => dispatch(setUser(notFoundUser)))
  } else {
    dispatch(setUser(notFoundUser));
  }
}

export const checkLogin = (token: string) => (dispatch: Dispatch) => {
  let notFoundUser = {username: '', password: ''}

  UserService.getUser(token).catch(() => 
  dispatch(setUser(notFoundUser)))
}

export const updateSecurityCredentials = (data: User) => (dispatch: Dispatch) => {
  UserService.updateSecurityCredentials(data);
}

export const changeUserName = (data: User) => (dispatch: Dispatch) => {
  UserService.updateUserName(data).then(userData => {
    dispatch(setUser(userData))
  })
}

export const getUserList = () => (dispatch: Dispatch) =>  {
  UserService.getUserList().then(userListData => {
      dispatch(setUserList(userListData));
    }
  )
}

export const setOnboardingDone = (data: object) => (dispatch: Dispatch) =>  {
  UserService.setOnboardingDone(data).then(updatedUser => {
    dispatch(setUser(updatedUser));
  })
}

export const logoutUser = (token: string) => (dispatch: Dispatch) => {
  let notFoundUser = {username: '', password: ''}
  UserService.logout(token).then(() => {
    dispatch(setUser(notFoundUser));
  }).catch(() => {
    console.log('logout error')
  })
}

export const extendSession = (payload: object) => {
  UserService.extendSession(payload).then(() => {
    console.log('extended session')
  }).catch(() => {
    //console.log(e);
    console.log('extend session error')
  })
}
/*
export const getSessionExpireTime = (token: string) => {
  //UserService.getSessionExpireTime(token).then(() => {
    //console.log(token)
  //}).catch(() => {
    console.log('failed to get time until session expire')
  //})
}*/

export const setUserList = (payload: User) =>
{
  return {
    type: 'USERLIST',
    payload
  }
}

export const setPincode = (payload: number) =>
{
  return {
    type: 'PINCODE',
    payload
  }
}

export const setContentSettings = (payload: AccessibilityContentCookies) =>
{
  return {
    type: 'CONTENTSETTINGS',
    payload
  }
}

export const setStyleSettings = (payload: AccessibilityStyleCookies) =>
{
  return {
    type: 'STYLESETTINGS',
    payload
  }
}

export const setUser = (payload: User) =>
{
  return {
    type: 'USER',
    payload
  }
}
export const setView = (payload: View) => {
  return {
    type: 'VIEW',
    payload
  }
}

export const setCategory = (payload: CategoryObject) => {
  return {
    type: 'CATEGORY',
    payload
  }
}

export const loadCategoryModules = (payload: CategoryPayload) => (dispatch: Dispatch) => {
  const isSubject = payload.type === 'subject';

  ModuleService.list({
    subject: isSubject ? payload.title : undefined,
    source: !isSubject ? payload.title : undefined,
  }).then(modules => {
    dispatch(setCategory({
      ...payload,
      modules,
    }));
    dispatch(setView(isSubject ? View.SUBJECTS : View.SOURCES));
  });
}

function compare( a: Module, b: Module ) {
  // Sorting for curriculum guides
  if (a.source === "Curriculum Guides" && b.source === "Curriculum Guides") {
    // Full guides sorting (using XOR logic) If both titles are full cir guides can be sorted regularly
    if ((a.name.includes("Full ")) ? !(b.name.includes("Full ")) : (b.name.includes("Full "))) {
      return (a.name.includes("Full "))? -1 : 1;
    }
    // Report card
    if ((b.name.includes("Sample Report Card")) || (a.name.includes("Sample Report Card"))) {
      return (a.name.includes("Sample Report Card"))? -1 : 1;
    }
  }

  // Regular sort by resource name
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

export const loadSubmodules = (payload: ModuleListSubmodulesParams) => (dispatch: Dispatch) => {
  ModuleService.listSubmodules(payload)
    .then(modules => {
      if (modules[0]) {
        if (modules[0].display === Display.Text) {
          dispatch(setResults(modules.sort(compare)));
        } else {
          dispatch(setResults(modules));
        }
      }
      dispatch(setView(View.SUBMODULES));
    })
    .catch(err => {
      if (err.message === 'Not Found') {
        dispatch(setView(View.NOTFOUND));
      }
    });
}

export const setResults = (payload: Module[]) => {
  return {
    type: 'RESULTS',
    payload
  }
}

export const loadResources = (params: ListResourceParams, append = false) => (dispatch: Dispatch) => {
  ResourceService.list(params).then(res => {
    if (append) {
      dispatch(appendResourceList(res));
    } else {
      dispatch(setResourceList(res));
    }
  });
}

export const setResourceList = (payload: ListResourceResponse) => {
  return {
    type: 'RESOURCES',
    payload
  }
}

const appendResourceList = (payload: ListResourceResponse) => {
  return {
    type: 'APPEND_RESOURCES',
    payload
  }
}

export const loadNotifications = (id: number) => (dispatch: Dispatch) => {
  let notFoundUser = {username: '', password: ''}

  UserService.getNotifications(id).then(userData => {
      dispatch(setUser(userData));
    }
  ).catch(() => 
  dispatch(setUser(notFoundUser)))
}

export const read = (notificationId: number,) => (dispatch: Dispatch) => {
  const data = {id: notificationId};

  UserService.read(data);
}

export const sendNotificationUser = (notification: object) => (dispatch: Dispatch) => {
  UserService.sendNotificationUser(notification);
}

export const sendNotificationAdminLogin = (username: string) => async (dispatch: Dispatch) => {
  const request = { isPublic: true, approved: false };
  await ResourceService.list(request).then(res => {
    if (res.count > 0) {
      const newNotification = {
				message: `${res.count}`,
        resource_name: '',
        username: username,
        title: 'Upload pending approval',
        sender: 'Simbi Foundation'
			};

      UserService.sendNotificationUser(newNotification).then(userData => {
        dispatch(setUser(userData));
      });
    }
  });
  FeedbackService.getNewResCount().then(count => {
    if (count > 0) {
      const newNotification = {
        message: `${count}`,
        resource_name: '',
        username: username,
        title: 'Feedback responce',
        sender: 'Simbi Foundation'
      };

      UserService.sendNotificationUser(newNotification).then(userData => {
        dispatch(setUser(userData));
      });
    }
  });
}

export const sendNotificationAdmin = (notification: object) => (dispatch: Dispatch) => {
  UserService.sendNotificationAdmin(notification);
}

export const deleteNotification = (payload: number, id: number) => async (dispatch: Dispatch) => {
  UserService.deleteNotification(payload).then(() => {
    let notFoundUser = {username: '', password: ''}

    UserService.getNotifications(id).then(userData => {
        dispatch(setUser(userData));
      }
    ).catch(() => 
    dispatch(setUser(notFoundUser)))
    });
}

export const getNewResCount = () => (dispatch: Dispatch) => {
  return FeedbackService.getNewResCount();
}

export const deleteOldContent = () => async (dispatch: Dispatch) => {
  UserService.deleteOldNotifications();
  FeedbackService.deleteOldFeedback();
}