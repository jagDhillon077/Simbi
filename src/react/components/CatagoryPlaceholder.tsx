import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import Colors from '../css/Colors';
import PlaceholderCard from './PlaceholderCard';

export enum Type {
  LARGE_CARDS, MINI_CARDS, PDF_VIEW, HESPERIAN_VIEW
}

interface Props {
  type: Type
}

const useStyles = makeStyles((theme) => ({
    subcategoryGrid: {
        margin: theme.spacing(2),
        marginTop: 0,
        marginBottom: 0,
        paddingBottom: 24,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        columnGap: 20,
        '&& > *': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        '&:after': {
            content: '""',
            width: 300,
        },
        [theme.breakpoints.down('xs')]: {
            '& > .MuiGrid-item': {
            flexBasis: '100%',
            }
        },
    },
    flexBasis: {
      [theme.breakpoints.down(1310)]: {
        flexBasis: '50%',
        maxWidth: '50%',
      },
      [theme.breakpoints.down(1010)]: {
        flexBasis: '100%',
        maxWidth: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        flexBasis: '50%',
        maxWidth: '50%',
      },
      [theme.breakpoints.down(674)]: {
        flexBasis: '100%',
        maxWidth: '100%',
      },
    },

    //Placeholders
    catagoryPlaceholder: {
        height: '40px',
        width: '360px',
        backgroundColor: Colors.GRAY_400,
        marginBottom: 45,
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.down(410)]: {
        width: '90vw',
        },
    },
    subjectPlaceholder: {
        height: '46px',
        width: '575px',
        backgroundColor: Colors.GRAY_400,
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.down(635)]: {
        width: '90vw',
        },
    },
    grayBar: {
        backgroundColor: Colors.GRAY_400,
        color: `${Colors.GRAY_400} !important`,
        userSelect: 'none', // supported by Chrome, Edge, Opera and Firefox only!
        },
    descriptionPlaceholder: {
        height: 'auto',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    subtitlePlaceholder: {
        width: '500px',
        height: '24px',
        padding: '4px 0',
        backgroundColor: Colors.GRAY_400,
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.down(560)]: {
        width: '90vw',
        },
    },
    subCatPlaceholder: {
        margin: '29px 0 16px 0',
        height: '35px',
        width: '160px',
        backgroundColor: Colors.GRAY_400,
        position: 'relative',
        overflow: 'hidden',
    },
    subDiscriptionPlaceholder: {
        marginTop: 29,
        marginBottom: 8,
        height: '24px',
        width: '850px',
        backgroundColor: Colors.GRAY_400,
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.down(1235)]: {
        width: '60vw',
        },
        [theme.breakpoints.down('sm')]: {
        width: '90vw',
        },
    },
    whiteSpace: {
        height: 24,
        width: '100%',
    },
    leftAlignText: {
        textAlign: 'left',
        width: '100%'
    },
    noBorder: {
        border: 'none',
    },
    pdfPlaceholder: {
      height: '800px',
      width: '100%',
      backgroundColor: Colors.GRAY_50,
      position: 'relative',
      overflow: 'hidden',
      marginTop: 40,
    },
    breadcrumbPlaceholder: {
      height: '24px',
      width: '100%',
      color: Colors.GRAY_400,
      position: 'relative',
      overflow: 'hidden',
      alignContent: 'left',
    },

    // Animations
    shimmerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        animation: `$loading 3000ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
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

function CatagoryPlaceholder(props: Props) {
  const { type } = props;
  const classes = useStyles();

  const holderCards = [
    { cardNumber: 1 }, { cardNumber: 2 }, { cardNumber: 3 }, 
    { cardNumber: 4 }, { cardNumber: 5 }, { cardNumber: 6 }]
  
  const getPlaceholderType = (type : Type) => {
    switch(type) {
      case Type.LARGE_CARDS:
        return(<>
        <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
          <div className={classes.catagoryPlaceholder}>
            <div className={classes.shimmerWrapper}>
              <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
            </div>
          </div>
          <Typography component="p" className={classes.descriptionPlaceholder}>
            <span className={classes.grayBar}> 
              Welcome to 'categoryName'! Here, you will find a wide range of learning content about 'categoryName', including 
              'list of different subcategories', and lots more! 
            </span>
            <div className={classes.shimmerWrapper}>
              <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
            </div>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.subtitlePlaceholder}>
            <div className={classes.shimmerWrapper}>
              <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
            </div>
          </div>
        </Grid>
        <Grid container spacing={4} className={`${classes.subcategoryGrid} ${classes.noBorder}`} justify="flex-start" >
          <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
            <div className={classes.subCatPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
            <div className={classes.subDiscriptionPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
          </Grid>
            {holderCards.map(element => (
                <Grid item key={holderCards.indexOf(element)}><PlaceholderCard largeCard={true}></PlaceholderCard></Grid>
              ))}
          <div className={classes.whiteSpace}></div>
          <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
            <div className={classes.subCatPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
            <div className={classes.subDiscriptionPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
          </Grid>
            {holderCards.map(element => (
                <Grid item key={holderCards.indexOf(element)}><PlaceholderCard largeCard={true}></PlaceholderCard></Grid>
              ))}
        </Grid>
        </>);
      case Type.MINI_CARDS:
        return(<>
          <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
            <div className={classes.subtitlePlaceholder} style={{marginBottom: '40px', width: '250px'}}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
            <div className={classes.catagoryPlaceholder} style={{width: '210px', height: '31px', marginBottom: 30 }}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
          </Grid>
              {holderCards.map(element => (
                  <Grid item xs={12} sm={6} md={4} key={holderCards.indexOf(element)} className={classes.flexBasis}><PlaceholderCard largeCard={false}></PlaceholderCard></Grid>
                ))}
            <div className={classes.whiteSpace}></div>

        </>);
      case Type.PDF_VIEW:
        return(<>
          <Grid item xs={12} sm={12} md={12}>
              <Typography component="p" className={classes.breadcrumbPlaceholder} style={{marginBottom: '40px', }}>
                <span className={classes.grayBar} style={{position: 'absolute', left: 0, top: 0}}> 
                  SourcePage-MainCardsPage-PDFCards
                </span>
                <div className={classes.shimmerWrapper}>
                  <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                </div>
              </Typography>
              <div className={classes.subjectPlaceholder} style={{width: '370px'}}>
                <div className={classes.shimmerWrapper}>
                  <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
                </div>
              </div>
              <div className={classes.pdfPlaceholder}>
                <div className={classes.shimmerWrapper}>
                  <div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
                </div>
              </div>
            </Grid>
        </>);
      case Type.HESPERIAN_VIEW:
        return(<>
          <Grid item xs={12} sm={12} md={12} style={{marginTop: -10, marginLeft: -10}}>
            <div className={classes.subjectPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </div>
            <Typography component="p" className={classes.descriptionPlaceholder} style={{textAlign: 'left', marginBottom: 60}}>
              <span className={classes.grayBar}> 
              A collection of detailed, illustrated guides on healthcare in remote areas where access to doctors and facilities is limited. 
              These materials do not provide medical advice and are for informational purposes only. This content is not intended to be a 
              substitute for professional medical advice, diagnosis or treatment. Always seek the advice of a qualified health provider with 
              any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it 
              because of something you have read here.
              </span>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
              </div>
            </Typography>
            <div className={classes.pdfPlaceholder}>
              <div className={classes.shimmerWrapper}>
                <div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
              </div>
            </div>
          </Grid>
        </>);
    }
  }

  return (
    <Grid container spacing={4} style={{margin: '0', paddingTop: '10px'}}>
      {getPlaceholderType(type)}
    </Grid>
  );
}

export default CatagoryPlaceholder;