import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Colors from '../css/Colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ColorSelect } from './AccessibilityPage';

const LARGETAB = 1024;

const useStyles = makeStyles((theme) => ({
	content: {
		flexGrow: 1,
		font: 'Lora',
		marginTop: 0,
		minHeight: 'calc(100vh - 140px - 1.3rem)',
		backgroundColor: Colors.ORANGE_100,
		padding: '64px 80px 80px',
		[theme.breakpoints.down(LARGETAB)]: {
			padding: '32px 36px 80px',
		},
		[theme.breakpoints.down('xs')]: {
			padding: '32px 16px 60px',
			fontSize: 16,
		},
		[theme.breakpoints.down(376)]: {
			paddingLeft: 16,
			paddingRight: 16,
		}
	},
	banner: { 
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	contentContainer: {
		backgroundColor: (props: StyleProps) => props.backgroundCol,
		flexDirection: 'column',
		position: 'relative',
	},
	grid: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
		'& > .MuiGrid-item': {
			paddingBottom: 60,
		},
		'& > .MuiGrid-item:last-child': {
			paddingBottom: 0,
		},
		[theme.breakpoints.down('md')]: {
			'& > .MuiGrid-item': {
				marginLeft: -90,
			},
		},
		[theme.breakpoints.down(LARGETAB)]: {
			paddingLeft: '0',
			'& > .MuiGrid-item': {
				marginLeft: 'unset',
				paddingBottom: 48,
			},
		},
		[theme.breakpoints.down('xs')]: {
			'& > .MuiGrid-item': {
				paddingBottom: 48,
			},
		},	
	},
	centerAlignText: {
		textAlign: 'center'
	},
	title: {
		position: 'absolute',
		color: Colors.ORANGE_400,
		width: '100%',
		top: 112,
		left: '50%',
		transform: 'translate(-50%, 0)',
		[theme.breakpoints.down('md')]: {
			fontSize: '48px',
		}
	},
	proposition: {
		padding: '56px 130px 64px 130px',
		color: Colors.TEXT_PRIMARY,
		fontSize: '18px',
		lineHeight: '32px',
		[theme.breakpoints.down(LARGETAB)]: {
			padding: '32px 36px 32px'
		},
		[theme.breakpoints.down('xs')]: {
			padding: '28px 36px 32px',
			fontSize: '16px',
			lineHeight: '23px',
		},
		[theme.breakpoints.down(400)]: {
			padding: '28px 16px 32px',
		},
	},
	contentDescription: {
		margin: '32px 0 40px',
		fontSize: '18px',
		lineHeight: '32px',
		[theme.breakpoints.down(LARGETAB)]: {
			margin: '24px 0 32px',
			padding: '0 0px'
		},
		[theme.breakpoints.down('xs')]: {
			margin: '24px 0 32px',
			fontSize: '16px',
			lineHeight: '23px',
		},
		
	},
	contentTitle: {
		margin: '0 auto',
		[theme.breakpoints.down(LARGETAB)]: {
			fontSize: '24px',
			lineHeight: '32px',
		}
	},
	thumbnail: {
		width: 600,
		marginTop: '35px !important',
		[theme.breakpoints.down(1372)]: {
			width: 550,
		},
		[theme.breakpoints.down(1290)]: {
			width: 500,
			marginTop: '50px !important',
		},
		[theme.breakpoints.down(1100)]: {
			width: 430,
		},
		[theme.breakpoints.down(LARGETAB)]: {
			width: 400,
		},
		[theme.breakpoints.down('sm')]: {
			width: 'unset',
			height: '720px',
			display: 'table',
			margin: '-165px auto 0 !important',
		},
		[theme.breakpoints.down(720)]: {
			position: 'absolute',
			left: 'calc((-720px + 100%)/2)'
		},
		[theme.breakpoints.down('xs')]: {
			left: 'calc((-614px + 100%)/2 + 8px)',
			height: '614px',
			marginTop: '-82px !important',
		}
	},
	crop: {
		//overflow: 'hidden',
		height: '400px',
		margin: '0 -30px',
		position: 'relative',
		[theme.breakpoints.up('md')]: {
			minWidth: '580px',
		},
		[theme.breakpoints.down(1372)]: {
			minWidth: '540px',
		},
		[theme.breakpoints.down(1290)]: {
			minWidth: '490px',
		},
		[theme.breakpoints.down(1100)]: {
			minWidth: '420px',
		},
		[theme.breakpoints.down(LARGETAB)]: {
			height: '286px',
			minWidth: '390px',
			marginTop: -24,
		},
		[theme.breakpoints.down('sm')]: {
			height: '435px',
			overflow: 'hidden',
			width: '100vw',
			marginTop: 0,
		},
		[theme.breakpoints.down('xs')]: {
			margin: '0 0 0 -16px',
			minWidth: 'unset',
			height: '440px',
		}
	},
	searchMethod: {
		[theme.breakpoints.down('xl')]: {
			display: 'flex',
			alignItems: 'center',
			'& :first-child': {
				marginRight: 110,
			},
		},
		[theme.breakpoints.down('md')]: {
			'& :first-child': {
				marginRight: 25,
			},
		},
		[theme.breakpoints.down(LARGETAB)]: {
			flexDirection: 'column',
			'& :first-child': {
				display: 'table',
				margin: '0 auto',
				marginBottom: 34,
			},
		},
	},
	detailsDescription: {
		maxWidth: 408,
		lineHeight: '32px',
		marginTop: 24,
		[theme.breakpoints.down('md')]: {
			fontSize: 18,
			minWidth: 'calc(54vw - 279px)',
		},
		[theme.breakpoints.down(1160)]: {
			fontSize: 18,
			minWidth: 'calc(50vw - 279px)',
		},
		[theme.breakpoints.down(LARGETAB)]: {
			marginTop: 'unset',
			minWidth: 'unset',
			maxWidth: 'unset',
			fontSize: 16,
			textAlign: 'center',
			lineHeight: '23px',
		},
		[theme.breakpoints.down('xs')]: {
			width: 'calc(100vw - 32px)'
		},
	},
	methodNumber: {
		whiteSpace: 'nowrap',
		color: 'white !important',
		fontFamily: 'Roboto Slab',
		fontSize: 16,
		fontWeight: 500,
		borderRadius: 4,
		padding: '6px 10px',
		letterSpacing: '0.02em',
		[theme.breakpoints.down('xs')]: {
			position: 'relative',
 			left: '-8px',
		},
	},
	detailsTitle: {
		fontSize: 24,
		lineHeight: '32px',
		marginTop: '22px',
		marginBottom: '24px',
		[theme.breakpoints.down(LARGETAB)]: {
			marginTop: '-18px',
			marginBottom: 16,
			textAlign: 'center',
			fontSize: '18px',
			lineHeight: '24px',
			width: '100% !important'
		},
		[theme.breakpoints.down('xs')]: {
			width: 'calc(100% - 16px) !important'
		},
	},
	searchMethodContainer: {
		[theme.breakpoints.down('sm')]: {
			width: 'calc(100vw - 72px) !important',
		},
		[theme.breakpoints.down('xs')]: {
			width: 'unset',
			marginBottom: 0
		},
	}
}));

