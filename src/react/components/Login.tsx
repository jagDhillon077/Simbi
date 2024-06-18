import React, { useReducer, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, createStyles, Typography, TextField, Button,
  InputAdornment, IconButton, fade, Theme, useTheme, Grid, Tooltip, withStyles } from "@material-ui/core";
import UserService from '../../services/users'
import {setUserLogin, createUser, sendNotificationAdminLogin, deleteOldContent } from '../actions';
import { ReduxState } from '../types';
import { connect, ConnectedProps } from 'react-redux';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Footer from './Footer';
import ShowIcon from '../components/icons/ShowIcon';
import HideIcon from './icons/HideIcon';
import { Link } from 'react-router-dom';
import { BackIcon } from "./icons/backIcon";
import Colors from '../css/Colors';
import { ColorSelect } from './AccessibilityPage';

export enum LoginMessage {
  UPDATED_PASS, SESSION_TO, FIRST_TIME, NONE
}

enum ActiveToolTip {
  LOGIN, PASSWORD, USERNAME
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentContainer: {
      height: '100vh',
      width: '100%',
      backgroundColor: (props: StyleProps) => props.backgroundCol,
      fallbacks: {
        overflow: 'auto',
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
        height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
      },
      [theme.breakpoints.down('xs')]: {
        height: `calc(100vh - 56px) !important`,
        marginTop: `56px !important`,
      }
    },
    grid: {
      alignItems: 'center',
      position: 'relative',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        minHeight: `calc(100vh - 304.5px + ${NAVBAR_HEIGHT}px)`,
      },
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        minHeight: `calc(100vh - 285.5px + 55px)`,
      },
    },
    image: {
      width: '50%',
      height: '1024px',
      backgroundImage: 'url(/images/teacherPortalLoginBanner.png)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      [theme.breakpoints.up('md')]: {
        minHeight: '100vh',
        position: 'absolute',
        top: 0,
        right: 0,
        flexGrow: 1,
      },
      [theme.breakpoints.down('sm')]: {
        height: '46vw',
        width: '100%',
        display: 'table',
        margin: '0 auto',
        marginBottom: '24px',
        backgroundPosition: '0 -25vw',
      },
    },
    return: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '24px',
      marginBottom: '48px',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    icon: {
      width: '247px',
      height: '148px',
      marginBottom: 56,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    title: {
      lineHeight: '48px',
      fontSize: 36,
      margin: '0 auto 32px',
      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
        fontSize: 24,
        lineHeight: '32px',
      }
    },
    proposition: {
      lineHeight: '32px',
      fontSize: 18,
      textAlign: 'center',
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        lineHeight: '23px',
      },
    },
    regularMargins: {
      marginBottom: 48,
      [theme.breakpoints.down('sm')]: {
        marginBottom: 32,
      },
    },
    passwordResetMargins: {
      marginBottom: 24,
    },
    loginField: {
      width: '50%',
      paddingLeft: 109,
      paddingRight: 109,
      [theme.breakpoints.down(1440)]: {
        paddingLeft: '7.57vw',
        paddingRight: '7.57vw',
      },
      [theme.breakpoints.down(1350)]: {
        paddingLeft: '6.66vw',
        paddingRight: '6.66vw',
      },
      [theme.breakpoints.down(1250)]: {
        paddingLeft: '5.55vw',
        paddingRight: '5.55vw',
      },
      [theme.breakpoints.down(1150)]: {
        paddingLeft: '4.44vw',
        paddingRight: '4.44vw',
      },
      [theme.breakpoints.down(1050)]: {
        paddingLeft: '3.33vw',
        paddingRight: '3.33vw',
      },
      [theme.breakpoints.up('md')]: {
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        flexGrow: 1,
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '11.35vw',
        paddingRight: '11.35vw',
        width: '100%',
        display: 'table',
        margin: '0 auto',
      },
      [theme.breakpoints.down(830)]: {
        paddingLeft: '9.35vw',
        paddingRight: '9.35vw',
      },
      [theme.breakpoints.down(760)]: {
        paddingLeft: '7.35vw',
        paddingRight: '7.35vw',
      },
      [theme.breakpoints.down(730)]: {
        paddingLeft: 32,
        paddingRight: 32,
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 16,
        paddingRight: 16,
      },
    },
    textFeild: {
      fontSize: '18px',
      position: 'relative',
      margin: '8px 0',
      [`& label`]: {
        top: '4px',
        '&.shrink': {
          top: '0px',
        },
      },
      [`& fieldset`]: {
        borderRadius: '10px',
        borderColor: '#757575',
      },
      [`& span`]: {
        width: '94%',
        height: '94%',
      },
      [theme.breakpoints.up('md')]: {
        [`& button`]: {
          '& :last-child': {
            left: 3,
            top: 2,
          },
          marginRight: '-13px',
        },
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        margin: '6px 0',
        [`& label`]: {
          top: '-4px',
        },
        [`& span`]: {
          width: '84%',
          height: '84%',
        },
        [`& button`]: {
          '& :last-child': {
            left: 8,
            top: 6,
          },
          marginRight: '-13px',
        },
      },
    },
    textFeildStyle: {
      '&$focused $notchedOutline': {
        borderColor: '#4D6DCB',
      },
      [`& input`]: {
        fontSize: '18px',
      },
      height: '64px',
      [theme.breakpoints.down('sm')]: {
        height: '48px',
        [`& input`]: {
          fontSize: '16px',
        },
      },
    },
    textFeildLabel: {
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    messageBox: {
      marginBottom: '32px',
      [theme.breakpoints.down('sm')]: {
        marginBottom: '12px',
      },
    },
    messageText: {
      padding: '16px',
      fontSize: '16px',
      lineHeight: '24px',
      [theme.breakpoints.down('sm')]: {
        padding: '10px',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
    forgotLinks: {
      margin: '24px 0 32px 0',
      width: '100%',
      position: 'relative',
      alignItems: 'center',
      [theme.breakpoints.up(1000)]: {
        '& :last-child': {
          position: 'absolute',
          right: '0px',
        },
      },
      [theme.breakpoints.down(1000)]: {
        '& :last-child': {
          paddingTop: 10,
        },
      },
      [theme.breakpoints.down('sm')]: {
        margin: '0 0 62px 0',
      },
      /*[theme.breakpoints.between(470, 'sm')]: {
        '& :last-child': {
          position: 'absolute',
          right: '0px',
          paddingTop: 0,
        },
      },*/
      [theme.breakpoints.down('sm')]: {
        '& :last-child': {
          paddingTop: 10,
        },
      },
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      margin: 0,
      width: '100%',
      height: '60px',
      borderRadius: '8px',
      backgroundColor: 'black',
      color: 'white',
      '&:hover': {
        backgroundColor: fade('#222222', 0.9),
      },
      '&:disabled': {
        backgroundColor: '#D8D8D8',
        color: '#E3E3E3',
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: '18px',
        height: '40px',
        '& :first-child': {
          margin: 0,
        },
      },
    },
    loginText: {
      fontSize: 17,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 15,
      },
    },
    signupGrid: {
      marginTop: 32,
      display: 'flex',
      justifyContent: 'center',
      '& :first-child': {
        paddingRight: '12px',
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: 24,
        marginBottom: 16,
        '& :first-child': {
          margin: 0,
        },
      },
    },
    smallFont: {
      lineHeight: '26px',
      fontSize: 18,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        lineHeight: '23px',
      },
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    focused: {},
    notchedOutline: {}

  })
);

