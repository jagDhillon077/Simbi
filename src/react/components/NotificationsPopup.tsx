import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, useMediaQuery, IconButton, Badge, Card, CircularProgress} from "@material-ui/core";
import Colors from '../css/Colors';
import { Link } from 'react-router-dom';
import CloseIcon from './icons/CloseIcon';
import { UploadMaterialApproved, UploadMaterialDenied } from './icons/UploadNotification';
import SimbiCloud from './icons/SimbiCloud';
import { loadNotifications } from '../actions';
import { ReduxState } from '../types';
import { connect, ConnectedProps } from 'react-redux';
import { Notification } from '../Data';
import ReloadIcon from './icons/ReloadIcon';
import { getAnchorProps } from '../../helpers';
import { CustomToolTip } from './CustomToolTip';
import { ColorSelect } from './AccessibilityPage';

const mapDispatchToProps = {
  loadNotifications,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  unreadNotifications: number;
  onClose: () => void;
  onSelectNotification: (notification: Notification) => void;
  bellIconRef: any;
  onboarding: boolean;
  screenHeight: number;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkHeight: boolean;
  backgroundCol: ColorSelect;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    position: 'absolute',
    top: 110,
    right: 24,
    backgroundColor: 'white',
    boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
    width: '465px',
    height: (props: StyleProps) => props.shrinkHeight? '315px' : '495px',
    borderRadius: '15px',
  },
  arrowUp: {
    position: 'absolute',
    top: -24,
    right: 27,

    width: 0, 
    height: 0, 
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderBottom: `30px solid ${Colors.LIGHT_ORANGE_50}`,
  },
  headerBanner: {
    position: 'relative',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px 15px 0px 0px',
    height: '79px',
    width: '100%',
    backgroundColor: Colors.LIGHT_ORANGE_50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    margin: '0 auto',
    fontWeight: 700,
    fontSize: '20px',
    color: `${Colors.TEXT_PRIMARY} !important`
  },
  closeButton: {
    position: 'absolute',
    right: 16.8,
  },
  notifications: {
    overflow: 'hidden',
    height: (props: StyleProps) => props.shrinkHeight? '182px' : '364px',
    width: '100%',
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationContainer: {
    position: 'relative',
    width: '100%',
    height: '90px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationImage: {
    width: 36,
    height: 36,
    margin: '0 19px'
  },
  notificationSVG: {
    display: 'flex',
    marginLeft: '14px',
    marginRight: '12px'
  },
  notificationTime: {
    fontFamily: 'Roboto Slab',
    position: 'absolute',
    fontSize: '10px',
    lineHeight: '26px',
    color: Colors.TEXT_SECONDARY,
    bottom: 5,
    right: 13
  },
  notificationBadge: {
    right: -16,
    top: 25,
    fontSize: 14,
    fontWeight: 600,
    width: 22,
    height: 22,
    borderRadius: 22,
    color: 'white !important',
    backgroundColor: Colors.CORAL_400,
  },
  blackLine: {
    width: '100%',
    height: 0,
    borderBottom: '1px solid black'
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
    [`& div p`]: {
      color: Colors.TEXT_PRIMARY
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
  refreshIcon: {
    [`& svg`]: {
      marginRight: 1,
      [theme.breakpoints.down('xs')]: {
        width: 24,
        height: 21,
      },
    }
  },
  refreshButton: {
    '&&': {
      borderRadius: '50%',
      color: 'black',
    },
    padding: 0,
    marginRight: 0
  },
  message: {
    width: '368px', 
    textAlign: 'left',
    fontSize: '18px !important',
    lineHeight: '26px !important',
    letterSpacing: 'normal !important'
  }
}));