interface StyleProps {
	backgroundCol: ColorSelect,
}

interface Props {
	scrollTo: string,
	backgroundColor: ColorSelect,
	onScrollTo: (scroll: number) => void
}
  
function HomePage(props: Props) {
	const backgroundCol = props.backgroundColor;
	const classes = useStyles({backgroundCol});
	const theme = useTheme();
	const largeTabletView = useMediaQuery(theme.breakpoints.down(LARGETAB));
	const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
	const mobileView = useMediaQuery(theme.breakpoints.down('xs'));

	const contentContainer = React.useRef<any>();
	const htwRef = React.useRef<any>();
	
	React.useEffect(() => {
		if (htwRef.current && (props.scrollTo === "#howItWorks") )  props.onScrollTo(htwRef.current.offsetTop);
	}, [htwRef.current, contentContainer.current]);

	return (
		<div ref={contentContainer} className={classes.contentContainer}>
			{!mobileView && <img src='/images/ExtendedSLCBanner.jpg' alt="banner" className={classes.banner}></img>}
			{mobileView && <img src='/images/SmallSLCBanner.jpg' alt="banner" className={classes.banner}></img>}
			<Typography component="p" className={classes.proposition}>
				Simbi Learn Cloud brings you high-quality educational content from around the world.
				Find resources here related to mathematics, sciences, languages, history, and more!
			</Typography>
			<div id='howItWorks' ref={htwRef} className={classes.content}>
				<Typography  variant="h4" className={classes.contentTitle}> How it Works</Typography>
				<Typography component="p" className={classes.contentDescription}>
					There are three different ways that you can search for learning content in Simbi Learn Cloud:
				</Typography>
				<Grid direction="column" spacing={1} container className={classes.grid}>
					<Grid item xs={12} sm={12} md={12}>
						<div className={classes.searchMethod}>
							{!largeTabletView && <div className={classes.crop}><img src={"/images/desktopSubjects.gif"} alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
							
							<div className={classes.searchMethodContainer} style={{ marginRight: mobileView? '' : tabletView? 0 : '', marginLeft: mobileView? '' : tabletView? 0 : ''}}>
							<span className={classes.methodNumber} style={{ backgroundColor: Colors.ORANGE_400 }}>
									METHOD 1
								</span>
								<Typography component="h5" variant="h5" className={classes.detailsTitle}>
									Search by "Subjects"
								</Typography>
								{largeTabletView && <div className={classes.crop}><img src={mobileView? "/images/mobileSubjects.gif" : tabletView? "/images/tabletSubjects.gif" : "/images/desktopSubjects.gif"} alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
								<Typography component="p" className={classes.detailsDescription}>
									You can use the menu on the left to search learning resources by subject area. 
									For example, click on “Science” to see all of the Science resources.
								</Typography>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} sm={12} md={12}>
						<div className={classes.searchMethod}>
							<div className={classes.searchMethodContainer} style={{ marginRight: mobileView? '' : tabletView? 0 : '', marginLeft: mobileView? '' : tabletView? 0 : ''}}>
								<span className={classes.methodNumber} style={{ backgroundColor: Colors.BLUE_200 }}>
									METHOD 2
								</span>
								<Typography component="h5" variant="h5" className={classes.detailsTitle}>
									Search by "Sources"
								</Typography>
								{largeTabletView && <div className={classes.crop}><img src={mobileView? "/images/mobileSources.gif" : tabletView? "/images/tabletSources.gif" : "/images/desktopSources.gif"} alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
								<Typography component="p" className={classes.detailsDescription}>
									You can also use the menu on the left to search for content by source. 
									For example, click on “KA Lite Essentials” to see the learning resources provided by Khan Academy.
								</Typography>
							</div>
							{!largeTabletView && <div className={classes.crop}><img src="/images/desktopSources.gif" alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
						</div>
					</Grid>
					<Grid item xs={12} sm={12} md={12}>
						<div className={classes.searchMethod}>
							{!largeTabletView && <div className={classes.crop}><img src={"/images/desktopSearch.gif"} alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
							<div className={classes.searchMethodContainer} style={{ marginRight: mobileView? '' : tabletView? 0 : '', marginLeft: mobileView? '' : tabletView? 0 : ''}}>
								<span className={classes.methodNumber} style={{ backgroundColor: Colors.TEAL_200 }}>
									METHOD 3
								</span>
								<Typography component="h5" variant="h5" className={classes.detailsTitle}>
									Use the search bar
								</Typography>
								{largeTabletView && <div className={classes.crop}><img src={mobileView? "/images/mobileSearch.gif" : tabletView? "/images/tabletSearch.gif" : "/images/desktopSearch.gif"} alt="Sample video thumbnail" className={classes.thumbnail} /></div>}
								<Typography component="p" className={classes.detailsDescription}>
									Click the magnifying glass at the top right of the screen to open the search bar.
									Type in what you’re looking for and explore the content that appears.
								</Typography>
							</div>
						</div>
					</Grid>
				</Grid>

			</div>
		</div>
	);
}

export default HomePage;
