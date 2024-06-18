import {
  makeStyles, Container, Typography, TextField, Button, InputAdornment, IconButton, 
  Select, MenuItem, FormControl, FormHelperText, useTheme, Grid,
} from "@material-ui/core";
import * as React from 'react';
import { Dimensions } from 'react-native';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ReduxState } from '../types';
import { createUser, getPincode } from '../actions';
import { User } from "../Data";
import { NAVBAR_HEIGHT } from "./ClippedDrawer";
import { Link } from 'react-router-dom'
import ShowIcon from '../components/icons/ShowIcon';
import HideIcon from './icons/HideIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { BackIcon } from "./icons/backIcon";
import Colors from '../css/Colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Footer from './Footer';
import { Scrollbar } from "react-scrollbars-custom";
import { ColorSelect } from './AccessibilityPage';

enum SignupErrorMessage {
  NONE, SERVER, EXISTS
}

interface IFormInput {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  reEnterPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  pinCode: string;
} 

const schema = yup.object().shape({
  firstName: yup.string().required('First name is a required field').min(2, 'First name must be at least 2 characters').max(20, "First name must not be more than 20 characters"),
  lastName: yup.string().required('Last name is a required field').min(2, 'Last name must be at least 2 characters').max(20, "Last name must not be more than 20 characters"),
  password: yup.string().required('Password is a required field').min(8).max(20),
  reEnterPassword: yup.string().required('You must confirm your password').oneOf([yup.ref('password'), null], 'Passwords must match'),
  securityQuestion: yup.string().required('You must create a security question').typeError('You must create a security question'),
  securityAnswer: yup.string().required('You must enter a security answer').min(5, "Security answer must be at least 5 characters").max(20, "Security answer must be at most 20 characters"),
});

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: '100vw',
    height: '100vh',
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    fallbacks: {
      overflowY: 'scroll',
      overflowX: 'hidden',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
      height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    },
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
      minHeight: `calc(100vh - 285.5px + 55px) !important`,
    },
  },
  scrollbarWrapper: {
    width: '50%',
    
    [theme.breakpoints.up('md')]: {
      minHeight: '100vh',
      height: '1024px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      //height: `calc(100vh - ${NAVBAR_HEIGHT}px - 46vw)`,
      //minHeight: '100vh',
    },
  },
  signUpContainer: {
    padding: '0 109px',
    margin: 0,
    width: '50vw',
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
      paddingBottom: '48px',
      fallbacks: {
        overflowY: 'scroll',
        overflowX: 'hidden',
      },
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '11.35vw',
      paddingRight: '11.35vw',
      width: '100%',
      //display: 'table',
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
  heading: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: '36px',
    lineHeight: '48px',
    margin: '101px auto 64px',
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 24px',
      fontSize: '24px',
      lineHeight: '32px',
    },
  },
  subheading: {
    fontSize: '18px',
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  alreadyExists: {
    fontSize: '16px',
    lineHeight: '24px',
    backgroundColor: '#FCE9E8',
    borderRaduis: '4px',
    padding: '16px',
    marginTop: '24px',
    color: `${Colors.CORAL_600} !important`,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  leftEmpty: {
    fontSize: '0.75rem',
    lineHeight: '1.66',
    marginTop: '8px',
    color: '#f44336 !important',
    position: 'relative',
    marginLeft: '6px',
    marginRight: 'auto'
  },
  submitButton: {
    backgroundColor: 'black',
    color: 'white',
    height: '60px',
    borderRadius: '8px',
    marginTop: '24px',
    '& :first-child': {
      fontSize: 17,
      fontFamily: 'Roboto Slab',
    },
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      '& :first-child': {
        fontSize: 15,
      },
    },
  },
  formInput: {
    fontSize: '16px',
    color: 'grey',
    [`& p`]: {
      fontSize: '16px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
      [`& p`]: {
        fontSize: '14px',
      },
    },
  },
  firstName: {
    [theme.breakpoints.up('md')]: {
      width: '40%',
      marginLeft: 12,
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
  textField: {
    fontSize: '18px',
    lineHeight: '26px',
    position: 'relative',
    margin: '16px 0',
    [`& label`]: {
      top: '4px',
      '&.shrink': {
        top: '0px',
      },
    },
    [`& fieldset`]: {
      borderRadius: '10px',
      borderColor: '#757575'
    },
    [`& span`]: {
      width: '94%',
      height: '94%',
    },
    [`& p`]: {
      marginTop: 5,
      marginBottom: 5,
      marginRight: 0,
      marginLeft: 6
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
      lineHeight: '23px',
      margin: '10px 0',
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
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    fontSize: '18px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
  },
  selectField: {
    zIndex: 0,
    margin: 'none',
    borderRadius: '4px',
    height: '64px',
    ['& svg']: {
      color: (props: StyleProps) => props.textCol
    },
    '& :first-child': {
      fontSize: '18px',
    },
    [`& p`]: {
      marginTop: 0,
      marginBottom: 0,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    },
    [`& fieldset`]: {
      borderColor: '#757575',
    },
    marginBottom: 6,
    [theme.breakpoints.down('sm')]: {
      height: '48px',
      marginBottom: 0,
      [`& div`]: {
        paddingTop: 12,
        paddingBottom: 12,
      },
      [`& p`]: {
        marginTop: 0,
      },
      '& :first-child': {
        fontSize: '16px',
      }
    },
  },
  securityText: {
    fontWeight: 600,
    textAlign: 'left',
    margin: '16px 0',
    fontSize: '18px',
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '14px',
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  image: {
    width: '50vw',
    backgroundImage: 'url(/images/teacherPortalSignUpBanner.png)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [theme.breakpoints.up('md')]: {
      minHeight: '100vh',
      position: 'absolute',
      top: 0,
      right: 0,
    },
    [theme.breakpoints.down(1269)]: {
      height: '1180px',
    },
    [theme.breakpoints.down(1238)]: {
      height: '1200px',
    },
    [theme.breakpoints.down(1084)]: {
      height: '1250px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'table',
      height: '46vw',
      margin: '0 auto',
      marginBottom: '24px',
      backgroundPosition: '0 -20vw',
    },
  },
  return: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  regularHeight: {
    height: '1024px',
    [theme.breakpoints.down('sm')]: {
      height: '46vw',
    },
  },
  loginLink: {
    marginTop: 24,
    fontSize: '18px',
    lineHeight: '26px',
    //paddingBottom: '47px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16,
      fontSize: '16px',
      lineHeight: '23px',
      paddingBottom: '56px',
    },
  },
  homepageButton: {
    textDecoration: 'none',
    backgroundColor: 'transparent !important',
  },
  accountCreated: {
    background: Colors.ORANGE_100,
    borderRadius: '4px',
    marginBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '24px'
    },
  },
  pinArray: {
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%',
    '& :first-child': {
      marginLeft: '0px',
    },
    '& :last-child': {
      marginRight: '0px',
    },
    
    [theme.breakpoints.between('md', 1804)]: { //  styling 8 pin code
      justifyContent: 'space-between',
    },
    /*[theme.breakpoints.between('md', 1470)]: {
      justifyContent: 'space-between',
    },*/ //                                  CODE FOR STYLING 6 PIN PASSCODES

    [theme.breakpoints.between(1000, 1090)]: { //  styling 8 pin code
      marginLeft: -6,
      marginRight: -6,
      width: 'calc(100% + 12px)'
    },
    [theme.breakpoints.between('md', 1000)]: { //  styling 8 pin code
      marginLeft: -15,
      width: 'calc(100% + 25px)'
    },
    [theme.breakpoints.between(384, 700)]: {
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down(392)]: { //  styling 8 pin code
      width: 'calc(100% + 32px)',
      marginLeft: -16,
      justifyContent: 'center',
    },
    [theme.breakpoints.down(372)]: { //  styling 8 pin code
      justifyContent: 'space-between',
      width: '100%',
      marginLeft: 0,
    },
    [theme.breakpoints.down(310)]: { //  styling 8 pin code
      width: 'calc(100% + 32px)',
      marginLeft: -16,
      justifyContent: 'center',
    },
  },
  pinInput: {
    width: '54px',
    height: '54px',
    border: '1px solid #757575',
    fontSize: '16px',
    textAlign: 'center',
    borderRadius: '10px',
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    [theme.breakpoints.up(1804)]: { //  styling 8 pin code
      margin: '0 18px',
    },/*
    [theme.breakpoints.up(1670)]: {
      margin: '0 18px',
    },*/ //                            CODE FOR STYLING 6 PIN PASSCODES
    [theme.breakpoints.between('sm', 994)]: { //  styling 8 pin code
      marginLeft: -10,
    },
    [theme.breakpoints.between(700, 'sm')]: { //  styling 8 pin code
      margin: '0 18px',
    },
    [theme.breakpoints.down('sm')]: {
      //margin: '0 18px',
      fontSize: '14px',
      width: '48px',
      height: '48px',
    },
    [theme.breakpoints.down('xs')]: {
      //margin: '0 16px',
      width: '44px',
      height: '44px',
    },
    [theme.breakpoints.down(470)]: {
      //margin: '0 2px',
    },
    [theme.breakpoints.down(412)]: {//  styling 8 pin code
      marginLeft: 1,
    },
    [theme.breakpoints.down(372)]: { //  styling 8 pin code
      width: '38px',
      height: '38px',
    },
    [theme.breakpoints.down(342)]: { //  styling 8 pin code
      width: '34px',
      height: '34px',
    },
  },
  largeNegativeMargins: {
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
  },
  smallNegativeMargins: {
    marginLeft: -20,
    marginRight: -20,
    [theme.breakpoints.down(1140)]: {
        marginLeft: -10,
        marginRight: -10,
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginRight: 0,
    },
  },
  trackY: {
    background: 'white !important',
  },
  redBorder: {
    borderColor: Colors.CORAL_400,
  },
  focused: {},
  notchedOutline: {}
}));