/* This function makes the assumption that the user is logged in */
const NotificationsPopup = (props: Props) => {
  const { user, unreadNotifications, onClose, loadNotifications, onSelectNotification, bellIconRef, onboarding, screenHeight, backgroundCol } = props;
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  const theme = useTheme();
  const anchorProps = getAnchorProps(undefined, '/notifications');
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [shrinkHeight, setShrinkHeight] = useState(screenHeight < 624);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const classes = useStyles({ shrinkHeight, backgroundCol });

  useEffect(() => {
    if (user.notifications) setNotifications(user.notifications);
  }, [user]);

  useEffect(() => {
    window.addEventListener("resize", () => {if ((window.innerHeight < 624) !== shrinkHeight) setShrinkHeight(!shrinkHeight)})
  })

  /* Hook that alerts clicks outside of the passed ref */
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (bellIconRef.current) {
          if (ref.current && !ref.current.contains(event.target) && !bellIconRef.current.contains(event.target)) {
            onClose();
          }
        } else {
          if (ref.current && !ref.current.contains(event.target)) {
            onClose();
          }
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const reloadNotifications = () => {
    setRefreshNotifications(true);
    loadNotifications(user.id);

		setTimeout(() => {
			setRefreshNotifications(false);
		}, 1000)
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

  const getNotificationMessage = (title: string, resourceName: string, message: string, read: boolean) => {
    const shownName = (resourceName.length > 12)? resourceName.substring(0,12).concat('...') : resourceName;

    if (title === 'Your Recent Upload') {
      let upStatus = 'denied';
      if (message === null) upStatus = 'approved';
      return (
        <Typography component="p" className={classes.message} style={{color: read? Colors.GRAY_700 : ''}} >
          Your public upload "{shownName}" was {upStatus}. {<Link to="/notifications" style={{color: read? Colors.GRAY_700 : ''}}>See full message</Link>}.
        </Typography>
      );
    } else if (title === 'Welcome!') {
      return (
        <Typography component="p" className={classes.message} style={{color: read? Colors.GRAY_700 : ''}} >
          Welcome to Simbi Learn Cloud! As a teacher, you... {<Link to="/notifications" style={{color: read? Colors.GRAY_700 : ''}}>See full message</Link>}.
        </Typography>
      );
    } else if (title === 'Need help?') {
      return (
        <Typography component="p" className={classes.message} style={{color: read? Colors.GRAY_700 : ''}} >
          Did you know that you can add your own lesson mate... {<Link to="/notifications" style={{color: read? Colors.GRAY_700 : ''}}>See full message</Link>}.
        </Typography>
      );
    } else if (title === 'Upload pending approval') {
      const numUploads = ~~message;
      return (
        <Typography component="p" className={classes.message} style={{color: read? Colors.GRAY_700 : ''}} >
            {'You have '+ numUploads + ' new upload'}{(numUploads > 1)? 's': ''} {' to approve.'} {<Link to="/notifications" style={{color: read? Colors.GRAY_700 : ''}}>See full message</Link>}.
        </Typography>
      );
    } else if (title === 'Feedback responce') {
      const numUploads = ~~message;
      return (
        <Typography component="p" className={classes.message} style={{color: read? Colors.GRAY_700 : ''}} >
            {'You have '+ numUploads + ' new feedback responce'}{(numUploads > 1)? 's': ''} {' to download.'} {<Link to="/notifications" style={{color: read? Colors.GRAY_700 : ''}}>See full message</Link>}.
        </Typography>
      );
    }
    return "Unknown type of notification"
  }

  const getIcon = (title: string, message: string, read: boolean) => {
    return(
      <div className={classes.notificationSVG}>
        {(title === 'Your Recent Upload')? (message === null)? <UploadMaterialApproved monochrome={read}/> : <UploadMaterialDenied monochrome={read}/> : <SimbiCloud monochrome={read} padding={true}/>}
      </div>
    );
  }

  const notificationSlot = (notification: Notification) => {
    return (
      <Card>
        <Link {...anchorProps} className={classes.anchor} onClick={() => {onSelectNotification(notification);}}>
          <div className={classes.notificationContainer} style={{backgroundColor: notification.read? Colors.GRAY_50 : ''}}>
            {getIcon(notification.title, notification.message, notification.read)}
            {getNotificationMessage(notification.title, notification.resource_name, notification.message, notification.read)}
            <span className={classes.notificationTime} style={{color: notification.read? Colors.GRAY_700 : ''}}>{notificationTimestamp(notification.time_sent)}</span>
          </div>
          <div className={classes.blackLine} />
        </Link>
      </Card>
    );
  }

  return (
    <div className={classes.contentContainer} ref={wrapperRef}>
      <div className={classes.arrowUp} />
      <div className={classes.headerBanner}>
        <Typography component="h4" className={classes.header} > Notifications </Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon style={{color: Colors.TEXT_PRIMARY}} shrink={false}/>
        </IconButton>
      </div>
      <div className={`${classes.notifications} ${(notifications.length === 0)? classes.centerContent : '' }`} >
        {notifications.slice(0).reverse().slice(0,shrinkHeight? 2 : 4).map(notification =>  { return notificationSlot(notification);} )}
        {(notifications.length === 0) && <div>
          <Typography component="p" style={{marginBottom: refreshNotifications? 18 : 5}}>No new notifications</Typography>
          {!refreshNotifications && <IconButton edge="end" color="inherit" aria-label="open drawer"
            className={classes.refreshButton} onClick={reloadNotifications} >
            <div className={`${classes.circle} ${classes.refreshIcon}`}><ReloadIcon/></div>
          </IconButton>}
          {refreshNotifications && <CircularProgress color="inherit" />}
          </div>}
      </div>
      {(notifications.length < 4) && <div className={classes.blackLine} />}
      <CustomToolTip title={`Click here to open the notifications page.`} placement={ "top" } arrow open={onboarding}>
        <Badge badgeContent={unreadNotifications} classes={{ badge: classes.notificationBadge}}>
          <Typography component="p" style={{marginTop: 10}}> <Link to='/notifications'>See all</Link> </Typography>
        </Badge>
      </CustomToolTip>
    </div>
  );
}

export default connector(NotificationsPopup);