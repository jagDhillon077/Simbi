import { makeStyles, } from '@material-ui/core/styles';
import { Typography, Grid, useMediaQuery, Fab, useTheme } from "@material-ui/core";
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { ReduxState } from '../types';
import { loadResources, setResourceList } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Colors from '../css/Colors';
import Footer from './Footer';
import TrainingResourcesIcon from './icons/TrainingResourcesIcon';
import VideoCard from './VideoCard';
import { useHistory, Link } from 'react-router-dom'
import { BackDashboardIcon } from "./icons/backIcon";
import { CustomToolTip } from './CustomToolTip';
import { useThrottle } from '../../helpers';
import { ArrowRightAlt, CropPortrait } from '@material-ui/icons';
import ExitPrompt from './ExitPrompt';
import { ColorSelect } from './AccessibilityPage';

const mapDispatchToProps = {
  loadResources,
  setResourceList,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    resourceList: state.resourceList,
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
    textCol: state.styleSettings.copyCol,
    highlightLink: state.styleSettings.highlightLink,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  onboarding: boolean;
  shrinkTopBar: boolean;
  onDoneOnboarding: () => void;
  quitEarly: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    maxWidth: '100%',  // Removes the horizontal scrollbar for screen size 'sm' to 645
    overflowX: 'hidden',
    marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    width: '100% - 40px',
    overflow: 'overlay',
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
    fallbacks: {
      overflow: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      overflowX: 'hidden',
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    }
  },
  heroContainer: {
    boxShadow: '0px 2px 0 0 #A9A9A9',
    width: '85%',
    display: 'flex',
    paddingBottom: 36,
    margin: '64px 0 0 104px',
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      display: 'table',
      margin: '24px auto',
      boxShadow: '0 0 0 0 #A9A9A9',
      paddingBottom: '0px',
      marginBottom: '0px'
    },
    [theme.breakpoints.between(1000, 1040)]: {
      margin: '64px 0 0 74px',
    },
  },
  titleContainer: {
    height: '100%',
  },
  title: {
    fontSize: '30px',
    lineHeight: '40px',
    textAlign: 'left',
    margin: '0 16px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16,
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px',
      lineHeight: '24px',
    },
  },
  proposition: {
    fontSize: '18px',
    textAlign: 'left',
    padding: '4px 16px',
    lineHeight: '32px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 16,
      fontSize: '16px',
      lineHeight: '23px',
      textAlign: 'center',
    },
  },
  subproposition: {
    margin: 'none',
    maxWidth: 1232,
    width: '95%',
    fontSize: '18px',
    textAlign: 'left',
    lineHeight: '32px', 
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      display: 'table',
      margin: '0 20% 0 auto',
      width: '91%',
      fontSize: '16px',
      lineHeight: '23px',
      textAlign: 'center',
    },
    [theme.breakpoints.down(645)]: {
      width: '86%',
    },
    [theme.breakpoints.down(470)]: {
      width: '91%',
      marginRight: '10%',
      marginLeft: '-5%',
    },
    [theme.breakpoints.down(360)]: {
      marginRight: '10%',
      marginLeft: '-7%',
    },
  },
  description: {
    textAlign: 'left',
    marginBottom: 40,
  },
  trainingIcon: {
    width: '65px',
    height: '70px',
  },
  videoGrid: {
    width: '90%',
    margin: '43px 104px 80px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0px 36px 60px',
    },
    [theme.breakpoints.between(1000, 1040)]: {
      margin: '43px 74px 80px',
    },
  },
  return: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '32px',
    marginBottom: '0px',
    marginLeft: '104px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '24px',
      marginLeft: '32px',
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '16px',
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
  arrow: {
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
    filter: 'alpha(opacity=30)',
    opacity: '0.3',
  },
  dashboardIcon: {
    zIndex: 1001, 
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '6px'
  }
}));

//const bc = new BroadcastChannel('video');
// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 400;

