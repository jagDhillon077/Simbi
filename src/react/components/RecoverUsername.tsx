import React, { useReducer, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, createStyles, Typography, TextField, Button,
  InputAdornment, IconButton, fade, Theme, useTheme, Grid } from "@material-ui/core";
import UserService from '../../services/users'
import {setUserLogin, createUser } from '../actions';
import { ReduxState } from '../types';
import { connect, ConnectedProps } from 'react-redux';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { Link } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Footer from './Footer';
import ShowIcon from '../components/icons/ShowIcon';
import HideIcon from './icons/HideIcon';
import Colors from '../css/Colors';
import { BackIcon } from "./icons/backIcon";
import { ColorSelect } from './AccessibilityPage';

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
      backgroundImage: 'url(/images/teacherPortalSignUpBanner.png)',
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
    title: {
      marginBottom: 32,
      lineHeight: '48px',
      fontSize: 36,
      marginRight: 'auto',
      marginLeft: 'auto',
      [theme.breakpoints.down('sm')]: {
        marginBottom: 16,
        fontSize: 24,
        lineHeight: '32px',
      }
    },
    subtitle: {
      lineHeight: '32px',
      fontSize: 24,
      marginBottom: 24,
      textAlign: 'center',
      fontFamily: 'Lora',
      marginRight: 'auto',
      marginLeft: 'auto',
      color: Colors.TEXT_SECONDARY,
      [theme.breakpoints.down('sm')]: {
        marginBottom: 16,
        fontSize: 18,
        lineHeight: '24px',
      },
    },
    prompt: {
      lineHeight: '26px',
      fontSize: 18,
      textAlign: 'center',
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        lineHeight: '23px',
      },
    },
    section2Prompt: {
        marginBottom: 32,
        [theme.breakpoints.down('sm')]: {
            marginBottom: 16,
        },
    },
    question: {
        lineHeight: '28px',
        fontSize: 20,
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'Roboto Slab',
        marginRight: 'auto',
        marginLeft: 'auto',
        Color: Colors.TEXT_PRIMARY,
        [theme.breakpoints.down('sm')]: {
          marginBottom: 16,
          fontSize: 18,
          lineHeight: '24px',
        },
    },
    additionalSubtitle: {
        marginTop: 16,
        [theme.breakpoints.down('sm')]: {
            marginTop: 22,
        },
    },
    recoverUsernameField: {
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
        marginBottom: 32,
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
    firstName: {
      [theme.breakpoints.up('md')]: {
        width: '40%',
      },
    },
    lastName: {
        [theme.breakpoints.up('md')]: {
          width: '60%',
          paddingLeft: '12px',
          [`& label`]: {
            paddingLeft: '12px',
            '&.shrink': {
              paddingLeft: '15px',
            },
          },
        },
    },
    textField: {
      fontSize: '18px',
      position: 'relative',
      marginTop: 0,
      marginBottom: '16px',
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
      [`& p`]: {
        marginTop: 5,
        marginBottom: 5,
        marginRight: 2,
        marginLeft: 8
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
        marginBottom: '10px',
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
        [`& p`]: {
          marginTop: 0,
        },
      },
    },
    textFieldStyle: {
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
    textFieldLabel: {
      backgroundColor: (props: StyleProps) => props.backgroundCol,
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    nextBtn: {
      flexGrow: 1,
      margin: '16px 0 0 0',
      width: '100%',
      height: '60px',
      borderRadius: '8px',
      backgroundColor: 'black',
      color: 'white',
      fontSize: '17px',
      '&:hover': {
        backgroundColor: fade('#222222', 0.9),
      },
      '&:disabled': {
        backgroundColor: '#D8D8D8',
        color: '#E3E3E3',
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: '14px',
        fontSize: '15px',
        height: '40px',
        '& :first-child': {
          margin: 0,
        },
      },
    },
    buttonText: {
      fontSize: 17,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 15,
      },
    },
    focused: {},
    notchedOutline: {},

    // Recovered Username CSS
    heading: {
      marginTop: 101,
      fontWeight: 'bold',
      fontFamily: 'Roboto Slab !important',
      fontSize: '20px',
      lineHeight: '28px',
      marginLeft: 'auto',
      marginRight: 'auto',
      color: Colors.TEXT_PRIMARY,
      [theme.breakpoints.down('sm')]: {
        marginTop: 24,
        fontSize: '18px',
        lineHeight: '24px',
      },
    },
    recoveredUsername: {
        background: Colors.ORANGE_100,
        width: '100%',
        borderRadius: '4px',
        marginTop: 40,
        [theme.breakpoints.down('sm')]: {
            marginTop: 24,
          },
    },
    subheading: {
        color: Colors.TEXT_PRIMARY,
        fontSize: '18px',
        lineHeight: '26px',
        fontFamily: 'Roboto Slab',
        marginRight: 'auto',
        marginLeft: 'auto',
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
            lineHeight: '23px',
          },
    },
    negativeMargins: {
        marginLeft: -40,
        marginRight: -40,
        [theme.breakpoints.down(1140)]: {
            marginLeft: -20,
            marginRight: -20,
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            marginRight: 0,
        },
    }
  })
);

