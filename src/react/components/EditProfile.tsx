import { makeStyles, useTheme, withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { ReduxState, View } from '../types';
import { loadResources, setResourceList, updateSecurityCredentials, changeUserName } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import React, { useReducer, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Footer from './Footer';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "../Data";
import HideIcon from './icons/HideIcon';
import ShowIcon from '../components/icons/ShowIcon';
import EditProfileIcon from './icons/EditProfileIcon';
import { useHistory, Link } from 'react-router-dom'
import { Button, Grid, TextField, InputAdornment, IconButton, FormControl, Select, MenuItem, FormHelperText } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Colors from '../css/Colors';
import UserService from '../../services/users';
import { BackDashboardIcon } from "./icons/backIcon";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ColorSelect, ColorSelectContrast } from './AccessibilityPage';

interface ProfileInput {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

interface PasswordInput {
    username: string; 
    password: string;
    currentPassword: string;
    newPassword: string;
    reEnterNewPassword: string;
}

interface SecurityQInput {
    id: number;
    securityQuestion: string;
    securityAnswer: string;
    username: string;
    password: string;
}

interface StyledTabProps {
    label: string;
    value: string;
}

const profileSchema = yup.object().shape({
    id: yup.string().required(),
    firstName: yup.string().required('First name is a required field').min(2, 'First name must be at least 2 characters').max(20, "First name must not be more than 20 characters"),
    lastName: yup.string().required('Last name is a required field').min(2, 'Last name must be at least 2 characters').max(20, "Last name must not be more than 20 characters"),
});

const securityQSchema = yup.object().shape({
    id: yup.string().required(),
    securityQuestion: yup.string().required('You must create a security question'),
    securityAnswer: yup.string().required('You must enter a security answer').min(5, "Security answer must be at least 5 characters").max(20, "Security answer must be at most 20 characters"),
});

const passwordSchema = yup.object().shape({
    username: yup.string().required(),
    currentPassword: yup.string().required('Old password is a required field').min(2).max(20),
    newPassword: yup.string().required('New password is a required field').min(8, "New password cannot be shorter than 20 characters").max(20, "New password cannot be longer than 20 characters"),
    reEnterNewPassword: yup.string().required('You must confirm your password').oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

const mapDispatchToProps = {
    loadResources,
    setResourceList,
    changeUserName,
    updateSecurityCredentials
}

const mapStateToProps = (state: ReduxState) => {
    return {
        resourceList: state.resourceList,
        user: state.user,
        backgroundCol: state.styleSettings.backgroundCol,
        textCol: state.styleSettings.copyCol,
        highlightLink: state.styleSettings.highlightLink
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
    shrinkTopBar: boolean,
    editSection: View,
} & ConnectedProps<typeof connector>;

interface StyleProps {
	shrinkTopBar: boolean,
    backgroundCol: ColorSelect,
    textCol: ColorSelect
}

const AntTabs = withStyles({
    root: {
        [`& button`]: {
            marginLeft: 'auto',
            marginRight: 'auto'
        },
    },
    indicator: {
        backgroundColor: Colors.TEAL_200,
        height: 6,
        borderRadius: 2,
        zIndex: 1,
    },
})(Tabs);


const AntTab = withStyles((theme: Theme) =>
    createStyles({
        root: {
            textTransform: 'none',
            minWidth: 100,
            fontSize: 16,
            fontFamily: 'Roboto Slab',
            '&:hover': {
                // fontWeight: theme.typography.fontWeightMedium,
            },
            '&$selected': {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        selected: {
            // fontWeight: theme.typography.fontWeightMedium, 
        }
    }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
    contentContainer: {
        backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
        marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
        height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
        width: '100%',
        overflow: 'overlay',
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
        display: 'flex',
        margin: '95px 36px 0 17.75%',
        [theme.breakpoints.down('sm')]: {
            width: "calc(100% - 64px)",
            display: 'table',
            margin: '24px 32px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: '24px 16px 14px',
            width: "calc(100% - 32px)",
        },
    },
    titleContainer: {
        height: '100%',
    },
    title: {
        fontSize: '30px',
        lineHeight: '40px',
        margin: '0 16px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px',
            lineHeight: '24px',
            margin: '16px auto 0'
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
    editProfileIcon: {
        width: '70px',
        height: '70px',
    },
    fieldContainer: {
        height: '45vh',
        display: 'flex',
        flexDirection: 'row',
        margin: '36px 36px 180px 17.75%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            marginLeft: '36px',
            marginBottom: '220px',
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: '16px',
            marginRight: '16px',
            marginTop: '0px',
            marginBottom: '180px',
        },
    },
    fieldAttributes: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '130px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row',

        },
    },
    fieldText: {
        fontSize: '16px',
        lineHeight: '24px',
        textAlign: 'left',
        paddingBottom: '6px',
        textDecoration: 'none',
        color: 'black',
        backgroundColor: 'transparent !important',
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
            lineHeight: '24px',
            width: '105px'
        },
    },
    fieldTextSelectedGreen: {
        '&::before': {
            content: '"1"',
            color: '#00949D',
            backgroundColor: '#00949D',
            borderRadius: '2px',
            marginRight: '4px'
        },
    },
    fieldTextSelectedGreenLarge: {
        marginLeft: '12px',
        '&::before': {
            content: '""',
            color: '#00949D',
            backgroundColor: '#00949D',
            borderRadius: '2px',
            height: '52px',
            width: '8px',
            display: 'block',
            top: '2px',
            left: '-12px',
            position: 'absolute',
        },
    },
    textField: {
        margin: '10px 0',
        [`& fieldset`]: {
            borderRadius: '10px',
            borderColor: Colors.GRAY_700
        },
        "& .MuiInputBase-root.Mui-disabled": {
            color: "black"
        },
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            marginBottom: '0',
            height: '48px',
            [`& div`]: {
                height: '48px',
            },
            [`& label`]: {
                top: '-4px',
                '&.shrink': {
                  top: '0px',
                },
              },
        },
    },
    formInput: {
        fontSize: '16px',
        color: 'grey'
    },
    selectField: {
        margin: 'none',
        borderRadius: '10px',
        fontSize: '18px',
        lineHeight: '26px',
        maxHeight: '55px',
        backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? 'white' : 'transparent',
        [`& fieldset`]: {
            borderColor: Colors.GRAY_700
        },
        ['& svg']: {
			color: (props: StyleProps) => props.textCol
		},
        [theme.breakpoints.down('xs')]: {
            height: '48px',
            [`& div`]: {
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '6px !important'
            },
        },
    },
    textFeildStyle: {
        backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? 'white' : 'transparent',
        [`& input`]: {
          fontSize: '18px',
        },
        [theme.breakpoints.down('sm')]: {
          [`& input`]: {
            fontSize: '16px',
          },
        },
      },
    submitButton: {
        marginTop: '8px',
        backgroundColor: 'black',
        color: 'white',
        height: '55px',
        width: '178px',
        borderRadius: '8px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '40px',
            fontSize: '15px',
        }
    },
    attributeField: {
        textAlign: 'left',
        fontSize: '16px',
        [theme.breakpoints.down('xs')]: {
            paddingTop: '8px !important',
            paddingBottom: '8px !important'
        },
    },
    attributeFieldText: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 500,
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
            lineHeight: '20px',
        },
    },
    securityQFeildText: {
        paddingBottom: '10px',
        fontWeight: 500
    },
    inputContainer: {
        marginLeft: '56px',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            marginLeft: '0',
            marginTop: '32px',
        }
    },
    successfulBanner: {
        position: 'absolute',
        paddingTop: '12px',
        marginTop: '0px',
        backgroundColor: '#00BDA3',
        width: '100%',
        height: '50px',
        zIndex: 1,
        [`& p`]: {
            textAlign: 'center',
            color: 'white !important',
            fontWeight: 800
        }
        
    },
    return: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '24px',
        marginLeft: '25px',
    },
    returnWithBanner: {
        marginTop: '53px'
    },
    test: {
        width: '100%',
        height: 2,
        backgroundColor: Colors.GRAY_600,
        left: 0,
        bottom: 4,
        marginTop: '-4px',
    },
    mobileTabs: {
        [`& button span`]: {
            color: (props: StyleProps) => `${props.textCol} !important`
        },
        [`& svg path`]: {
            fill: (props: StyleProps) => props.textCol
        },
        '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.3,
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: '-16px',
            marginRight: '-16px',
        },
        [theme.breakpoints.down('sm')]: {
            [`& span`]: {
                fontSize: '14px',
                width: 'fit-content'
            },
        },
        [theme.breakpoints.down(390)]: {
            [`& button`]: {
                marginLeft: '0px',
                marginRight: '0px',
                minWidth: 'unset'
            },
        }
    }
}));

