import React, { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, fade, withStyles } from '@material-ui/core/styles';
import { Button, Typography, useTheme, Dialog, Backdrop, Snackbar, Fab, IconButton, Link} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from './icons/CloseIcon';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { ReduxState } from '../types';
import { loadResources, setResourceList, logoutUser, setOnboardingDone, setUser, } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import DashboardCard from './DashboardCard';
import Colors from '../css/Colors';
import Footer from './Footer';
import Login from './Login';
import { User } from '../Data';
import { Dispatch } from "redux";
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as CK12 from './icons/cardIcons/CK12';
import ResourceCard from './ResourceCard';
import ResourceService from '../../services/resources';
import UserService from '../../services/users'
import { Resource } from '../Data';
import { useThrottle } from '../../helpers';
import { ArrowRightAlt } from '@material-ui/icons';
import ExitPrompt from './ExitPrompt';
import { ColorSelect } from './AccessibilityPage';

export enum ToolTip {
  TRAINING_CARD, UPLOAD_CARD, HIDDEN_CARD, GUIDES_CARD, FEEDBACK_CARD, HIDE_FEEDBACK_CARD, NOTIFICATIONS, QUIT_EARLY, FINISHED_PROMPT, NONE, DONE
}

const mapDispatchToProps = {
  loadResources,
  setResourceList,
  logoutUser,
  setOnboardingDone,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    resourceList: state.resourceList,
    user: state.user,
    styleSettings: state.styleSettings
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  activeToolTip: ToolTip;
  shrinkTopBar: boolean;
  onOnboardingStart: () => void;
  onOnboardingEnd: () => void;
  onOnboardingExit: () => void;
  onSignout: () => void;
  scrollTo: string;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    width: '100%',
    overflow: 'auto',
    padding: 'none',
    textAlign: 'left',
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      overflow: 'overlay',
      fallbacks: {
        overflow: 'auto',
      },
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    }
  },
  container: {
    padding: '14px 72px 80px',
    [theme.breakpoints.down('sm')]: {
      padding: '24px 32px 40px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '24px 16px 40px',
    },
  },
  title: {
    width: '100%',
    marginBottom: 16,
    fontSize: '36px',
    lineHeight: '48px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '26px',
      lineHeight: '32px',
    },
  },
  proposition: {
    padding: '42px 0 64px',
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      padding: '25px 0 24px',
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  welcome: {
    position: 'relative',
    zIndex: 1,
    fontSize: '20px',
    fontFamily: 'Roboto Slab !important',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px',
    },
  },
  welcomeUnderline: {
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 387,
      height: 14,
      float: 'center',
      backgroundColor: Colors.YELLOW_200,
      bottom: 0,
      zIndex: -1,
      [theme.breakpoints.down('xs')]: {
        width: 348,
      },
    },
  },
  topLine: {
    '&::before': {
      [theme.breakpoints.down(384)]: {
        width: 250,
      },
    }
  },
  bottomLine: {
    '&::before': {
      [theme.breakpoints.down(384)]: {
        width: 97,
      },
    }
  },
  cardContainer: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
  },
  logout: {
    position: 'relative',
    textDecoration: 'underline',
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: 'bold',
    color: '#2D52B3',
    cursor: 'pointer',
    fontFamily: 'Roboto Slab',
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  teachingNotesSection: {
    marginTop: 80,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      marginTop: 40,
      textAlign: 'center',
      [`& h5`]: {
        marginRight: 'auto',
        marginLeft: 'auto'
      }
    },
  },
  teachingNotesProposition: {
    marginTop: 16,
    marginBottom: 48,
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '23px',
      marginBottom: 32,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
  },
  nothing: {
    marginLeft: '0 0 0 8px',
  },
  deletionAlert: {
    backgroundColor: Colors.CORAL_400,
    color: theme.palette.common.white,
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 600,
    padding: '12px 16px',
    borderRadius: 4,
    boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.25)',
  },
  updateAlert: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.BLUE_200,
    color: theme.palette.common.white,
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 600,
    padding: '11px 16px',
    borderRadius: 4,
    boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.25)',
  },
  snackbarClose: {
    color: theme.palette.common.white,
    marginLeft: 50,
    '&:hover': {
      color: '#ffffffee'
    }
  },
  checkmark: {
    fill: theme.palette.common.white,
    width: 37,
    height: 37,
  },
  closeIcon: {
    width: 18,
    height: 18,
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
  arrow: {
    transform: 'rotate(-90deg)',
  },
  dialogContent: {
    textAlign: 'center',
    borderRadius: '4px',
    boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
    overflowX: 'hidden',

    [`& div`]: {
      padding: '48px 54px 40px',
      [theme.breakpoints.down('sm')]: {
        padding: '24px 32px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '24px 16px',
      },
      [`& p`]: {
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: '28px',
        marginBottom: 32,
        [theme.breakpoints.down('sm')]: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '23px',
          marginBottom: 24,
        },
      },
    },
  },
  onboardingDialog: {
    backgroundColor: Colors.GRAY_50,
    [theme.breakpoints.up('md')]: {
      minWidth: 740,
    },
  },
  exitTitle: {
    marginBottom: '36px !important',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '20px !important',
    },
  },
  exitContent: {
    marginBottom: '20px !important',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '12px !important',
    },
  },
  selectionButton: {
    fontSize: 17,
    fontWeight: 600,
    lineHeight: '20px',
    height: 55,
    width: 147,
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      height: 40,
      fontSize: 15,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
  deleteButton: {
    backgroundColor: Colors.CORAL_400,
    color: 'white',
    '&:hover': {
      backgroundColor: fade(Colors.CORAL_300, 0.9),
    },
    marginRight: 24,
  },
  cancelButton: {
    backgroundColor: 'white',
    color: Colors.CORAL_400,
    '&:hover': {
      backgroundColor: fade(Colors.GRAY_100, 0.9),
    },
    border: '1.5px solid #E25266',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 12,
    },
  },
  skipButton: {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: fade(Colors.GRAY_300, 0.9),
    },
  },
  startButton: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 750,
    fontSize: '18px !important',
    '&:hover': {
      backgroundColor: fade(Colors.GRAY_100, 0.9),
    },
    border: '1.5px solid #000000',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px !important',
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: 12,
    },
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
}));

