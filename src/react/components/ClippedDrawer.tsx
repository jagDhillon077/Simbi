import React from 'react';
import { makeStyles, fade, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Dimensions, StatusBar } from 'react-native';

import { Link, useLocation } from 'react-router-dom'
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';
import { setView, loadCategoryModules, loadSearchResults, loadSubmodules, authUser, setContentSettings, setStyleSettings, } from '../actions'
import { connect, ConnectedProps } from 'react-redux';
import ModuleCard from './Card'
import ResultCard from './ResultsCard'
import PDFCard from './pdfCard'
import HomePage from './HomePage'
import { Button, ButtonGroup, Grid, Typography, Badge, InputBase, Fab, IconButton } from "@material-ui/core";
import { Display, sources, Subject, subjects, SubjectCopy, Source, SourceCopy, getSourceGroupCopy, Module, matchesKeyword, matchesSubjectKeyword, Notification } from '../Data'
import { ReduxState, View } from '../types';
import Footer from './Footer';
import { formatString, getAnchorProps, useDebounce, useThrottle } from '../../helpers';
import MasterMenu from './MasterMenu';
import MasterMenuPlaceholder from './MasterMenuPlaceholder';
import BurgerMenuIcon from './icons/BurgerMenuIcon';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CSSTransition } from 'react-transition-group';
import SubmoduleView from './SubmoduleView';
import PageNotFound from './PageNotFound';
import Colors from '../css/Colors';
import { useHistory } from 'react-router-dom';
import UploadDialog from './UploadDialog';
import ResourcesPage from './ResourcesPage';
import ResourcesHome from './ResourcesHome';
import TrainingResources from './TrainingResources';
import AboutPage from './AboutPage';
import HomePlaceholder from './HomePlaceholder';
import CatagoryPlaceholder, { Type } from './CatagoryPlaceholder';
import TeacherDashboard, {ToolTip} from './TeacherDashboard';
import EditProfile from './EditProfile';
import Login, {LoginMessage} from './Login';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import RecoverUsername from './RecoverUsername';
import TimeoutModal from './TimeoutModal';
import Admin from './Admin';
import FeedbackModal from './FeedbackModal';
import { BackDashboardIcon } from "./icons/backIcon";
import { CustomToolTip } from './CustomToolTip';
import { ArrowRightAlt } from '@material-ui/icons';
import NotificationsIcon from './icons/NotificationsIcon';
import NotificationsPopup from './NotificationsPopup';
import NotificationPage from './NotificationPage';
import AccessibilityPage, { AccessibilityContentCookies, AccessibilityStyleCookies, ColorSelect } from './AccessibilityPage';
import ExitPrompt from './ExitPrompt';

export const NAVBAR_HEIGHT = 96;
const xxs = 376;
const xxxs = 321;

