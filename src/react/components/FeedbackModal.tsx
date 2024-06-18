import React, { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Fade, fade, Backdrop, Modal, TextField, 
    IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import { connect, ConnectedProps } from 'react-redux';
import { ReduxState } from '../types';
import { useHistory } from 'react-router-dom';
import FeedbackService from '../../services/feedback';
import Colors from '../css/Colors';
import { CustomToolTip } from './CustomToolTip';
import { ColorSelect } from './AccessibilityPage';

import CloseIcon from './icons/CloseIcon';
import { ThankYouPaper } from './icons/ThankYouPaper';
import { RedErrorPaper, RedErrorPaperBoarder } from './icons/ErrorPaper';

const mapDispatchToProps = {
}
  
const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user,
        styleSettings: state.styleSettings
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  onboarding: boolean;
  onDoneOnboarding: () => void;
} & ConnectedProps<typeof connector>;

interface StyleProps {
    backgroundCol: ColorSelect,
    copyCol: ColorSelect,
    headingsCol: ColorSelect,
    readableFont: boolean,
    highlightHeading: boolean,
}

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [`& p, label, textarea`]: {
            fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Roboto Slab',
            color: (props: StyleProps) => props.copyCol,    
        },
        [`& h4`]: {
            fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Lora',
            color: (props: StyleProps) => props.headingsCol,
            backgroundColor: (props: StyleProps) => props.highlightHeading? 'yellow' : '',
            width: 'fit-content'
        },
    },
    paper: {
        boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
        padding: '16px 105px 48px 64px',
        borderRadius: '4px',
        width: '900px',
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: (props: StyleProps) => props.backgroundCol,
        [theme.breakpoints.down('sm')]: {
            padding: '16px 73px 24px 32px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '12px 16px 24px',
        },
    },
    orangeScreen: {
        backgroundColor: Colors.LIGHT_ORANGE_100,
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
        padding: '16px 64px 32px',
        borderRadius: '4px',
        width: '856px',
        alignContent: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: '16px 32px 24px',
        },
        [theme.breakpoints.down(951)]: {
            width: '90vw',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '16px 16px 24px',
        },
    },
    redScreen: {
        backgroundColor: Colors.CORAL_200,
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
        width: '856px',
        alignContent: 'center',
        padding: '16px 59px 32px',
        borderRadius: '4px',
        [theme.breakpoints.down('sm')]: {
            padding: '16px 32px 24px',
        },
        [theme.breakpoints.down(951)]: {
            width: '90vw',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '16px 16px 24px',
        },
    },
    title: {
        font: 'Lora',
        fontWeight: 700,
        marginTop: 50,
        marginBottom: 24,
        fontSize: '36px',
        lineHeight: '48px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: 16,
            marginTop: 24,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '22px',
            lineHeight: '32px',
        },
    },
    failedTitle: {
        font: 'Lora',
        fontWeight: 700,
        marginTop: 0,
        marginBottom: 32,
        fontSize: '30px',
        lineHeight: '40px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: 16,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '22px',
            lineHeight: '32px',
        },
    },
    subheader: {
        marginBottom: 32,
        [theme.breakpoints.down('sm')]: {
            marginBottom: 24,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px',
            lineHeight: '23px',
        },
    },
    questionPromt: {
        marginBottom: 12,
        fontWeight: 600,
        [theme.breakpoints.down('sm')]: {
            marginBottom: 8,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px',
            lineHeight: '22px',
        },
    },
    submitButton: {
        borderRadius: '8px',
        backgroundColor: 'black',
        marginTop: '8px',
        width: '260px',
        height: '55px',
        color: 'white',
        '&:hover': {
            backgroundColor: fade('#222222', 0.9),
        },
        [`& span`]: {
            fontSize: 17,
            fontFamily: 'Roboto Slab',
            [theme.breakpoints.down('xs')]: {
                fontSize: 15,
            },
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 0,
        },
        [theme.breakpoints.down('xs')]: {
            height: '40px',
            width: '100%',
        },
    },
    statusScreenButton: {
        [theme.breakpoints.up('sm')]: {
            width: '147px',
        },
        marginRight: 'auto', 
        marginLeft: 'auto', 
        display: 'flex'
    },
    closeButton: {
        float: 'right',
        padding: 0,
        marginRight: '-89px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '-57px'
        },
        [theme.breakpoints.down('xs')]: {
            marginRight: '-4px'
        },
    },
    closeButtonMargins: {
        marginRight: '-48px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '-16px'
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: '-4px',
            marginRight: '-4px'
        },
    },
    errorIcon: {
        width: '71px',
        display: 'flex',
        margin: '34px auto 32px',
        [theme.breakpoints.down('sm')]: {
            margin: '24px auto 27px',
        },
    },
    thankYouIcon: {
        width: '110px',
        display: 'flex',
        margin: '64px auto 0',
        [theme.breakpoints.down('sm')]: {
            marginTop: '24px'
        },
    },

    /* Text feild styling */
    textFeild: {
        fontSize: '18px',
        position: 'relative',
        margin: '0 0 24px 0',
        [`& label`]: {
          top: '4px',
          '&.shrink': {
            top: '0px',
          },
        },
        [`& fieldset`]: {
          borderRadius: '4px',
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
          margin: '0 0 24px 0',
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
        height: '132px',
        //width: '735px',
        [theme.breakpoints.down('sm')]: {
            height: '107px',
            [`& input`]: {
            fontSize: '16px',
            },
        },
    },
    textFeildLabel: {
        backgroundColor: (props: StyleProps) => props.backgroundCol,
        paddingRight: '5px',
        fontSize: '18px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
            paddingRight: 0,
        },
    },
    focused: {},
    notchedOutline: {}
}));