const LOAD_MORE_LIMIT = 50;

// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 400;

const bc = new BroadcastChannel('Add new private upload');

const TeacherDashboard = (props: Props) => {
  const { logoutUser, loadResources, setResourceList, setOnboardingDone, onSignout, 
    activeToolTip, shrinkTopBar, onOnboardingStart, onOnboardingEnd, onOnboardingExit, scrollTo, styleSettings} = props
  const { backgroundCol, readableFont, headingsCol, highlightHeading, copyCol } = styleSettings;
  const classes = useStyles({ shrinkTopBar, backgroundCol });
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const teachNotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bc.onmessage = event => {console.log(event); 
      // Update frontend list
      const newResources = props.resourceList.resources;
      newResources.push(event.data);
      const newCount = props.resourceList.count + 1;

      setResourceList({
        resources: newResources,
        count: newCount,
      });
    };
  }, []);

  useEffect(() => {
    if (teachNotesRef.current  && (scrollTo === "#teacherNotes")) scrollToPos(teachNotesRef.current.offsetTop - 125);
  }, [teachNotesRef.current, contentContainerRef.current]);

  let path = ''
  let history = useHistory();
  const theme = useTheme();
  

  const handleLogout = (token: string) => {
    logoutUser(token);
    onSignout();
    history.push(path)
 };

 // Comented out code below is if a search bar for privatly uploaded resources is added 
  // const [searchInput, setSearchInput] = useState('');
  // const [grades, setGrades] = useState<string[]>([]);
  // const [offset, setOffset] = useState(0);
  const [teacherNotesOpen, setTeacherNotesOpen] = React.useState(false);
  const [resourceID, setResourceID] = useState(0);
  const [resourceName, setResourceName] = useState('Title');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [pending, setPending] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [quitEarly, setQuitEarly] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [startOnboarding, setStartOnboarding] = useState((activeToolTip === ToolTip.NONE)? !props.user.doneOnboarding : false);

  const twoRows = useMediaQuery(theme.breakpoints.down(384));
  const shrinkImage = useMediaQuery(theme.breakpoints.down(370));
  const twoColumns = useMediaQuery(theme.breakpoints.down(1177));
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const smallMobileView = useMediaQuery(theme.breakpoints.down(400));

  const startDashboardOnboarding = () => {
    setStartOnboarding(false);
    onOnboardingStart();
  }

  const finishDashboardOnboarding = () => {
    if (!props.user.doneOnboarding) {
      setOnboardingDone(props.user);
    } 
    onOnboardingEnd();
  }

  const skipOnboarding = () => {
    setStartOnboarding(false);
    if (!props.user.doneOnboarding) {
      setOnboardingDone(props.user);
      onOnboardingEnd();
    } 
  }

  const handleClose = (alert: 'delete' | 'update', reason?: string) => {
    if (reason !== 'clickaway') {
      if (alert === 'delete') {
        setShowDeleteAlert(false);
      } else {
        setShowUpdateAlert(false);
      }
    }
  }

  const handleCloseDelete = (_event?: React.SyntheticEvent, reason?: string) => handleClose('delete', reason);
  const handleCloseUpdate = (_event?: React.SyntheticEvent, reason?: string) => handleClose('update', reason);
  const backdrop = (activeToolTip === ToolTip.TRAINING_CARD) || (activeToolTip === ToolTip.UPLOAD_CARD) || (activeToolTip === ToolTip.GUIDES_CARD) || (activeToolTip === ToolTip.FEEDBACK_CARD) || (activeToolTip === ToolTip.NOTIFICATIONS)

  const setDeleteWarning = async (resource: Resource) => {
    setResourceName(resource.name);
    setResourceID(resource.id);
    setShowDeleteWarning(true);
  }

  const closeDeleteWarning = () => {
    setShowDeleteWarning(false);
  }

  const updateResource = async (newResource: Resource) => {
    await ResourceService.update(newResource.id, newResource);

    const newResources = props.resourceList.resources.map(res => res.id === newResource.id ? newResource : res);

    setResourceList({
      ...props.resourceList,
      resources: newResources,
    });
    if(newResource.isPublic && !newResource.approved) setPending(true); 
    else setPending(false); 

    setShowUpdateAlert(true);
  }

  const deleteResource = async () => {
    try {
      await ResourceService.delete(resourceID);
    } catch (e) {
      console.error(e);
    }
    setShowDeleteWarning(false);

    // Update frontend list
    const newResources = props.resourceList.resources.filter((res) => res.id !== resourceID);
    const newCount = props.resourceList.count - 1;

    setResourceList({
      resources: newResources,
      count: newCount,
    });
    setShowDeleteAlert(true);
  }

  const scrollToPos = (scroll: number) => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, scroll);
    }
  }

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
      setShowScrollToTop(false);
    }
  }

  const restartOnboarding = () => {
    setStartOnboarding(true);
  }

  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  useEffect(() => {
    if (activeToolTip === ToolTip.TRAINING_CARD && !startOnboarding) {scrollToPos(mobileView? smallMobileView? 170 : 110 : 60); setOnboardingStep(0); }
    else if (activeToolTip === ToolTip.UPLOAD_CARD && !startOnboarding) { scrollToPos(mobileView? smallMobileView? 480 : 410 : 60); setOnboardingStep(3); }
    else if (activeToolTip === ToolTip.HIDDEN_CARD && !startOnboarding) { setOnboardingStep(4); }
    else if (activeToolTip === ToolTip.GUIDES_CARD && !startOnboarding) { scrollToPos(twoColumns? mobileView? smallMobileView? 810 : 760 : 410 : 60); setOnboardingStep(5); }
    else if (activeToolTip === ToolTip.FEEDBACK_CARD && !startOnboarding) { scrollToPos(mobileView? smallMobileView? 1135 : 1010 : 410); setOnboardingStep(10); }
    else if (activeToolTip === ToolTip.HIDE_FEEDBACK_CARD && !startOnboarding) { setOnboardingStep(11); }
    else if (activeToolTip === ToolTip.NONE && !props.user.doneOnboarding) setStartOnboarding(true); // Prevent race condition when switching users mid onboarding
  }, [activeToolTip, startOnboarding, contentContainerRef.current]);

  useEffect(() => {
    loadResources({ limit: LOAD_MORE_LIMIT, isPublic: false, username: props.user.username });

    if (props.resourceList.count > 0) setTeacherNotesOpen(true);
    else setTeacherNotesOpen(false);
  }, [props.user.username, props.resourceList.count]);

  !props.user.token && history.push('/teacher-portal')
  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainerRef} onScroll={onScroll}>
      <div className={classes.container} style={{clipPath: backdrop? 'inset(0 0 0 0)' : ''}}>
        {!tabletView && <div style={{paddingTop: '10px', paddingBottom: '14px', textAlign: 'right'}}>
          <a onClick={() => handleLogout(props.user.token.toString())} className={classes.logout}>
            Log out 
          </a>
        </div>}
        <Typography variant="h4" className={classes.title}>Hello {props.user.firstName} {props.user.lastName},</Typography>
        {twoRows ? (<div style={{flexDirection: 'column'}}>
          <Typography variant="h6" className={`${classes.welcome} ${(backgroundCol === ColorSelect.WHITE)?classes.welcomeUnderline:''} ${(backgroundCol === ColorSelect.WHITE)?classes.topLine:''}`}>Welcome to the SLC Teacher</Typography>
          <Typography variant="h6" className={`${classes.welcome} ${(backgroundCol === ColorSelect.WHITE)?classes.welcomeUnderline:''} ${classes.bottomLine}`}>Dashboard</Typography>
        </div>
          ):
        <Typography variant="h6" className={`${classes.welcome} ${(backgroundCol === ColorSelect.WHITE)?classes.welcomeUnderline:''}`} style={{backgroundColor: 'transparent'}}>Welcome to the SLC Teacher Dashboard</Typography>
        }
        
        <Typography component="p" className={classes.proposition}>
        Simbi Learn Cloud’s Teacher’s Portal is full of unique tools to support your teaching. 
        Here, you can watch technology training videos, upload your own teaching resources, 
        find curriculum guides to help you plan lessons, and more!
        </Typography>

        {tabletView && <div style={{marginBottom: '32px'}}>
            <a onClick={() => handleLogout(props.user.token.toString())} className={classes.logout}>
              Log out 
            </a>
          </div>}

        {backdrop && <div className={classes.backdrop}></div>}
        <div className={classes.cardContainer}>
          <DashboardCard
            title="Training Resources"
            description="Watch videos about BrightBox, Simbi Learn Cloud, using laptops, and more."
            linkText="Access Training Resources"
            url="/training-resources"
            image="/images/trainingResources.jpg"
            openTooltip={(activeToolTip === ToolTip.TRAINING_CARD)}
            tooltipMessage={"Click here to watch videos about your BrightBox and Simbi Learn Cloud."}
          />
          
          <DashboardCard
            title="Upload Materials"
            description="Upload your own lessons or study documents to support student learning."
            linkText="Upload Materials"
            url="/upload-materials"
            image="/images/upload.jpg"
            openTooltip={(activeToolTip === ToolTip.UPLOAD_CARD)}
            tooltipMessage={"Click here to upload your own lessons and materials."}
          />
          <DashboardCard
            title="Teacher Curriculum Guides"
            description="Explore Ugandan National Curriculum Development Centre curriculum outlines."
            linkText="Access Curriculum Guides"
            url="/curriculum-guides"
            image="/images/teachingGuides.png"
            openTooltip={(activeToolTip === ToolTip.GUIDES_CARD)}
            tooltipMessage={"Click here to access Uganda NCDC Curriculum Guides to help you plan lessons."}
          />
          <DashboardCard
            title="Give Feedback to SLC"
            description="Do you have any recommendations for how we can improve Simbi Learn Cloud?"
            linkText="Give Feedback"
            url="/feedback" 
            image="/images/feedback.jpg"
            openTooltip={(activeToolTip === ToolTip.FEEDBACK_CARD)}
            tooltipMessage={"Click here to share your feedback or ideas with Simbi Foundation."}
          />
          <DashboardCard
            title="Edit Profile"
            description="Edit your name, password, and security question."
            linkText="Edit Profile"
            url="/edit-profile"
            image="/images/editProfile.jpg"
          />
          {props.user.isAdmin &&  
          <DashboardCard
            title="Admin"
            description="Review uploaded documents, manage signed-up teachers, and more."
            linkText="Use Admin Tools"
            url="/admin"
            image="/images/admin.jpg"
          />}
          <DashboardCard
            title="Retake Dashboard Onboarding"
            description="Click here to see an interactive overview of the tools in your dashboard."
            linkText="Dashboard Onboarding"
            url="/"
            image="/images/onboarding.png"
            button={true}
            onClick={restartOnboarding}
          />
        </div>
        {teacherNotesOpen && <>
          <div className={classes.teachingNotesSection} ref={teachNotesRef}>
            <Typography variant="h5" style={{fontSize: tabletView ? 24 : 30}} >Teaching notes</Typography>
            <Typography component="p" className={classes.teachingNotesProposition}>
              A list of personal documents, notes and plan ideas that will be useful for your classroom lessons and teachings skills!
            </Typography> 
          </div>
          <div style={{textAlign: 'left'}}>
            {props.resourceList.resources.map(resource => {
              return <ResourceCard key={resource.id} resource={resource} deleteResource={setDeleteWarning} updateResource={updateResource}  user={props.user} dashboardView={true} backgroundCol={backgroundCol} readableFont={readableFont} highlightHeading={highlightHeading} headingsCol={headingsCol} copyCol={copyCol}/>;
            })}
          </div>
        </>
        }
      </div>
      <Footer />
      <Snackbar
        open={showDeleteAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleCloseDelete}
      >
        <Alert
          classes={{ icon: classes.nothing }}
          icon={<></>}
          className={classes.deletionAlert}
          onClose={handleCloseDelete}
          action={
            <IconButton className={classes.snackbarClose} onClick={handleCloseDelete}>
              <CloseIcon className={classes.closeIcon} shrink={mobileView}/>
            </IconButton>
          }
        >
          Study material deleted from this list.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showUpdateAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleCloseUpdate}
      >
        <Alert
          icon={<CheckCircle className={classes.checkmark} />}
          className={classes.updateAlert}
          onClose={handleCloseUpdate}
          action={
            <IconButton className={classes.snackbarClose} onClick={handleCloseUpdate}>
              <CloseIcon className={classes.closeIcon} shrink={mobileView}/>
            </IconButton>
          }
        >
          {pending? 'Your file is pending approval' : 'Your changes have been saved' }
        </Alert>
      </Snackbar>
      {showScrollToTop && (
        <Fab className={classes.fab} onClick={scrollToTop}>
          <ArrowRightAlt className={classes.arrow} />
        </Fab>
      )}
      {[ToolTip.FEEDBACK_CARD, ToolTip.GUIDES_CARD, ToolTip.TRAINING_CARD, ToolTip.UPLOAD_CARD, ToolTip.HIDDEN_CARD, ToolTip.HIDE_FEEDBACK_CARD].includes(activeToolTip) && !startOnboarding && (
        <ExitPrompt currentStep={onboardingStep} quitOnboarding={() => { setQuitEarly(true); onOnboardingExit(); }} />
      )}
      <Dialog
        open={showDeleteWarning}
        //onClose={handleClose}
        PaperProps={{ className: classes.dialogContent }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <div>
          <Typography component="p">Are you sure you want to permanently delete “{resourceName}” from this list?</Typography>
          {mobileView && <Button variant="contained" onClick={closeDeleteWarning} className={`${classes.selectionButton} ${classes.cancelButton}`}> Cancel </Button>}
          <Button variant="contained" onClick={deleteResource} className={`${classes.selectionButton} ${classes.deleteButton}`}> Delete </Button>
          {!mobileView && <Button variant="contained" onClick={closeDeleteWarning} className={`${classes.selectionButton} ${classes.cancelButton}`}> Cancel </Button>}
        </div>
      </Dialog>
      <Dialog
        open={startOnboarding}
        //onClose={handleClose}
        PaperProps={{ className: `${classes.dialogContent} ${classes.onboardingDialog}` }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <div>
          <Typography component="p" style={{fontWeight: 600, fontSize: tabletView? '18px' : ''}}>Learn how to use your new Simbi Learn Cloud teacher account!</Typography>
          <img src="/images/onboardingPrompt.jpg" width={mobileView? (shrinkImage? '100%' : 275) : (tabletView? 420 : 525)} 
            height={mobileView? 150 : (tabletView? 225 : 275)} style={{marginBottom: tabletView ? 16 : 32, objectFit: 'cover'}}></img>
          <div style={{display: 'flex', justifyContent: mobileView? '' : 'space-between', flexDirection: mobileView? 'column' : 'row', paddingBottom: 0, paddingTop: 0}}>
            <Button variant="contained" onClick={startDashboardOnboarding} className={`${classes.selectionButton} ${classes.startButton}`}> Start </Button>
            <Button variant="contained" onClick={skipOnboarding} className={`${classes.selectionButton} ${classes.skipButton}`}> {props.user.doneOnboarding? 'Cancel' : 'Skip'} </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={(activeToolTip === ToolTip.FINISHED_PROMPT) || (activeToolTip === ToolTip.QUIT_EARLY)}
        //onClose={handleClose}
        PaperProps={{ className: `${classes.dialogContent} ${classes.onboardingDialog}` }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <div>
          <Typography component="p" style={{fontWeight: 600, fontSize: tabletView? '18px' : ''}} className={classes.exitTitle}>{(quitEarly || (activeToolTip === ToolTip.QUIT_EARLY))? `You have quit the orientation for your Simbi Learn Cloud teacher account.` : `Congratulations! You've completed this orientation to your Simbi Learn Cloud teacher account.`}</Typography>
          <img src={tabletView? mobileView? "/images/mobileOnboarding.gif" : "/images/tabletOnboarding.gif" : "/images/desktopOnboarding.gif"} width={mobileView? (shrinkImage? '100%' : 275) : (tabletView? 420 : 525)} 
            height={`auto`} style={{marginLeft: mobileView ? 6 : tabletView? 0 : 4, objectFit: 'cover',}}/>
          <Typography component="p" style={{fontWeight: 400, fontSize: tabletView? '15px' : '17px',}} className={classes.exitContent}>Remember, you can restart this walkthrough whenever you would like by accessing it inside the dashboard.</Typography>
          <div style={{display: 'flex', justifyContent: mobileView? '' : 'space-between', flexDirection: mobileView? 'column' : 'row', paddingBottom: 0, paddingTop: 0}}>
            <Button variant="contained" onClick={() => { setQuitEarly(false); finishDashboardOnboarding();}} className={`${classes.selectionButton} ${classes.startButton}`} style={{marginRight: 'auto', marginLeft: 'auto'}}> Close </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default connector(TeacherDashboard);
