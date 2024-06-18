import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link, withStyles, Grid, Select, MenuItem} from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import Footer from './Footer';
import Colors from '../css/Colors';
import { Dimensions } from 'react-native';

import { LineSpaceIcon, LargeLineSpaceIcon } from './icons/LineSpaceIcon';
import { CharGapIcon, LargeCharGapIcon } from './icons/CharGapIcon';
import LinksIcon from './icons/LinksIcon';
import { HighlightHeadingsIcon, ReadableFontIcon } from './icons/AccessibilityIcons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { ReduxState } from '../types';
import { connect, ConnectedProps } from 'react-redux';
//import { setContentSettings, setStyleSettings,} from '../actions'
import CookieService, { CookieKeys } from '../../services/cookie';

export enum ColorSelect {
	BLACK =  '#262729',
	GRAY = '#56585B',
	BLUE = '#2D52B2',
	ORANGE = '#D95A00',
	BROWN = '#5D4432',
	WHITE = '#FFFDFD',
}

export enum ColorSelectContrast {
	BLACK =  '#4A4949',
	GRAY = '#757575',
	BLUE = '#4D6DCB',
	ORANGE = '#FE7B11',
	BROWN = '#665A3E' ,
	WHITE = '#F5F7F8',
}

enum SelectedSettings {
	NONE,
	CONTENT,
	STYLE,
	NAVIGATION,
}

const MOBILEVIEW = 732;

const mapDispatchToProps = { 
	/* for some irational reason, functions here cause a run time error unlike in other files, so untill fixed, must be handled in clippeddrawer */
	//setContentSettings, 
	//setStyleSettings
}

const mapStateToProps = (state: ReduxState) => {
	return {
		contentSettings: state.contentSettings,
		styleSettings: state.styleSettings,
	}
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
	shrinkTopBar: boolean,
	setContentSettings: (settings: AccessibilityContentCookies) => void,
	setStyleSettings: (settings: AccessibilityStyleCookies) => void,
} & ConnectedProps<typeof connector>;

export interface AccessibilityContentCookies {
	fontSize: number | number[],
	lineGap: number | number[],
	charGap: number | number[],
}
  
export interface AccessibilityStyleCookies {
	highlightLink: boolean,
	readableFont: boolean,
	highlightHeading: boolean,
	headingsCol: ColorSelect,
	copyCol: ColorSelect,
	backgroundCol: ColorSelect,
	linkCol: ColorSelect,
}

interface StyleProps {
	shrinkTopBar: boolean,
	fontSize: number | number[],
	lineGap: number | number[],
	charGap: number | number[],
	backgroundCol: ColorSelect,
	downY: number,
	highlightHeading: boolean,
	copyCol: ColorSelect,
}

