import React, { useReducer, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, createStyles, Typography, TextField, Button,
  InputAdornment, IconButton, fade, Theme, useTheme, Grid, } from "@material-ui/core";
import UserService from '../../services/users'
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Footer from './Footer';
import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from '../types';
import ShowIcon from '../components/icons/ShowIcon';
import HideIcon from './icons/HideIcon';
import Colors from '../css/Colors';
import { BackIcon } from "./icons/backIcon";
import { Link } from 'react-router-dom';
import { ColorSelect } from './AccessibilityPage';

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface PasswordFormInput {
  newPassword: string;
  reEnterNewPassword: string;
}

const schema = yup.object().shape({
    newPassword: yup.string().required('You must enter a new password').min(8, 'Your new password must be at least 8 characters').max(20, 'Your new password must not be more than 20 characters'),
    reEnterNewPassword: yup.string().required('You must confirm your password').oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  });

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
      [theme.breakpoints.down(1000)]: {
        height: '1028px',
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
    section3Prompt: {
        marginBottom: 24,
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
    resetPasswordField: {
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
    password: {
        [theme.breakpoints.down(378)]: {
          [`& label`]: {
            '&.shrink': {
              "&:after": {
              content: '" (min. 8 characters) "',
              }
            },
          },
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
      '&:hover': {
        backgroundColor: fade('#222222', 0.9),
      },
      '&:disabled': {
        backgroundColor: '#D8D8D8',
        color: '#E3E3E3',
      },
      [theme.breakpoints.down('sm')]: {
        marginTop: '14px',
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
    notchedOutline: {}

  })
);

//state type

type State = {
  username: string
  password:  string
  repassword:  string
  securityQuestion:  string
  isButton1Disabled: boolean
  isButton2Disabled: boolean
  isButton3Disabled: boolean
  usernameMessage: string
  questionMessage: string
  step1Error: boolean
  step2Error: boolean
  repeatPasswordMessage: string
  securityAnswer: string
};

const initialState:State = {
  username: '',
  password: '',
  repassword: '',
  securityQuestion:  'Your security question should appear here',
  isButton1Disabled: true,
  isButton2Disabled: true,
  isButton3Disabled: true,
  usernameMessage: '',
  questionMessage: '',
  step1Error: false,
  step2Error: false,
  repeatPasswordMessage: '',
  securityAnswer: '',
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setIsButton1Disabled', payload: boolean }
  | { type: 'setSecretQuestion', payload: string }
  | { type: 'setIsButton2Disabled', payload: boolean }
  | { type: 'setPassword', payload: string }
  | { type: 'setRePassword', payload: string }
  | { type: 'setIsButton3Disabled', payload: boolean }
  | { type: 'getUserSuccess', payload: string }
  | { type: 'getUserFailed', payload: string }
  | { type: 'getAnwserSuccess', payload: string }
  | { type: 'getAnwserFailed', payload: string }
  | { type: 'getRepeatPassword', payload: string }
  | { type: 'setSecurityAnswer', payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
    case 'setSecretQuestion': 
      return {
        ...state,
        securityQuestion: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setRePassword': 
      return {
        ...state,
        repassword: action.payload
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
    case 'setIsButton3Disabled': 
      return {
        ...state,
        isButton3Disabled: action.payload
      };
    case 'getUserSuccess': 
      return {
        ...state,
        usernameMessage: action.payload,
        step1Error: false
      };
    case 'getUserFailed': 
      return {
        ...state,
        usernameMessage: action.payload,
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
    case 'getRepeatPassword': 
      return {
        ...state,
        repeatPasswordMessage: action.payload,
      };
    case 'setSecurityAnswer': 
      return {
        ...state,
        securityAnswer: action.payload
      };
  }
}

const mapDispatchToProps = {
}

type Props = {
  shrinkTopBar: boolean;
  onResetPassword: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect;
}

const mapStateToProps = (state: ReduxState) => ({
  user: state.user,
  pincode: state.pincode,
  backgroundCol: state.styleSettings.backgroundCol,
  textCol: state.styleSettings.copyCol,
  highlightLink: state.styleSettings.highlightLink
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ResetPassword = (props: Props) => {
    const { shrinkTopBar, backgroundCol, textCol} = props;
    const classes = useStyles({ shrinkTopBar, backgroundCol });
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<PasswordFormInput>({
      resolver: yupResolver(schema),
    });

  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const shortenPrompt = useMediaQuery(theme.breakpoints.down(384));

  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
 
  useEffect(() => {
    if (state.username.trim()) {
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

    if (state.securityAnswer.trim()) {
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
    
    if (state.password.trim() && state.repassword.trim()) {
      dispatch({
        type: 'setIsButton3Disabled',
        payload: false
      });
      } else {
        dispatch({
          type: 'setIsButton3Disabled',
          payload: true
        });
    }
  }, [state.username, state.securityAnswer, state.password, state.repassword]);

  let path = '/teacher-portal'
  let history = useHistory();

  const handleStep1 = () => {
    let user = {
      username: state.username
    }
     
     UserService.sendUsername(user).then(securityQuestion => {
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
    ).catch(() => {
      dispatch({
        type: 'getUserFailed',
        payload: 'Please enter an existing username'
      });
    })
  };

  const handleStep2 = () => {
    let user = {
      username: state.username,
      securityAnswer: state.securityAnswer
    }
    
    UserService.verifyAnwser(user).then(() => {
     dispatch({
       type: 'getAnwserSuccess',
       payload: ''
     })
     setStep3(true);
    }
    ).catch(() => {
      dispatch({
        type: 'getAnwserFailed',
        payload: 'Incorrect anwser to security question'
      });
    })
 };

 const handleStep3 = () => {
  let user = {
    username: state.username,
    newPassword: state.password
  }

  UserService.passwordCheck(user).then(newPass => {
    if (newPass) {
      UserService.resetPassword(user).then(newPass => {
        if (newPass) {
          props.onResetPassword();
          history.push(path)
        } else {
          dispatch({
            type: 'getRepeatPassword',
            payload: 'Failed to change your password.'
          });
          setNewPassword(true);
        }
      })
    } else {
      dispatch({
        type: 'getRepeatPassword',
        payload: 'You must choose a password you have not used before.'
      });
      setNewPassword(true);
    }
   })
  };

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const handleErrorReset = () => {
    setNewPassword(false);
    dispatch({
      type: 'getRepeatPassword',
      payload: ''
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButton1Disabled || handleStep1();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handleSecurityAnswerChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setSecurityAnswer',
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
  const handleRePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setRePassword',
        payload: event.target.value
      });
    }

  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}}>
        <Grid item xs={12} sm={12} md={12} className={classes.grid}>
          {tabletView && <div className={classes.image} />}
          <div className={classes.resetPasswordField}>
            {!tabletView && (
            <div className={classes.return}>
              <Link to='/teacher-portal'>
                  <BackIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
              </Link>
            </div>)}
            <Typography variant="h4" className={classes.title}>Reset password</Typography>
            <Typography variant="h3" className={classes.subtitle}>Step 1 of 3</Typography>
            <TextField
              error={state.step1Error}
              helperText={state.usernameMessage}
              disabled={step2}
              fullWidth
              id="username"
              type="email"
              label="Username"
              margin="normal"
              variant="outlined"
              className={classes.textField}
              InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
              InputLabelProps={{classes: {root: classes.textFieldLabel,
                shrink: "shrink"}}}
              onChange={handleUsernameChange}
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
              <Typography variant="h3" className={`${classes.subtitle} ${classes.additionalSubtitle}`}>Step 2 of 3</Typography>
              <Typography component="p" className={`${classes.prompt} ${classes.section2Prompt}`}>Please answer the security question below.</Typography>
              <Typography variant="h3" className={classes.question}>{state.securityQuestion}</Typography>
              <TextField
                  error={state.step2Error}
                  helperText={state.questionMessage}
                  disabled={step3}
                  fullWidth
                  id="securityQuestion"
                  type="email"
                  label="Your answer"
                  margin="normal"
                  variant="outlined"
                  className={classes.textField}
                  InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
                  InputLabelProps={{classes: {root: classes.textFieldLabel,
                  shrink: "shrink"}}}
                  onChange={handleSecurityAnswerChange}
                  onKeyPress={handleKeyPress}
              />
              {!step3 && 
              <Button
                  variant="contained"
                  className={classes.nextBtn}
                  onClick={handleStep2}
                  disabled={state.isButton2Disabled}>
                  <span className={classes.buttonText}>Next</span>
              </Button>
              }
              {step3 && (
              <>
                  <Typography variant="h3" className={`${classes.subtitle} ${classes.additionalSubtitle}`}>Step 3 of 3</Typography>
                  <Typography component="p" className={`${classes.prompt} ${classes.section3Prompt}`}>Create a new password. It must be different from previously used passwords.</Typography>
                  <form 
                  onSubmit={handleSubmit(handleStep3)} 
                  noValidate>
                    <TextField
                      {...register("newPassword")}
                        helperText={!!errors.newPassword?.message ? errors.newPassword?.message : state.repeatPasswordMessage}
                        error={!!errors.newPassword?.message || newPassword}
                        fullWidth
                        id="newpassword"
                        type={passwordShown ? "text" : 'password'}
                        label={shortenPrompt ? "Create new password" : "Create new password (min. 8 characters)"}
                        margin="normal"
                        variant="outlined"
                        className={`${classes.textField} ${classes.password}`}
                        InputLabelProps={{classes: {root: classes.textFieldLabel,
                        shrink: "shrink"}}}
                        InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePassword}> {(passwordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                            </IconButton>
                        </InputAdornment>
                        ),} }
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress}/> 
                    <TextField
                        {...register("reEnterNewPassword")}
                        helperText={errors.reEnterNewPassword?.message}
                        error={!!errors.reEnterNewPassword?.message}
                        fullWidth
                        id="repassword"
                        type={confirmPasswordShown ? "text" : 'password'}
                        label="Re-enter new password"
                        margin="normal"
                        variant="outlined"
                        className={classes.textField}
                        InputLabelProps={{classes: {root: classes.textFieldLabel, shrink: "shrink"}}}
                        InputProps={{ classes: {root: classes.textFieldStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleConfirmPassword}> {(confirmPasswordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                            </IconButton>
                        </InputAdornment>
                        ),} }
                        onChange={handleRePasswordChange}
                        onKeyPress={handleKeyPress}/> 
                    <Button
                        type="submit"
                        variant="contained"
                        className={classes.nextBtn}
                        disabled={state.isButton3Disabled}
                        onClick={handleErrorReset}
                        >
                        <span className={classes.buttonText}>Reset Password</span>
                    </Button>
                  </form>
              </>  
              )}
              </>  
            )}
              
          </div>
          {!tabletView && <div className={classes.image} />}
      </Grid>
      {tabletView && <Footer/>}
    </div>
  );
}
 
export default connector(ResetPassword);