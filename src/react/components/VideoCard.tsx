import { makeStyles, fade } from '@material-ui/core/styles';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import { VideoCardProps } from '../types'
import { Typography, useMediaQuery, Button, Card } from "@material-ui/core";
import ReactPlayer from 'react-player'
import { ThemeProvider } from 'react-native-paper';
import useTheme from '@material-ui/core/styles/useTheme';
import { BACKEND_URL } from '../../services';
import PlayIcon from "./icons/PlayIcon";
import { CustomToolTip } from './CustomToolTip';

const VID_WIDTH = '278px';
const VID_HEIGHT = '155px';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
    height: 'auto',
    maxWidth: 'fit-content',
    backgroundColor: 'transparent',
    [theme.breakpoints.down(470)]: {
      marginLeft: -7,
    },
    [theme.breakpoints.down(455)]: {
      marginLeft: -14,
    },
    [theme.breakpoints.down(440)]: {
      marginLeft: 0,
    },
    [theme.breakpoints.down(420)]: {
      marginLeft: -7,
    },
    [theme.breakpoints.down(400)]: {
      marginLeft: -18,
    },
  },
  videoWrapper: {
    padding: '64px 40px 16px 0px',
    [theme.breakpoints.between(1325,1414)]: {
      paddingRight: 20,
    },
    [theme.breakpoints.between(994,1060)]: {
      paddingRight: 20,
    },
    [theme.breakpoints.between(630,650)]: {
      paddingRight: 20,
    },
    [theme.breakpoints.down(630)]: {
      width: 520,
      height: 343,
      padding: '32px 0 16px',
    },
    [theme.breakpoints.down(565)]: {
      width: 450,
      height: 304,
    },
    [theme.breakpoints.down(500)]: {
      width: 400,
      height: 275,
    },
    [theme.breakpoints.down(440)]: {
      width: 340,
      height: 242,
    },
    [theme.breakpoints.down(370)]: {
      width: 330,
      height: 235,
    },
    [theme.breakpoints.down(355)]: {
      width: 300,
      height: 218,
    },
    [theme.breakpoints.down(330)]: {
      width: 290,
      height: 214,
    },
  },
  videoPlayer: {
    top: 0,
    left: 0,
    [`& svg`]: {
      display: 'none',
    },
    "&:hover": {
      [`& svg`]: {
        display: 'inline',
      },
    },
  },
  videoTitle: {
    width: '278px',
    textAlign: 'left',
    fontFamily: 'Roboto Slab',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    [theme.breakpoints.down(630)]: {
      width: "93%",
    },
    [theme.breakpoints.down(345)]: {
      width: "90%",
    }
  },
}));

//const bc = new BroadcastChannel('video');

// add div that will behave as wrapper and have the react player, make card only have auto size, 
function VideoCard(videoProps: VideoCardProps,) {
  const {title, url, thumbnail, /*loadedVideos, setLoadedVideos,*/ setToolTip, onOpen} = videoProps;
  const playerRef = React.useRef<ReactPlayer>(null);
  
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(630));
  const reduceToolTipMargins = useMediaQuery(theme.breakpoints.down(395));
  const [vidTooltip, setVidTooltip] = React.useState(true);

  const onVideoStart = () => {
    setVidTooltip(false);
    onOpen();
  }

  /*React.useEffect(() => {
    //console.log("test: " + title + " for list: " + loadedVideos);
    if (!loadedVideos.includes(title) && playerRef.current && (loadedVideos.length > 1)) { playerRef.current.showPreview(); /*console.log("back to light view");/ }
    else { /*console.log("Staying loaded!");*/ //}
  //}, [loadedVideos]);

  /*React.useEffect(() => {
    bc.onmessage = event => { 
      console.log(event);
      console.log(!event.data.includes(title));
      if (!event.data.includes(title) && playerRef.current)  playerRef.current.showPreview(); 
    }
    
  }, []);*/

  const returnCard = () => {
    return(
      <ReactPlayer id='video' className={classes.videoPlayer}  url={`${BACKEND_URL}${url}`} controls={true} light={`${BACKEND_URL}${thumbnail}`} playIcon={<PlayIcon></PlayIcon> }
        ref={playerRef}
        playing={true}
        width ={isSmallScreen ? '100%': VID_WIDTH }
        height={isSmallScreen ? '100%': VID_HEIGHT }
        onStart={()=>{onVideoStart()}}
        onClickPreview={()=>{console.log("test!")}}
        onEnablePIP={()=>{console.log("PIP enabled!")}}
      />
    ); }

  if (setToolTip) {
    return (
      <Card className={classes.root}>
          <CustomToolTip title={`Click once to watch a video.`} placement={ "top-start" } arrow open={setToolTip && vidTooltip} 
          smallScreenMargins={reduceToolTipMargins? "16px" : "32px"} posTopMarginTop={40} >
            <div className={classes.videoWrapper} style={{zIndex: 1001, position: 'relative'}} >
              {returnCard()}
            </div>
          </CustomToolTip>
        <Typography component="p" variant="h5" className={classes.videoTitle}> {title} </Typography>
      </Card>
    );
  } else {
    return (
      <Card className={classes.root}>
        <div className={classes.videoWrapper} >
          {returnCard()}
        </div>
        <Typography component="p" variant="h5" className={classes.videoTitle}> {title} </Typography>
      </Card>
    );
  }
}

export default VideoCard;