const mapDispatchToProps = {
  setView,
  loadCategoryModules,
  loadSearchResults,
  loadSubmodules,
  authUser,
  setContentSettings, 
  setStyleSettings,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    search: state.search,
    view: state.view,
    category: state.category,
    results: state.results,
    user: state.user,
    contentSettings: state.contentSettings,
		styleSettings: state.styleSettings,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

interface StyleProps {
  searchOpen: boolean;
  tabletView: boolean;
  mobileMenuOpen: boolean;
  view: View;
  onSignup: boolean;
  shrinkTopBar: boolean;
	highlightLink: boolean,
	readableFont: boolean,
	highlightHeading: boolean,
	headingsCol: ColorSelect,
	copyCol: ColorSelect,
	backgroundCol: ColorSelect,
  linkCol: ColorSelect,
  fontSize: number | number[],
	lineGap: number | number[],
	charGap: number | number[],
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    [`&::-webkit-scrollbar`]: {
      [theme.breakpoints.up('sm')]: {
        backgroundColor: 'transparent',
      }
    },
    [theme.breakpoints.down('sm')]: {
      scrollbarColor: `#A9A9A9 transparent`,
    },
    [`& a`]: {
			backgroundColor: (props: StyleProps) => props.highlightLink? 'yellow' : '',
      color: (props: StyleProps) => props.linkCol,
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Roboto Slab',
      width: 'fit-content'
		},
    [`& p, label, input, textarea`]: {
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Roboto Slab',
      color: (props: StyleProps) => props.copyCol, 
    },
    [`& span`]: {
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Roboto Slab',
    },
    [`& p`]: {
      fontSize: (props: StyleProps) => `calc(18px + calc(${props.fontSize}px / 25))`,
      lineHeight: (props: StyleProps) => `calc(1.5em + calc(${props.lineGap}px / 25))`,
      letterSpacing: (props: StyleProps) => `calc(0.00938em + calc(${props.charGap}px / 30))`,
      [theme.breakpoints.down('xs')]: {
        fontSize: (props: StyleProps) => `calc(16px + calc(${props.fontSize}px / 25))`,
      },
    },
    [`& button span`]: {
      //color: 'white',
    },
    [`& li li, h1, h2, h3, h4, h5, h6`]: {
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Lora',
      color: (props: StyleProps) => props.headingsCol,
      backgroundColor: (props: StyleProps) => props.highlightHeading? 'yellow' : '',
      width: 'fit-content'
    },     
    [`& .contentContainer`]: {
			backgroundColor: (props: StyleProps) => props.backgroundCol,
		}
  },
  appBar: {
    background: Colors.MAIN_WHITE,
    height: NAVBAR_HEIGHT,
    maxHeight: 160,
    color: theme.palette.common.black,
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 56,
      boxShadow: `0 4px 3px 0 rgba(190,188,188,.25)`,
    },
    [theme.breakpoints.up('md')]: {
      zIndex: theme.zIndex.modal - 1,
    }
  },
  shrinkAppBar: {
    height: 56,
    boxShadow: `0 4px 3px 0 rgba(190,188,188,.25)`,
  },
  content: {
    padding: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : theme.spacing(3),
    paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 80,
    paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 80,
    paddingBottom: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : props.view === View.SEARCH ? 80 : 64,
    marginTop: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 24,
    // screen height - (navbar height + top margin + footer height)
    minHeight: 'calc(100vh - 200px)',
    [theme.breakpoints.down(1380)]: {
      paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 60,
      paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 60,
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 36,
      paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 36,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 24,
      paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 24,
      paddingBottom: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : props.view === View.SEARCH ? 24 : 8,
      minHeight: 'calc(100vh - 250px)',
      marginTop: (props: StyleProps) => (props.view === View.SEARCH) ? 24 : 0,
    },
    [theme.breakpoints.down(xxs)]: {
      paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 20,
      paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 20,
      paddingBottom: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : props.view === View.SEARCH ? 20 : 4,
    },
    [theme.breakpoints.down(xxxs)]: {
      paddingLeft: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 16,
      paddingRight: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : 16,
      paddingBottom: (props: StyleProps) => ((props.view === View.HOME) || (props.view === View.HOMEPLACEHOLDER)) ? 0 : props.view === View.SEARCH ? 18 : 0,
    },
  },
  logo: { 
    maxWidth: 210,
    height: 72,
    [theme.breakpoints.down('sm')]: {
      marginLeft: "16%",
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'unset',
      marginTop: "5px",
      height: '36px',
      width: '60px',
    }
  },
  shrinkLogo: {
    marginLeft: 'unset',
    marginTop: "5px",
    height: '36px',
    width: '60px',
  },
  logoLink: {
    height: 72,
    marginRight: 16,
    backgroundColor: 'transparent !important',
    [theme.breakpoints.down(660)]: {
      marginRight: 0,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: (props: StyleProps) => (props.view === View.LOGIN || !props.onSignup) ? "" : "auto",
    },
    [theme.breakpoints.down('xs')]: {
      height: 48,
    }
  },
  search: {
    display: 'flex',
    position: 'relative',
    borderRadius: 10,
    backgroundColor: fade(theme.palette.common.white, 0.5),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.5),
    },
    marginLeft: -12,
    marginRight: 0,
    width: '100%',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 0,
      width: 'auto',
    },
    border: (props: StyleProps) => props.searchOpen ? '1px solid black' : 'none',
    [theme.breakpoints.down('sm')]: {
      '&&': {
        border: 'none',
      }
    }
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '60%',
    height: '60px',
    width: '60px',
    '&:hover': {
      background: '#E6E6E7',
    },
    [theme.breakpoints.down('xs')]: {
      width: '36px',
      height: '36px',
    }
  },
  shrinkCircle: {
    width: '36px',
    height: '36px',
  },
  searchIcon: {
    width: 40,
    height: 40,
    [theme.breakpoints.down('xs')]: {
      width: 24,
      height: 24,
    },
  },
  shrinkSearchIcon: {
    width: 24,
    height: 24,
  },
  notificationIcon: {
    [`& svg`]: {
      width: 34,
      height: 40,
      [theme.breakpoints.down('xs')]: {
        width: 23,
        height: 26,
      },
    }
  },
  inputRoot: {
    color: 'inherit',
    marginLeft: theme.spacing(2),
    [`& input:first-of-type, span:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
  },
  inputInput: {
    fontFamily: 'Lora',
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '28px',
    padding: (props: StyleProps) => props.searchOpen ? theme.spacing(1) : theme.spacing(1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: (props: StyleProps) =>
      props.searchOpen ?
        props.tabletView ? 'calc(100vw - 82px)' : 'max(40vw, 31ch)' : 0,
    [theme.breakpoints.down('sm')]: {
      width: (props: StyleProps) => props.searchOpen ? 'calc(100vw - 128px)' : 0,
    },
    [theme.breakpoints.down(xxs)]: {
      width: (props: StyleProps) => props.searchOpen ? 'calc(100vw - 78px)' : 0,
    },
    [theme.breakpoints.down(xxxs)]: {
      width: (props: StyleProps) => props.searchOpen ? 'calc(100vw - 70px)' : 0,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      width: (props: StyleProps) => props.searchOpen ? 'calc(100vw - 82px)' : 0,
      paddingLeft: '0 !important'
    }
  },
  rightToolbar: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
    [theme.breakpoints.up('lg')]: {
      marginRight: 20,
    }
  },
  bottom: {
    width: '100%',
    background: '#C4C4C4'
  },
  listHeader: {
    fontSize: '1.5rem',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  leftAlignText: {
    textAlign: 'left',
  },
  subcategoryGrid: {
    margin: theme.spacing(2),
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 24,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    columnGap: 20,
    '&& > *': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '&:after': {
      content: '""',
      width: 300,
    },
    [theme.breakpoints.down('xs')]: {
      '& > .MuiGrid-item': {
        flexBasis: '100%',
      }
    },
  },
  contentContainer: {
    display: 'block',
    width: '100%',
    marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    overflow: 'overlay',
    //scrollbarColor: (props: StyleProps) => `#A9A9A9 ${Colors.GRAY_50}`,
    fallbacks: {
      overflow: 'auto',
    },
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      scrollbarColor: `#A9A9A9 transparent`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    }
  },
  menuButton: {
    height: 40,
    width: 62,
    [`&svg`]: {
      height: 40,
      width: 62,
    },
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      height: 30,
      width: 48,
      marginLeft: 2,
      [`&svg`]: {
        height: 30,
        width: 48,
      },
    },
    [theme.breakpoints.down(xxxs)]: {
      marginLeft: 1,
    },
  },
  shrinkMenuBtn: {
    height: 30,
    width: 48,
    [`&svg`]: {
      height: 30,
      width: 48,
    },
  },
  searchButton: {
    '&&': {
      backgroundColor: (props: StyleProps) => props.searchOpen ? Colors.LIGHT_ORANGE_300 : 'inherit',
      '&:hover': {
        backgroundColor: (props: StyleProps) => props.searchOpen ? Colors.LIGHT_ORANGE_200 : 'inherit',
      },
      borderRadius: (props: StyleProps) => props.searchOpen ? '10px' : '50%',
      borderTopLeftRadius: (props: StyleProps) => props.searchOpen ? 0 : 'inherit',
      borderBottomLeftRadius: (props: StyleProps) => props.searchOpen ? 0 : 'inherit',
      color: (props: StyleProps) => props.searchOpen ? 'white' : 'black',
      [theme.breakpoints.down('sm')]: {
        '&&': {
          marginRight: 0,
          backgroundColor: 'unset',
          border: 'none',
          padding: 5,
          color: 'black'
        }
      },
      [theme.breakpoints.down('xs')]: {
        '&&': {
          paddingRight: 8,
          marginRight: 0,
        }
      },
      [theme.breakpoints.down(xxxs)]: {
        '&&': {
          marginRight: 3,
        }
      }
    },
    marginRight: (props: StyleProps) => props.searchOpen ? 32 : 40,
    padding: (props: StyleProps) => props.searchOpen ? '14px 25px' : 7,
    border: (props: StyleProps) => props.searchOpen ? '1px solid black' : 'none',
  },
  shrinkSearchBtn: {
    '&&': {
      '&&': {
        paddingRight: 8,
      }
    }
  },
  teacherPortalButton: {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: fade('#222222', 0.9),
    },
    [theme.breakpoints.down(750)]: {
      margin: 0,
    },
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    height: 55,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 16,
    paddingBottom: 16,
    width: 167,
    borderRadius: 8,
  },
  appBarLink: {
    position: 'relative',
    textDecoration: 'none',
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 500,
    [theme.breakpoints.up(750)]: {
      margin: '0 20px',
    },
    '&&&': {
      backgroundColor: 'inherit',
      color: Colors.TEXT_PRIMARY,
    },
    '&:hover': {
      color: Colors.ORANGE_400,
    }
  },
  teacherAppBarLink: {
    textDecoration: 'none',
    backgroundColor: 'transparent !important',
  },
  activeLink: {
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -5,
      left: 0,
      backgroundColor: Colors.ORANGE_400,
      width: '100%',
      height: 5,
      borderRadius: 2,
    }
  },
  clearButton: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
    lineHeight: '26px',
    marginRight: 12,
    '&:hover': {
      backgroundColor: 'inherit',
      textDecoration: 'underline'
    }
  },
  toolbar: {
    paddingLeft: 36,
    paddingRight: 36,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    [theme.breakpoints.down(376)]: {
      paddingLeft: 0,
      paddingRight: 0,
    }
  },
  resultsHeader: {
    '& > *': {
      marginBottom: '1rem',
    },
    '& :last-child': {
      marginBottom: '1.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      '& h4': {
        fontSize: '22px',
        fontWeight: 'bold',
        lineHeight: '32px',
        marginBottom: '18px',
      },
      '& p': {
        fontSize: '16px',
        lineHeight: '23px',
      },
    },
  },
  resultsEmpty: {
    '& > *': {
      marginTop: '2.5rem',
    },
    '& :nth-child(2)': {
      marginTop: 0,
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0px !important',
      paddingLeft: '8px !important',
      paddingRight: '8px !important',
      '& p': {
        marginTop: '0px',
        fontSize: '16px',
        textAlign: 'center'
      },
    },
  },
  buttonGroup: {
    borderRadius: 10,
  },
  noBorder: {
    border: 'none',
  },
  categoryBreakdownText: {
    textAlign: 'left',
    
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  textCard: {
    '&&': {
      padding: 0,
    },
    '&:last-child': {
      paddingBottom: 20,
    }
  },
  resultCard: {
    '&&': {
      padding: 0,
    },
    // This is all to prevent double borders in the results list
    '& > * > * > div': {
      borderTop: `1px solid ${Colors.GRAY_300}`,
    },
    '&& > * > * > div:hover': {
      border: `1px solid ${Colors.GRAY_900}`,
      '& + & > * > * > div': {
        borderTop: 'none',
      }
    },
    '&:last-child > * > * > div': {
      borderBottom: `1px solid ${Colors.GRAY_300}`,
    }
  },
  categoryTitle: {
    marginBottom: 40,
    lineHeight: '48px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px',
      lineHeight: '32px',
      marginBottom: 24,
    },
  },
  categoryDescription: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  subcategoryTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontSize: "30px", 
    lineHeight: "40px",
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px',
      lineHeight: '26px',
      marginTop: 0,
    },
  },
  subcategoryDescription: {
    marginBottom: 8,
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  firstpdf: {
    '& div': {
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
    },
  },
  lastpdf: {
    '&&': {
      paddingBottom: 32,
    },
    '& div': {
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
  },
  subjectSearch: {
    color: Colors.TEXT_SECONDARY,
    lineHeight: '26px', 
    fontWeight: 700,
    fontSize: '18px', 
    fontFamily: 'Roboto Slab', 
    marginTop: '24px',
    marginLeft: '12px',

  },
  subjectSearchLink: {
    marginLeft: "8px",
    color: Colors.TEXT_LINK
  },
  notFound: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  return: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0px',
    marginBottom: '60px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '18px',
    },
  },

  //Placeholders
  subjectPlaceholder: {
    height: '46px',
    width: '575px',
    backgroundColor: Colors.GRAY_400,
    marginBottom: 40,
    position: 'relative',
		overflow: 'hidden',
    [theme.breakpoints.down(635)]: {
      width: '90vw',
    },
  },
  grayBar: {
		backgroundColor: Colors.GRAY_400,
		userSelect: 'none', // supported by Chrome, Edge, Opera and Firefox only!
	},
  descriptionPlaceholder: {
    height: 'auto',
    width: '100%',
    color: Colors.GRAY_400,
    position: 'relative',
		overflow: 'hidden',
  },
  healthGuides: {
    height: '800px',
    width: '100%',
    backgroundColor: Colors.GRAY_50,
    position: 'relative',
		overflow: 'hidden',
    marginTop: 40,
  },

  // Animations
  shimmerWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		animation: `$loading 3000ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
	},
	shimmer: {
		width: '30%',
		height: '100%',
		transform: 'skewX(-20deg)',
		boxShadow: '0 0 30px 30px rgba(225, 225, 225, 0.05)'
	},
	lightShimmer: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
	},
	darkShimmer: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
	},
  "@keyframes loading": {
		"0%": { transform: "translateX(-150%)" },
		"50%": { transform: "translateX(-60%)" },
		"100%": { transform: "translateX(150%)" },
	},

  badgeMargin: {
    right: 2,
    fontSize: 16,
    fontWeight: 600,
    width: 25,
    height: 25,
    borderRadius: 12,
    color: 'white !important',
    backgroundColor: Colors.BLUE_200,
    [theme.breakpoints.down('xs')]: {
      width: 20,
      height: 20,
      fontSize: 14,
      borderRadius: 10,
      right: 4,
    },
  },
  notificationBadge: {
    right: 6,
    top: 12,
    fontSize: 12,
    fontWeight: 600,
    width: 18,
    height: 18,
    borderRadius: 22,
    color: 'white',
    backgroundColor: Colors.CORAL_400,
    border: '1px solid white',
    [theme.breakpoints.down('sm')]: {
      right: -36,
      top: -10,
    },
    [theme.breakpoints.down('xs')]: {
      width: 20,
      height: 20,
      fontSize: 14,
      borderRadius: 10,
      right: -22,
    },
  },
  fab: {
    width: 38,
    height: 38,
    backgroundColor: Colors.TEXT_PRIMARY,
    color: theme.palette.common.white,
    position: 'absolute',
    bottom: 40,
    right: 148,
    '&:hover': {
      backgroundColor: '#222222',
    },
    '&&&': {
      boxShadow: 'unset',
    },
    [theme.breakpoints.down('sm')]: {
      right: 48,
    },
    [theme.breakpoints.down('xs')]: {
      right: 16,
    }
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  scrollIconArrow: {
    transform: 'rotate(-90deg)',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    zIndex: 1000,
    backgroundColor: 'black',
    opacity: '0.3',
  },
  notificationButton: {
    '&&': {
      borderRadius: '50%',
      color: 'black',
    },
    padding: 0,
    marginRight: -19,
    marginLeft: 35,
    [theme.breakpoints.down(1280)]: {
      marginRight: 0,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 10,
      marginLeft: 0,
    },
  },
  closeIcon: {
    [theme.breakpoints.down('sm')]: {
      color: 'black !important',
    },
  },
  guidesHeader: {
    display: 'flex',
    paddingBottom: 36,
    marginBottom: 42,
    boxShadow: '0px 2px 0 0 #A9A9A9',
    [theme.breakpoints.down('sm')]: {
      boxShadow: '0 0 0 0 #A9A9A9',
      paddingBottom: 0,
      marginBottom: 16,
      flexDirection: 'column'
    },
  },
  guidesTitle: {
    marginLeft: 16,
    [`& h4`]: {
      marginBottom: 4,
      fontSize: '30px',
      lineHeight: '40px',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '16px'
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '18px',
        lineHeight: '24px',
      },
    },
    [`& p`]: {
      marginBottom: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  guidesIcon: {
    marginTop: 4,
    width: '65px', 
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
  },
  searchGrid: {
    [theme.breakpoints.down('xs')]: {
      width: 'unset',
      margin: '-42px 0 0'
    },
  }
}));

// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 400;

/* Note that this broadcast feature is not supported by internet explorer */
const bcLoggedOut = new BroadcastChannel('loggedOut');
const bcDisablePlaceholder = new BroadcastChannel('DisablePlaceholder');
const bcSubmoduleViewPH = new BroadcastChannel('SubmoduleViewPH');

function ClippedDrawer(props: Props) {
  const {
    view, category, results,
    setView,
    loadCategoryModules,
    loadSearchResults,
    loadSubmodules,
    authUser,
    contentSettings, styleSettings,
    setContentSettings, setStyleSettings
  } = props;

  const searchRef = React.useRef<any>();
  const contentContainerRef = React.useRef<any>();
  const notificationBellRef = React.useRef<any>();
  const topDrawerRef = React.useRef<any>();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [hideAppBarControls, setHideAppBarControls] = React.useState(false);
  const [guidesPage, setGuidesPage] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState(false);
  const [placeholderType, setPlaceholderType] = React.useState(Type.LARGE_CARDS);
  const [hideAppBar, setHideAppBar] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState(false);
  const [feedbackModal, setFeedbackModal] = React.useState(false);
  const [loginMessage, setLoginMessage] = React.useState(LoginMessage.NONE);
  const [onSignup, setOnSignup] = React.useState(false);
  const [backToDashboard, setBackToDashboard] = React.useState(false);
  const [dashboardTooltip, setDashboardTooltip] = React.useState(false);
  const [onboardingTooltip, setOnboardingTooltip] = React.useState(ToolTip.NONE);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [scrollToHIW, setScrollToHIW] = React.useState(0);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification>();
  const placeholderDelay = 500;
  const loggedIn = (props.user.token)? (props.user.token === 'initial')? false : true : false;

  // This might not be nexcessary, using it to debounce the search term while keeping the input updated
  const [searchInput, setSearchInput] = React.useState('');

  // This is only for demonstrating the error dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const theme = useTheme();
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const smallMobileView = useMediaQuery(theme.breakpoints.down(xxs));
  const tinyScreen = useMediaQuery(theme.breakpoints.down(xxxs));
  const [shrinkTopBar, setShrinkTopBar] = React.useState( tabletView? Dimensions.get('window').height < 380 : false );

  const classes = useStyles({ searchOpen, tabletView, mobileMenuOpen, view, onSignup, shrinkTopBar,
    ...styleSettings, ...contentSettings });
  const location = useLocation();
  let history = useHistory();

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
      setShowScrollToTop(false);
    }
  }
  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  const pathname = window.location.pathname.slice(1);

  const setStateFromPathname = () => {
    const path = window.location.pathname.slice(1);
    const segments = path.split('/');
    
    if (segments[0] === 'curriculum-guides') setGuidesPage(true);
    else setGuidesPage(false);

    if (path !== 'feedback') setFeedbackModal(false);
    if (path !== 'upload-materials') setDialogOpen(false);
    if (path !== 'notifications') setSelectedNotification(undefined);
    if (path !== 'curriculum-guides/primary/P2') setBackToDashboard(false);
    if (path !== 'teacher-dashboard' && dashboardTooltip) setDashboardTooltip(false);

    if (onboardingTooltip === ToolTip.HIDDEN_CARD) setOnboardingTooltip(ToolTip.UPLOAD_CARD);
    if (onboardingTooltip === ToolTip.HIDE_FEEDBACK_CARD) setOnboardingTooltip(ToolTip.FEEDBACK_CARD);

    if (segments.length > 1) {
      setPlaceholderType(Type.MINI_CARDS);
      setPlaceholder(true);

      if(view) 
        if (view === View.HOME) {
          if (segments.length === 2) setPlaceholderType(Type.MINI_CARDS);
          else setPlaceholderType(Type.PDF_VIEW);
          setView(View.SOURCES); 
        }
        if (view === View.SUBMODULES) 
          if (segments.length === 2) bcSubmoduleViewPH.postMessage(Type.MINI_CARDS);
          else bcSubmoduleViewPH.postMessage(Type.PDF_VIEW);
      
      loadSubmodules({ path: window.location.pathname });
      setTimeout(async () => {
        //setPlaceholder(false);
        if(view) 
          if (view === View.SUBMODULES) bcDisablePlaceholder.postMessage('Remove placeholder view');
      }, placeholderDelay)

    } else {
      const subjectPath = subjects.find(el => formatString(el) === path); // do placeholders need to be set on for this?
      const sourcePath = sources.find(el => formatString(el) === path);

      if (subjectPath) {
        searchOpen && setSearchOpen(false);
        setSearchInput('');
        setPlaceholderType(Type.LARGE_CARDS);
        setPlaceholder(true);

        if(view) {
          if (view === View.HOME) setView(View.SUBJECTS);
        }

        setTimeout(async () => {
          loadCategoryModules({
            type: 'subject',
            title: subjectPath,
          });
          setPlaceholder(false);
        }, placeholderDelay)
        
      } else if (sourcePath) {
        searchOpen && setSearchOpen(false);
        setSearchInput('');

        if(sourcePath === Source.HesperianHealth) setPlaceholderType(Type.HESPERIAN_VIEW);
        else setPlaceholderType(Type.LARGE_CARDS);

        setPlaceholder(true);

        if(view) {
          if (view === View.SUBMODULES) bcSubmoduleViewPH.postMessage(Type.LARGE_CARDS);
          if (view === View.HOME) setView(View.SOURCES);
        }
          
        setTimeout(async () => {
          loadCategoryModules({
            type: 'source',
            title: sourcePath,
          });
          setPlaceholder(false);
        }, placeholderDelay)
      } else if (path === '') {
        setSearchInput('');
        setPlaceholder(false);
        setView(View.HOME);
      }
      else if (path === 'resources') {
        setView(View.RESOURCES);
      } else if (path === 'resource-list') {
        setView(View.RESOURCESLIST);
      }
      else if (path === 'training-resources') {
        setView(View.TRAININGRESOURCES);
      } else if (path === 'about') {
        setView(View.ABOUT);
      }
      else if (path === 'teacher-portal') {
        setView(View.LOGIN);
      }
      else if (path === 'reset-password') {
        setView(View.RESETPASS);
      }
      else if (path === 'recover-username') {
        setView(View.RECOVERUSERNAME);
      }
      else if (path === 'user') {
        setView(View.SIGNUP);
      }
      else if (path === 'teacher-dashboard') {
        setView(View.DASHBOARD);
      }
      else if (path === 'admin') {
        setView(View.ADMIN);
      }
      else if (path === 'edit-profile') {
        setView(View.EDITPROFILE);
      }
      else if (path === 'edit-password') {
        setView(View.EDITPASSWORD);
      }
      else if (path === 'edit-securityquestion') {
        setView(View.EDITSECURITYQUESTION);
      }
      else if (path === 'accessibility') {
        setView(View.ACCESSIBILITY);
      }
      else if (path === 'notifications') {
        setShowNotifications(false);
        setView(View.NOTIFICATIONS);
      }
      else if (path === 'feedback') {
        if (props.user.username) { 
          setFeedbackModal(true);
          if (onboardingTooltip === ToolTip.FEEDBACK_CARD) setOnboardingTooltip(ToolTip.HIDE_FEEDBACK_CARD);
        } else setView(View.LOGIN);
      }
      else if (path === 'upload-materials') {
        if (props.user.username) {
          setDialogOpen(true);
          if (onboardingTooltip === ToolTip.UPLOAD_CARD) setOnboardingTooltip(ToolTip.HIDDEN_CARD);
        }else setView(View.LOGIN);
      } else {
        setView(View.NOTFOUND);
      }
    }
  }

  const getCategoryContent = () => {
    const isSubject = category.type === 'subject';

    const copyMap = ((isSubject ? SubjectCopy : SourceCopy) as any)[category.title];

    if (!copyMap) {
      return;
    }

    const description = isSubject ? copyMap.copy : copyMap;

    return (
      
      <Grid container spacing={guidesPage ? 1 : 4}>
        {guidesPage && 
          <div className={classes.return}>
            <Link to='/teacher-portal'> <BackDashboardIcon color={styleSettings.highlightLink? Colors.TEXT_PRIMARY : styleSettings.copyCol}/> </Link>
          </div>}
        {!placeholder && (<>
          <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
            {guidesPage && (<div className={classes.guidesHeader} ><img src="/images/teachingGuides.png" className={classes.guidesIcon}/>
              <div className={classes.guidesTitle}>
                <Typography variant="h4" className={classes.categoryTitle}>{category.title}</Typography>
                {!tabletView && <Typography className={classes.categoryBreakdownText}>{`Explore Curriculum Guides from Uganda NCDC.`}</Typography>}
              </div>
            </div>)}
            {!guidesPage && (<Typography variant="h4" className={classes.categoryTitle}>{isSubject ? 'Subject' : 'Source'}: {category.title}</Typography>)}
            <Typography className={classes.categoryDescription} style={{textAlign: (guidesPage && tabletView)? 'center' : 'left'}}>
              {(guidesPage && tabletView)? 'Explore Curriculum Guides from Uganda NCDC. ' : ''}{description}
            </Typography>
          </Grid>
          {getInnerCategoryContent()}
        </>)}
      {placeholder && ( <CatagoryPlaceholder type={placeholderType}></CatagoryPlaceholder>)}
      </Grid>
    );
  }

  const getInnerCategoryContent = () => {
    const isSubject = category.type === 'subject';
    let info: { [x: string]: string };
    let groups: string[];

    if (isSubject) {
      info = SubjectCopy[category.title as Subject].tags;
      groups = Object.keys(info);
    } else {
      groups = [...Array.from(new Set(category.modules.filter(mod => !!mod.group).map(mod => mod.group!)))];
    }

    const filterGroups = (mod: Module, groupKey: string) => {
      if (isSubject) {
        return mod.tags.some(tag => tag.name === groupKey);
      }

      return mod.group === groupKey;
    }

    if (groups.length) { 
      return (
        <>
          <Grid item xs={12} sm={12} md={12} style={{paddingTop: mobileView? '8px' : '', paddingBottom: mobileView? '24px' : ''}}>
            <Typography className={classes.categoryBreakdownText}>{`${category.title} is broken down into the following categories:`}</Typography>
          </Grid>
          {groups.sort((a, b) => a.localeCompare(b)).map((groupKey, idx) => {
            return (
              <Grid container spacing={4} className={`${classes.subcategoryGrid} ${idx === 0 ? classes.noBorder : ''}`} justify="flex-start" key={groupKey}>
                <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
                  <Typography variant="h5" className={classes.subcategoryTitle}>{groupKey}</Typography>
                  <Typography className={classes.subcategoryDescription}>{isSubject ? (info as any)[groupKey] : getSourceGroupCopy(groupKey, category.title)}</Typography>
                </Grid>
                {category.modules.filter(el => filterGroups(el, groupKey)).map(element =>
                  <Grid item key={element.url} style={{paddingTop: mobileView? '14px' : '', paddingBottom: mobileView? '14px' : ''}}><ModuleCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} /></Grid>
                )}
              </Grid>
            );
          })}
        </>
      );
    } else {
      return (
        <>  
          <Grid container spacing={4} style={{justifyContent: guidesPage ? 'left' : 'flex-start', margin: guidesPage ? '16px 4px 0' : '0 16px'}} className={`${classes.subcategoryGrid} ${classes.noBorder}`} justify="flex-start">
            {(guidesPage && (category.modules.length > 0)) && (
              <CustomToolTip title={`Select the type of guide you are looking for.`} placement={ "top-start" } arrow open={onboardingTooltip === ToolTip.GUIDES_CARD} smallScreenMargins={tinyScreen ? '16px' : smallMobileView ? '20px' : '24px'} >
                <Grid item key={category.modules[0].url}>
                  <ModuleCard image={category.modules[0].image} title={category.modules[0].name} author={guidesPage ? 'Uganda NCDC' : category.modules[0].source} port={category.modules[0].port} url={category.modules[0].url} guidesPageView={guidesPage} tooltip={onboardingTooltip === ToolTip.GUIDES_CARD} />
                </Grid>
              </CustomToolTip>
            )}
            {category.modules.map(element =>
              <Grid item key={element.url}>{((element.name === "Primary") && guidesPage)? 
                  <></>
              : <ModuleCard image={element.image} title={element.name} author={guidesPage ? 'Uganda NCDC' : element.source} port={element.port} url={element.url} guidesPageView={guidesPage} />}
              </Grid>
            )}
          </Grid>
        </>
      );
    }
  }

  const getSourceContent = () => {
    if (category.title === Source.HesperianHealth) {
      return (
        <>
          {!placeholder && (
            <Grid direction="column" spacing={1} container className={classes.leftAlignText} style={{margin: 0}}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant="h4">Source: {category.title}</Typography>
                <Typography component="p" style={{ margin: '40px 0', fontSize: mobileView? 16 : 18 }}>{SourceCopy[category.title as Source]}</Typography>
              </Grid>
              {category.modules.filter(e => e.display === Display.Text).sort((a, b) => b.name.localeCompare(a.name))
                .map((element, idx, arr) => {
                  if (element.display === Display.Text) { return <Grid item xs={12} sm={12} md={12} className={`${classes.textCard} ${idx === 0 ? classes.firstpdf : ''} ${idx === arr.length - 1 ? classes.lastpdf : ''}`}><PDFCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} /></Grid> }
                  else {
                    return <Grid item xs={12} sm={12} md={12}><ResultCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} /></Grid>
                  }
                })}
            </Grid>
          )}
          {placeholder && <CatagoryPlaceholder type={Type.HESPERIAN_VIEW}></CatagoryPlaceholder>}
        </>
      );
    } else {
      return getCategoryContent();
    }
  }

  const countUnreadNotifications = () => {
    let count = 0;
    for (let index = 0; index < props.user.notifications.length; index++) {
      if (!props.user.notifications[index].read) count++;
    }
    return count;
  }

  /* Callback functions */
  const onSignUp = () => {
    setLoginMessage(LoginMessage.FIRST_TIME);  
    setOnSignup(true);
  }

  const newActiveSession = () => {
    setOnboardingTooltip(ToolTip.NONE);
    setOnSignup(false);
    setLoginMessage(LoginMessage.NONE);
    setActiveModal(true);
    setShowNotifications(false);
  }

  const resetPassword = () => {
    setLoginMessage(LoginMessage.UPDATED_PASS);
  }

  const onSignout = () => {
    setShowNotifications(false);
    setOnboardingTooltip(ToolTip.NONE);
    bcLoggedOut.postMessage("User signed out.");
  }

  const onModalSignout = () => {
    setActiveModal(false);
    setOnboardingTooltip(ToolTip.NONE);
  }

  const onTimeout = () => {
    setShowNotifications(false);
    setOnboardingTooltip(ToolTip.NONE);
    setLoginMessage(LoginMessage.SESSION_TO); 
    setActiveModal(false);
  }

  const onOnboardingStart = () => {
    setOnboardingTooltip(ToolTip.TRAINING_CARD);
  }

  const onStartUploadOnboarding = () => {
    if (onboardingTooltip === ToolTip.TRAINING_CARD) setOnboardingTooltip(ToolTip.UPLOAD_CARD);
  }

  const onDoneGuidesOnboarding = () => {
    if (onboardingTooltip === ToolTip.GUIDES_CARD) setOnboardingTooltip(ToolTip.FEEDBACK_CARD);
  }

  const onDoneFeedbackOnboarding = () => {
    if (onboardingTooltip === ToolTip.HIDE_FEEDBACK_CARD) setOnboardingTooltip(ToolTip.NOTIFICATIONS);
  }

  const onDoneNotificationOnboarding = () => {
    if (onboardingTooltip === ToolTip.NOTIFICATIONS) setOnboardingTooltip(ToolTip.FINISHED_PROMPT);
  }

  const exitOnboarding = () => {
    setOnboardingTooltip(ToolTip.QUIT_EARLY);
    if (pathname !== 'teacher-dashboard') { history.push('/teacher-dashboard'); }
  }

  const onDoneOnboarding = () => {
    setOnboardingTooltip(ToolTip.DONE); // Set to DONE (not NONE) to prevent race condition in dashboard to reopen prompt
  }

  const onContentScrollTo = (scroll: number) => {
    setScrollToHIW(scroll);
  }

  const closeNotifications = () => {
    setShowNotifications(false);
  }

  const setContentCookies = (settings: AccessibilityContentCookies) => {
    console.log(settings)
    setContentSettings(settings);
  }

  const setStyleCookies = (settings: AccessibilityStyleCookies) => {
    console.log(settings)
    setStyleSettings(settings);
  }
  /* End of callback functions */


  const getViewContent = () => {
    switch (view) {
      case View.SEARCH:
        return (
          <Grid spacing={4} container className={`${results.length > 0 ? classes.leftAlignText : ''} ${classes.searchGrid}`}>
            {results.length > 0 ? (
              <Grid item xs={12} sm={12} md={12} className={classes.resultsHeader}>
                <Typography variant="h4">{`Results for "${props.search}"`}</Typography>
                <Typography component='p' variant="subtitle1">{`Showing ${results.length} result${results.length > 1 ? 's' : ''}`}</Typography>
              </Grid>
            ) : (
                <Grid item xs={12} sm={12} md={12} className={classes.resultsEmpty}>
                  <Typography component="p" variant="subtitle1">{`Sorry, we couldn't find any results for "${props.search}".`}</Typography>
                  <Typography component="p" variant="subtitle1">Please try another search.</Typography>
                  <img src="/images/not_found.png" alt='Not Found' className={classes.notFound}></img>
                </Grid>
              )}
            {matchesKeyword(props.search) ? (matchesKeyword(props.search) === Source.HesperianHealth) ?
              (
                <Grid container spacing={4} className={`${classes.subcategoryGrid} ${classes.noBorder}`} justify="space-between" style={{ paddingBottom: 0 }}>
                  {results.map(element =>
                    <Grid item key={element.url} xs={12} sm={12} md={12}><PDFCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} /></Grid>
                  )}
                </Grid>
              )
              :
              (
                <Grid container spacing={4} className={`${classes.subcategoryGrid} ${classes.noBorder}`} justify="space-between" style={{ paddingBottom: 0 }}>
                  {results.map(element =>
                    <Grid item key={element.url}><ModuleCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} fontSize={contentSettings.fontSize} /></Grid>
                  )}
                </Grid>
              ) : results.map(element =>
                <Grid item xs={12} sm={12} md={12} className={classes.resultCard}><ResultCard image={element.image} title={element.name} author={element.source} port={element.port} url={element.url} /></Grid>
              )}
            <Grid item xs={12} sm={12} md={12} className={classes.resultCard}>
              {matchesSubjectKeyword(props.search) ? (
                <Typography className={classes.subjectSearch} variant="subtitle1"> See: <Link className={classes.subjectSearchLink} to={"/" + formatString(props.search)}> {matchesSubjectKeyword(props.search)} </Link> </Typography>)
                : <div></div>}
            </Grid>
          </Grid>
        );
      case View.SUBJECTS:
        return getCategoryContent();
      case View.SOURCES:
        return getSourceContent();
      case View.SUBMODULES:
        return <SubmoduleView curriculumGuides={guidesPage} onboarding={onboardingTooltip === ToolTip.GUIDES_CARD} onDoneOnboarding={onDoneGuidesOnboarding} setDashboardStep={() => {setBackToDashboard(true)}}/>;
      case View.NOTFOUND:
        return <PageNotFound />;
      case View.RESOURCES:
        return <ResourcesHome shrinkTopBar={shrinkTopBar}/>;
      case View.RESOURCESLIST:
        return <ResourcesPage />;
      case View.LOGIN:
        return <Login stateMessage={loginMessage} shrinkTopBar={shrinkTopBar} activeSession={newActiveSession} />;
      case View.RESETPASS:
        return <ResetPassword onResetPassword={resetPassword} shrinkTopBar={shrinkTopBar}/>;
      case View.RECOVERUSERNAME:
        return <RecoverUsername shrinkTopBar={shrinkTopBar}/>;
      case View.SIGNUP:
        return <SignUp onSignup={onSignUp} shrinkTopBar={shrinkTopBar}/>;
      case View.DASHBOARD:
        return <TeacherDashboard onSignout={onSignout} shrinkTopBar={shrinkTopBar} scrollTo={location.hash} activeToolTip={onboardingTooltip} onOnboardingStart={onOnboardingStart} onOnboardingEnd={onDoneOnboarding} onOnboardingExit={exitOnboarding} />;
      case View.TRAININGRESOURCES:
        return <TrainingResources shrinkTopBar={shrinkTopBar} onboarding={onboardingTooltip === ToolTip.TRAINING_CARD} onDoneOnboarding={onStartUploadOnboarding} quitEarly={exitOnboarding}/>;
      case View.EDITPROFILE:
      case View.EDITPASSWORD:
      case View.EDITSECURITYQUESTION:
        return <EditProfile shrinkTopBar={shrinkTopBar} editSection={view}/>;
      case View.HOME:
        if (placeholder) return <CatagoryPlaceholder type={Type.LARGE_CARDS} ></CatagoryPlaceholder>
        else return  <HomePage scrollTo={location.hash} backgroundColor={styleSettings.backgroundCol} onScrollTo={onContentScrollTo} />;
      case View.HOMEPLACEHOLDER:
        return <HomePlaceholder />;
      case View.ABOUT:
        return <AboutPage shrinkTopBar={shrinkTopBar} backgroundCol={styleSettings.backgroundCol}/>;
      case View.ADMIN:
        return <Admin scrollTo={location.hash} shrinkTopBar={shrinkTopBar}/>;
      case View.ACCESSIBILITY:
        return <AccessibilityPage shrinkTopBar={shrinkTopBar} setContentSettings={setContentCookies} setStyleSettings={setStyleCookies}/>;
      case View.NOTIFICATIONS:
        return <NotificationPage shrinkTopBar={shrinkTopBar} initialNotification={selectedNotification} topDrawerRef={topDrawerRef} onboarding={onboardingTooltip === ToolTip.NOTIFICATIONS} quitEarly={exitOnboarding} onDoneOnboarding={onDoneNotificationOnboarding} openNotification={() => {setDashboardTooltip(true);}}/>
    }
  }

  const getPathnameMatches = (array: string[]) => {
    const segments = location.pathname.split('/');
    let count = 0;

    segments.forEach((segment, index) => {
      if (array[index]) {
        if (array[index] === segment) count++;
      }
    });
    return count;
  }

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const checkWidth = () => {
    return (((Dimensions.get('screen').width - Dimensions.get('window').width) > 10) && tabletView)
  }

  React.useEffect(() => {
    window.addEventListener("resize", () => {if((Dimensions.get('window').height < 380) !== shrinkTopBar) setShrinkTopBar(tabletView? !shrinkTopBar : false);})
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      if (contentContainerRef.current) {
        if ((scrollToHIW !== 0)) {
          contentContainerRef.current.scrollTo(0, scrollToHIW);
          setScrollToHIW(0);
  
        } else if ((onboardingTooltip === ToolTip.GUIDES_CARD) && (pathname === 'curriculum-guides') ) {
          smallMobileView? contentContainerRef.current.scrollTo(0, 170) : contentContainerRef.current.scrollTo(0, 90); 
        }
      }
		}, placeholderDelay+100)
  }, [contentContainerRef.current, onboardingTooltip, pathname, scrollToHIW,]);

  React.useEffect(() => {
    setStateFromPathname();
  }, [pathname]);

  React.useEffect(() => {
    if (props.user.notifications) setUnreadNotifications(countUnreadNotifications());
  }, [props.user]);

  React.useEffect(() => {
    if(view === View.LOGIN || view === View.SIGNUP || view === View.RESETPASS || view === View.RECOVERUSERNAME) {
      setHideAppBar(true);
    } else {
      setHideAppBar(false);
    }
    if((view !== View.LOGIN) && (loginMessage === LoginMessage.SESSION_TO || loginMessage === LoginMessage.UPDATED_PASS)) setLoginMessage(LoginMessage.NONE);
  }, [view]);

  React.useEffect(() => {
    if (contentContainerRef.current && !((onboardingTooltip === ToolTip.GUIDES_CARD) && (pathname === 'curriculum-guides'))) {
      contentContainerRef.current.scrollTo(0, 0);
    }
  }, [category, view]);

  React.useEffect(() => {
    authUser();
  }, []);

  React.useEffect(() => {
    if (props.user && loggedIn && !activeModal) setActiveModal(true);
  }, [props.user])

  const debounceInput = useDebounce((input: string) => {
    if (input !== '') {
      loadSearchResults(input);
    } else {
      setStateFromPathname();
    }
  }, 250);

  const teacherPortalButton = () => {
    return (
    <Link to="/teacher-portal" className={classes.teacherAppBarLink} onClick={() => { if(dashboardTooltip) {setDashboardTooltip(false); setOnboardingTooltip(ToolTip.FINISHED_PROMPT);}}}>
      <Button variant="contained" className={classes.teacherPortalButton}>
        {loggedIn? "Dashboard" : "Teacher's Portal"}
      </Button>
    </Link>);
  }

  const burgerMenuButton = () => {
    return (
      <IconButton
        edge="start"
        className={`${classes.menuButton} ${shrinkTopBar? classes.shrinkMenuBtn : ''}`}
        color="inherit"
        aria-label="open drawer"
        onClick={() => mobileMenuOpen? setMobileMenuOpen(false) : setMobileMenuOpen(true)}
      >
        <BurgerMenuIcon />
      </IconButton>
    );
  }

  if (guidesPage && !props.user.token) setView(View.LOGIN);
  return (
    <div className={classes.root} style={{width: (checkWidth())? Dimensions.get('window').width : '100vw'}}>
      <CssBaseline />
      {!(hideAppBar && !tabletView) && (
        <AppBar position="fixed" className={`${classes.appBar} ${shrinkTopBar? classes.shrinkAppBar : ''}`}>

      <Toolbar className={classes.toolbar} ref={topDrawerRef}>
        {tabletView && !hideAppBarControls && (!onSignup || view === View.LOGIN) && (
          <CustomToolTip title={`Click here to open the notification page.`} placement={ "bottom-start" }
            arrow open={onboardingTooltip === ToolTip.NOTIFICATIONS && !mobileMenuOpen && !(view === View.NOTIFICATIONS)} arrowLeftPosition={33} arrowLeftPositionXS={33}
          >
            <IconButton
              edge="start"
              className={`${classes.menuButton} ${shrinkTopBar? classes.shrinkMenuBtn : ''}`}
              color="inherit"
              aria-label="open drawer"
              onClick={() => mobileMenuOpen? setMobileMenuOpen(false) : setMobileMenuOpen(true)}
            >
              <Badge
              badgeContent={loggedIn? unreadNotifications : 0}
              classes={{ badge: classes.notificationBadge}}></Badge>
                <BurgerMenuIcon />
                
            </IconButton>
          </CustomToolTip>
        )}
        {tabletView && !hideAppBarControls && onSignup && (view !== View.LOGIN) && (
          <CustomToolTip title={`Click here to sign in to your new account!`} placement={ "bottom-start" }
            arrow open={!mobileMenuOpen} arrowLeftPosition={16} arrowLeftPositionXS={15}
          >
            <Badge
            badgeContent={"!"}
            classes={{ badge: classes.badgeMargin}}
            >
              {burgerMenuButton()}
            </Badge>
          </CustomToolTip>
        )}
        {!(hideAppBarControls && tabletView) && (
          <Link to="/" className={classes.logoLink} style={{height: shrinkTopBar? 48 : '', marginRight: shrinkTopBar? 0 : ''}}
            onClick={() => { setSearchInput(''); setView(View.HOME); }}>
            <img src="/images/simbi.png" alt='Simbi Learn Cloud' className={`${classes.logo} ${shrinkTopBar? classes.shrinkLogo : ''}`}/>
          </Link>
        )}
        <section className={classes.rightToolbar}>
          {!tabletView && !hideAppBarControls && (
            <>
              {/* TODO: Get the port from the backend environment variables? */}
              <Link {...getAnchorProps(undefined, '/simbi-reading')} className={pathname === 'simbi-reading' ? `${classes.appBarLink} ${classes.activeLink}` : classes.appBarLink}>
                Simbi Reading
              </Link>
              <Link to="/resources" className={pathname === 'resources' ? `${classes.appBarLink} ${classes.activeLink}` : classes.appBarLink}>
                Resources
              </Link>
              <Link to="/accessibility" className={pathname === 'accessibility' ? `${classes.appBarLink} ${classes.activeLink}` : classes.appBarLink}>
                Accessibility
              </Link>
            </>
          )}
          <ButtonGroup className={classes.buttonGroup}>
            <div className={classes.search}>
              <CSSTransition
                in={searchOpen}
                timeout={300}
                classNames={classes.inputInput}
                onEnter={() => setHideAppBarControls(true)}
                onExited={() => setHideAppBarControls(false)}
              >
                <InputBase
                  placeholder={!tabletView ? 'Search a topic. Start typing to see results...' : 'Search here'}
                  value={searchInput}
                  inputRef={searchRef}
                  autoFocus
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchInput(event.target.value);
                    debounceInput(event.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchOpen(false);
                      setSearchInput('');
                    }
                  }}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  endAdornment={!tabletView && searchOpen && (
                    <Button
                      variant="text"
                      className={classes.clearButton}
                      onClick={() => {
                        setSearchInput('');
                        searchRef.current!.focus();
                        debounceInput('');
                      }}
                    >
                      Clear
                    </Button>
                  )}
                />
              </CSSTransition>
            </div>
            <IconButton
              edge="end"
              className={`${classes.searchButton} ${shrinkTopBar? classes.shrinkSearchBtn : ''}`}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen && searchRef.current) {
                  searchRef.current.focus();
                }
                if (searchOpen && tabletView) {
                  setSearchInput('');
                  debounceInput('');
                }
              }}
            >
              {searchOpen ? <CloseIcon className={classes.closeIcon} shrink={mobileView}/> : <div className={`${classes.circle} ${shrinkTopBar? classes.shrinkCircle : ''}`}><SearchIcon className={`${classes.searchIcon} ${shrinkTopBar? classes.shrinkSearchIcon : ''}`} /></div>}
            </IconButton>
          </ButtonGroup>
          {(!tabletView && !onSignup) && (
            <CustomToolTip
            title={`Click here to return to the teacher dashboard.`}
            placement={ "bottom-end" } arrow open={dashboardTooltip}>
              {teacherPortalButton()}
            </CustomToolTip>
          )}
          {(!tabletView && onSignup) && (
            <CustomToolTip
            title={`Click here to sign in to your new account!`}
            placement={ "bottom-end" }
            arrow
            open={true}
          >
            <Badge
            badgeContent={"!"}
            classes={{ badge: classes.badgeMargin}}
            >
              {teacherPortalButton()}
            </Badge>
          </CustomToolTip>
          )}
          {(loggedIn && !tabletView) && 
            <CustomToolTip title={`Click here to open the notification preview.`}
              placement={ "bottom-end" } arrow open={onboardingTooltip === ToolTip.NOTIFICATIONS && !showNotifications && !(view === View.NOTIFICATIONS)}>
              <IconButton
                edge="end"
                ref={notificationBellRef}
                className={classes.notificationButton}
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  if(view != View.NOTIFICATIONS) setShowNotifications(!showNotifications);
                }}
              >
                <div className={`${classes.circle} ${classes.notificationIcon}`}>
                  <Badge badgeContent={unreadNotifications} classes={{ badge: classes.notificationBadge}}><NotificationsIcon /></Badge>
                </div>
              </IconButton>
            </CustomToolTip>
            }
            {loggedIn && showNotifications && 
              <NotificationsPopup unreadNotifications={unreadNotifications} onClose={closeNotifications} onSelectNotification={(notification: Notification)=>{setSelectedNotification(notification);}} bellIconRef={notificationBellRef} onboarding={onboardingTooltip === ToolTip.NOTIFICATIONS} screenHeight={Dimensions.get('screen').height}/>
            }
        </section>
      </Toolbar>

    </AppBar> 
      )}
      {[View.NOTFOUND, View.RESOURCES, View.RESOURCESLIST, View.TRAININGRESOURCES, View.DASHBOARD, View.EDITPROFILE, View.EDITPASSWORD, View.EDITSECURITYQUESTION , View.LOGIN, View.SIGNUP, View.RESETPASS, View.RECOVERUSERNAME, View.ABOUT, View.ADMIN, View.NOTIFICATIONS, View.ACCESSIBILITY].includes(view) ? (
        <>
          {getViewContent()}
          {tabletView && <MasterMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} onSignup={(view === View.LOGIN) ? false : onSignup} unreadNotifications={unreadNotifications} onboarding={onboardingTooltip === ToolTip.NOTIFICATIONS && view !== View.NOTIFICATIONS} /> }
          {(showNotifications || (onboardingTooltip === ToolTip.NOTIFICATIONS && view != View.NOTIFICATIONS)) && <div className={classes.backdrop} />}
          {((view != View.NOTIFICATIONS) && (onboardingTooltip === ToolTip.NOTIFICATIONS)) && (
                <ExitPrompt currentStep={(showNotifications || mobileMenuOpen)? 13 : 12} quitOnboarding={exitOnboarding} />
          )}
        </>
      ) : (
          <>
            {!guidesPage && (<MasterMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} onSignup={(view === View.LOGIN) ? false : onSignup} unreadNotifications={unreadNotifications} onboarding={onboardingTooltip === ToolTip.NOTIFICATIONS && view !== View.NOTIFICATIONS} />) }

            <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainerRef} onScroll={onScroll}>
              <main className={classes.content} onClick={() => setMobileMenuOpen(false)} style={{clipPath: (onboardingTooltip === ToolTip.GUIDES_CARD && guidesPage)? 'inset(0 0 0 0)' : '', marginTop: guidesPage? 0 : ''}}>
                {((guidesPage && (onboardingTooltip === ToolTip.GUIDES_CARD)) || showNotifications || (onboardingTooltip === ToolTip.NOTIFICATIONS)) && <div className={classes.backdrop}/>}
                {getViewContent()}
              </main>
              {showScrollToTop && (
                <Fab className={classes.fab} onClick={scrollToTop}>
                  <ArrowRightAlt className={classes.scrollIconArrow} />
                </Fab>
              )}
              <Footer />
              {(guidesPage && (onboardingTooltip === ToolTip.GUIDES_CARD)) && (
                <ExitPrompt currentStep={backToDashboard? 9 : getPathnameMatches('/curriculum-guides/primary/P2'.split('/')) + 5} quitOnboarding={exitOnboarding} />
              )}
              {((view != View.NOTIFICATIONS) && (onboardingTooltip === ToolTip.NOTIFICATIONS)) && (
                <ExitPrompt currentStep={(showNotifications || mobileMenuOpen)? 13 : 12} quitOnboarding={exitOnboarding} />
              )}
            </div>
            
          </>
        )}
        {feedbackModal && <FeedbackModal onboarding={onboardingTooltip === ToolTip.HIDE_FEEDBACK_CARD} onDoneOnboarding={onDoneFeedbackOnboarding} ></FeedbackModal>}
        {activeModal && <TimeoutModal onSignout={onModalSignout} onTimeout={onTimeout} />}
      <UploadDialog
        firstName={props.user.firstName} username={props.user.username} admin={props.user.isAdmin}
        open={dialogOpen} tooltip={onboardingTooltip === ToolTip.HIDDEN_CARD} styleSettings={styleSettings}
        handleClose={() => {if (onboardingTooltip === ToolTip.HIDDEN_CARD) setOnboardingTooltip(ToolTip.GUIDES_CARD); setDialogOpen(false); }}
      />
    </div>

  );
}

export default connector(ClippedDrawer)
