import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, useMediaQuery, IconButton, Grid, Card, CardActionArea, CircularProgress, Snackbar, Button} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Colors from '../css/Colors';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { Link } from 'react-router-dom';
import CloseIcon from './icons/CloseIcon';
import { UploadMaterialApproved, UploadMaterialDenied } from './icons/UploadNotification';
import SimbiCloud from './icons/SimbiCloud';
import DeleteIcon from './icons/DeleteIcon';
import { RightArrow, LeftArrow } from './icons/ArrowIcons';
import { loadNotifications, read, deleteNotification } from '../actions';
import { FullUser, Notification } from '../Data';
import { connect, ConnectedProps } from 'react-redux';
import { ReduxState } from '../types';
import ReloadIcon from './icons/ReloadIcon';
import { useHistory } from 'react-router-dom';
import UserService from '../../services/users';
import ExitPrompt from './ExitPrompt';
import { CustomToolTip } from './CustomToolTip';
import { ColorSelect } from './AccessibilityPage';

const WIDE_CARDS = 1110;
const MOBILE_VIEW = 840;

const mapDispatchToProps = {
  loadNotifications,
  read,
  deleteNotification
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
    textCol: state.styleSettings.copyCol
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  //onClose: () => void;
  initialNotification?: Notification;
  topDrawerRef: any;
  onboarding: boolean;
  shrinkTopBar: boolean;
  quitEarly: () => void;
  onDoneOnboarding: () => void;
  openNotification: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  selectedNotification: boolean;
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect;
  textCol: ColorSelect;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    width: '100%',
    overflow: 'auto',
    padding: 'none',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    }
  },
  orangeSection: {
    backgroundColor: Colors.LIGHT_ORANGE_50,
    overflowX: 'hidden',
    overflowY: 'auto',
    minWidth: '609px',
    minHeight: '100%',
    position: 'relative',
    [theme.breakpoints.down(1300)]: {
      minWidth: '47%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      width: '100%',
      display: (props: StyleProps) => props.selectedNotification? 'none' : '',
    },
  },
  orangeHeader: {
    textAlign: 'center',
    color: Colors.TEXT_SECONDARY,
    marginTop: '24px'
  },
  notificationViewSection: {
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%',
    padding: '54px 64px',
    position: 'relative',
    [`& div p, div h1`]: {
      color: Colors.TEXT_PRIMARY
    },
    [theme.breakpoints.down(WIDE_CARDS)]: {
      padding: '54px 32px',
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      display: (props: StyleProps) => props.selectedNotification? '' : 'none',
      padding: '40px 32px 78px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '20px 16px 78px',
    },
  },
  messageView: {
    backgroundColor: 'white',
    overflow: 'auto',
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
    padding: '92px 72px 32px',
    [theme.breakpoints.down(WIDE_CARDS)]: {
      padding: '92px 54px 32px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '92px 32px 32px',
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      padding: '72px 32px 0',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '52px 19px 0',
    },
  },
  messageTitle: {
    fontSize: 48, 
    textAlign: 'left',
    [theme.breakpoints.down('xs')]: {
      fontSize: 24, 
      marginTop: 24
    },
  },
  deleteButton: {
    display: 'flex', 
    flexDirection: 'row', 
    width: 'fit-content', 
    cursor: 'pointer',
    [`& a`]: {
      width: 'fit-content', 
      marginLeft: 4, 
      textDecoration: 'underline', 
      color: '#2D52B2', 
      fontSize: 16,
      fontFamily: 'Roboto Slab'
    },

    [theme.breakpoints.up(MOBILE_VIEW)]: {
      position: 'absolute',
      top: 26,
      right: 35,
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      margin: 'auto 0 16px auto',
    },
  },
  notificationCopy: {
    marginTop: 30,
    textAlign: 'left',
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      fontSize: 16,
    },
  },
  sectionHeader: {
    textAlign: 'center', 
    fontSize: '30px',
    fontWeight: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    },
  },
  notificationContainer: {
    position: 'relative',
    width: '506px',
    height: '186px',
    borderRadius: '15px',
    boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
    marginLeft: '52px',
    marginBottom: '14px',
    [`& p:first-of-type`]: {
      color: Colors.TEXT_PRIMARY
    },
    [`& p:nth-of-type(2)`]: {
      color: Colors.TEXT_SECONDARY,
      [theme.breakpoints.down(MOBILE_VIEW)]: {
        color: Colors.TEXT_PRIMARY
      },
    },
    [theme.breakpoints.down(1300)]: {
      width: 'calc(100% - 103px)',
    },
    [theme.breakpoints.down(WIDE_CARDS)]: {
      width: 'calc(100% - 50px)',
      marginLeft: '25px'
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      width: 'calc(100% - 64px)',
      marginLeft: '32px'
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 32px)',
      marginLeft: '16px',
      height: '95px',
    },
  },
  notificationCardCopy: { 
    textAlign: 'left',
    height: '54px',
    marginRight: '10px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      WebkitLineClamp: 1,
      height: '25px',
    },
  },
  notificationTitle: {
    margin: '24px 0 22px 31px',
    fontWeight: 700,
    textAlign: 'left',
    [theme.breakpoints.down(1170)]: {
      marginLeft: 18
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      marginLeft: '34px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      margin: '6px 0 4px',
    },
  },
  titleBordered: {
    margin: '31px 0 30px 28px',
    [theme.breakpoints.down(1170)]: {
      marginLeft: 15
    },
  },
  notificationImage: {
    width: 36,
    height: 36,
    margin: '0 19px'
  },
  notificationSVG: {
    display: 'flex',
    marginLeft: '45px',
    marginRight: '11px',
    width: '50px',
    [theme.breakpoints.down(1170)]: {
      marginLeft: 24
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      marginLeft: '45px',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '30px 3px 0 9px',
      width: 'auto',
    },
  },
  seeFullMessage: {
    color: Colors.TEXT_SECONDARY, 
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      fontSize: 9,
      margin: '0 15px 14px auto !important'
    },
  },
  svgBordered: {
    marginLeft: 42,
    [theme.breakpoints.down(1170)]: {
      marginLeft: 21
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      marginLeft: 42,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 6,
    },
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '60%',
    height: '60px',
    width: '60px',
    '&:hover': {
      background: (props: StyleProps) => (props.backgroundCol === ColorSelect.BLACK)? Colors.GRAY_800 : '#E6E6E7',
    },
    [theme.breakpoints.down('xs')]: {
      width: '36px',
      height: '36px',
    }
  },
  refreshIcon: {
    [`& svg`]: {
      marginRight: 1,
      [theme.breakpoints.down('xs')]: {
        width: 24,
        height: 21,
      },
    },
    '&:hover': {
      background: '#E6E6E7 !important',
    },
  },
  arrowButton: {
    '&&': {
      borderRadius: '50%',
      color: 'black',
    },
    padding: 0,
    height: 40,
    marginLeft: -10
  },
  leftIcon: {
    [`& svg`]: {
      marginRight: 2,
    }
  },
  rightIcon: {
    [`& svg`]: {
      marginLeft: 2,
    }
  },
  refreshButton: {
    '&&': {
      borderRadius: '50%',
      color: 'black',
    },
    position: 'absolute',
    top: 38,
    left: 42,
    padding: 0,
    marginRight: 0,
    [theme.breakpoints.down(WIDE_CARDS)]: {
      left: 12,
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      left: 22,
    },
    [theme.breakpoints.down('xs')]: {
      left: 12,
      top: 19,
    },
  },
  refreshProgress: {
    position: 'absolute', 
    top: 50, 
    left: 55,
    [theme.breakpoints.down(WIDE_CARDS)]: {
      left: 25,
    },
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      left: 35,
    },
    [theme.breakpoints.down('xs')]: {
      left: 21,
      top: 27,
    },
  },
  emptyNotificationSection: {
    margin:'auto',
    [theme.breakpoints.down(MOBILE_VIEW)]: {
      display: 'none',
    }
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 18,
    [theme.breakpoints.down('xs')]: {
      right: 7,
      top: 10
    }
  },
  leaveButton: {
    position: 'absolute',
    right: 24,
    top: 42,
    [theme.breakpoints.down('xs')]: {
      right: 8,
      top: 17
    }
  },
  notificationArrowSection: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 19,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 'fit-content',
    [`& p:first-of-type`]: {
      color: (props: StyleProps) => props.textCol,
    }
  },
  nothing: {
    marginLeft: '0 0 0 8px',
    padding: 0
  },
  deletionAlert: {
    backgroundColor: Colors.CORAL_400,
    color: theme.palette.common.white,
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 600,
    padding: '18px 16px',
    borderRadius: 4,
    boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.25)',
    [`&p`]: {

    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      width: '100%',
      diplay: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '14px 16px 18px',
    }
  },
  snackbarClose: {
    color: theme.palette.common.white,
    marginLeft: 105,
    '&:hover': {
      color: '#ffffffee'
    },
    [theme.breakpoints.down(1070)]: {
      marginLeft: 65,
    },
    [theme.breakpoints.down(970)]: {
      marginLeft: 50,
    },
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      top: 10,
      right: 10
    }
  },
  closeIcon: {
    width: 18,
    height: 18,
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      width: 14,
      height: 14,
    }
  },
  undoButton: {
    width: '147px',
    height: '55px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: Colors.CORAL_400,
    fontWeight: 600,
    fontSize: 17,
    '&:hover': {
      backgroundColor: Colors.GRAY_100,
      color: Colors.CORAL_300,
    },
    [theme.breakpoints.down('xs')]: {
      width: '97px',
      height: '26px',
      borderRadius: '4px',
      border: '1px solid #E25266',
      fontSize: 13,
    }
  },
  alertAction: {
    paddingLeft: 39,
    [theme.breakpoints.down('xs')]: {
      margin: '4px auto 0 auto',
      padding: 0
    }
  },
  alertMessage: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center'
    }
  }
}));