const useStyles = makeStyles((theme) => ({
	contentContainer: {
		marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
		height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
		width: '100%',
		overflow: 'overlay',
		fallbacks: {
			overflow: 'auto'
		},
		padding: 'none',
		textAlign: 'left',
		backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
		[theme.breakpoints.down(MOBILEVIEW)]: {
			overflow: 'hidden',
		},
		[theme.breakpoints.down('sm')]: {
			scrollbarColor: `#A9A9A9 transparent`,
		},
		[theme.breakpoints.down('xs')]: {
			marginTop: `56px !important`,
			height: `calc(100vh - 56px) !important`,
			maxHeight: `calc(100vh - 56px) !important`,
		}
	},
	screenEventHandler: {
		width: '100vw',
		height: '100vh'
	},
	title: {
		margin: '72px auto 0',
		width: 'fit-content',
		height: 'fit-content',
		fontSize: 48,
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginLeft: 0,
			marginTop: 24,
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: 26,
		},
	},
	resetAllBtn: {
		margin: '4px auto 60px',
		display: 'inherit',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginRight: '0 !important',
			marginTop: '28px !important',
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: 16,
		},
	},
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			flexDirection: 'column',
		},
	},
	sampleSection: {
		width: '40%',
		overflow: 'hidden',
		borderRight: '1px solid #757575',
		padding: '24px 74px 54px',
		[theme.breakpoints.down('sm')]: {
			padding: '24px 32px 54px',
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			padding: '0 16px 24px',
			border: 'none',
			width: '100%',
			overflowX: 'hidden',
			overflowY: 'auto',
			scrollbarColor: `#A9A9A9 transparent`,
			maxHeight: (props: StyleProps) => `calc(${props.downY}px - 56px)`
		},
	},
	sampleHeading: {
		marginBottom: 40,
		fontWeight: 700,
		width: 'fit-content',
		fontSize: (props: StyleProps) => `calc(36px + calc(${props.fontSize}px / 10))`, // Replace these with css set in clipped drawer
		lineHeight: (props: StyleProps) => `calc(1.5em + calc(${props.lineGap}px / 25))`,
		letterSpacing: (props: StyleProps) => `calc(0.00938em + calc(${props.charGap}px / 30))`,
		[theme.breakpoints.down('xs')]: {
			fontSize: (props: StyleProps) => `calc(18px + calc(${props.fontSize}px / 25))`,
			marginBottom: 12,
		},
	},
	sampleCopy: {
		/*fontSize: (props: StyleProps) => `calc(18px + calc(${props.fontSize}px / 25))`,
		lineHeight: (props: StyleProps) => `calc(1.5em + calc(${props.lineGap}px / 25))`,
		letterSpacing: (props: StyleProps) => `calc(0.00938em + calc(${props.charGap}px / 30))`,
		[theme.breakpoints.down('xs')]: {
			fontSize: (props: StyleProps) => `calc(16px + calc(${props.fontSize}px / 25))`,
		},*/
	},
	sampleLinks: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 35,
		'& :first-child': {
			[theme.breakpoints.up(MOBILEVIEW)]: {
				marginLeft: 0,
			},
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			flexDirection: 'column',
			justifyContent: 'space-around',
			margin: 0,
		},
	},
	sampleLink: {
		textDecoration: 'underline',
		marginLeft: 50,
		fontSize: (props: StyleProps) => `calc(18px + calc(${props.fontSize}px / 25))`,
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginLeft: 24,
			fontSize: (props: StyleProps) => `calc(16px + calc(${props.fontSize}px / 25))`,
		},
		[theme.breakpoints.down(480)]: {
			marginLeft: 16
		}
	},
	sampleImage: {
		marginTop: 32,
		marginBottom: 24,
		width: 300,
		height: 200,
		[theme.breakpoints.down(872)]: {
			width: '100%'
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			margin: 0,
			width: 300,
			height: 200,
		},
		[theme.breakpoints.down(400)]: {
			width: 175,
			height: 100,
		},
	},
	settingsSection: {
		position: 'relative',
		width: '60%',
		padding: '0 78px',
		maxHeight: 'max(calc(100vh - 156px), 620px)',
		overflowX: 'hidden',
		overflowY: 'auto',
		scrollbarColor: `#A9A9A9 transparent`,
		backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
		[theme.breakpoints.down('sm')]: {
			padding: '0 32px',
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			padding: '0 16px',
			width: '100%',
			minHeight: 68,
			bottom: 0,
			position: 'absolute',
			height: (props: StyleProps) => `calc(${Dimensions.get('window').height}px - ${props.downY}px - 128px)`,
		},
		[theme.breakpoints.down('xs')]: {
			height: (props: StyleProps) => `calc(${Dimensions.get('window').height}px - ${props.downY}px - 88px)`,
		}
	},
	footerClipBottom: {
		bottom: 0,
		position: 'absolute',
		width: '100%'
	},
	resizeSlider: {
		width: 76,
		height: 6,
		background: Colors.GRAY_600,
		borderRadius: '8px',
		margin: '0 auto 8px',
		cursor: 'row-resize',
	},
	selectBar: {
		position: 'relative',
		zIndex: 1,
		boxShadow: '0px -2px 6px rgba(202, 202, 202, 0.75)',
		padding: '10px 16px',
		backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
	},
	resizeSliderBox: {
		width: '100%',
	},
	settingsHeader: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 48
	},
	clearBtn: {
		textDecoration: 'underline',
		cursor: 'pointer',
		fontSize: 16,
		marginLeft: 'auto',
		height: 'fit-content',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginRight: 'auto',
			textAlign: 'center',
			display: 'block',
			marginTop: 8
		}
	},
	selectField: {
		zIndex: 0,
		margin: 'none',
		borderRadius: '4px',
		height: '64px',
		['& svg']: {
			color: (props: StyleProps) => props.copyCol
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
		  borderColor: '#757575'
		},
		marginBottom: 6,
		[theme.breakpoints.down('sm')]: {
		  height: '48px',
		  [`& div`]: {
			maxHeight: 48,
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
	controlHeading: {
		marginBottom: 68,
		height: 'fit-content',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			fontSize: 18,
			margin: '0 auto 46px'
		}
	},
	scrollBarBox: {
		height: '196px',
		backgroundColor: 'white',
		borderRadius: '5px',
		boxShadow: '0px 3px 6px 0px #CACACA80',
		marginBottom: 32,
		padding: '24px 90px 24px 45px',
		position: 'relative',
		[`& h5:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
		[theme.breakpoints.down('sm')]: {
			padding: '24px 60px 24px 30px',
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginBottom: 16,
			padding: '16px 16px 14px',
			height: '129px',
		}
	},
	settingsGrid: {
		justifyContent: 'space-around',
		margin: '0 -10px',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			margin: '0',
			width: '100%'
		},
		[`& h5:first-of-type, h6:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
	},
	toggleSettingBox: {
		backgroundColor: 'white',
		width: 247,
		height: 187,
		position: 'relative',
		margin: '58px 39.5px 30px',
		padding: '66px 16px 24px',
		cursor: 'pointer',
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		borderRadius: 5,
		[`& p`]: {
			textAlign: 'center',
			userSelect: 'none',
			[theme.breakpoints.down(MOBILEVIEW)]: {
				textAlign: 'left'
			}
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			width: '100%',
			height: 127,
			margin: '0 0 16px',
			padding: '0 16px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center'
		}
	},
	toggleSettingContent: {
		[`& p:first-of-type`]: {
			color: Colors.TEXT_SECONDARY
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginLeft: 14
		}
	},
	boxPlaceholder: {
		backgroundColor: 'transparent',
		width: 247,
		height: 187,
		position: 'relative',
		margin: '58px 39.5px 30px',
		padding: '66px 16px 24px',
	},
	selectedToggleSettingsBox: {
		backgroundColor: Colors.BLUE_300,
		[`& p:first-of-type`]: {
			color: 'white'
		},
		[`& h5:first-of-type, h6:first-of-type`]: {
			color: (props : StyleProps) => (props.highlightHeading)? Colors.TEXT_PRIMARY : 'white' ,
		},
		[`& p`]: {
			color: 'white'
		}
	},
	grayCircle: {
		backgroundColor: Colors.BLUE_50,
		borderRadius: '55px',
		height: 108,
		width: 108,
		position: 'absolute',
		top: -57,
		left: 68,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			minHeight: 54,
			minWidth: 54,
			height: 54,
			width: 54,
			position: 'initial'
		}
	},
	redLine: {
		width: 58,
        height: 58,
        borderBottom: '3px solid red',
        WebkitTransform: 'translateY(-21px) translateX(17px) rotate(40deg)',
        position: 'absolute',
		bottom: '-7px',
		right: '-7px',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			WebkitTransform: 'translateY(-16px) translateX(11px) rotate(40deg)',
			width: 41,
			height: 41,
		}
	},
	blueCircle: {
		backgroundColor: Colors.BLUE_300,
		border: '1px white solid',
	},
	optionIcon: {
		
	},
	boxOptionCopy: {
		marginTop: 16, 
		fontSize: 16,
		color: Colors.TEXT_SECONDARY,
		[theme.breakpoints.down(MOBILEVIEW)]: {
			marginTop: 12, 
		}
	},
	colourSelectBox: {
		width: 306,
		height: 245,
		backgroundColor: 'white',
		borderRadius: 5,
		boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
		padding: '32px',
		margin: '0 10px 28px',
		[`& p`]: {
			textAlign: 'center',
			width: 'fit-content',
			margin: '0 auto'
		},
		[theme.breakpoints.down(MOBILEVIEW)]: {
			height: 127,
			width: '100%',
			margin: '0 0 16px',
			padding: '16px 0'
		}
	},
	colourCircle: {
		width: 46,
		height: 46,
		borderRadius: 25,
		cursor: 'pointer',
		position: 'relative',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			width: 30,
			height: 30,
		}
	},
	selectedColourCircle: {
		width: 60,
		height: 60,
		borderRadius: 30,
		border: `2px solid ${Colors.GRAY_700}`,
		boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
		position: 'absolute',
		[theme.breakpoints.down(MOBILEVIEW)]: {
			width: 42,
			height: 42,
		}
	},
	palletRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
}));

