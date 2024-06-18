import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Colors from '../css/Colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
	gradientRectangle: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%, rgba(241, 241, 241, 0) 100%), #F2F2F2',
		width: '100%',
		position: 'relative',
		overflow: 'hidden',
        height: 'calc(52.25vw - 145.8px)',
		[theme.breakpoints.down('sm')]: {
			height: '52.25vw',
		}
	},
    contentContainer: {
		backgroundColor: '#FFFDFD',
		flexDirection: 'column',
		position: 'relative',
		[theme.breakpoints.only('sm')]: {
			paddingTop: 41,
		}
	},
	proposition: {
  		color: Colors.GRAY_400,
		padding: '56px 130px 64px 130px',
		fontSize: '18px',
		lineHeight: '32px',
		position: 'relative',
		overflow: 'hidden',
		[theme.breakpoints.down('sm')]: {
			paddingTop: 32,
			paddingBottom: 32,
		},
		[theme.breakpoints.only('sm')]: {
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
	grayBar: {
		backgroundColor: Colors.GRAY_400,
		userSelect: 'none', // supported by Chrome, Edge, Opera and Firefox only!
	},
	grayedMethodSection: {
		backgroundColor: Colors.GRAY_300,
		width: '100%',
		height: '1500px',
		position: 'relative',
		overflow: 'hidden',
	},
	shimmerWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		animation: `$loading 2500ms ${theme.transitions.easing.easeInOut} 400ms infinite`,
	},
	shimmer: {
		width: '30%',
		height: '100%',
		transform: 'skewX(-20deg)',
		boxShadow: '0 0 30px 30px rgba(225, 225, 225, 0.05)'
	},
	lightShimmer: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
	},
	darkShimmer: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
	},
    "@keyframes loading": {
		"0%": { transform: "translateX(-150%)" },
		"50%": { transform: "translateX(-60%)" },
		"100%": { transform: "translateX(150%)" },
	  },
}));

function HomePlaceholder() {
	const classes = useStyles();
	const theme = useTheme();
	const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

	return ( 
		<div className={classes.contentContainer}>
			<div className={classes.gradientRectangle}>
				<div className={classes.shimmerWrapper}>
					<div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
				</div>
			</div>
			<Typography component="p" className={classes.proposition}>
				<span className={classes.grayBar}> 
					Simbi Learn Cloud brings you high-quality educational content from around the world.
					Find resources here related to mathematics, sciences, languages, history, and more!
				</span>
				<div className={classes.shimmerWrapper}>
					<div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
				</div>
			</Typography>
			<div className={classes.grayedMethodSection}>
				<div className={classes.shimmerWrapper}>
					<div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
				</div>
			</div>
		</div>
		
	);
}

export default HomePlaceholder;