function TrainingResources(props: Props) {
  const { onboarding, shrinkTopBar, backgroundCol, onDoneOnboarding, quitEarly} = props
  const theme = useTheme();

  //const [loadedVideos, setLoadedVideos] = React.useState<string[]>([]);
  //const loadedLimit = 5;
  const [dashboardTooltip, setDashboardTooltip] = React.useState(false);
  const [vidTooltip, setVidTooltip] = React.useState(onboarding);
  const [tooltip, setTooltip] = React.useState(onboarding);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const contentContainerRef = React.useRef<HTMLDivElement>(null);

  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(400));

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
  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  /*const onLoaded = (title : string) => {
    let videos = loadedVideos ? loadedVideos : [];
    videos.push(title);

    if (videos.length === loadedLimit) videos.shift();

    setLoadedVideos(videos);
    console.log(videos);        // TODO: remove this messasge, just for testing purposes
    bc.postMessage(loadedVideos);
  }*/

  const onOpenVideo = () => {
    if (vidTooltip) {
      if (tooltip) setVidTooltip(false);
      setDashboardTooltip(true);
      scrollToTop();
    }
  }

  const onOpenToolTipVideo = () => {
    if (tooltip) {
      setTooltip(false);
      setDashboardTooltip(true);
      scrollToTop();
    }
  }
  
  const onGoToDashboard = () => {
    if (dashboardTooltip) onDoneOnboarding();
  }

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const renderTrainingVideo = (index: number, element: {title: string; url: string; thumbnail: string;}) => {
    if (index === 0) {
      return( <VideoCard title={element.title} url={element.url} thumbnail={element.thumbnail} onOpen={onOpenToolTipVideo} setToolTip={vidTooltip} /> );
    } else if (index !== 21 || props.user.isAdmin) {
      return( <VideoCard title={element.title} url={element.url} thumbnail={element.thumbnail} onOpen={onOpenVideo}/> );
    }
  }

  useEffect(() => {
    if (vidTooltip) scrollToPos(tabletView? mobileView? isSmallScreen? 280 : 240 : 170 : 120);
  }, [contentContainerRef.current, vidTooltip]);

  const classes = useStyles({shrinkTopBar, backgroundCol});

  const list = [{title: '1. Welcome to your BrightBox', url: "/assets/TV/Welcome to BB TV.mp4", thumbnail: '/assets/TV/Thumbnails/WelcomeToYourBrightbox.png'},
                {title: '2. The Core Setup', url: "/assets/TV/Core Setup TV.mp4", thumbnail: '/assets/TV/Thumbnails/TheCoreSetup.png'},
                {title: '3. Powering up the technology', url: "/assets/TV/Powering on.mp4", thumbnail: '/assets/TV/Thumbnails/PoweringOn.png'},
                {title: '4. How to use a laptop and a tablet', url: "/assets/TV/How to use computer.mp4", thumbnail: '/assets/TV/Thumbnails/HowToUseLaptopAndTablet.png'},

                {title: '5. What is the mini-computer?', url: "/assets/TV/What is the Mini-Computer_.mp4", thumbnail: '/assets/TV/Thumbnails/WhatIsTheMiniComputer.png'},
                {title: '6. Connecting to the mini-computer\'s network', url: "/assets/TV/How to connect to mini pc.mp4", thumbnail: '/assets/TV/Thumbnails/HowToConnectToMiniPCNetwork.png'},
                {title: '7. Navigating Simbi Learn Cloud', url: "/assets/TV/Navigating SLC.mp4", thumbnail: '/assets/TV/Thumbnails/NavigatingSLC.png'},
                {title: '8. What materials are on Simbi Learn Cloud?', url: "/assets/TV/What materials are on SLC_.mp4", thumbnail: '/assets/TV/Thumbnails/WhatMaterialsAreOnSLC.png'},

                {title: '9. Understanding Simbi', url: "/assets/TV/Understanding Simbi.mp4", thumbnail: '/assets/TV/Thumbnails/UnderstandingSimbi.png'},
                {title: '10. Supplementing the national curriculum with Simbi Learn Cloud', url: "/assets/TV/supplementing with SLC.mp4", thumbnail: '/assets/TV/Thumbnails/SupplementingSLC.png'},
                {title: '11. Respecting and maintaining the technology', url: "/assets/TV/Respecting the tech.mp4", thumbnail: '/assets/TV/Thumbnails/RespectingAndMaintainingTheTech.png'},
                {title: '12. Final words about your BrightBox', url: "/assets/TV/Final Words.mp4", thumbnail: '/assets/TV/Thumbnails/FinalWords.png'},

                {title: "13. Creating your teacher's account", url: "/assets/TV/13. Signing Up.mp4", thumbnail: '/assets/TV/Thumbnails/13.CreatingYourTeacher_sAccount.png'},
                {title: '14. Logging in', url: "/assets/TV/14. First time login.mp4", thumbnail: '/assets/TV/Thumbnails/14.LoggingIn.png'},
                {title: '15. Notifications', url: "/assets/TV/15. Notifications.mp4", thumbnail: '/assets/TV/Thumbnails/15.Notifications.png'},
                {title: '16. Uploading a learning material', url: "/assets/TV/16. Upload.mp4", thumbnail: '/assets/TV/Thumbnails/16.UploadingALearningMaterial.png'},

                {title: '17. Uploading a learning material part 2', url: "/assets/TV/17. Upload 2.mp4", thumbnail: '/assets/TV/Thumbnails/16.UploadingALearningMaterial.png'},
                {title: '18. Curriculum guides', url: "/assets/TV/18. C Guides.mp4", thumbnail: '/assets/TV/Thumbnails/18.CurriculumGuides.png'},
                {title: '19. Editing your profile', url: "/assets/TV/19. Edit Profile.mp4", thumbnail: '/assets/TV/Thumbnails/19.EditingYourProfile.png'},
                {title: '20. Recovering your username and password', url: "/assets/TV/20. Username Recover.mp4", thumbnail: '/assets/TV/Thumbnails/20.RecoveringYourUsernamePassword.png'},

                {title: '21. Logging out', url: "/assets/TV/21. Logging Out.mp4", thumbnail: '/assets/TV/Thumbnails/21.LoggingOut.png'},
                {title: '22. Administrator tools', url: "/assets/TV/22. Admin Tools.mp4", thumbnail: '/assets/TV/Thumbnails/22.AdministratorTools.png'},]
  const history = useHistory();
  !props.user.token && history.push('/teacher-portal')
  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainerRef} onScroll={onScroll}>
      <div style={{clipPath: vidTooltip? 'inset(0 0 0 0)' : ''}}>
        {vidTooltip && <div className={classes.backdrop}></div>}
        <div className={classes.return}>
          <CustomToolTip
            title={`Click here to return to the dashboard.`}
            placement={ "bottom-start" }
            arrow
            open={dashboardTooltip}
          >
            <Link to='/teacher-dashboard' onClick={onGoToDashboard} className={dashboardTooltip? classes.dashboardIcon : ''}>
              <BackDashboardIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
            </Link>
          </CustomToolTip> 
        </div>
        <div className={classes.heroContainer}>
          <TrainingResourcesIcon className = {classes.trainingIcon} />
          <div className={classes.titleContainer}>
            <Typography variant="h3" className={classes.title}>Training Resources</Typography>
            <Typography component="p" className={classes.proposition}>
              Explore these training videos to learn more about your 
              BrightBox and how to use it to boost student learning outcomes.
              {tabletView && ` From opening your BrightBox, to switching on the technology, to connecting to the server, to navigating Simbi Learn Cloud, 
              these videos will guide you through the entire process of familiarizing yourself with your BrightBox.`}
            </Typography>
          </div>
        </div>
        <Grid container className={classes.videoGrid} justify="flex-start">
          {!tabletView && <Grid item xs={12} sm={12} md={12}>
            <Typography component="p" className={classes.subproposition}>
              From opening your BrightBox, to switching on the technology, to connecting to the server, to navigating Simbi Learn Cloud, 
              these videos will guide you through the entire process of familiarizing yourself with your BrightBox.</Typography>
          </Grid>}
          {list.map((element, index) =>
            <Grid key={element.title} item > 
            {renderTrainingVideo(index, element)}
            </Grid>)
          }
        </Grid>
        {showScrollToTop && (
          <Fab className={classes.fab} onClick={scrollToTop}>
            <ArrowRightAlt className={classes.arrow} />
          </Fab>
        )}
        <Footer />
      </div>
      {onboarding && (
        <ExitPrompt currentStep={dashboardTooltip? 2:1} quitOnboarding={quitEarly} />
      )}
    </div>
  );
}

export default connector(TrainingResources);