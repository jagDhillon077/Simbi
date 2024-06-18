import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, useMediaQuery, Link } from "@material-ui/core";
import Colors from '../css/Colors';
import CloseIcon from './icons/CloseIcon';

interface Props {
  currentStep: number,
  quitOnboarding: () => void,
}

const useStyles = makeStyles((theme) => ({
  /* A circle with an x in it which opens to a prompt with a button when hovered over */
  exitPrompt: {
    width: 52,
    height: 52,
    borderRadius: '24px',
    backgroundColor: Colors.TEXT_PRIMARY,
    color: theme.palette.common.white,
    position: 'absolute',
    bottom: 40,
    left: 36,
    opacity: '0.7',
    overflow: 'hidden',
    transition: 'width 0.6s',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'white',
    zIndex: 1401,
    [`& svg`] : {
      position: 'relative',
      left: '14px',
      minWidth: '20px',
      height: '20px',
    },
    [`& p`] : {
      transition: 'opacity 0.6s 0.5s linear',
      fontSize: '16px !important',
      visibility: 'hidden',
      opacity: '0',
      marginTop: -2,
      overflow: 'hidden',
      height: '25px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px !important',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '21px',
      },
      [theme.breakpoints.down(424)]: {
        height: 'unset',
        maxHeight: '42px'
      },
      [`& a`] : {
        color: Colors.BLUE_100,
        marginLeft: 2,
        marginRight: 2
      },
    },
    '&&&': {
      boxShadow: 'unset',
    },
    [theme.breakpoints.down('sm')]: {
      left: 32,
    },
    [theme.breakpoints.down('xs')]: {
      left: 16,
    },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': {
        opacity: '0.9',
        width: 450,
        [theme.breakpoints.down(480)]: {
          width: 'calc(100% - 32px)',
        },
        [`& svg`] : {
          //marginLeft: 2,
        },
        [`& p`] : {
          marginLeft: 25,
          visibility: 'visible',
          opacity: '1',
        }
      },
    }
  },
  exitPromptOpened: {
    opacity: '0.9',
    width: 450,
    [theme.breakpoints.down(480)]: {
      width: 'calc(100% - 32px)',
    },
    [`& p`] : {
      marginLeft: 25,
      marginRight: 10,
      visibility: 'visible',
      opacity: '1',
      [theme.breakpoints.between(444, 'xs')]: {
        margin: '0 auto',
      },
      [theme.breakpoints.between(370, 395)]: {
        marginLeft: 45,
      },
      [theme.breakpoints.between(350, 370)]: {
        marginLeft: 35,
      },
    },
  }
}));

export default function ExitPrompt(props: Props) {
  const { currentStep, quitOnboarding } = props;
  const theme = useTheme();
  const classes = useStyles();

  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const mobileView = useMediaQuery(theme.breakpoints.down(840));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const ONBOARDING_STEPS = mobileView? 17 : 16;

  const togglePrompt = () => {
    if (isSmallScreen) setShowExitPrompt(!showExitPrompt);
  }
  
  return (
    <div className={`${(showExitPrompt && isSmallScreen)? classes.exitPromptOpened : ''} ${classes.exitPrompt}`} >
        <CloseIcon onClick={togglePrompt} shrink={isSmallScreen}/>
        <Typography component='p' style={{textAlign:  'left', color: 'white'}}> {`${Math.floor((currentStep/ONBOARDING_STEPS)*100)}`}% completed. Click 
          <Link onClick={quitOnboarding} style={{textDecoration: 'underline', marginLeft: 5}} >here</Link> to exit onboarding now. 
        </Typography>
    </div>
  );
}