//state type

type State = {
  firstName: string
  lastName: string
  password:  string
  securityAnwser:  string
  isButton1Disabled: boolean
  isButton2Disabled: boolean
  userMessage: string
  questionMessage: string
  step1Error: boolean
  step2Error: boolean
  securityQuestion: string
  username: string
};

const initialState:State = {
  firstName: '',
  lastName: '',
  password: '',
  securityAnwser:  '',
  isButton1Disabled: true,
  isButton2Disabled: true,
  userMessage: '',
  questionMessage: '',
  step1Error: false,
  step2Error: false,
  securityQuestion: 'Your security question should appear here',  // TODO: maybe remove this and the one in reset password later on *******************
  username: '',
};

type Action = { type: 'setFirstName', payload: string }
  | { type: 'setLastName', payload: string }
  | { type: 'setIsButton1Disabled', payload: boolean }
  | { type: 'setSecretAnwser', payload: string }
  | { type: 'setIsButton2Disabled', payload: boolean }
  | { type: 'setPassword', payload: string }
  | { type: 'getUserSuccess', payload: string }
  | { type: 'getUserFailed', payload: string }
  | { type: 'getAnwserSuccess', payload: string }
  | { type: 'getAnwserFailed', payload: string }
  | { type: 'setSecretQuestion', payload: string }
  | { type: 'setUsername', payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setFirstName': 
      return {
        ...state,
        firstName: action.payload
      };
    case 'setLastName': 
      return {
        ...state,
        lastName: action.payload
      };
    case 'setSecretAnwser': 
      return {
        ...state,
        securityAnwser: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButton1Disabled': 
      return {
        ...state,
        isButton1Disabled: action.payload
      };
    case 'setIsButton2Disabled': 
      return {
        ...state,
        isButton2Disabled: action.payload
      };
    case 'getUserSuccess': 
      return {
        ...state,
        userMessage: action.payload,
        step1Error: false
      };
    case 'getUserFailed': 
      return {
        ...state,
        userMessage: action.payload,
        step1Error: true
      };
    case 'getAnwserSuccess': 
      return {
        ...state,
        questionMessage: action.payload,
        step2Error: false
      };
    case 'getAnwserFailed': 
      return {
        ...state,
        questionMessage: action.payload,
        step2Error: true
      };
    case 'setSecretQuestion': 
      return {
        ...state,
        securityQuestion: action.payload
      };
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
  }
}
const mapDispatchToProps = {
    setUserLogin,
    createUser,
  }
type Props = {
  shrinkTopBar: boolean;
} & ConnectedProps<typeof connector>;
  
interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect
}

const mapStateToProps = (state: ReduxState) => ({
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
    textCol: state.styleSettings.copyCol,
    highlightLink: state.styleSettings.highlightLink
  });
  
const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Question{
  securityQuestion: string,
}

