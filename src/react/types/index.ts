import { ListResourceResponse } from '../../services/resources';
import { FullUser, Module, User } from '../Data';
import { AccessibilityContentCookies, AccessibilityStyleCookies, ColorSelect } from '../components/AccessibilityPage';
import CookieService, { CookieKeys } from '../../services/cookie';

export enum View {
  ADMIN, ABOUT, ACCESSIBILITY, DASHBOARD, EDITPROFILE, EDITPASSWORD, EDITSECURITYQUESTION, HOME, HOMEPLACEHOLDER, SIGNUP, LOGIN, TRAININGRESOURCES, SEARCH, SUBJECTS, 
  SOURCES, SUBMODULES, NOTFOUND, NOTIFICATIONS, RESETPASS, RECOVERUSERNAME, RESOURCES, RESOURCESLIST,
}

export interface CardProps {
  port: string;
  url: string;
  author: string;
  title: string;
  image: string;
  index?: number;
  guidesPageView?: boolean;
  onClick?: () => void;
  tooltip?: boolean;
  fontSize?: number | number[];
}

export interface VideoCardProps {
  title: string
  url: string
  thumbnail: string;
  //loadedVideos: string[];
  //setLoadedVideos: Function;
  onOpen: Function;
  setToolTip?: boolean;
}

export interface CategoryObject {
  type: 'subject' | 'source';
  title: string;
  modules: Module[]; 
}

export type CategoryPayload = Pick<CategoryObject, "type" | "title">;

export interface ReduxState {
  user: FullUser;
  search: string;
  view: View;
  category: CategoryObject;
  results: Module[];
  resourceList: ListResourceResponse;
  userList: FullUser[];
  pincode: number;
  contentSettings: AccessibilityContentCookies;
  styleSettings: AccessibilityStyleCookies;
  loadedVideos: string[];
}

export const defaultState: ReduxState = {
  search: '',
  view: View.HOME,
  category: {
    type: 'subject',
    title: 'Mathematics',
    modules: [],
  },
  results: [],
  resourceList: { resources: [], count: 0 },
  user: {
    "username": '',
    "firstName": '',
    "lastName": '',
    "token": 'initial',
    "isAdmin": false,
    'securityAnswer': '',
    "doneOnboarding": true,
    "notifications": [],
  },
  userList: [],
  pincode: 513814,
  contentSettings: {fontSize: ~~CookieService.get(CookieKeys.FONT_SIZE), 
    lineGap: ~~CookieService.get(CookieKeys.LINE_SP), charGap: ~~CookieService.get(CookieKeys.LETTER_SP)
  },
  styleSettings: { highlightLink: CookieService.getBoolean(CookieKeys.LINK_HL), readableFont: CookieService.getBoolean(CookieKeys.READABILITY),
    highlightHeading: CookieService.getBoolean(CookieKeys.HEADING_HL), headingsCol: CookieService.getColorSelect(CookieKeys.HEADING_COL, ColorSelect.BLACK),
    copyCol: CookieService.getColorSelect(CookieKeys.BODY_COL, ColorSelect.BLACK), backgroundCol: CookieService.getColorSelect(CookieKeys.BACKGROUND_COL, ColorSelect.WHITE),
    linkCol: CookieService.getColorSelect(CookieKeys.LINK_COL, ColorSelect.BLUE)
  },
  loadedVideos: [],
}