const mapDispatchToProps = {
  createUser,
  getPincode
}
type Props = {
  shrinkTopBar: boolean;
  onSignup: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect;
  textCol: ColorSelect;
}

const mapStateToProps = (state: ReduxState) => ({
  user: state.user,
  pincode: state.pincode,
  backgroundCol: state.styleSettings.backgroundCol,
  textCol: state.styleSettings.copyCol,
  highlightLink: state.styleSettings.highlightLink
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const SignUp = (props: Props) => {
  const {
    shrinkTopBar,
    backgroundCol,
    textCol,
    createUser,
    getPincode,
    onSignup
  } = props
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const classes = useStyles({shrinkTopBar, backgroundCol, textCol});
  const theme = useTheme();
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const shortenPrompt = useMediaQuery(theme.breakpoints.down(378));

  //const [json, setJson] = useState<string>();
  const [securityQuestion, setSecurityQuestion] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);
  const [customQuestionVisibility, setCustomQuestionVisibility] = useState(false);
  const [accountCreatedView, setAccountCreatedView] = useState(false);
  const pinLength: number = 8
  const [pin, setPin] = useState<Array<number | undefined>>([]);
  const [submitPin, setSubmitPin] = React.useState('')
  const [invalidPincode, setinvalidPincode] = React.useState(false); 
  const [emptyPincode, setEmptyPincode] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(SignupErrorMessage.NONE);

  const contentContainerRef = React.useRef<any>();

  const onPinChange = (pinEntry: number | undefined, index: number) => {
    const newPin = [...pin];
    newPin[index] = pinEntry;
    setPin(newPin);
    setSubmitPin([...newPin].join(''))
  }

  const inputRefs = React.useRef<HTMLInputElement[]>([]);
  const changePinFocus = (pinIndex: number) => {
    const ref = inputRefs.current[pinIndex]
    if (ref) {
      ref.focus()
    }
  }

  const PIN_MIN_VALUE = 0;
  const PIN_MAX_VALUE = 9;
  const BACKSPACE_KEY = 'Backspace';
  //const cleanNumber = number.replace(/[^0-9]/g, ""); //TODO: might need this after testing numpad on passcode on phone

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value;
    const pinNumber = Number(value.trim());
    if (isNaN(pinNumber) || value.length === 0) {
      return
    }
    if (pinNumber >= PIN_MIN_VALUE && pinNumber <= PIN_MAX_VALUE) {
      onPinChange(pinNumber, index);
      if (index < pinLength) {
        changePinFocus(index + 1)
      }
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const keyBoardKeyCode = event.nativeEvent.code;
    if (keyBoardKeyCode !== BACKSPACE_KEY) {
      return
    }
    if (pin[index] === undefined) {
      changePinFocus(index - 1)
    } else {
      onPinChange(undefined, index)
    }
  }

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const handleSecurityQuestionChange = (event: any) => {
    if (event.target.value == 'Custom Question') {
      setCustomQuestionVisibility(true)
      setSecurityQuestion(event.target.value)
    } else {
      setCustomQuestionVisibility(false)
      setSecurityQuestion(event.target.value)
    }
  };

  const onSubmit = async (data: User) => {
    setErrorMessage(SignupErrorMessage.NONE);
    submitPin ? setEmptyPincode(false) : setEmptyPincode(true);
    if (parseInt(submitPin) === props.pincode) {
      setinvalidPincode(false);
      //setJson(JSON.stringify(data));
      const responce = await createUser(data);
      if (responce === `{"token":"Already Exists"}`) setErrorMessage(SignupErrorMessage.EXISTS);
      else if (responce === `{"token":"Server Error"}`) setErrorMessage(SignupErrorMessage.SERVER);
      else onSignup();
    } else {setinvalidPincode(true);}
  };

  const checkPincode = () => {
    setErrorMessage(SignupErrorMessage.NONE);
    if (submitPin) {
      setEmptyPincode(false);
      (parseInt(submitPin) === props.pincode) ? setinvalidPincode(false) : setinvalidPincode(true);
    } else setEmptyPincode(true); 
  };

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  React.useEffect(() => {
    if ((props.user.token !== "Already Exists") && (props.user.username !== '')) {
      setAccountCreatedView(true);
      scrollToTop();
    } else setAccountCreatedView(false);
  }, [props.user]);

  React.useEffect(() => {
    if (emptyPincode && (submitPin.length === 6)) {
      setEmptyPincode(false);
      setinvalidPincode(false);
    }
  }, [submitPin]);

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
    }
  }

  React.useEffect(() => {
    getPincode();
  }, []);
    
  const getContentContainer = () => {
    return (
      <Container className={classes.signUpContainer}>
        {accountCreatedView ? <>
          <Typography className={classes.heading} variant="h5">
            Account created
          </Typography>
            <Typography style={{ marginBottom: tabletView ? '24px' : '40px' }} className={`${classes.subheading} ${classes.largeNegativeMargins}`} variant="subtitle1" component="p">
              You have successfully created a Simbi Learn Cloud’s Teacher account!
          </Typography>
            <div className={classes.accountCreated}>
              <Typography style={{ paddingTop: '16px', marginBottom: tabletView ? '16px' : '14px' }} className={classes.subheading} variant="subtitle1" component="p">
                Your username is:
              </Typography>
              <Typography style={{ paddingBottom: '16px', fontSize: tabletView ? '18px' : '24px', fontWeight: 700, lineHeight: tabletView ? '24px' : '32px' }} className={classes.subheading} variant="subtitle1" component="p">
                {props.user.username}
              </Typography>
            </div>
            <Typography style={{ marginBottom: tabletView ? '24px' : '32px' }} className={`${classes.subheading} ${classes.largeNegativeMargins}`} variant="subtitle1" component="p">
              Please make note of this username as you will need it in order to log in into the Teacher’s portal of Simbi Learn Cloud.
            </Typography>
            <Typography style={{ marginBottom: tabletView ? '24px' : '48px' }} className={`${classes.subheading} ${classes.smallNegativeMargins}`} variant="subtitle1" component="p">
              For security purposes, we need to verify that you’re a registered teacher in this school. Once this is verified, we will notify you that your account has been 
              activated so you can proceed to log in into the Teacher’s portal.
            </Typography>
            <Link to='/' className={classes.homepageButton}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submitButton}
                style={{ marginBottom: '60px', marginTop: 0 }}
              >
                Go to homepage
            </Button>
            </Link>
        </> 
        : ( <>
        <div className={classes.return}>
          <Link to='/teacher-portal'>
            <BackIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
          </Link>
        </div>
        <Typography style={{ marginBottom: tabletView ? '24px' : '32px', marginTop: tabletView ? '24px' : '48px' }} className={classes.heading} variant="h5">
          Teacher’s Portal Sign Up
        </Typography>
        <Typography style={{ marginBottom: tabletView ? '24px' : '32px' }} className={classes.subheading} variant="subtitle1" component="p">
          You need to be a teacher in order to create an account.
        </Typography>
        {(errorMessage !== SignupErrorMessage.NONE) && (
          <Typography style={{ marginBottom: tabletView ? '18px' : '26px', color: Colors.CORAL_400 }} className={classes.subheading} variant="subtitle1">
          {(errorMessage === SignupErrorMessage.EXISTS) ? <>{"An account with this name already exists."} <br></br> {"Please choose another."}</> : "An error occured creating your account, please try again. If this persits then contact your school administrator."}
          </Typography>
        )}
        <form
        onSubmit={handleSubmit(onSubmit, checkPincode)} 
        noValidate>
          <Grid direction={tabletView?"column":"row"} spacing={1} container style={{width: '100%', margin: 0,}} >
            <TextField
              {...register("firstName")}
              variant="outlined"
              label="First name"
              fullWidth
              style={{ marginTop: 0 }}
              helperText={errors.firstName?.message}
              error={!!errors.firstName?.message || (errorMessage === SignupErrorMessage.EXISTS)}
              className={`${classes.textField} ${classes.firstName}`}
              InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
              InputLabelProps={{classes: {root: classes.textFeildLabel,
                shrink: "shrink"}}}
            />
            <TextField
              {...register("lastName")}
              variant="outlined"
              label="Last name"
              fullWidth
              style={{ marginTop: 0 }}
              helperText={errors.lastName?.message}
              error={!!errors.lastName?.message || (errorMessage === SignupErrorMessage.EXISTS)}
              className={`${classes.textField} ${classes.lastName}`}
              InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
              InputLabelProps={{classes: {root: classes.textFeildLabel,
                shrink: "shrink"}}}
            />
          </Grid>
          <TextField
            {...register("password")}
            variant="outlined"
            key="Create a password"
            label={shortenPrompt ? "Create a password" : "Create a password (min. 8 characters)"}
            helperText={errors.password?.message}
            error={!!errors.password?.message}
            type={passwordShown ? "text" : 'password'}
            className={`${classes.textField} ${classes.password}`}
            style={{ marginTop: 0 }}
            fullWidth
            InputLabelProps={{classes: {root: classes.textFeildLabel,
              shrink: "shrink"}}}
            InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePassword}> {(passwordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                </IconButton>
              </InputAdornment>
            ),} }
          />
          <TextField
            {...register("reEnterPassword")}
            variant="outlined"
            label="Re-enter password"
            helperText={errors.reEnterPassword?.message}
            error={!!errors.reEnterPassword?.message}
            type={confirmPasswordShown ? "text" : 'password'}
            style={{ marginTop: 0 }}
            className={classes.textField}
            fullWidth
            InputLabelProps={{classes: {root: classes.textFeildLabel,
              shrink: "shrink"}}}
            InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPassword}> {(confirmPasswordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                </IconButton>
              </InputAdornment>
            ),} }
          />
          <Typography className={classes.securityText} variant="subtitle1">
            In case you forget your username or password:
          </Typography>
          <FormControl
            fullWidth>
            <Select
              {...customQuestionVisibility ? {} : { ...register("securityQuestion") }}
              fullWidth
              displayEmpty
              value={securityQuestion}
              onChange={handleSecurityQuestionChange}
              variant="outlined"
              error={!customQuestionVisibility && !!errors.securityQuestion?.message}
              IconComponent={KeyboardArrowDownIcon}
              className={classes.selectField}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
                getContentAnchorEl: null
              }}
            >
              <MenuItem disabled value="">
                <Typography className={classes.formInput} align="left">-Choose a security question-</Typography>
              </MenuItem>
              <MenuItem className={classes.formInput} value={'What is your place of birth?'}><Typography align="left">What is your place of birth?</Typography></MenuItem>
              <MenuItem className={classes.formInput} value={'What is your favourite animal?'}><Typography align="left">What is your favourite animal?</Typography></MenuItem>
              <MenuItem className={classes.formInput} value={'What is the first name of your best friend?'}><Typography align="left">What is the first name of your best friend?</Typography></MenuItem>
              <MenuItem className={classes.formInput} value={'What is your favourite food?'}><Typography align="left">What is your favourite food?</Typography></MenuItem>
              <MenuItem className={classes.formInput} value={'Custom Question'}><Typography align="left">-Type your own question below-</Typography></MenuItem>
            </Select>
            <FormHelperText style={{ marginLeft: '1em', color: '#f44336', marginTop: 0, marginBottom: 10 }}>{!customQuestionVisibility && errors.securityQuestion?.message}</FormHelperText>
          </FormControl>
          {customQuestionVisibility && <TextField
            {...customQuestionVisibility ? { ...register("securityQuestion") } : {}}
            variant="outlined"
            label="Your question"
            helperText={errors.securityQuestion?.message}
            error={!!errors.securityQuestion?.message}
            className={classes.textField}
            InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
            InputLabelProps={{classes: {root: classes.textFeildLabel,
              shrink: "shrink"}}}
            style={{ marginTop: 0 }}
            fullWidth
          />}
          <TextField
            {...register("securityAnswer")}
            variant="outlined"
            label="Your answer"
            helperText={errors.securityAnswer?.message}
            error={!!errors.securityAnswer?.message}
            className={classes.textField}
            InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
            InputLabelProps={{classes: {root: classes.textFeildLabel,
              shrink: "shrink"}}}
            style={{ marginTop: 0 }}
            fullWidth
          />
          <Typography className={classes.securityText} variant="subtitle1" style={{left: 0}}>
            Enter your school's teacher passcode:
          </Typography>
          <FormControl style={{float:'left', width: '100%'}}>
            <div
              className={classes.pinArray}
            >
              {Array.from({ length: pinLength }, (_, index) => (
                <input
                  className={`${classes.pinInput} ${(invalidPincode || emptyPincode) ? classes.redBorder : ''}`}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  key={index}
                  /*type="number"*/ pattern="[0-9]*" inputMode="numeric"
                  ref={el => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  onChange={(event) => onChange(event, index)}
                  value={pin[index] || ''}
                />
              ))}
            </div>
            <TextField
              {...register("pinCode", { value: submitPin })}
              style={{ display: 'none' }}
            />
            {(invalidPincode && !emptyPincode) && <Typography className={classes.alreadyExists} variant="subtitle1" component="p">
                Invalid passcode. <br></br>
                Contact your school administrator for the correct passcode.
              </Typography>}
              {emptyPincode && <Typography className={classes.leftEmpty} variant="subtitle1" component="p">
                Please input your school's sign-up passcode
              </Typography>}
            </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submitButton}
            onClick={()=>{scrollToTop();}}
          >
            Create account
          </Button>
          <Typography className={classes.loginLink} variant="subtitle1" component="p"> Already have an account?
            <Link to="/teacher-portal" style={{ marginLeft: '.25em' }}>Log in</Link>
          </Typography>
          {/*json && (
            <>
              <Typography variant="body1">
                Below is the JSON that would normally get passed to the server
                when a form gets submitted
            </Typography>
              <Typography variant="body2">{json}</Typography>
            </>
          )*/}
          </form>
        </> )}
      </Container>
    );
  }

  return (
  <div ref={contentContainerRef} className={classes.mainContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}}>
    <Grid item xs={12} sm={12} md={12} className={classes.grid}>
      {tabletView && (
      <>
        <div className={classes.image} />
        {getContentContainer()}
      </>
      )}
      {!tabletView && (
      <>
        <div className={classes.scrollbarWrapper}>
          <Scrollbar noScrollY={tabletView} noScrollX={true} style={{ width: '98%', height: '100%', }} maximalThumbYSize={360}
          trackYProps={{ className: classes.trackY }}>
            {getContentContainer()}
          </Scrollbar>
        </div>
        <div className={`${classes.image} ${classes.regularHeight}`}/>
      </>
      )}
    </Grid>
    {tabletView && <Footer/>}
  </div>
  );
}

export default connector(SignUp); 