const AccessibilitySlider = withStyles((theme)=>({
	root: { // remove later if nothing to add here
		
	},
	rail: {
		[`&&`]: {
			color: Colors.BLUE_200,
			height: 9
		}
	},
	track: {
		[`&&`]: {
			color: Colors.BLUE_200,
			height: 9
		}
	},
	thumb: {
		[`&&`]: {
			color: Colors.BLUE_200
		},
		[`& span`]: { // Value label
			borderRadius: 2,
			backgroundColor: Colors.BLUE_50,
			top: -20,
			padding: 3,
			fontSize: 18,
			[theme.breakpoints.down(MOBILEVIEW)]: {
				fontSize: 16,
				height: 30,
				top: -15,
			}
		},
		[`& span span`]: {
			color: Colors.TEXT_PRIMARY
		}
	},
}))(Slider);

function Accessibility(props: Props) {
	const { shrinkTopBar, contentSettings, styleSettings, setContentSettings, setStyleSettings } = props;
	const [fontSize, setFontSize] = useState<number|number[]>(contentSettings.fontSize);
	const [lineGap, setLineGap] = useState<number|number[]>(contentSettings.lineGap);
	const [charGap, setCharGap] = useState<number|number[]>(contentSettings.charGap);
	const [highlightLink, setHighlightLink] = useState(styleSettings.highlightLink);
	const [readableFont, setReadableFont] = useState(styleSettings.readableFont);
	const [highlightHeading, setHighlightHeading] = useState(styleSettings.highlightHeading);
	const [headingsCol, setHeadingsCol] = useState(styleSettings.headingsCol);
	const [copyCol, setCopyCol] = useState(styleSettings.copyCol);
	const [backgroundCol, setBackgroundCol] = useState(styleSettings.backgroundCol);
	const [linkCol, setLinkCol] = useState(styleSettings.linkCol);
	const [selectedSettings, setSelectedSettings] = useState(SelectedSettings.NONE);
	const [resizing, setResizing] = useState(false);
	const [downY, setDownY] = useState(345);
	const [clipFooter, setClipFooter] = useState(true);
	const [selectedSlider, setSelectedSlider] = useState<CookieKeys>(CookieKeys.TOKEN);
	const [release, setRelease] = useState<boolean>(false);

	const theme = useTheme();
	const singleColumn = useMediaQuery(theme.breakpoints.down(1294));
  	const mobileView = useMediaQuery(theme.breakpoints.down(MOBILEVIEW));
	const classes = useStyles({ 
		shrinkTopBar, fontSize, lineGap, charGap, backgroundCol, downY, highlightHeading, copyCol
	});

	useEffect(() => {
		if (fontSize != contentSettings.fontSize || lineGap != contentSettings.lineGap || charGap != contentSettings.charGap) {
			setContentSettings({fontSize, lineGap, charGap});
		}
  }, [fontSize, lineGap, charGap]);

	useEffect(() => {
		if (JSON.stringify({highlightLink, readableFont, highlightHeading, headingsCol, copyCol, backgroundCol, linkCol}) !== JSON.stringify(styleSettings)) {
			setStyleSettings({highlightLink, readableFont, highlightHeading, headingsCol, copyCol, backgroundCol, linkCol})
		}
  }, [highlightLink, readableFont, highlightHeading, headingsCol, copyCol, backgroundCol, linkCol]);

  useEffect(() => {
	const settingsSection = document.getElementById("settingsSection");

	if (settingsSection?.scrollHeight && settingsSection?.clientHeight) setClipFooter(settingsSection.scrollHeight === settingsSection.clientHeight);
}, [document.getElementById("settingsSection")?.clientHeight, selectedSettings]);

  	// Event handlers for mobile draggable divider
	const handleMouseDown = (e: any) => {
		setResizing(true);
		e.preventDefault();
	}

	const handleMouseMove = (e: any) => {
		if (resizing) {
			const minHeight = 180;
			let newPosition = (e.clientY < minHeight)? minHeight : e.clientY;

			const sampleSection = document.getElementById("sampleSection");

			if (sampleSection?.scrollHeight !== sampleSection?.clientHeight) setDownY(newPosition - 18);
			else if (downY > (newPosition - 18)) setDownY(newPosition - 18);
			e.preventDefault();
		}
	}

	const handleMouseUp = (e: any) => {
		setResizing(false);
		e.preventDefault();
	}

	const handleSlider = () => {
		if (release) {
			setRelease(false);
			setCookie(selectedSlider, (selectedSlider === CookieKeys.FONT_SIZE)? fontSize : (selectedSlider === CookieKeys.LETTER_SP)? charGap : lineGap);
		}
	}

	//const componentDidMount {
	//	document.addEventListener('mousemove', e => this.handleMousemove(e));
	//	document.addEventListener('mouseup', e => this.handleMouseup(e));
	//}

	// Functions to update cookies
	const resetSliders = () => {
		setFontSize(0);
		setLineGap(0);
		setCharGap(0);

		CookieService.removeSet([CookieKeys.FONT_SIZE, CookieKeys.LINE_SP, CookieKeys.LETTER_SP]);
	}

	const resetStyle = () => {
		setHighlightLink(false);
		setReadableFont(false);
		setHighlightHeading(false);
		setHeadingsCol(ColorSelect.BLACK);
		setCopyCol(ColorSelect.BLACK);
		setBackgroundCol(ColorSelect.WHITE);
		setLinkCol(ColorSelect.BLUE);

		CookieService.removeSet([CookieKeys.HEADING_COL, CookieKeys.BODY_COL, CookieKeys.BACKGROUND_COL, CookieKeys.LINK_COL, CookieKeys.LINK_HL, CookieKeys.READABILITY, CookieKeys.HEADING_HL]);
	}

	const resetAll = () => {
		resetSliders();
		resetStyle();
	}

	// Functions to help with UI rendering
	const sliderFormat = (value: number) => {
		if (value === 0) return 'Default';
		else return value+"%";
	}

	const links = () => {
		return (<Link className={`${classes.sampleLink } ${classes.sampleCopy}`}>Links</Link>);
	}

	const enabled = (color: ColorSelect, type: CookieKeys) => {
		if ([CookieKeys.BODY_COL, CookieKeys.HEADING_COL, CookieKeys.LINK_COL].includes(type)) return color !== backgroundCol;
		else if ([headingsCol, copyCol, linkCol].includes(color) && color !== ColorSelect.BLACK) return false; // Case for pallet of background colour
		else return true;
	}

	const setCookie = (slider: CookieKeys, value: number | number[]) => {
		CookieService.set(slider, value.toString(), {path: '/'});
	}

	const setDarkMode = () => {
		setCopyCol(ColorSelect.WHITE); 
		setHeadingsCol(ColorSelect.WHITE);
		setLinkCol(ColorSelect.BLUE);
		CookieService.set(CookieKeys.BODY_COL, `${ColorSelect.WHITE}`, {path: '/'});
		CookieService.set(CookieKeys.HEADING_COL, `${ColorSelect.WHITE}`, {path: '/'});
		CookieService.set(CookieKeys.LINK_COL, `${ColorSelect.BLUE}`, {path: '/'});
	}

	const colorSelect = (color: ColorSelect, selected: ColorSelect, func: React.Dispatch<React.SetStateAction<ColorSelect>>, type: CookieKeys) => {
		const enable = enabled(color, type); // Note this does not need to be a dynamic assignment because any change to colour values will result in a re render of the colour pallets
		return (<div className={classes.colourCircle} style={{backgroundColor: color, border: (color === ColorSelect.WHITE)? `1px solid ${Colors.TEXT_SECONDARY}` : '', cursor: enable? '' : 'not-allowed'}} onClick={() => { 
			if (enable) { 
				func(color); CookieService.set(type, `${color}`, {path: '/'});}
				if (type === CookieKeys.BACKGROUND_COL && color === ColorSelect.BLACK) setDarkMode();}}>
			{(color === selected || !enable) && <div className={classes.selectedColourCircle} style={{top: (color === ColorSelect.WHITE)? mobileView? -7 : -8 : mobileView? -6 : -7, left: (color === ColorSelect.WHITE)? mobileView? -7 : -8 : mobileView? -6 : -7, borderColor: enable? '' : 'red', borderWidth: enable? '' : '3px'}}/>}
			{!enable && <div className={classes.redLine}/>}
			</div>);
	}

	const colorPallet = (selected: ColorSelect, func: React.Dispatch<React.SetStateAction<ColorSelect>>, type: CookieKeys) => {
		return( <>
			{!mobileView && <><div className={classes.palletRow} style={{marginTop: 24}}>
				{colorSelect(ColorSelect.BLACK, selected, func, type)}{colorSelect(ColorSelect.GRAY, selected, func, type)}{colorSelect(ColorSelect.BLUE, selected, func, type)}
			</div>
			<div className={classes.palletRow} style={{marginTop: 32}}>
				{colorSelect(ColorSelect.ORANGE, selected, func, type)}{colorSelect(ColorSelect.BROWN, selected, func, type)}{colorSelect(ColorSelect.WHITE, selected, func, type)}
			</div></>}
			{mobileView && <div className={classes.palletRow} style={{marginTop: 24}}>
				{colorSelect(ColorSelect.BLACK, selected, func, type)}{colorSelect(ColorSelect.GRAY, selected, func, type)}{colorSelect(ColorSelect.BLUE, selected, func, type)}
				{colorSelect(ColorSelect.ORANGE, selected, func, type)}{colorSelect(ColorSelect.BROWN, selected, func, type)}{colorSelect(ColorSelect.WHITE, selected, func, type)}
			</div>}
		</>
		);
	}

	const getContentSettings = () => {
		return(
			<div style={{marginTop: 24}}>
				{!mobileView && <div className={classes.settingsHeader}>
					<Typography variant="h4">Content</Typography>
					<a className={classes.clearBtn} onClick={resetSliders}>Reset content settings</a>
				</div>}
				<div className={classes.scrollBarBox}>
					<Typography variant="h5" className={classes.controlHeading}>Font Size</Typography>
					<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" style={{marginLeft: mobileView? 0 : 40, height: 34}}>
						<Typography style={{fontWeight: 700, fontSize: 20, color: Colors.TEXT_PRIMARY, margin: mobileView? '0 16px 0 0':'0 10px 0 22px'}}>A</Typography>
						<AccessibilitySlider aria-label="FontSize" onChange={(event, value) => { setFontSize(value); setRelease(true); }}
							onMouseDown={() => {console.log('set');setSelectedSlider(CookieKeys.FONT_SIZE);}} onTouchStart={() => {setSelectedSlider(CookieKeys.FONT_SIZE);}}
							value={fontSize} valueLabelDisplay="on" valueLabelFormat={sliderFormat}/>
						<Typography style={{fontWeight: 700, fontSize: 40, color: Colors.TEXT_PRIMARY}}>A</Typography>
					</Stack>
				</div>
				<div className={classes.scrollBarBox}>
					<Typography variant="h5" className={classes.controlHeading}>Line Spacing</Typography>
					<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" style={{marginLeft: mobileView? 0 : 40, height: 34}}>
						<LineSpaceIcon style={{minHeight: mobileView? 13 : 22, minWidth: mobileView? 26 : 43, marginRight: mobileView? 0 : 10}}/>
						<AccessibilitySlider aria-label="LineSpace" onChange={(event, value) => { setLineGap(value); setRelease(true); }} 
							onMouseDown={() => {setSelectedSlider(CookieKeys.LINE_SP);}} onTouchStart={() => {setSelectedSlider(CookieKeys.LINE_SP);}}
							value={lineGap} valueLabelDisplay="on" valueLabelFormat={sliderFormat}/>
						<LargeLineSpaceIcon style={{minHeight: mobileView? 27 : 30.5, minWidth: mobileView? 38 : 43}}/>
					</Stack>
				</div>
				<div className={classes.scrollBarBox} style={{marginBottom: mobileView? '24px' : ''}}>
					<Typography variant="h5" className={classes.controlHeading}>Letter Spacing</Typography>
					<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" style={{marginLeft: mobileView? 0 : 40, height: 34}}>
						<CharGapIcon style={{minHeight: mobileView? 26 : 40, minWidth: mobileView? 17 : 30, margin: mobileView? '0 8px 0 0':'0 10px 0 14px'}} />
						<AccessibilitySlider aria-label="LetterSpace" onChange={(event, value) => { setCharGap(value); setRelease(true); }} 
							onMouseDown={() => {setSelectedSlider(CookieKeys.LETTER_SP);}} onTouchStart={() => {setSelectedSlider(CookieKeys.LETTER_SP);}}
							value={charGap} valueLabelDisplay="on" valueLabelFormat={sliderFormat}/>
						<LargeCharGapIcon style={{minHeight: mobileView? 33 : 40, minWidth: mobileView? 33 : 40}}/>
					</Stack>
				</div>
				{mobileView && <a className={classes.clearBtn} onClick={resetSliders}>Reset content settings</a>}
			</div>
		);
	}

	const getStyleSettings = () => {
		return(
			<div style={{marginTop: 24}}>
				{!mobileView && <div className={classes.settingsHeader}>
					<Typography variant="h4">Style</Typography>
					<a className={classes.clearBtn} onClick={resetStyle}>Reset style settings</a>
				</div>}
				<Grid container spacing={4} className={classes.settingsGrid}>
					<div className={classes.colourSelectBox}>
						<Typography variant="h5" className={classes.controlHeading} style={{margin: '0 auto'}}>Headings Color</Typography>
						{colorPallet(headingsCol, setHeadingsCol, CookieKeys.HEADING_COL)}
					</div>
					<div className={classes.colourSelectBox}>
						<Typography variant="h5" className={classes.controlHeading} style={{margin: '0 auto'}}>Body Text Color</Typography>
						{colorPallet(copyCol, setCopyCol, CookieKeys.BODY_COL)}
					</div>
					<div className={classes.colourSelectBox}>
						<Typography variant="h5" className={classes.controlHeading} style={{margin: '0 auto'}}>Background Color</Typography>
						{colorPallet(backgroundCol, setBackgroundCol, CookieKeys.BACKGROUND_COL)}
					</div>
					<div className={classes.colourSelectBox}>
						<Typography variant="h5" className={classes.controlHeading} style={{margin: '0 auto'}}>Link Color</Typography>
						{colorPallet(linkCol, setLinkCol, CookieKeys.LINK_COL)}
					</div>
					<div className={`${classes.toggleSettingBox} ${highlightLink? classes.selectedToggleSettingsBox : ''}`} onClick={()=>{setHighlightLink(!highlightLink); CookieService.set(CookieKeys.LINK_HL, !highlightLink, {path: '/'});}}>
						<div className={`${classes.grayCircle} ${highlightLink? classes.blueCircle : ''}`}><LinksIcon className={classes.optionIcon} white={highlightLink} mobile={mobileView}/></div>
						<div className={classes.toggleSettingContent}>
							<Typography variant="h5" className={classes.controlHeading} style={{margin: mobileView? '0' : '0 auto'}}>Highlight Links</Typography>
							<Typography className={classes.boxOptionCopy}>Highlight the links.</Typography>
						</div>
					</div>
					<div className={`${classes.toggleSettingBox} ${readableFont? classes.selectedToggleSettingsBox : ''}`} onClick={()=>{setReadableFont(!readableFont); CookieService.set(CookieKeys.READABILITY, !readableFont, {path: '/'});}}>
						<div className={`${classes.grayCircle} ${readableFont? classes.blueCircle : ''}`}><ReadableFontIcon className={classes.optionIcon} white={readableFont} mobile={mobileView}/></div>
						<div className={classes.toggleSettingContent}>
							<Typography variant="h6" className={classes.controlHeading} style={{margin: mobileView? '0' : '0 auto'}}>Readable Font</Typography>
							<Typography className={classes.boxOptionCopy}>Change the font into a more readable one.</Typography>
						</div>
					</div>
					<div className={`${classes.toggleSettingBox} ${highlightHeading? classes.selectedToggleSettingsBox : ''}`} onClick={()=>{setHighlightHeading(!highlightHeading); CookieService.set(CookieKeys.HEADING_HL, !highlightHeading, {path: '/'});}}>
						<div className={`${classes.grayCircle} ${highlightHeading? classes.blueCircle : ''}`}><HighlightHeadingsIcon className={classes.optionIcon} white={highlightHeading} mobile={mobileView}/></div>
						<div className={classes.toggleSettingContent}>
							<Typography variant="h6" className={classes.controlHeading} style={{margin: mobileView? '0' : '0 auto'}}>Highlight Headings</Typography>
							<Typography className={classes.boxOptionCopy}>Highlight the headings.</Typography>
						</div>
					</div>
					{!singleColumn && <div className={classes.boxPlaceholder}/>}
				</Grid>
				{mobileView && <a className={classes.clearBtn} onClick={resetStyle}>Reset style settings</a>}
			</div>
		);
	}

	const getNavigationSettings = () => {
		return(
			<div style={{marginTop: 24}}>

			</div>
		);
	}

	const getContent = () => {
		return ( <>
			<div className={classes.sampleSection} id="sampleSection">
				{mobileView && <div className={classes.flexRow} style={{flexDirection: 'row'}}>
					<Typography variant="h4" className={classes.title}>Accessibility</Typography>
					<a className={`${classes.resetAllBtn} ${classes.clearBtn}`} onClick={resetAll}>Reset all settings</a>
				</div>}
				<Typography variant="h4" className={classes.sampleHeading}>This is a heading</Typography>
				<Typography className={classes.sampleCopy}>This is a body text. Feel free to modify the  accessibility options for a better navigation. Here are some examples of what you can modify.</Typography>
				<div className={classes.flexRow} style={{flexDirection: (mobileView)? 'row' : 'column', margin: (mobileView)? '16px 0 8px' : ''}}>
					{!mobileView && <div className={classes.sampleLinks}>{links()}{links()}{links()}</div>}
					<img className={classes.sampleImage} src={'images/sample.png'}/>
					{mobileView && <div className={classes.sampleLinks}>{links()}{links()}{links()}</div>}
				</div>
				<Typography>Images</Typography>
			</div>
			{mobileView && <div className={classes.selectBar}>
					<div className={classes.resizeSlider} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}/>
					<Select
						fullWidth
						displayEmpty
						value={selectedSettings}
						onChange={(event: any) => {setSelectedSettings(event.target.value);}}
						variant="outlined"
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
						<MenuItem disabled value={SelectedSettings.NONE}>
							<Typography align="left">Select an accesibility option</Typography>
						</MenuItem>
						<MenuItem value={SelectedSettings.CONTENT}><Typography align="left">Content</Typography></MenuItem>
						<MenuItem value={SelectedSettings.STYLE}><Typography align="left">Style</Typography></MenuItem>
						<MenuItem value={SelectedSettings.NAVIGATION}><Typography align="left">Navigation</Typography></MenuItem>
					</Select>
				</div>}
			<div className={classes.settingsSection} id="settingsSection">
				
				{(!mobileView || selectedSettings === SelectedSettings.CONTENT) && getContentSettings()}
				{(!mobileView || selectedSettings === SelectedSettings.STYLE) && getStyleSettings()}
				{(!mobileView || selectedSettings === SelectedSettings.NAVIGATION) && getNavigationSettings()}
				{mobileView && <div style={{margin: '60px -16px 0'}} className={clipFooter? classes.footerClipBottom : ''}> <Footer /> </div>}
			</div>
		</>);
	}

	return(
		<div className={classes.screenEventHandler} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onTouchEnd={handleMouseUp} onTouchMove={handleMouseMove} onClick={handleSlider}>
			<div className={classes.contentContainer}>
				{!mobileView && <div className={classes.flexRow} style={{flexDirection: 'column'}}>
					<Typography variant="h4" className={classes.title}>Accessibility</Typography>
					<a className={`${classes.resetAllBtn} ${classes.clearBtn}`} onClick={resetAll}>Reset all settings</a>
				</div>}
				{!mobileView && <div className={classes.flexRow}>
					{getContent()}
				</div>}
				{mobileView && getContent()}
			</div>
		</div>
	);
}

export default connector(Accessibility);