const RecoverUsername = (props: Props) => {
  const { shrinkTopBar, backgroundCol } = props;
    const classes = useStyles({shrinkTopBar, backgroundCol});
    const {
        setUserLogin,
        createUser,
    } = props

  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));

  const [recoveredUsernameView, setRecoveredUsernameView] = useState(false);
  const [step2, setStep2] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
 
  useEffect(() => {
    if (state.firstName.trim() && state.lastName.trim() && state.password.trim()) {
     dispatch({
       type: 'setIsButton1Disabled',
       payload: false
     });
    } else {
      dispatch({
        type: 'setIsButton1Disabled',
        payload: true
      });
    }

    if (state.securityAnwser.trim()) {
      dispatch({
        type: 'setIsButton2Disabled',
        payload: false
      });
      } else {
        dispatch({
          type: 'setIsButton2Disabled',
          payload: true
        });
    }
  }, [state.firstName, state.lastName, state.securityAnwser, state.password]);

  const handleStep1 = () => {
    let user = {
        firstName: state.firstName,
        lastName: state.lastName,
        password: state.password 
    }

     UserService.sendCredentials(user).then(securityQuestion => {
      dispatch({
        type: 'getUserSuccess',
        payload: ''
      })
      dispatch({
        type: 'setSecretQuestion',
        payload: securityQuestion
      })
      setStep2(true);
    }
    ).catch(e => {
      console.log(e);
      dispatch({
        type: 'getUserFailed',
        payload: 'Incorrect name or password'
      });
    })
  };

  const handleStep2 = () => {
    let user = {
      firstName: state.firstName,
      lastName: state.lastName,
      password: state.password,
      securityAnswer: state.securityAnwser
    }
    
    UserService.recoverUsername(user).then(username => {
     dispatch({
       type: 'getAnwserSuccess',
       payload: 'Login Successfully'
     })
     dispatch({
      type: 'setUsername',
      payload: username
     })
     setRecoveredUsernameView(true);
    }
    ).catch(e => {
      console.log(e);
      dispatch({
        type: 'getAnwserFailed',
        payload: 'Incorrect security question anwser'
      });
    })
  };

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButton1Disabled || handleStep1();
    }
  };

  const handleFirstNameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setFirstName',
        payload: event.target.value
      });
    };

  const handleLastNameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setLastName',
        payload: event.target.value
      });
    };

  const handleSecurityAnwserChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setSecretAnwser',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }

  return (
 <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}}>
        <Grid item xs={12} sm={12} md={12} className={classes.grid}>
        {tabletView && <div className={classes.image} />}
        <div className={classes.recoverUsernameField}>
        {recoveredUsernameView ? <>
            <Typography className={classes.heading} variant="subtitle1">
                You have successfully recovered your username!
            </Typography>
            <div className={classes.recoveredUsername}>
                <Typography style={{ paddingTop: '16px', paddingBottom: tabletView ? '16px' : '14px' }} className={classes.subheading} variant="subtitle1">
                Your username is:
                </Typography>
                <Typography style={{ fontSize: '24px', fontWeight: 700, paddingBottom: '16px', lineHeight: '32px' }} className={classes.subheading} variant="subtitle1">
                {state.username} 
                </Typography>
            </div>
            <Typography style={{ marginTop: tabletView ? '24px' : '40px'}} className={`${classes.subheading} ${classes.negativeMargins}`} variant="subtitle1" component="p">
                Please make note of this username as you will need it in order to log in into the Teacher’s portal of Simbi Learn Cloud.
            </Typography>
            <Link to='/teacher-portal'>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ marginTop: tabletView ? '24px' : '40px' }}
                    className={classes.nextBtn}
                    onClick={handleStep1}
                    >
                    Go to log in page
                </Button>
            </Link>   
        </> :
        ( <>
            {!tabletView && (
            <div className={classes.return}>
                <Link to='/teacher-portal'>
                    <BackIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
                </Link>
            </div>)}
            <Typography variant="h4" className={classes.title}>Recover my username</Typography>
            <Typography variant="h3" className={classes.subtitle}>Step 1 of 2</Typography>
            <Grid direction={tabletView?"column":"row"} spacing={1} container style={{width: '100%', margin: 0,}} >
            <TextField
            variant="outlined"
            label="First name"
            fullWidth
            disabled={step2}
            style={{ marginTop: 0 }}
            error={state.step1Error}
            className={`${classes.textField} ${classes.firstName}`}
            InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
            InputLabelProps={{classes: {root: classes.textFieldLabel,
                shrink: "shrink"}}}
            onChange={handleFirstNameChange}
            onKeyPress={handleKeyPress}
            />
            <TextField
            variant="outlined"
            label="Last name"
            fullWidth
            disabled={step2}
            style={{ marginTop: 0 }}
            error={state.step1Error}
            className={`${classes.textField} ${classes.lastName}`}
            InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
            InputLabelProps={{classes: {root: classes.textFieldLabel,
                shrink: "shrink"}}}
            onChange={handleLastNameChange}
            onKeyPress={handleKeyPress}
            />
        </Grid>
        <TextField
            variant="outlined"
            disabled={step2}
            label={"Password"}
            helperText={state.userMessage}
            error={state.step1Error}
            type={passwordShown ? "text" : 'password'}
            className={ classes.textField }
            style={{ marginTop: 0 }}
            fullWidth
            InputLabelProps={{classes: {root: classes.textFieldLabel,
            shrink: "shrink"}}}
            InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={togglePassword}> {(passwordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                </IconButton>
            </InputAdornment>
            ),} }
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress}
        />
            {!step2 && 
            <Button
                variant="contained"
                className={classes.nextBtn}
                onClick={handleStep1}
                disabled={state.isButton1Disabled}>
                <span className={classes.buttonText}>Next</span>
            </Button>
            }
            {step2 && (
            <>
            <Typography variant="h3" className={`${classes.subtitle} ${classes.additionalSubtitle}`}>Step 2 of 2</Typography>
            <Typography component="p" className={`${classes.prompt} ${classes.section2Prompt}`}>Please answer the security question below.</Typography>
            <Typography variant="h3" className={classes.question}>{state.securityQuestion}</Typography>
            <TextField
                error={state.step2Error}
                helperText={state.questionMessage}
                fullWidth
                id="securityAnwser"
                type="email"
                label="Your answer"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
                InputLabelProps={{classes: {root: classes.textFieldLabel,
                shrink: "shrink"}}}
                onChange={handleSecurityAnwserChange}
                onKeyPress={handleKeyPress}
            />
            <Button
                variant="contained"
                className={classes.nextBtn}
                onClick={handleStep2}
                disabled={state.isButton2Disabled}>
                <span className={classes.buttonText}>Recover username</span>
            </Button>
            </>  
            )} 
        </>)}
        </div>
        {!tabletView && <div className={classes.image} />}
    </Grid>
    {tabletView && <Footer/>}
    </div>
  );
}

export default connector(RecoverUsername);