import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Fade, fade, Backdrop, Modal} from "@material-ui/core";
import { logoutUser, extendSession, checkLogin} from '../actions';
import { ReduxState } from '../types';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UserService, {UserParams} from '../../services/users';
import { ColorSelect } from './AccessibilityPage';

export const SESSION_WARNING_TIME = 300;
const mapDispatchToProps = {
    logoutUser,
    extendSession,
    checkLogin
  }

const mapStateToProps = (state: ReduxState) => {
return {
    user: state.user,
    styleSettings: state.styleSettings
}
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
    onTimeout: () => void;
    onSignout: () => void;
  } & ConnectedProps<typeof connector>;

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: (props: StyleProps) => props.backgroundCol,
        border: '2px solid #FE7B11',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),

        [`& p`]: {
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
    title: {
        font: 'Lora',
        marginBottom: 24,
        [theme.breakpoints.down('xs')]: {
            marginBottom: 16,
            fontSize: '24px',
            lineHeight: '32px',
        },
    },
    body: {
        maxWidth: '600px',
        marginBottom: 24,
        [theme.breakpoints.down(750)]: {
            maxWidth: '80vw',
        },
        [theme.breakpoints.down('xs')]: {
            maxWidth: '440px',
            fontSize: '16px',
            lineHeight: '23px',
        },
        [theme.breakpoints.down(550)]: {
            maxWidth: '80vw',
        },
    },
    button: {
        borderRadius: '8px',
        backgroundColor: 'black',
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
    }
}));

interface StyleProps {
    backgroundCol: ColorSelect;
    copyCol: ColorSelect;
    headingsCol: ColorSelect;
    readableFont: boolean;
    highlightHeading: boolean;
  }

const bcLoggedOut = new BroadcastChannel('loggedOut');

function TimeoutModal(props: Props) {
    const {styleSettings, logoutUser, extendSession, onTimeout, onSignout, checkLogin} = props
    const classes = useStyles({...styleSettings});
    const [open, setOpen] = React.useState(false);
    let path = ''
    let history = useHistory();

    const handleLogout = () => {
        path = '';
        terminateInterval();
        closeModal();
        if (props.user.username) {
            console.log('Logging out');
            logoutUser(props.user.token);
        }
        history.push(path);
        onSignout();
    };

    const checkLoggedIn = () => {
        if (props.user.token) {
            UserService.getSessionExpireTime(props.user.token).then(timeLeft => {
              console.log('Remaining session time: '+timeLeft);
              console.log('Interval function id: '+checkTimeOut);
              console.log('Logged in as: '+props.user.username);
              if (timeLeft <= 0) sessionTimeOut();
              else if (timeLeft <= SESSION_WARNING_TIME) openModal();
            }
            ).catch(e => {
              console.log(e);
              console.log('Failed to obtain remaining session time!')
        })
        } else {
            console.log('Interval function is still running. This is likely a memory leak!!!');
        }
    };
    let checkTimeOut = 0;

    const handleExtendSession= () => {
        if (props.user.username) {
            UserService.extendSession(props.user).then(() => {
                console.log('Extended session')
              }).catch(() => {
                console.log('Extend session error')
              })
            setOpen(false);
        }
    };

    const openModal = () => {
        if (!open) setOpen(true);
    };

    const terminateInterval = () => {
        window.clearInterval(checkTimeOut);
    }

    const closeModal = () => {
        setOpen(false);
    };

    const sessionTimeOut = () => {
        path = '/teacher-portal';
        terminateInterval();
        history.push(path);
        closeModal();
        if (props.user.token) checkLogin(props.user.token);
        onTimeout();
    };

    React.useEffect(() => {
        checkTimeOut = window.setInterval(checkLoggedIn, 30000);

        /* Handle the case where the user logged out through the dashboard */
        bcLoggedOut.onmessage = event => {
            terminateInterval();
            closeModal();
            onSignout();
        }
    }, []);
    
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                style={{zIndex: 6000}}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <Typography variant="h4" component="h4" className={classes.title}>Session Timeout Warning</Typography>
                        <Typography component="p" className={classes.body}>Hi {props.user.firstName ? props.user.firstName : ''}, your session will timeout in 5 minutes. You can extend your session for another hour or you can sign out now.</Typography>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button variant="contained" className={classes.button} onClick={handleExtendSession}>
                                <span>Extend session</span>
                            </Button>
                            <Button variant="contained" className={classes.button} onClick={handleLogout}>
                                <span>Sign out</span>
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default connector(TimeoutModal);