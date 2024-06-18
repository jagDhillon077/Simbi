import { makeStyles } from '@material-ui/core/styles';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { ReduxState } from '../types';
import { loadResources, setResourceList } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Footer from './Footer';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, FormControl, Grid, InputLabel, TextField, useTheme, Dialog, 
	OutlinedInput, FormHelperText, DialogContent, Typography, Fab, IconButton,} from '@material-ui/core';
import AdminIcon from './icons/AdminIcon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getUserList, deleteUser, changeUserPassword, updatePincode, getPincode, sendNotificationUser } from '../actions';
import { useHistory, Link } from 'react-router-dom'
import ResourceService from '../../services/resources';
import { User, Resource, Notification } from '../Data';
import { BackDashboardIcon } from "./icons/backIcon";
import { BACKEND_URL } from '../../services';
import FeedbackService from '../../services/feedback';
import Colors from '../css/Colors';
import { minHeight } from '@mui/system';
import { useThrottle } from '../../helpers';
import { ArrowRightAlt } from '@material-ui/icons';
import UserService from '../../services/users';
import { ColorSelect } from './AccessibilityPage';
import CloseIcon from './icons/CloseIcon';

const FULL_WIDTH = 1302;
const STRETCH = 1068;

interface IFormInput {
	id: number;
	password: string;
	reEnterPassword: string;
	username: string;
}

interface PincodeChangeType {
    pincode: number;
    reEnterPincode: number;
}