type State = {
    passwordIncorrect: boolean
    passwordMessage: string
    passwordAlreadyUsed: boolean
    passwordAlreadyUsedMessage: string
};

const initialState: State = {
    passwordMessage: '',
    passwordAlreadyUsedMessage: '',
    passwordIncorrect: false,
    passwordAlreadyUsed: false
};

type Action = { type: 'passwordIncorrect', payload: string }
    | { type: 'succesfullyChangedPassword', payload: boolean }
    | { type: 'passwordAlreadyUsedMessage', payload: string };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'passwordIncorrect':
            return {
                ...state,
                passwordIncorrect: true,
                passwordMessage: action.payload,
            };
        case 'succesfullyChangedPassword':
            return {
                ...state,
                passwordIncorrect: action.payload,
                passwordAlreadyUsed: action.payload,
                passwordMessage: '',
                passwordAlreadyUsedMessage: '' 
            };
        case 'passwordAlreadyUsedMessage':
            return {
                ...state,
                passwordAlreadyUsed: true,
                passwordAlreadyUsedMessage: action.payload,
                passwordIncorrect: false,
                passwordMessage: '',
            };
    }
}

function EditProfile(props: Props) {
    const { shrinkTopBar, backgroundCol, textCol, editSection } = props;
    const { changeUserName, updateSecurityCredentials } = props

    const classes = useStyles({ shrinkTopBar, backgroundCol, textCol });

    // Profile view
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // Password view
    const [oldPasswordShown, setOldPasswordShown] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    // Security questions view
    const [customQuestionVisibility, setCustomQuestionVisibility] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState([]);

    const [changesSavedBanner, setChangesSavedBanner] = useState(false);
    const theme = useTheme();
    const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
    const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
    const arrowButtons = useMediaQuery(theme.breakpoints.down(390));

    const history = useHistory();

    useEffect(() => {
        console.log(props.user.firstName);
        resetProfile({id: props.user.id, firstName: props.user.firstName, lastName: props.user.lastName, });
        resetPass({currentPassword: '', newPassword: '', reEnterNewPassword: ''});
        resetSecurityQ({securityQuestion: '', securityAnswer: '',});
      }, [editSection, props.user]);

    const clipScreen = () => {
        return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
    }

    const handleChange = (_event: React.ChangeEvent<{}>, newValue: View) => {
        switch (Number(newValue)) {
            case View.EDITPROFILE: {
                history.push('/edit-profile');
                break;
            }
            case View.EDITPASSWORD: {
                history.push('/edit-password');
                break;
            }
            case View.EDITSECURITYQUESTION: {
                history.push('/edit-securityquestion');
                break;
            }
        }
    };

    const { register: registerProfile, handleSubmit: handleProfile, reset: resetProfile, formState: { errors: profileErrors },
	} = useForm<ProfileInput>({
		resolver: yupResolver(profileSchema),
	});

    const { register: registerPassword, handleSubmit: handlePassword, reset: resetPass, formState: { errors: passErrors },
	} = useForm<PasswordInput>({
		resolver: yupResolver(passwordSchema),
	});

    const { register: registerSecurityQuestion, handleSubmit: handleSecurityQuestion, reset: resetSecurityQ, formState: { errors: securityQErrors },
	} = useForm<SecurityQInput>({
		resolver: yupResolver(securityQSchema),
	});

    /* Profile view helper functions */
    const onProfileChange = (data: User) => {
        changeUserName(data)
        setChangesSavedBanner(true)
        setTimeout(() => {
            setChangesSavedBanner(false)
        }, 8000)
    };

    /* Password view helper functions */
    const onPassChange = (data: User) => {
        console.log(`Request: ${JSON.stringify(data)}`)
        UserService.userUpdateUserPassword(data).then((response) => {
            console.log(`Response: `+ response)
            setChangesSavedBanner(true)
            setTimeout(() => {
                setChangesSavedBanner(false)
            }, 8000)
            dispatch({
                type: 'succesfullyChangedPassword',
                payload: false
            })
        }).catch((error) => {
            console.log(`Error Message: ${error.message}`)
            if (error.message === "Password is incorrect") {
                dispatch({
                    type: 'passwordIncorrect',
                    payload: error.message,
                })
            } else if (error.message === "Password has already been used, please enter a new password") {
                dispatch({
                    type: 'passwordAlreadyUsedMessage',
                    payload: "Password has already been used. Please enter a new password.",
                })
            } else {
                dispatch({
                    type: 'passwordIncorrect',
                    payload: "Error Changing Password",
                })
            }  
        })
    };

    const toggleOldPassword = () => {
        setOldPasswordShown(!oldPasswordShown);
    };

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const toggleConfirmPassword = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    };

    /* Security question view helper functions */
    const onSecurityQChange = (data: User) => {
        updateSecurityCredentials(data)
        setChangesSavedBanner(true)
        setTimeout(() => {
            setChangesSavedBanner(false)
        }, 8000)
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

    /* Rendering functions */
    const securityQuestionView = () => {
        return (
            <form
                onSubmit={handleSecurityQuestion(onSecurityQChange)} noValidate>
                <TextField
                    {...registerSecurityQuestion("id", { value: props.user.id })}
                    variant="outlined"
                    value={props.user.id}
                    style={{ display: 'none' }}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={10} className={classes.attributeField} style={{paddingBottom: mobileView? '0px !important' : ''}}>
                        <Typography className={`${classes.attributeField} ${classes.securityQFeildText}`}>Security question</Typography>
                        <FormControl
                            fullWidth>
                            <Select
                                {...customQuestionVisibility ? {} : { ...registerSecurityQuestion("securityQuestion") }}
                                fullWidth
                                displayEmpty
                                value={securityQuestion}
                                onChange={handleSecurityQuestionChange}
                                variant="outlined"
                                error={!customQuestionVisibility && !!securityQErrors.securityQuestion?.message}
                                IconComponent={KeyboardArrowDownIcon}
                                className={classes.selectField}
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
                            <FormHelperText style={{ marginLeft: '1em', color: '#f44336' }}>{!customQuestionVisibility && securityQErrors.securityQuestion?.message}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {customQuestionVisibility && <Grid item xs={12} md={10} className={classes.attributeField}>
                        <Typography className={`${classes.attributeField} ${classes.securityQFeildText}`}>Type your new security question</Typography>
                        <TextField
                            {...customQuestionVisibility ? { ...registerSecurityQuestion("securityQuestion") } : {}}
                            variant="outlined"
                            label="Your question"
                            defaultValue=""
                            helperText={securityQErrors.securityQuestion?.message}
                            error={!!securityQErrors.securityQuestion?.message}
                            className={classes.textField}
                            InputProps={{ classes: {root: classes.textFeildStyle} } }
                            style={{ marginTop: 0 }}
                            fullWidth
                        />
                    </Grid>}
                    <Grid item xs={12} md={10} className={classes.attributeField}>
                        <Typography className={`${classes.attributeField} ${classes.securityQFeildText}`}>Security answer</Typography>
                        <TextField
                            {...registerSecurityQuestion("securityAnswer")}
                            variant="outlined"
                            label="Your answer"
                            defaultValue=""
                            helperText={securityQErrors.securityAnswer?.message}
                            error={!!securityQErrors.securityAnswer?.message}
                            className={classes.textField}
                            InputProps={{ classes: {root: classes.textFeildStyle} } }
                            style={{ marginTop: 0 }}
                            fullWidth
                        />

                    </Grid>
                    <Grid item xs={12} className={classes.attributeField} style={{ height: '55px', paddingBottom: '80px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submitButton}
                        >
                            Save changes
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    const passwordView = () => {
        return (
            <form
                onSubmit={handlePassword(onPassChange)} noValidate>
                <TextField
                    {...registerPassword("username", { value: props.user.username })}
                    variant="outlined"
                    value={props.user.username}
                    style={{ display: 'none' }}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={10} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>Current password</Typography>
                        <TextField
                            {...registerPassword("currentPassword")}
                            id="currentPassword"
                            variant="outlined"
                            label="Enter your current password"
                            type={oldPasswordShown ? "text" : 'password'}
                            defaultValue=""
                            helperText={passErrors.currentPassword?.message || state.passwordMessage}
                            error={!!passErrors.currentPassword?.message || state.passwordIncorrect}
                            className={classes.textField}
                            InputProps={{ classes: {root: classes.textFeildStyle}, endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleOldPassword}> {(oldPasswordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                                    </IconButton>
                                </InputAdornment>
                                ),} }
                        />
                    </Grid>
                    <Grid item xs={12} md={10} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>{mobileView? 'New password (min. 8 chars)' : 'New password'}</Typography>
                        <TextField
                            {...registerPassword("newPassword")}
                            id="newPassword"
                            variant="outlined"
                            label={mobileView? 'Enter new password' : 'Enter new password (min. 8 characters)'}
                            type={passwordShown ? "text" : 'password'}
                            defaultValue=""
                            helperText={passErrors.newPassword?.message || state.passwordAlreadyUsedMessage}
                            error={!!passErrors.newPassword?.message || state.passwordAlreadyUsed}
                            className={classes.textField}
                            InputProps={{ classes: {root: classes.textFeildStyle}, endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePassword}> {(passwordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                                    </IconButton>
                                </InputAdornment>
                                ),} }
                        />

                    </Grid>
                    <Grid item xs={12} md={10} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>Re-enter new password</Typography>
                        <TextField
                            {...registerPassword("reEnterNewPassword")}
                            id="reEnterNewPassword"
                            variant="outlined"
                            label={mobileView? 'Re-enter new password' : 'Re-enter new password (min. 8 characters)'}
                            type={confirmPasswordShown ? "text" : 'password'}
                            className={classes.textField}
                            defaultValue=""
                            helperText={passErrors.reEnterNewPassword?.message}
                            error={!!passErrors.reEnterNewPassword?.message}
                            InputProps={{ classes: {root: classes.textFeildStyle}, endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleConfirmPassword}> {(confirmPasswordShown)? <HideIcon style={{marginTop: 7, marginRight: 1}} inverse={backgroundCol === ColorSelect.BLACK}/> : <ShowIcon inverse={backgroundCol === ColorSelect.BLACK}/>}
                                    </IconButton>
                                </InputAdornment>
                                ),} }
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.attributeField} style={{ height: '55px', paddingBottom: '80px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submitButton}
                        >
                            Save password
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    const profileView = () => {
        return (
            <form
                onSubmit={handleProfile(onProfileChange)} noValidate>
                <TextField
                    {...registerProfile("id", { value: props.user.id })}
                    variant="outlined"
                    value={props.user.id}
                    style={{ display: 'none' }}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>First name</Typography>
                        <TextField
                            {...registerProfile("firstName")}
                            id="firstName"
                            variant="outlined"
                            defaultValue={props.user.firstName}
                            helperText={profileErrors.firstName?.message}
                            error={!!profileErrors.firstName?.message}
                            className={classes.textField}
                            InputProps={{ classes: {root: classes.textFeildStyle} } }
                            onChange={(event) => {
                                setFirstName(event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={5} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>Last name</Typography>
                        <TextField
                            {...registerProfile("lastName")}
                            id="lastName"
                            variant="outlined"
                            defaultValue={props.user.lastName}
                            helperText={profileErrors.lastName?.message}
                            InputProps={{ classes: {root: classes.textFeildStyle} } }
                            error={!!profileErrors.lastName?.message}
                            className={classes.textField}
                        />

                    </Grid>
                    <Grid item xs={12} md={5} className={classes.attributeField}>
                        <Typography className={classes.attributeFieldText}>Username</Typography>
                        <TextField
                        id="username"
                            style={{ backgroundColor: (backgroundCol === ColorSelect.WHITE)? '#EDEEF1' : Object.values(ColorSelectContrast)[Object.values(ColorSelect).indexOf(props.backgroundCol)],
                                borderRadius: '10px', color: 'black' }}
                            disabled
                            variant="outlined"
                            value={props.user.username}
                            className={classes.textField}
                        />

                    </Grid>
                    <Grid item xs={5}>
                    </Grid>
                    <Grid item xs={12} className={classes.attributeField} style={{ height: '55px', paddingBottom: '80px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submitButton}
                        >
                            Save changes
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    !props.user.token && history.push('/teacher-portal')
    return (
        <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}}>
            {changesSavedBanner && <div className={classes.successfulBanner}>
                <Typography component="p">Changes were successfully saved.</Typography></div>}
            <div className={`${classes.return} ${changesSavedBanner ? classes.returnWithBanner : ''}`}>
                <Link to='/teacher-dashboard'>
                    <BackDashboardIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textCol}/>
                </Link>
            </div>
            <div className={classes.heroContainer}>
                <EditProfileIcon className={classes.editProfileIcon} />
                <div className={classes.titleContainer}>
                    <Typography variant="h3" className={classes.title}>Edit Profile</Typography>
                    <Typography component="p" className={classes.proposition}>
                        Use the forms below to change your name, password, and security question. Don’t forget to save your changes!
                        </Typography>
                </div>
            </div>
            <div className={classes.fieldContainer}>
                {tabletView ?
                    <div className={classes.mobileTabs}>
                        <AntTabs value={`${editSection}`} onChange={handleChange} variant="scrollable" scrollButtons={arrowButtons? 'on' : 'off'}>
                            <AntTab label="Profile" value={`${View.EDITPROFILE}`} />
                            <AntTab label="Password" value={`${View.EDITPASSWORD}`} />
                            <AntTab label="Security Question" value={`${View.EDITSECURITYQUESTION}`} />
                        </AntTabs>
                        <div className={classes.test}></div>
                    </div>
                    : <div className={classes.fieldAttributes}>
                        <Link to='/edit-profile' className={classes.fieldText}>
                            <Typography variant='subtitle1' component="p" style={{ paddingBottom: '0' }} className={`${classes.fieldText} ${(editSection === View.EDITPROFILE)? classes.fieldTextSelectedGreen : ''}`}>Profile</Typography>
                        </Link>
                        <Link to='/edit-password' className={classes.fieldText}>
                            <Typography variant='subtitle1' component="p" style={{ paddingBottom: '0' }} className={`${classes.fieldText} ${(editSection === View.EDITPASSWORD)? classes.fieldTextSelectedGreen : ''}`}>Password</Typography>
                        </Link>
                        <Link to='/edit-securityquestion' className={classes.fieldText} style={{width: '92px'}}>
                            <Typography variant='subtitle1' component="p" style={{ paddingBottom: '0', position: 'relative' }} className={`${classes.fieldText} ${(editSection === View.EDITSECURITYQUESTION)? classes.fieldTextSelectedGreenLarge : ''}`}>Security Question</Typography>
                        </Link>
                    </div>}

                <div className={classes.inputContainer}>
                    <div style={{display: (editSection === View.EDITSECURITYQUESTION)? '' : 'none'}}>{securityQuestionView()}</div>
                    <div style={{display: (editSection === View.EDITPASSWORD)? '' : 'none'}}>{passwordView()}</div>
                    <div style={{display: (editSection === View.EDITPROFILE)? '' : 'none'}}>{profileView()}</div>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default connector(EditProfile);