// Creating a customly styled tool tip with animation
const LoginTooltip = withStyles((theme: Theme) =>({
  "@keyframes bottomBouncing": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(40px)" },
    "100%": { transform: "translateY(0px)" },
  },
  "@keyframes topBouncing": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-40px)" },
    "100%": { transform: "translateY(0px)" },
  },
  "@keyframes rightBouncing": {
      "0%": { transform: "translateX(0px)" },
      "50%": { transform: "translateX(40px)" },
      "100%": { transform: "translateX(0px)" },
  },
  popper: {
    marginLeft: 5,
    '&[x-placement*="top"] .MuiTooltip-arrow': { // Removes arrow gap when animating on top
      bottom: 1,
    },
    '&[x-placement*="bottom"] .MuiTooltip-arrow': { // Removes arrow gap when animating on bottom
      top: 1,
    },
    '&[x-placement*="right"] .MuiTooltip-arrow': { // Removes arrow gap when animating on right
      left: 1,
    },
    '&[x-placement*="left"] .MuiTooltip-arrow': { // Removes arrow gap when animating on left
      right: 1,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      paddingLeft: '11.35vw',
      paddingRight: '11.35vw',
    },
    [theme.breakpoints.down(830)]: {
      paddingLeft: '9.35vw',
      paddingRight: '9.35vw',
    },
    [theme.breakpoints.down(760)]: {
      paddingLeft: '7.35vw',
      paddingRight: '7.35vw',
    },
    [theme.breakpoints.down(730)]: {
      paddingLeft: 32,
      paddingRight: 32,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  tooltip: {
    fontSize: '20px',
    fontWeight: 600,
    padding: '13px 20px',
    minWidth: 468,
    textAlign: 'center',
    backgroundColor: Colors.BLUE_200,

    fontFamily: 'Roboto Slab',
    animation: `$rightBouncing 2800ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
    '&.MuiTooltip-tooltipPlacementBottom': {
      animation: `$bottomBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
    },
    '&.MuiTooltip-tooltipPlacementTop': {
      animation: `$topBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      minWidth: "100%",
      padding: '12px 16px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
    }
  },
  arrow: {
    fontSize: 28,
    color: Colors.BLUE_200,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      left: '0 !important',
      right: '0 !important',
      marginLeft: 'auto !important',
      marginRight: 'auto !important',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  }
}))(Tooltip);


type State = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState:State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false,
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
  }
}
const mapDispatchToProps = {
    setUserLogin,
    createUser,
    sendNotificationAdminLogin,
    deleteOldContent,
  }
type Props = {
  stateMessage: LoginMessage;
  shrinkTopBar: boolean;
  activeSession: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
	shrinkTopBar: boolean,
  backgroundCol: ColorSelect
}
  
const mapStateToProps = (state: ReduxState) => ({
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
    textCol: state.styleSettings.copyCol,
    highlightLink: state.styleSettings.highlightLink
  });
  
const connector = connect(mapStateToProps, mapDispatchToProps);

const Login = (props: Props) => {
  const { shrinkTopBar, backgroundCol } = props;
	const classes = useStyles({ shrinkTopBar, backgroundCol });
    const {
        setUserLogin,
        stateMessage,
        activeSession,
        sendNotificationAdminLogin,
        deleteOldContent
    } = props

  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const stackLinks = useMediaQuery(theme.breakpoints.down(1000));
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [loginOnboarding, setLoginOnboarding] = useState(false);
  const [activeToolTip, setActiveToolTip] = useState(ActiveToolTip.USERNAME);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  useEffect(() => {
    if (state.username.trim() && state.password.trim()) {
      setActiveToolTip(ActiveToolTip.LOGIN);
      dispatch({
        type: 'setIsButtonDisabled',
        payload: false
      });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.username, state.password]);

  let path = '/teacher-dashboard'
  let history = useHistory();

  const handleLogin = () => { 
    let user = {
      username: state.username,
      password: state.password 
    }
    setUserLogin(user).then((res) => {
      if (res.success) {
        deleteOldContent();
        if (res.isAdmin) sendNotificationAdminLogin(res.username);
        activeSession();
      }
    })
     
    setTimeout(() => {
      dispatch({
        type: 'loginFailed',
        payload: 'Incorrect username or password'
    })}, 800)
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
      if (event.target.value !== "") {
        if (state.password === "") setActiveToolTip(ActiveToolTip.PASSWORD);
      } else {
        setActiveToolTip(ActiveToolTip.USERNAME);
      }
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
      if (event.target.value === "") {
        if (state.username !== "") setActiveToolTip(ActiveToolTip.PASSWORD);
      }
    }
  
  React.useEffect(() => {
    setUpdatedPassword(false);
    setTimedOut(false);
    setLoginOnboarding(false);

    switch (stateMessage) {
      case LoginMessage.UPDATED_PASS: 
        setUpdatedPassword(true);
        break;
      case LoginMessage.SESSION_TO: 
        setTimedOut(true);
        break;
      case LoginMessage.FIRST_TIME:
        setLoginOnboarding(true);
    }

  }, [stateMessage]);

  props.user.token && (props.user.token != 'initial') && history.push('/teacher-dashboard') 
  return (
      <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}}>
          <Grid item xs={12} sm={12} md={12} className={classes.grid}>
            {tabletView && <div className={classes.image} />}
            <div className={classes.loginField}>
              {!tabletView && (
              <div className={classes.return}>
                <Link to='/'>
                    <BackIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
                </Link>
              </div>)}
              <img src="/images/simbi.png" alt="Logo Icon" className={classes.icon} />
              <Typography variant="h4" className={classes.title}>Teacher’s Portal Log In</Typography>
              <Typography component="p" className={updatedPassword? `${classes.proposition} ${classes.passwordResetMargins}` : `${classes.proposition} ${classes.regularMargins}`}>Sign in to the teacher's portal using 
                your username and password. You must be a teacher in order to access the portal.</Typography>
              {updatedPassword && <div className={classes.messageBox} style={{backgroundColor: Colors.GREEN_50}}>
                <Typography className={classes.messageText} style={{color: Colors.GREEN_400}}>Password has been successfully updated!</Typography>
              </div>}
              {timedOut && <div className={classes.messageBox} style={{backgroundColor: Colors.CORAL_50}}>
                <Typography className={classes.messageText} style={{color: Colors.CORAL_600}}>Your session has timed out!</Typography>
              </div>}
              <LoginTooltip
              title={`Type in your username here!`}
              placement={tabletView ? "bottom" : "right" }
              arrow
              open={((activeToolTip === ActiveToolTip.USERNAME) && loginOnboarding)}
              >
                <TextField
                  error={state.isError}
                  fullWidth
                  id="username"
                  type="email"
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  className={classes.textFeild}
                  InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
                  InputLabelProps={{classes: {root: classes.textFeildLabel,
                    shrink: "shrink"}}}
                  onChange={handleUsernameChange}
                  onKeyPress={handleKeyPress}
                />
              </LoginTooltip>
              
              <LoginTooltip
              title={`After you have typed in your username, enter your password here.`}
              placement={tabletView ? "bottom" : "right" }
              arrow
              open={((activeToolTip === ActiveToolTip.PASSWORD) && loginOnboarding)}
              >
                <TextField
                  error={state.isError}
                  fullWidth
                  id="password"
                  type={passwordShown ? "text" : 'password'}
                  label="Password"
                  margin="normal"
                  variant="outlined"
                  helperText={state.helperText}
                  className={classes.textFeild}
                  InputLabelProps={{classes: {root: classes.textFeildLabel,
                  shrink: "shrink"}}}
                  InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword}> {(passwordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                      </IconButton>
                    </InputAdornment>
                  ),} }
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                />
              </LoginTooltip>
              {!tabletView && (
              <Grid direction={stackLinks?"column":"row"} spacing={1} container className={classes.forgotLinks} >
                <Link to="/recover-username" className={classes.smallFont}>Forgot your username?</Link>
                <Link to="/reset-password" className={classes.smallFont}>Forgot your password?</Link>
              </Grid>)}
              <LoginTooltip
              title={`Click here to login!`}
              placement={tabletView ? "bottom" : "right" }
              arrow
              open={((activeToolTip === ActiveToolTip.LOGIN) && loginOnboarding)}
              >
                <Button
                  variant="contained"
                  className={classes.loginBtn}
                  onClick={handleLogin}
                  disabled={state.isButtonDisabled}>
                  <span className={classes.loginText}>Log in</span>
                </Button>
              </LoginTooltip>
              <Grid direction="row" spacing={1} container className={classes.signupGrid} >
                <Typography component="p" className={classes.smallFont}>Don't have an account?</Typography>
                <Link to="/user" className={classes.smallFont}>Sign up</Link>
              </Grid>
              {tabletView && (
              <Grid direction={"column"} spacing={1} container className={classes.forgotLinks} >
                <Link to="/recover-username" className={classes.smallFont}>Forgot your username?</Link>
                <Link to="/reset-password" className={classes.smallFont}>Forgot your password?</Link>
              </Grid>)}
            </div>
            {!tabletView && <div className={classes.image} />}
        </Grid>
        {tabletView && <Footer/>}
      </div>
  );
}

export default connector(Login);