const changePassSchema = yup.object().shape({
	id: yup.number().required('ID is a required field').typeError('ID is a required field'),
	password: yup.string().required('Password is a required field').min(8).max(20),
	reEnterPassword: yup.string().required('You must confirm your password').oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const changePinSchema = yup.object().shape({
    pincode: yup.number().required('Passcode is a required field').test('len', 'Passcode must be exactly 8 characters', val => val?.toString().length === 8),
    reEnterPincode: yup.number().required('Passcode is a required field').oneOf([yup.ref('pincode'), null], 'Passcode must match').typeError('You must confirm the chosen passcode'),
});

const mapDispatchToProps = {
	loadResources,
	setResourceList,
	getUserList,
	deleteUser,
	changeUserPassword,
	updatePincode,
    getPincode,
	sendNotificationUser
}

const mapStateToProps = (state: ReduxState) => {
	return {
		resourceList: state.resourceList,
		user: state.user,
		userList: state.userList,
		pincode: state.pincode,
		backgroundCol: state.styleSettings.backgroundCol,
		textColor: state.styleSettings.copyCol,
		highlightLink: state.styleSettings.highlightLink
	}
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
	scrollTo: string,
	shrinkTopBar: boolean,
} & ConnectedProps<typeof connector>;

const useStyles = makeStyles((theme) => ({
    contentContainer: {
        marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
        height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
        width: '100%',
        overflow: 'auto',
        padding: 'none',
        textAlign: 'left',
        backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
        [theme.breakpoints.down('xs')]: {
            overflowX: 'hidden',
            marginTop: `56px !important`,
            height: `calc(100vh - 56px) !important`,
        }
    },
    container: {
        padding: '32px 72px 80px',
        [theme.breakpoints.down('sm')]: {
            padding: '28px 32px 60px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '24px 16px 36px',
        }

    },
    pageTitle: {
        width: '100%',
		[theme.breakpoints.down('sm')]: {
			marginLeft: 'auto',
			marginRight: 'auto',
		},
        [theme.breakpoints.down('xs')]: {
            fontSize: 26
        }
    },
    title: {
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            fontSize: 20
        }
    },
	pincodeTitle: {
        fontSize: '24px',
        lineHeight: '40px',
        textAlign: 'left',
        margin: '0 16px',
        [theme.breakpoints.down('xl')]: {
            marginTop: 16,
            lineHeight: '24px',
            textAlign: 'left',
        },
		[theme.breakpoints.down(FULL_WIDTH)]: {
            paddingTop: 16
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '20px',
        },
    },
    promptTitle: {
        width: '100%',
        textAlign: 'left',
        paddingTop: '64px',
        paddingLeft: '64px',
		[theme.breakpoints.down('sm')]: {
            fontSize: '30px',
			padding: '32px 32px 0',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '24px',
			paddingLeft: '16px',
			paddingRight: '16px',
        },
    },
	pincodeProposition: {
        fontSize: '18px',
        textAlign: 'left',
        padding: '4px 16px',
        lineHeight: '32px',
        [theme.breakpoints.down('xl')]: {
            paddingTop: 16,
            fontSize: '16px',
            lineHeight: '23px',
            textAlign: 'left',
        },
    },
    proposition: {
        padding: '40px 0 64px',
        lineHeight: '23px',
        [theme.breakpoints.down('sm')]: {
            padding: '32px 0 50px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '24px 0 38px',
            fontSize: 16
        }
    },
    promptProposition: {
        padding: '40px 64px 64px',
        lineHeight: '23px',
        textAlign: 'left',
        paddingLeft: '64px',
		[theme.breakpoints.down('sm')]: {
			padding: '32px'
        },
		[theme.breakpoints.down('xs')]: {
            fontSize: '16px',
			paddingLeft: '16px',
			paddingRight: '16px',
        },
    },
    welcome: {
        position: 'relative',
        zIndex: 1,
		backgroundColor: 'transparent !important',
		fontFamily: 'Roboto Slab !important',
    	fontWeight: 600,
		marginTop: '15px',
		[theme.breakpoints.down('sm')]: {
			marginLeft: 'auto',
			marginRight: 'auto',
		},
        [theme.breakpoints.down('xs')]: {
            fontSize: 18
        },
    },
	welcomeUnderline: {
		'&::after': {
            content: '""',
            position: 'absolute',
            width: 285,
            height: 14,
            backgroundColor: Colors.YELLOW_200,
            left: 0,
            bottom: 0,
            zIndex: -1,
            [theme.breakpoints.down('xs')]: {
                width: 257,
            },
        }
	},
	anchor: {
		color: 'inherit',
		textDecoration: 'none',
		maxHeight: '36.5px',
		maxWidth: '130px',
		marginRight: '10px',
		
	},
    cardContainerBox: {
        height: '500px',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: '25px',
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		[`& div p, div h5`]: {
			color: Colors.TEXT_PRIMARY
		},
        [theme.breakpoints.down(FULL_WIDTH)]: {
            width: '100%'
        },
		[theme.breakpoints.up(FULL_WIDTH)]: {
            minWidth: '701px',
			height: '100%'
        },
    },
	cardContainer: {
		width: '100%',
		height: '100%',
		overflowY: 'auto',
		padding: '40px 0 30px 30px',
	},
	publicUploadsBox: {
		height: '500px',
		overflow: 'hidden',
		backgroundColor: 'white',
		width: '100%', 
		marginLeft: 'auto', 
		marginRight: 'auto', 
		marginBottom: '30px',
		borderRadius: '25px',
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		[`& div p, div h5`]: {
			color: Colors.TEXT_PRIMARY
		},
		[theme.breakpoints.down(945)]: {
            width: '945px',
        },
	},
	publicUploads: {
		overflow: 'auto',
		width: '100%', 
		height: '100%',
		borderRadius: '8px',
		padding: '40px 0 30px 30px',
	},
    logout: {
        position: 'absolute',
        textDecoration: 'underline',
        fontSize: '18px',
        lineHeight: '26px',
        left: '87%',
        marginTop: '24px',
        fontWeight: 'bold',
        color: '#2D52B3',
        cursor: 'pointer',
    },
    heroContainer: {
        height: '100%',
        display: 'flex',
        margin: '95px 36px 0 17.75%',
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            display: 'table',
            margin: '24px auto',
        },
    },
    titleContainer: {
        height: '100%',
		[theme.breakpoints.up('md')]: {
            padding: '0 16px'
        },
    },
    editProfileIcon: {
        width: '70px',
        height: '70px',
    },
    textField: {
        margin: '16px 0',
        [`& fieldset`]: {
            borderRadius: '10px',
        },
		[`& p`]: {
            marginTop: '4px',
        },
    },
    return: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '24px',
        marginLeft: '25px',
        zIndex: 1000,
    },
    returnWithBanner: {
        marginTop: '48px'
    },
    resetContainer: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '40px 30px 30px 30px',
        borderRadius: '25px',
        marginLeft: '30px',
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		[`& div input, legend span, p:first-of-type, h5:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
		[`& div label`]: {
			color: Colors.TEXT_SECONDARY
		},
		[theme.breakpoints.up(FULL_WIDTH)]: {
            minWidth: '427px'
        },
        [theme.breakpoints.down(FULL_WIDTH)]: {
            marginTop: 30,
			width: '100%',
			marginLeft: 0,
        },
		[theme.breakpoints.down(388)]: {
            overflowX: 'auto',
        },
    },
    promptContainer: {
        overflowY: 'auto',
        marginTop: '160px',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: '904px',
        borderRadius: '8px',
        boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
		[`& p, h4`]: {
			color: `${Colors.TEXT_PRIMARY} !important`
		},
		[theme.breakpoints.down(972)]: {
            width: 'calc(100% - 68px)',
        },
		[theme.breakpoints.down('xs')]: {
			marginTop: '120px',
            width: 'calc(100% - 34px)',
        },
    },
    promptButton: {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 40px',
        marginTop: '37px',
        marginRight: '40px',
        borderRadius: '8px',
		[theme.breakpoints.down('xs')]: {
            width: '100%',
			marginRight: 0,
			marginTop: 16
        },
    },
    promptCancelButton: {
        backgroundColor: Colors.GRAY_600,
        color: 'black',
        padding: '10px 40px',
        marginTop: '37px',
        borderRadius: '8px',
		[theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    successfulBanner: {
		fontFamily: 'Roboto Slab',
		fontStyle: 'normal',
		fontWeight: 800,
		fontSize: '18px',
		lineHeight: '26px',

        position: 'absolute',
        paddingTop: '12px',
        marginTop: '0px',
        backgroundColor: '#00BDA3',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        height: '50px',
        zIndex: 1000,
        alignContent: 'center',
		[theme.breakpoints.down('xs')]: {
            fontSize: '16px',
        },
    },
    attributes: {
        boxShadow: '0 2px #C4C4C4',
        display: 'flex',
        flexDirection: 'row',
		[`& p`]: {
			fontSize: '14px !important',
			letterSpacing: 'normal !important',
			lineHeight: '1.57 !important'
		},

    },
    usersContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    userListItem: {
        display: 'flex',
        flexDirection: "row"
    },
    userListItemText: {
        //padding: '20px 0px 0 0',
		marginTop: 20,
        fontWeight: 'bold',
        fontSize: '16px',
    },
	resourceUser: {
		minWidth: '150px', 
		overflow: 'auto', 
		marginRight: 7, 
		marginTop: '9.5px', 
        fontWeight: 'bold',
        fontSize: '16px',
		[theme.breakpoints.up(STRETCH)]: {
			width: '16.78%',
		},
	},
	resourceName: {
		minWidth: '135px', 
		overflow: 'auto', 
		marginRight: 10, 
		marginTop: '9.5px',
        fontWeight: 'bold',
        fontSize: '16px',
		[theme.breakpoints.up(STRETCH)]: {
			width: '15.36%',
		},
		[theme.breakpoints.up(1360)]: {
			width: '15.66%',
			marginRight: 5,
		},
	},
	resourceDescription: {
		minWidth: '165px', 
		width: '165px',
		overflow: 'auto', 
		marginRight: 7, 
		fontWeight: 500, 
		fontSize: '15px', 
		marginTop: '9.5px',
		[theme.breakpoints.up(STRETCH)]: {
			width: '18.45%',
		},
	},
	resourceActions: {
		[theme.breakpoints.up(STRETCH)]: {
			display: 'flex',
			justifyContent: 'space-between',
			
		},
	},
	resourceButton: {
		margin: '26.5px 10px 0 0',
		minWidth: '130px',
		maxHeight: '36.5px',
		color: 'white'
	},
	buttonGap: {
		[theme.breakpoints.up(1140)]: {
			marginRight: '2.5%'
			
		},
		[theme.breakpoints.up(1280)]: {
			marginRight: '5%'
			
		},
	},
    deleteUserButton: {
        margin: '20px 0px 0 0',
        minWidth: '150px',
        backgroundColor: 'black',
        color: 'white'
    },
    changeUserPasswordForm: {
        //minWidth: '300px',
		width: '100%',
    },
    changePasswordButton: {
        marginTop: 16,
        padding: '10px 50px',
        backgroundColor: 'black',
        color: 'white'
    },
    resetPasscodeButton: {
        backgroundColor: 'black', 
        color: 'white', 
        width: '100%', 
        padding: '10px', 
        borderRadius: '4px'
    },
	formContainer: {
		minHeight: '380px',
        //width: '701px',
        backgroundColor: 'white', 
        margin: '30px 0 0', 
        borderRadius: '25px',
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		[`& div input, legend span, div p, div h3`]: {
			color: Colors.TEXT_PRIMARY
		},
		[`& div label`]: {
			color: Colors.TEXT_SECONDARY
		},
		[theme.breakpoints.down(FULL_WIDTH)]: {
			width: '100%',
			marginBottom: '60px',
		},
        [theme.breakpoints.down('xs')]: {
            marginBottom: '36px',
        }
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
	formContent: {
		maxWidth: 900,
		textAlign: 'center',
		maxHeight: 'calc(100% - 32px)',
		overflowX: 'hidden',
		[theme.breakpoints.down('xs')]: {
		  margin: 0,
		  maxHeight: '100%',
		}
	},
	formInput: {
		marginTop: 28,
	},
	inputLabel: {
		fontWeight: 600,
		[theme.breakpoints.down('sm')]: {
		  fontSize: 16,
		},
		'&&': {
		  transform: 'translate(0, -32px)',
		  color: Colors.TEXT_PRIMARY,
		}
	},
	helperText: {
		fontSize: 16,
		textAlign: 'right',
		marginBottom: 24,
		[theme.breakpoints.down('sm')]: {
		  fontSize: 14,
		  marginBottom: 16,
		},
	},
	formDialogContent: {
		textAlign: 'left',
		width: 863,
		'&&': {
		  padding: '40px 64px 48px',
		  [theme.breakpoints.down('sm')]: {
			width: '90vw',
			padding: '16px 32px 24px',
		  },
		  [theme.breakpoints.down('xs')]: {
			width: '100%',
			padding: '16px 16px 24px',
		  },
		}
	},
	grayLine: {
		width: '100%', 
		height: '1px', 
		backgroundColor: Colors.TEXT_SECONDARY, 
		marginTop: '9.5px',
		[theme.breakpoints.down(STRETCH)]: {
			width: '915px', 
		},
	},
	closeButton: {
        float: 'right',
        padding: 0,
        marginRight: '-35px',
		marginTop: '-15px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '-10px',
			marginTop: '2px',
        },
        [theme.breakpoints.down('xs')]: {
        	marginRight: '-4px',
			marginTop: '-4px'
        },
    },
	cancelButton: {
		backgroundColor: 'white',
		border: '2px solid black',
		borderRadius: 8,
		width: 147,
		height: 55,
		marginTop: 38,
		fontSize: '17px',
		marginRight: 16,
		[theme.breakpoints.down('xs')]: {
		  fontSize: '15px',
		  marginRight: 0,
		},
	},
	denyPrompt: {
		[theme.breakpoints.up('md')]: {
			width: 147,
			height: 55,
		  },
	},
	resource: {
		minHeight: '80px', 
		maxHeight: '80px',
		[`& p`]: {
			lineHeight: '70px !important'
		},
	}
}));

interface StyleProps {
	shrinkTopBar: boolean,
	backgroundCol: ColorSelect
}

const BACK_TO_TOP_THRESHOLD = 400;

function Admin(props: Props) {
	const { shrinkTopBar, backgroundCol } = props;
	const classes = useStyles({ shrinkTopBar, backgroundCol });
	const contentContainer = React.useRef<any>();
	const feedbackRef = React.useRef<any>();

	const { getUserList, deleteUser, changeUserPassword,
		resourceList, setResourceList, loadResources, updatePincode,
        getPincode, sendNotificationUser
	} = props

	const theme = useTheme();
	const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
	const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
	const compressApprovals = useMediaQuery(theme.breakpoints.down(STRETCH));
	const fullWidth = useMediaQuery(theme.breakpoints.down(FULL_WIDTH));
	const [passwordChangeSuccessful, setPasswordChangeSuccessful] = useState(false)
	const [deleteUsername, setDeleteUsername] = useState('')
	const [showScrollToTop, setShowScrollToTop] = React.useState(false);
	const [deleteUserId, setDeleteUserId] = useState(0)
	const [deleteUserPromptt, setDeleteUserPromptt] = useState(false)
	const [deleteUserBanner, setDeleteUserBanner] = useState(false)
	const [approveResourceBanner, setApproveResourceBanner] = useState(false)
	const [denyResourceBanner, setDenyResourceBanner] = useState(false)
	const [pincodeChangeSuccessful, setPincodeChangeSuccessful] = useState(false)
	const [pincodePrompt, setPincodePrompt] = useState(false)
	const [denyPrompt, setDenyPromp] = useState(false)
	const [submitPin, setSubmitPin] = useState(0)
	const [denialReason, setDenialReason] = useState('')
	const [changePassword, setChangePassword] = useState('')
	const [confirmChangePassword, setConfirmChangePassword] = useState('')
	const [feedback, setFeedback] = useState(false)
	const [userId, setUserId] = useState(-1)
	const [changePasswordPrompt, setChangePasswordPrompt] = useState(false)
	const [selectedResource, setSelectedResource] = useState({name: 'file name', firstname: 'name', user: 'username', filename: 'pathname'})
	const [deleteResource, setDeleteResource] = useState<undefined | Resource>(undefined)
	let activeTimeout = 0;

	const { register: registerPass, handleSubmit: handleChangePass, reset: resetPass, formState: { errors: passErrors },
	} = useForm<IFormInput>({
		resolver: yupResolver(changePassSchema),
	});

	const { register: registerPin, handleSubmit: handleChangePin, reset: resetPin, formState: { errors: pinErrors },
	} = useForm<PincodeChangeType>({
		resolver: yupResolver(changePinSchema),
	});

	const anchorProps = {
    to: {
      pathname: `${BACKEND_URL}/files/${selectedResource.filename}`,
    },
    target: '_blank',
    rel: 'noopener noreferrer',
  };

	React.useEffect(() => {
		if (feedbackRef.current && (props.scrollTo === "#feedbackResponces") )  contentContainer.current.scrollTo(0, feedbackRef.current.offsetTop - 125);
	}, [feedbackRef.current, contentContainer.current]);

  	const onChangePincode = (data: PincodeChangeType) => {
		setPincodePrompt(true);
	};

	const onChangePass = (user: User) => {
		setChangePasswordPrompt(true)
	};

	const showDeleteUserPrompt = (userId: number, username: string) => {
		setDeleteUserId(userId)
		setDeleteUsername(username)
		setDeleteUserPromptt(true)
	}

	const deleteUserById = (userId: number) => {
		deleteUser(userId)
		setDeleteUserPromptt(false)
		setDeleteUserBanner(true)
		clearTimeout(activeTimeout);
		activeTimeout = window.setTimeout(() => {
			setDeleteUserBanner(false)
		}, 8000)
	}

	const scrollToTop = () => {
		if (contentContainer.current) {
		  contentContainer.current.scrollTo(0, 0);
		  setShowScrollToTop(false);
		}
	}

	const onScroll = useThrottle(() => {
		setShowScrollToTop(!!(contentContainer.current && contentContainer.current.scrollTop > BACK_TO_TOP_THRESHOLD));
	}, 500);

	const getFeedback = async () => {
		let fileData = JSON.stringify('No feedback found');
		await FeedbackService.getResponseList().then(data => {
			fileData = JSON.stringify(data, null, 4);
		})

		const blob = new Blob([fileData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "slcFeedback.json";
		link.href = url;
		link.click();
	}

	const handleClose = () => {
        setDenyPromp(false);
		setDeleteResource(undefined);
    };

	const sendNotification = async () => {
		try {
			if (deleteResource) {
				const newResource = {
					...deleteResource,
					isPublic: false,
				};
				await ResourceService.update(newResource.id, newResource);
	
				updateList(deleteResource.id);

				const newNotification = {
					message: denialReason,
					resource_name: selectedResource.name,
					username: selectedResource.user,
					title: 'Your Recent Upload',
					sender: 'School Admin'
				};
				await UserService.sendNotificationUser(newNotification);
	
				setDenyPromp(false);
				setDenialReason('');
				setDenyResourceBanner(true);
				clearTimeout(activeTimeout);
				activeTimeout = window.setTimeout(() => {
					setDenyResourceBanner(false);
				}, 8000)
			}
		} catch (e) {	
				console.error(e);
		}
	}

	const denyResource = async (resource: Resource) => {
		setDeleteResource(resource);
		setDenyPromp(true);	
  	}

	const approveResource = async (resource: Resource) => {
		try {
			const newResource = {
				...resource,
				approved: true,
			};
			await ResourceService.update(newResource.id, newResource);
			updateList(resource.id);

			setApproveResourceBanner(true);
			clearTimeout(activeTimeout);
			activeTimeout = window.setTimeout(() => {
				setApproveResourceBanner(false);
			}, 8000)

			const newNotification = {
				resource_name: resource.name,
				title: 'Your Recent Upload',
				sender: 'School Admin',
				username: resource.username
			};
			await UserService.sendNotificationUser(newNotification);
		} catch (e) {
		console.error(e);
		}
  	}

	const clipScreen = () => {
		return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
	}

	const updateList = (resourceID: number) => {
		// Update frontend list
		const newResources = resourceList.resources.filter((res) => res.id !== resourceID);
		const newCount = resourceList.count - 1;

		setResourceList({
		resources: newResources,
		count: newCount,
		});
	}

	useEffect(() =>  {
		loadResources({ isPublic: true, approved: false });
		getUserList();
		getPincode();

		FeedbackService.getResponceExists().then((responce) => setFeedback(responce));
	}, []);

	const history = useHistory();

	!props.user.token && history.push('/teacher-portal')
	return (
		deleteUserPromptt ?
			(<div className={classes.contentContainer}>
				<Container maxWidth='xl' disableGutters className={classes.promptContainer}>
					<Typography variant="h4" className={classes.promptTitle}>Are you sure you want to delete {deleteUsername}’s account?</Typography>
					<Typography component="p" className={classes.promptProposition}>
						Please confirm that this is the action you want to take.
						<div>
							{!mobileView && <Button className={classes.promptButton} type='submit' variant="contained"
								onClick={() => {
									deleteUserById(deleteUserId)
								}}
							>Delete User</Button>}
							<Button className={classes.promptCancelButton} type='submit'  variant="contained"
								onClick={() => {
									setDeleteUserPromptt(false)
								}}
							>Cancel</Button>
							{mobileView && <Button className={classes.promptButton} type='submit' variant="contained"
								onClick={() => {
									deleteUserById(deleteUserId)
								}}
							>Delete User</Button>}
						</div>
					</Typography>
				</Container>
			</div>) : 
		changePasswordPrompt ?
			(<div className={classes.contentContainer}>
				<Container maxWidth='xl' disableGutters className={classes.promptContainer}>
					<Typography variant="h4" className={classes.promptTitle}>Are you sure you want to change this user's password?</Typography>
					<Typography component="p" className={classes.promptProposition}>
							Please confirm that this is the action you want to take.
						<div>
							{mobileView && <Button onClick={() => {
								setChangePasswordPrompt(false)
							}}
								className={classes.promptCancelButton} type='submit' variant="contained"
							>Cancel</Button>}
							<Button className={classes.promptButton} type='submit'
								variant="contained"
								onClick={() => {
									let changeData = {
										reEnterPassword: confirmChangePassword,
										password: changePassword,
										id: userId
									}
									changeUserPassword(changeData);
									resetPass({id: undefined, password: '', reEnterPassword: ''});
									setPasswordChangeSuccessful(true);
									
									clearTimeout(activeTimeout);
									activeTimeout = window.setTimeout(() => { setPasswordChangeSuccessful(false) }, 8000)
									setChangePasswordPrompt(false)
								}}
							>Change Password</Button>
							{!mobileView && <Button onClick={() => {
								setChangePasswordPrompt(false)
							}}
								className={classes.promptCancelButton} type='submit' variant="contained"
							>Cancel</Button>}
						</div>
					</Typography>
				</Container>
			</div>) :
		pincodePrompt ? 
			(<div className={classes.contentContainer}>
				<Container maxWidth='xl' disableGutters className={classes.promptContainer}>
					<Typography variant="h4" className={classes.promptTitle}>Are you sure you want to change the school’s passcode to {submitPin}?</Typography>
					<Typography component="p" className={classes.promptProposition}>
						Please confirm that this is the action you want to take.
						<div>
							<Button className={classes.promptButton} type='submit'
								variant="contained"
								onClick={() => {
									let pincode: PincodeChangeType = {
										pincode: submitPin,
										reEnterPincode: submitPin,
									}
									updatePincode(pincode);
									setPincodeChangeSuccessful(true);
									resetPin({pincode: undefined, reEnterPincode: undefined});
									clearTimeout(activeTimeout);
									activeTimeout = window.setTimeout(() => {
										setPincodeChangeSuccessful(false)
									}, 8000);
									setPincodePrompt(false);
								}}
							>Change Passcode</Button>
							<Button onClick={() => {
									setPincodePrompt(false);
								}}
								className={classes.promptCancelButton}
								type='submit'
								variant="contained"
							>Cancel</Button>
						</div>
					</Typography>
				</Container>
			</div>) :

			(<div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainer} onScroll={onScroll}>
				{deleteUserBanner && <div className={classes.successfulBanner}>
					Changes were successfully saved. The user has been deleted.</div>}
				{passwordChangeSuccessful && <div className={classes.successfulBanner}>
					Changes were successfully saved. The user’s password has been changed.</div>}
				{pincodeChangeSuccessful && <div className={classes.successfulBanner}>
            		Changes were successfully saved. The school passcode has been changed.</div>} 
				{approveResourceBanner && <div className={classes.successfulBanner}>
					The upload {`'`+selectedResource.name+`'`} by {selectedResource.user} has been approved.</div>}
				{denyResourceBanner && <div className={classes.successfulBanner} style={{backgroundColor: Colors.BLUE_200}}>
					The upload {`'`+selectedResource.name+`'`} by {selectedResource.user} has been denied.</div>}
				<div className={`${classes.return} ${(deleteUserBanner || passwordChangeSuccessful || pincodeChangeSuccessful || approveResourceBanner || denyResourceBanner) ? classes.returnWithBanner : ''}`}>
					<Link to='/teacher-dashboard'>
							<BackDashboardIcon color={props.highlightLink? Colors.TEXT_PRIMARY : props.textColor}/>
					</Link>
				</div>
				<div className={classes.container}>
					<Typography variant="h4" className={classes.pageTitle}>Hello {props.user.firstName} {props.user.lastName}</Typography>
					<Typography variant="h6" className={`${classes.welcome} ${(backgroundCol === ColorSelect.WHITE)?classes.welcomeUnderline:''}`}>Welcome to your admin tools</Typography>
					<Typography component="p" className={classes.proposition}>
						On this page, you are able to monitor teacher registrations, reset teacher passwords, and modify the
						Simbi Learn Cloud sign-up passcode. As an administrator, you are the only person in your school with
						access to this page. Please do not share your administrator log in information.
					</Typography>
					<Grid container >
						<div className={classes.publicUploadsBox} >
							<div className={classes.publicUploads}>
								<Typography variant="h5" style={{ marginBottom: '12px' }} className={classes.title}>Public Uploads Pending Approval</Typography>
								<div className={classes.attributes} style={{ width: compressApprovals? '915px' : '' }}>
									<Typography variant='subtitle2' component="p" style={{ width: compressApprovals? '153px' : '17.2%'}}>Uploader</Typography>
									<Typography variant='subtitle2' component="p" style={{ width: compressApprovals? '147px' : '16.2%' }}>Title</Typography>
									<Typography variant='subtitle2' component="p" style={{ width: compressApprovals? '168px' : 'calc(18.45% + 7px)' }}>Description</Typography>
									<Typography variant='subtitle2' component="p" style={{ paddingRight: '240px' }}>Take Action</Typography>
								</div>
								<Grid container className={classes.usersContainer}>
										{(props.resourceList.resources.length === 0) && 
											<div style={{display: 'flex', alignItems: 'center', height: '325px', width: '100%', justifyContent: 'center'}}>
												<Typography component="p" style={{textAlign: 'center', fontSize: '30px', fontWeight: 700}}>No documents to review</Typography>
											</div>
										}
										{props.resourceList.resources.map((element, index) =>
										<>
											{/*(index === 0) && <div style={{width: '100%', height: '10.5px',}}/>*/}
											{(index != 0) && <div className={classes.grayLine} />}
											<Grid key={element.id} item xs={1} sm={1} md={12} lg={12} className={`${classes.userListItem} ${classes.resource}`} >
												<Typography variant='subtitle2' component="p" className={classes.resourceUser}>{element.username}</Typography>
												<Typography variant='subtitle2' component="p" className={classes.resourceName}>{element.name}</Typography>
												<Typography className={classes.resourceDescription}>{element.description}</Typography>
												
													<Link {...anchorProps} className={`${classes.anchor} ${classes.buttonGap}`} style={{marginTop: 26.5, }} onClick={() => {
														setSelectedResource({name: element.name, firstname: element.firstName, user: element.username, filename: element.filename});
													}} ><Button variant="contained" className={classes.resourceButton} style={{backgroundColor: Colors.BLUE_200, height: '60px', marginTop: 0}} onClick={() => {
													}}> Preview </Button></Link>
													<Button variant="contained" className={`${classes.resourceButton} ${classes.buttonGap}`} style={{backgroundColor: Colors.GREEN_300,}} onClick={() => {
													setSelectedResource({name: element.name, firstname: element.firstName, user: element.username, filename: element.filename});	approveResource(element);}}> Approve </Button>
													<Button variant="contained" className={classes.resourceButton} style={{backgroundColor: Colors.CORAL_400}} onClick={() => {
													setSelectedResource({name: element.name, firstname: element.firstName, user: element.username, filename: element.filename});	denyResource(element);}}> Deny </Button>
											</Grid>
										</>
										)}
								</Grid>
							</div>
						</div>
						<div style={{display: fullWidth? '' : 'flex', flexBasis: fullWidth? '' : '100%', width: '100%'}}>
							<div className={classes.cardContainerBox} style={{width: fullWidth? "" : '60.53%'}}>
								<div className={classes.cardContainer}>
									<Typography variant="h5" style={{ marginBottom: '12px' }} className={classes.title}>Registered Users</Typography>
									<div className={classes.attributes} style={{ minWidth: '622px'}}>
										<Typography variant='subtitle2' component="p" style={{ paddingRight: '145px' }}>Username</Typography>
										<Typography variant='subtitle2' component="p" style={{ paddingRight: '50px' }}>User ID</Typography>
										<Typography variant='subtitle2' component="p" style={{ paddingRight: '50px' }}>Security Answer</Typography>
										<Typography variant='subtitle2' component="p" style={{ paddingRight: '65px' }}>Delete User</Typography>
									</div>
									<Grid container className={classes.usersContainer}>
										{(props.userList.length === 0) && 
											<div style={{display: 'flex', alignItems: 'center', height: '325px', width: '100%', justifyContent: 'center'}}>
												<Typography component="p" style={{textAlign: 'center', fontSize: '30px', fontWeight: 700}}>No documents to review</Typography>
											</div>
										}
										{props.userList.map(user =>
											<Grid key={user.id} item xs={1} sm={1} md={1} lg={1} className={classes.userListItem} >
												<Typography variant='subtitle2' component="p" className={classes.userListItemText} style={{ minWidth: '210px', }}>{user.username}</Typography>
												<Typography variant='subtitle2' component="p" className={classes.userListItemText} style={{ minWidth: '100px', }}>{user.id}</Typography>
												<Typography variant='subtitle2' component="p" className={classes.userListItemText} style={{ minWidth: '150px', marginRight: 10 }}>{user.securityAnswer}</Typography>
												<Button variant="contained" className={classes.deleteUserButton} onClick={() => {
													showDeleteUserPrompt(user.id, user.username)
												}}> Delete User </Button>
											</Grid>
										)}
									</Grid>
								</div>
							</div>
							<Grid item className={classes.resetContainer} style={{width: fullWidth? "" : '36.87%'}}>
								<Typography variant="h5" className={classes.title}>Reset A User’s Password</Typography>
								<Typography component="p" style={{ paddingBottom: '30px', paddingTop: '10px' }} className={classes.proposition}>
									Use this form to change a user’s password.
								</Typography>
								<form
									onSubmit={handleChangePass(onChangePass)} noValidate>
									<FormControl className={classes.changeUserPasswordForm}>
										<TextField
											{...registerPass("id")}
											variant="outlined"
											label="User ID"
											helperText={passErrors.id?.message}
											error={!!passErrors.id?.message}
											type="number"
											className={classes.textField}
											style={{ marginTop: 4, marginBottom: passErrors.id?.message? 0 : 24 }}
											fullWidth
											onChange={(event) => {
												setUserId(parseInt(event.target.value))
											}}
										/>
										<TextField
											{...registerPass("password")}
											variant="outlined"
											label="New password for user"
											helperText={passErrors.password?.message}
											error={!!passErrors.password?.message}
											type="text"
											className={classes.textField}
											style={{ marginBottom: passErrors.password?.message? 0 : 24 }}
											fullWidth
											onChange={(event) => {
													setChangePassword(event.target.value)
											}}
										/>
										<TextField
											{...registerPass("reEnterPassword")}
											variant="outlined"
											label="Re-enter new password for user"
											helperText={passErrors.reEnterPassword?.message}
											error={!!passErrors.reEnterPassword?.message}
											type="text"
											style={{ marginBottom: passErrors.reEnterPassword?.message? 0 : 24 }}
											className={classes.textField}
											fullWidth
											onChange={(event) => {
													setConfirmChangePassword(event.target.value)
											}}
										/>
										<Button type='submit'
											variant="contained"
											className={classes.changePasswordButton}

										>Change Password</Button>
									</FormControl></form>
							</Grid>
						</div>
						<div style={{display: fullWidth? '' : 'flex', flexBasis: fullWidth? '' : '100%', marginBottom: fullWidth? 0 : '80px'}}>
							<Grid item className={classes.resetContainer} style={{marginTop: '30px', marginLeft: 0, marginRight: fullWidth? 0 : '30px', height: fullWidth? '380px' : 'calc(100% - 30px)',}} ref={feedbackRef}>
								<Typography variant="h5" className={classes.title}>Download Teacher Feedback</Typography>
								<Typography component="p" style={{ paddingBottom: '30px', paddingTop: '10px' }} className={classes.proposition}>
									Download teacher's responses to the feedback form found on the teacher dashboard.
								</Typography>
								<Button
									className={classes.resetPasscodeButton}
									type='submit'
									variant="contained"
									onClick={getFeedback}
									disabled={!feedback}
									style={{marginTop: 'auto', marginBottom: 'auto'}}
								>{feedback ? `Download feedback` : `No feedback to download`}</Button>	
							</Grid>
							<div className={classes.formContainer}>
								<div className={classes.titleContainer}>
									<Typography variant="h3" className={classes.pincodeTitle}>Reset Your School’s Passcode</Typography>
									<Typography component="p" className={classes.pincodeProposition}>
										Teachers require an 8-digit school passcode to sign up to Simbi Learn Cloud. You can change this passcode with this form. Please change the passcode only when required.
									<Typography variant="h3" style={{ marginLeft: '0',fontSize: mobileView? '18px':'20px', }} className={classes.pincodeTitle}>The Current School Passcode is {props.pincode}</Typography>
									</Typography>
									<form
										onSubmit={handleChangePin(onChangePincode)} noValidate >
										<FormControl style={{ width: '100%', padding: '16px' }}>
											<TextField
												{...registerPin("pincode")}
												variant="outlined"
												label="New passcode for school"
												helperText={pinErrors.pincode?.message}
												error={!!pinErrors.pincode?.message}
												type="number"
												className={classes.textField}
												style={{ marginTop: 4 }}
												fullWidth
												onChange={(event) => {
													setSubmitPin(parseInt(event.target.value))
												}}
											/>
											<TextField
												{...registerPin("reEnterPincode")}
												variant="outlined"
												label="Re-enter new passcode for school"
												helperText={pinErrors.reEnterPincode?.message}
												error={!!pinErrors.reEnterPincode?.message}
												type="number"
												style={{ marginTop: 0 }}
												className={classes.textField}
												fullWidth
											/>
											<Button type='submit'
												variant="contained"
												color="primary"
												className={classes.resetPasscodeButton}
											>Reset Passcode</Button>
										</FormControl></form>
								</div>
							</div>
						</div>
					</Grid>
				</div>
				<Dialog
					open={denyPrompt}
					PaperProps={{ className: classes.formContent }}
					style={{ zIndex: 1302, marginTop: 0, marginBottom: 0, }}
					>
					<DialogContent className={classes.formDialogContent}>
						<IconButton edge="start" color="inherit" className={classes.closeButton} aria-label="open drawer" onClick={handleClose}>
                            <CloseIcon shrink={mobileView}/>
                        </IconButton>
						<Typography variant="h4" className={classes.promptTitle} style={{paddingLeft: 0, paddingTop: 10, marginBottom: tabletView? 24 : 32}}>Please provide a breif reason for denying this resource.</Typography>
						<FormControl fullWidth className={classes.formInput}>
							<InputLabel htmlFor="file-description-input" shrink variant="outlined" className={classes.inputLabel}>Add a reason for denial</InputLabel>
							<OutlinedInput
							id="file-description-input"
							aria-describedby="file-description-helper-text"
							placeholder={`Write a description here so ${selectedResource.firstname} knows why this resource is being denied.`}
							multiline
							rows={mobileView? 3 : 2}
							value={denialReason}
							onChange={(e) => setDenialReason(e.target.value.slice(0, 114))}
							/>
							<FormHelperText id="file-description-helper-text" className={classes.helperText}>{denialReason.length} / 114</FormHelperText>
						</FormControl>
						{mobileView && <Button
							className={classes.promptCancelButton}
							onClick={() => handleClose()}
						>Cancel denial
						</Button>}
						<Button className={classes.promptButton} style={{marginTop: tabletView? 18 : ''}} type='submit' variant="contained" 
							onClick={() => {
								sendNotification();
							}} disabled={denialReason.length === 0}
						>Submit Reason
						</Button>
						{!mobileView && <Button
							className={classes.promptCancelButton}
							style={{ marginTop: tabletView? 18 : 37 }}
							onClick={() => handleClose()}
						>Cancel denial
						</Button>}
					</DialogContent>
				</Dialog>
				{showScrollToTop && (
					<Fab className={classes.fab} onClick={scrollToTop}>
						<ArrowRightAlt style={{transform: 'rotate(-90deg)'}} />
					</Fab>
				)}
				<Footer />
			</div>)
	);
}

export default connector(Admin);