const NotificationPage = (props: Props) => {
  const { user, shrinkTopBar, loadNotifications, read, deleteNotification, onboarding, backgroundCol,
    textCol, quitEarly, onDoneOnboarding, openNotification} = props;
  let history = useHistory();
  const wrapperRef = React.useRef<any>(null);

  const theme = useTheme();
  const effectiveMobileView = useMediaQuery(theme.breakpoints.down(MOBILE_VIEW));
  const lowerTooltip = useMediaQuery(theme.breakpoints.down(1124));
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const [intialNotification, setInitialNotification] = useState(false);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [deletedPrompt, setDeletedPrompt] = useState(false);
  const [exitTooltip, setExitTooltip] = useState(false);
  const [first_Read, setFirstRead] = useState<boolean | undefined>(undefined);
  const [selectedNotification, setSelectedNotification] = useState<Notification>(); 
  const [notificationIndex, setNoticationIndex] = useState(1);
  const [deletedNotification, setDeletedNotification] = useState(-1);
  const [notifications, setNotifications] = useState<Notification[]>([]); 
  const classes = useStyles({selectedNotification: selectedNotification? true : false, shrinkTopBar, backgroundCol, textCol});
  let activeTimeout = 0

  /* Hook that alerts clicks outside of the passed ref */
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && deletedPrompt) {
        deleteNow();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, deletedPrompt]);
 
  useEffect(() => {
    if (user.notifications) {
      if (onboarding) {
        const notificationArray = user.notifications.slice(0);
        notificationArray.push({id: 0, sender: 'Simbi Foundation', title: 'Onboarding notification', message: '', resource_name: '', time_sent: new Date().toString(), read: (first_Read === false)? true : false});
        setNotifications(notificationArray.reverse());
      } else {
        setNotifications(user.notifications.slice(0).reverse());
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedNotification && notifications) {
      if (onboarding && selectedNotification.id === 0 && first_Read === undefined) { setFirstRead(true); openNotification();
      } else if (selectedNotification.id !== 0 && first_Read === true) setFirstRead(false);

      setNoticationIndex(notifications.findIndex((el) => el.id === selectedNotification.id));
 
      if (!selectedNotification.read) {
        if (onboarding && (selectedNotification.id === 0)) {
          notifications[0].read = true;
        } else {
          read(selectedNotification.id);
          setTimeout(() => {
            if (user) loadNotifications(user.id);
          }, 100);
        }
      }
    }
  }, [selectedNotification]);


  useEffect(() => {
    if(props.initialNotification && !intialNotification) {
      setSelectedNotification(props.initialNotification);
      setInitialNotification(true);
    }
  },);

  const reloadNotifications = () => {
    setRefreshNotifications(true);
    loadNotifications(user.id);

		setTimeout(() => {
			setRefreshNotifications(false);
		}, 1000)
  }

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const deleteSelectedNotification = () => {
    if (selectedNotification) setDeletedNotification(selectedNotification.id);

    closeNotification();
    setDeletedPrompt(true);
  }

  const deleteNow = ()  => {
    setDeletedPrompt(false);
    deleteNotification(deletedNotification, user?.id);
  }

  const restoreNotification = () => {
    setDeletedPrompt(false);
    setDeletedNotification(-1);
  }

  const goBack = () => {
    if (exitTooltip) onDoneOnboarding();

    history.goBack();
  }

  const selectNotification = (notification: Notification) => {
    setLoadingNotification(true);
    setSelectedNotification(notification);
    clearTimeout(activeTimeout);
    activeTimeout = window.setTimeout(() => {
      setLoadingNotification(false);
    }, 750);
    
  }

  const closeNotification = () => {
    if (onboarding && (first_Read !== undefined)) setExitTooltip(true);
    setSelectedNotification(undefined);
  }

  const notificationTimestamp = (time: string) => {
    const sentTime = new Date(time);
    const currentTime = new Date();
    const dayInMinutes = 60 * 24;
    const monthInMinutes = dayInMinutes * 30; 
    const minutesSinceSent = Math.max(0, Math.floor((currentTime.getTime() - sentTime.getTime()) / 60000));

    if (minutesSinceSent < monthInMinutes) {
      if (minutesSinceSent < dayInMinutes) {
        if (minutesSinceSent < 60) {
          return (minutesSinceSent === 1)? `1 minute ago` : `${minutesSinceSent} minutes ago`;
        } else {
          const diff = Math.floor(minutesSinceSent / 60);
          return (diff === 1)? `1 hour ago` : `${diff} hours ago`;
        }
      } else {
        const diff = Math.floor(minutesSinceSent / dayInMinutes);
        return (diff === 1)? `1 day ago` : `${diff} days ago`;
      }
    } else {
      const diff = Math.floor(minutesSinceSent / monthInMinutes);
      return (diff === 1)? `1 month ago` : `${diff} months ago`;
    }
  } 

  const getNotificationCardMessage = (title: string, resourceName: string, message: string, read: boolean,) => {
    const shownName = (resourceName.length > 12)? resourceName.substring(0,12).concat('...') : resourceName;

    if (title === 'Your Recent Upload') {
      let upStatus = 'denied';
      if (message === null) upStatus = 'approved';
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
          Your public upload "{shownName}" was {upStatus}. </Typography>
      );
    } else if (title === 'Welcome!') {
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
          Welcome to Simbi Learn Cloud! As a teacher, you will receive notifications here... </Typography>
      );
    } else if (title === 'Need help?') {
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
          Did you know that you can upload your own lesson materials on Simbi Learn Cloud... </Typography>
      );
    } else if (title === 'Upload pending approval') {
      const numUploads = ~~message;
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
            {'You have '+ numUploads + ' new upload'}{(numUploads > 1)? 's': ''} {' to approve.'} </Typography>
      );
    } else if (title === 'Feedback responce') {
      const numUploads = ~~message;
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
            {'You have '+ numUploads + ' new feedback responce'}{(numUploads > 1)? 's': ''} {' to download.'} </Typography>
      );
    } else if (title === 'Onboarding notification') {
      const numUploads = ~~message;
      return (
        <Typography component="p" className={classes.notificationCardCopy} style={{color: read? Colors.GRAY_700 : '',}}>
            This is an example notification. </Typography>
      );
    }
    return "Unkown type of notification"
  }

  const getIcon = (title: string, message: string, read: boolean, selected: boolean) => {
    return(
      <div className={`${classes.notificationSVG} ${selected? classes.svgBordered : ''}`}>
        {(title === 'Your Recent Upload')? (message === null)? <UploadMaterialApproved monochrome={read} shrink={mobileView}/> : <UploadMaterialDenied monochrome={read} shrink={mobileView}/> : <SimbiCloud monochrome={read} padding={true} shrink={mobileView}/>}
      </div>
    );
  }

  const notificationCard = (notification: Notification) => {
    const selected = (selectedNotification?.id === notification.id);
    const firstRead = (first_Read && notification.id === 0) || (selected && !selectedNotification?.read);

    return(
      <Card className={classes.notificationContainer} style={{backgroundColor: (notification.read && !firstRead)? Colors.GRAY_50 : 'white', border: selected? '3px solid #455A95' : '', display: (deletedNotification === notification.id)? 'none' : ''}} >
        <CardActionArea style={{height: '100%'}} onClick={() => {selectNotification(notification)}}>
          {!mobileView && <Typography component="p" className={`${classes.notificationTitle} ${selected? classes.titleBordered : ''}`} 
            style={{color: (notification.read && !firstRead)? Colors.GRAY_700 : ''}}>Message from {notification.sender}</Typography>}
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {getIcon(notification.title, notification.message, (notification.read && !firstRead), selected)}
            {!mobileView && getNotificationCardMessage(notification.title, notification.resource_name, notification.message, (notification.read && !firstRead))}
            {mobileView && <div>
              <Typography component="p" className={`${classes.notificationTitle} ${selected? classes.titleBordered : ''}`} 
              style={{color: (notification.read && !firstRead)? Colors.GRAY_700 : ''}}>Message from {notification.sender}</Typography>
              {getNotificationCardMessage(notification.title, notification.resource_name, notification.message, (notification.read && !firstRead))}
            </div>}
          </div>
          <Typography component="p" className={classes.seeFullMessage} style={{margin: selected? '6px 12px 14px auto' : '6px 15px 14px auto', color: (notification.read && !firstRead)? Colors.GRAY_700 : Colors.TEXT_SECONDARY}}>{effectiveMobileView? 'Tap to view full message' : 'Click to view full message'}</Typography>
          
        </CardActionArea>
      </Card>
    );
    
  }

  const getNotificationContent = () => {

    switch(selectedNotification?.title) {
      case "Your Recent Upload":
        if (selectedNotification.message === null) {
          return(<>
            <Typography className={classes.notificationCopy}>{'Your public upload "'+selectedNotification.resource_name+'" was approved.'}</Typography>
            <Typography className={classes.notificationCopy}>Your upload is now viewable on the Resources page. Click <Link to="/resource-list">here</Link> to view it.</Typography>
            </>);
        } else {
          return(<>
            <Typography className={classes.notificationCopy}>{'Your public upload "'+selectedNotification.resource_name+'" was denied because "'+selectedNotification.message+'".'}</Typography>
            <Typography className={classes.notificationCopy}>Your upload is still viewable in your private uploads. Click <Link to="/teacher-dashboard#teacherNotes">here</Link> to view it or delete it.</Typography>
            </>);
        }
      case "Welcome!":
        return(<>
          <Typography className={classes.notificationCopy}>Welcome to Simbi Learn Cloud! As a teacher, you will receive notifications here when your uploaded documents are approved or denied by the school admin.</Typography>
          <Typography className={classes.notificationCopy}>Thank you for making your teacher account, and we hope that Simbi Learn Cloud supports you in your teaching!</Typography>
          </>);
      case "Need help?":
        return(<>
          <Typography className={classes.notificationCopy}>Do you need help getting started with Simbi Learn Cloud?</Typography>
          <Typography className={classes.notificationCopy}>In your teacher dashboard, click on ‘Training Resources’ to watch a full video series about Simbi Learn Cloud, your BrightBox, and how to use the technology provided.</Typography>
          <Typography className={classes.notificationCopy}>Or, you can click <Link to="/training-resources">here</Link> to go straight there!</Typography>
          </>);
      case "Upload pending approval":
        const uploads = selectedNotification.message? parseInt(selectedNotification.message) : 1;
        return(<>
          <Typography className={classes.notificationCopy}>You have {uploads} new upload{uploads>1? 's':''} to review. Click <Link to="/admin">here</Link> to go to your admin tools.</Typography>
        </>);
      case "Feedback responce":
        const responces = selectedNotification.message? parseInt(selectedNotification.message) : 1;
        return(<>
          <Typography className={classes.notificationCopy}>There {responces>1? 'are':'is'} {responces} new feedback responce{responces>1? 's':''} to download. Click <Link to="/admin#feedbackResponces">here</Link> to go download feedback responces.</Typography>
        </>);
      case "Onboarding notification":
        return(<>
          <Typography className={classes.notificationCopy}>This is an example notification. If this is your fist time logging into SLC, come back after your onboarding to checkout the 'welcome!' and 'need help?' notifications to learn more about what you can do on Simbi Lean Cloud. </Typography>
        </>);
      default:
        return(<>
          </>);
    }
  }

  const deleteButton = () => {
    return(
      <div className={classes.deleteButton} onClick={deleteSelectedNotification}>
        <DeleteIcon shrink={mobileView}/>
        <a>Delete message</a>
      </div>
    );
  }

  !user.token && history.push('/teacher-portal');
  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={wrapperRef}>
      <Grid direction="column"  alignItems="center" className={classes.orangeSection}>
        {!refreshNotifications && <IconButton edge="end" color="inherit" aria-label="open drawer"
            className={classes.refreshButton} onClick={reloadNotifications} >
            <div className={`${classes.circle} ${classes.refreshIcon}`}><ReloadIcon/></div>
          </IconButton>}
        {refreshNotifications && <CircularProgress color="inherit" size={mobileView? 22 : 38} className={classes.refreshProgress}/>}
        <Typography component="h3" className={classes.sectionHeader} style={{fontSize: mobileView? 22 : 36, marginTop: mobileView? 21 : 38, marginBottom: mobileView? 10 : 14}} >Notifications</Typography>
        {effectiveMobileView && <CustomToolTip title={`Click here to return to the teacher dashboard.`} placement={mobileView? "bottom-end" : "left"} arrow open={exitTooltip}>
          <IconButton aria-label="close" className={classes.leaveButton} onClick={goBack}>
            <CloseIcon style={{color: Colors.TEXT_PRIMARY}} shrink={mobileView} />
          </IconButton>
        </CustomToolTip>}
        {(notifications.length === 0)? 
          <div style={{position: 'absolute', width: '100%', top: '45%'}}>
            <Typography variant='h3' className={classes.sectionHeader}>No notifications</Typography>
            <Typography component="p" style={{textAlign: 'center', marginTop: 10, fontSize: '16px'}}>
              <Link to='/teacher-dashboard' style={{ textDecoration: 'none' }}>{`< `}</Link><Link to='/teacher-dashboard'>Back to Dashboard</Link>
            </Typography>
          </div> :
          <>
          {onboarding && <CustomToolTip title={`Click on the notification card to open it.`} placement={lowerTooltip? effectiveMobileView? "bottom" : "bottom-start" : "right" } arrow open={first_Read === undefined}>
            <div>{notificationCard(notifications[0])}</div>
          </CustomToolTip>}
          {notifications.map(notification =>  { 
            if ((onboarding && notification.id !== 0) || !onboarding) { 
              return notificationCard(notification);
            }
            })}
          </>
        }
      </Grid>
      {(notifications.length === 0)? 
        <div className={classes.emptyNotificationSection}>
          <Typography variant='h3' className={classes.sectionHeader}>No notifications</Typography>
          <Typography component="p" style={{textAlign: 'center', marginTop: 10, fontSize: '16px'}}>
            <Link to='/teacher-dashboard' style={{ textDecoration: 'none' }}>{`< `}</Link><Link to='/teacher-dashboard'>Back to Dashboard</Link>
          </Typography>
        </div> :
        <div className={classes.notificationViewSection}>
          <div className={classes.messageView} style={{ justifyContent: (!selectedNotification)? 'center' : '', paddingTop: ((loadingNotification && !effectiveMobileView) || !selectedNotification)? 32 : ''}} >
            {!selectedNotification? <Typography variant='h3' className={classes.sectionHeader} >Select a notifiaction to view it</Typography>
            : <> 
            {(loadingNotification)? <CircularProgress color="inherit" size={48} style={{margin: 'auto'}}/>
              : <>
              {effectiveMobileView && <CustomToolTip title={`Click here to close the notification.`} placement={mobileView? "bottom-end" : "left"} arrow open={first_Read !== undefined}>
                <IconButton aria-label="close" className={classes.closeButton} onClick={closeNotification}>
                  <CloseIcon style={{color: textCol}} shrink={mobileView} />
                </IconButton>
              </CustomToolTip>}
              {!effectiveMobileView && !(onboarding && selectedNotification.id === 0) && deleteButton()}
              <Typography component="p" style={{display: 'flex', flexDirection: 'row', textAlign: 'left'}}>{'From '}
                <Typography component="p" style={{fontWeight: 600, margin: '0 5px',}}>{selectedNotification.sender}</Typography> 
                {!mobileView && <Typography component="p" style={{color: Colors.GRAY_900}}>{' - '+notificationTimestamp(selectedNotification.time_sent)}</Typography>}
              </Typography>
              {mobileView && <Typography component="p" style={{color: Colors.GRAY_900, fontSize: 16, textAlign: 'left'}}>{notificationTimestamp(selectedNotification.time_sent)}</Typography>}
              <Typography variant="h1" className={classes.messageTitle}>{selectedNotification.title}</Typography>
              <div style={{margin: tabletView? '24px 0 42px' : '62px 0 0'}}> 
                <Typography style={{textAlign: 'left'}}>Hello {user.firstName.charAt(0).toUpperCase()+user.firstName.slice(1)}{user.isAdmin? ' '+user.lastName : ''},</Typography>
                {getNotificationContent()}
                {!(selectedNotification.title === 'Welcome!' || selectedNotification.title === 'Need help?') && 
                  <Typography className={classes.notificationCopy}>{(selectedNotification.sender === 'Simbi Foundation')? 'Simbi Foundation' : 'Thank you.'}</Typography>
                }
              </div>
              {effectiveMobileView && deleteButton()}
              </>
            }
            </>
            }
          </div>
          {effectiveMobileView && <div className={classes.notificationArrowSection}>
            <IconButton edge="end" color="inherit" aria-label="open drawer"
              className={classes.arrowButton} disabled={notificationIndex === 0} onClick={() => {selectNotification(notifications[notificationIndex-1])}} >
              <div className={`${classes.circle} ${classes.leftIcon}`} style={{width: 40, height: 40}}><LeftArrow disabled={notificationIndex === 0} inverse={backgroundCol === ColorSelect.BLACK}/></div>
            </IconButton>
            <Typography style={{fontSize: 16, margin: mobileView? '7px 26px 0' : '7px 60px 0'}}>
              {(notificationIndex+1)+' of '+notifications.length+' notifications'}
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="open drawer"
              className={classes.arrowButton} disabled={notificationIndex === (notifications.length - 1)} onClick={() => {selectNotification(notifications[notificationIndex+1])}} >
              <div className={`${classes.circle} ${classes.rightIcon}`} style={{width: 40, height: 40,}}><RightArrow disabled={notificationIndex === (notifications.length - 1)} inverse={backgroundCol === ColorSelect.BLACK}/></div>
            </IconButton>
          </div>}
        </div>
      }
      <Snackbar
        open={deletedPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={8000}
        onClose={deleteNow}
      >
        <Alert
          classes={{ icon: classes.nothing, action: classes.alertAction, message: classes.alertMessage }}
          icon={<></>}
          className={classes.deletionAlert}
          onClose={deleteNow}
          action={<>
            <Button className={classes.undoButton} onClick={restoreNotification}><span style={{color: Colors.TEXT_PRIMARY}}>UNDO</span></Button>
            <IconButton className={classes.snackbarClose} onClick={deleteNow}>
              <CloseIcon className={classes.closeIcon} shrink={mobileView}/>
            </IconButton>
            </>
          }
        >
          <span style={{fontSize: mobileView? 16 : 18, fontWeight: mobileView? 400 : 600, color: 'white'}}> Notification deleted. </span>
        </Alert>
      </Snackbar>
      {onboarding && (
        <ExitPrompt currentStep={(first_Read === undefined)? 14 : (exitTooltip)? 16 : 15} quitOnboarding={quitEarly} />
      )}
    </div>
  );
}

export default connector(NotificationPage);