//state type
type State = {
    firstQuestion: string
    secondQuestion:  string
    isButtonDisabled: boolean
};
  
const initialState:State = {
    firstQuestion: '',
    secondQuestion: '',
    isButtonDisabled: true,
};

type Action = { type: 'setFirstQ', payload: string }
  | { type: 'setSecondQ', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'setFirstQ': 
        return {
          ...state,
          firstQuestion: action.payload
        };
      case 'setSecondQ': 
        return {
          ...state,
          secondQuestion: action.payload
        };
      case 'setIsButtonDisabled': 
        return {
          ...state,
          isButtonDisabled: action.payload
        };
    }
}

function FeedbackModal(props: Props) {
    const { onboarding, styleSettings, onDoneOnboarding } = props
    let history = useHistory();
    const classes = useStyles({...styleSettings});
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [success, setSuccess] = React.useState(false);
    const [failure, setFailure] = React.useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleFirstQChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setFirstQ',
        payload: event.target.value
      });
    };

  const handleSecondQChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setSecondQ',
        payload: event.target.value
      });
    };

    React.useEffect(() => {
        if (state.firstQuestion.trim() || state.secondQuestion.trim()) {
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
      }, [state.firstQuestion, state.secondQuestion]);

    const handleSubmit = () => {
        const d = new Date();
        let dateString = new Date(d).toUTCString();
        let response = {
            username: props.user.username,
            date: dateString.split(' ').slice(0, 4).join(' '),
            firstResponse: state.firstQuestion,
            secondResponse: state.secondQuestion,
        }
        
        FeedbackService.submit(response).then(feedback => {
            if (feedback.username) {
                setSuccess(true);
                setFailure(false);
            } else {
                setFailure(true);
                setSuccess(false);
            }
          }
        ).catch(() => {
            setFailure(true);
            setSuccess(false);
        })
    };

    const handleClose = () => {
        if (onboarding) onDoneOnboarding();

        history.goBack();
        setOpen(false);
    };

    const getFeedbackForm = () => {
        return (
            <Fade in={open}>
                <div className={classes.paper}>
                    <CustomToolTip title={`For now, let’s close the form.`} placement={ "left" } arrow open={onboarding} smallScreenMargins={"62px"} >
                        <IconButton edge="start" color="inherit" className={classes.closeButton} aria-label="open drawer" onClick={handleClose}>
                            <CloseIcon style={{color: styleSettings.copyCol}} shrink={isSmallScreen}/>
                        </IconButton>
                    </CustomToolTip>
                    <Typography variant="h4" className={classes.title}>Give your feedback to Simbi Learn Cloud</Typography>
                    <Typography component="p" className={classes.subheader}>Your opinion matters! Please complete the following form and help us improve Simbi Learn Cloud.</Typography>
                    <Typography component="p" className={classes.questionPromt}>Did you or your students experience any problems when using Simbi Learn Cloud?</Typography>
                    <TextField
                        id="firstQuestion"
                        type="email"
                        label="Describe the problem(s) here"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows="4"
                        className={classes.textFeild}
                        InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline} } }
                        InputLabelProps={{classes: {root: classes.textFeildLabel,
                        shrink: "shrink"}}}
                        onChange={handleFirstQChange}
                        //onKeyPress={handleKeyPress}
                    />
                    <Typography component="p" className={classes.questionPromt}>Is there anything that could be improved in Simbi Learn Cloud?</Typography>
                    <TextField
                        id="secondQuestion"
                        type="text"
                        label="Provide your thoughts or ideas here"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows="4"
                        className={classes.textFeild}
                        InputProps={{ classes: {root: classes.textFeildStyle, focused: classes.focused, notchedOutline: classes.notchedOutline}, } }
                        InputLabelProps={{classes: {root: classes.textFeildLabel,
                        shrink: "shrink"}}}
                        onChange={handleSecondQChange}
                        //onKeyPress={handleKeyPress}
                    />            
                    <Button variant="contained" className={classes.submitButton} onClick={handleSubmit} disabled={state.isButtonDisabled}>
                        <span>Submit</span>
                    </Button>
                </div>
            </Fade>
        );
    };

    const getSuccessScreen = () => {
        return (
            <Fade in={open}>
                <div className={classes.orangeScreen}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        className={`${classes.closeButton} ${classes.closeButtonMargins}`}
                        aria-label="open drawer"
                        onClick={handleClose}
                    >
                        <CloseIcon shrink={isSmallScreen}/>
                    </IconButton>
                    <div className={classes.thankYouIcon}><ThankYouPaper ></ThankYouPaper></div>
                    <Typography variant="h4" className={classes.title} style={{marginLeft: 'auto', marginRight: 'auto'}}>Thank you!</Typography>
                    <Typography component="p" className={classes.subheader} style={{textAlign: 'center', marginBottom: mobileView ? 24 : 48, marginTop: 8}}>Your feedback will be sent to Simbi Foundation for review.</Typography>
                    <Button variant="contained" className={`${classes.submitButton} ${classes.statusScreenButton}`} onClick={handleClose}>
                        <span>Got it!</span>
                    </Button>
                </div>
            </Fade>
        );
    };

    const getFailureScreen = () => {
        return (
            <Fade in={open}>
                <div className={classes.redScreen}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        className={`${classes.closeButton} ${classes.closeButtonMargins}`}
                        aria-label="open drawer"
                        onClick={handleClose}
                    >
                        <CloseIcon shrink={isSmallScreen}/>
                    </IconButton>
                    <div className={classes.errorIcon} style={{position: 'relative'}}><div style={{marginTop: 5, marginLeft: -5}}><RedErrorPaperBoarder></RedErrorPaperBoarder></div><div style={{position: 'absolute'}}><RedErrorPaper ></RedErrorPaper></div></div>
                    <Typography variant="h4" className={classes.failedTitle} style={{marginLeft: 'auto', marginRight: 'auto'}}>We are sorry!</Typography>
                    <Typography component="p" className={classes.subheader} style={{textAlign: 'center'}}>We’re having trouble submitting your form to our server. This isn’t your fault.</Typography>
                    <Typography component="p" className={classes.subheader} style={{textAlign: 'center'}}>Please click “Try again”. If this problem persists, please contact your school's administrator, who will be able to contact Simbi Foundation for support.</Typography>
                    <Button variant="contained" className={`${classes.submitButton} ${classes.statusScreenButton}`} onClick={handleSubmit}>
                        <span>Try again</span>
                    </Button>
                </div>
            </Fade>
        );
    };
    
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <>
                {(!success && !failure) && getFeedbackForm()}
                {success && getSuccessScreen()}
                {failure && getFailureScreen()}
                </>
            </Modal>
        </div>
    );
}

export default connector(FeedbackModal);