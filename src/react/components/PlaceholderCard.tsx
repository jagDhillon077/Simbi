import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardActionArea, useMediaQuery } from "@material-ui/core";
import Colors from '../css/Colors';
import useTheme from '@material-ui/core/styles/useTheme';

const PICTURE_HEIGHT = '186px';

interface Props {
    largeCard: boolean
  }

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 288,
    minWidth: 288,
    margin: '0px 16px 0px',
    height: 312,
    textAlign: 'left',
    [theme.breakpoints.down(716)]: {
      maxWidth: '100%',
      minWidth: 475,
    },
    [theme.breakpoints.down(550)]: {
      maxWidth: '100%',
      minWidth: 'unset',
    },
    [theme.breakpoints.between(1303, 1439)]: { // padding removed from cards to make cards fit withing specific breakpoints 
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.between(995, 1059)]: {  // padding removed from cards to make cards fit withing specific breakpoints 
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.between(716, 780)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.down(330)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 20px 0px 16px',
    },
    },
    imageHolder: {
        width: '100%',
        height: PICTURE_HEIGHT,
        backgroundColor: Colors.GRAY_100,
        position: 'relative',
        overflow: 'hidden',
    },
    textHolder: {
        height: `calc(100% - ${PICTURE_HEIGHT})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    titleHolder: {
        backgroundColor: Colors.GRAY_400,
        padding: '19px 0 19px 0',
        height: 26,
        display: 'flex',
        alignItems: 'center',
        width: '120px',
        position: 'relative',
        overflow: 'hidden',
    },
    sourceHolder: {
        backgroundColor: Colors.GRAY_400,
        padding: '4px 0 0 0',
        height: 23,
        display: 'flex',
        alignItems: 'center',
        width: '180px',
        position: 'relative',
        overflow: 'hidden',
    },
    miniCardPlaceholder: {
        display: 'flex',
        minWidth: 300,
        height: 122,
        justifyContent: 'space-between',
        backgroundColor: Colors.GRAY_100,
        alignItems: 'center',
        textAlign: 'left',
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
    },
    iconHolder: {
        width: '105px',
        height: '99px',
        borderRadius: '4px',
        backgroundColor: Colors.GRAY_400,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        flexBasis: '35%'
        //left: '50px'
    },

    // Animations
    shimmerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        animation: `$loading 1500ms ${theme.transitions.easing.easeInOut} 400ms infinite`,
    },
    shimmer: {
        width: '30%',
        height: '100%',
        transform: 'skewX(-20deg)',
        boxShadow: '0 0 30px 30px rgba(225, 225, 225, 0.05)'
    },
    lightShimmer: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
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

function PlaceholderCard(props: Props) {
    const { largeCard } = props;
    const classes = useStyles();

    if(largeCard) {
        return (
            <Card className={classes.root}>
                <div className={classes.imageHolder} > 
                    <div className={classes.shimmerWrapper}>
                        <div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
                    </div>
                </div>
                <CardContent className={classes.textHolder}>
                    <div className={classes.titleHolder} >
                        <div className={classes.shimmerWrapper}>
                            <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                        </div>
                    </div>
                    <div className={classes.sourceHolder} >
                        <div className={classes.shimmerWrapper}>
                            <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                        </div>
                    </div>
                </CardContent>
            </Card> 
            
        );
    } else {
        return (
            <Card className={classes.miniCardPlaceholder}>
                <div className={classes.shimmerWrapper}>
                    <div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
                </div>
                <CardContent style={{display: 'flex', alignItems: 'center', padding: 0, paddingRight: 16, width: '50%'}}>
                    <div className={classes.titleHolder} style={{width: '115px', padding: '0',}}>
                        <div className={classes.shimmerWrapper}>
                            <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                        </div>
                    </div>
                </CardContent>
                <div className={classes.iconHolder} >
                    <div className={classes.shimmerWrapper}>
                        <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                    </div>
                </div>
            </Card> 
        );
    }
}

export default PlaceholderCard;