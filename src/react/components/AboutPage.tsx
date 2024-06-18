import React from 'react';
import { Dimensions } from 'react-native';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Fab } from "@material-ui/core";
import Colors from '../css/Colors';
import { Link } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import Footer from './Footer';
import { useThrottle } from '../../helpers';
import { ArrowRightAlt } from '@material-ui/icons';
import { boolean } from 'yup';
import { ColorSelect } from './AccessibilityPage';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: (props: Props) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: Props) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    width: '100%',
    overflow: 'overlay',
    overflowX: 'hidden',
    backgroundColor: (props: Props) => props.backgroundCol,
    fallbacks: {
      overflow: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      scrollbarColor: `#A9A9A9 transparent`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 56px) !important`,
      marginTop: `56px !important`,
    }
  },
  heroContainer: {
    width: '100%',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: (props: Props) => (props.backgroundCol !== ColorSelect.WHITE)? props.backgroundCol : Colors.YELLOW_100,
    paddingBottom: 38,
    [theme.breakpoints.down(1150)]: {
      paddingBottom: 48,
    },
    [theme.breakpoints.down(1120)]: {
      paddingBottom: 58,
    },
    [theme.breakpoints.down(1060)]: {
      paddingBottom: 98,
    },
    [theme.breakpoints.down(1030)]: {
      paddingBottom: 138,
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      paddingBottom: 0,
    }
  },
  whiteBackground: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '26vw',
    backgroundColor: (props: Props) => props.backgroundCol,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  imageContainer: {
    flexBasis: '315%',
    zIndex: 1,
    [theme.breakpoints.down(1400)]: {
      flexBasis: '335%',
    },
    [theme.breakpoints.down(1350)]: {
      flexBasis: '365%',
    },
  },
  heroImage: {
    width: '100%',
    [theme.breakpoints.between(1050, 'sm')]: {
      width: '530px',
      height: '497px',
    },
  },
  titleContainer: {
    height: '100%',
  },
  title: {
    marginBottom: 28,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  proposition: {
  padding: '0 49px',
  lineHeight: '32px',
  [theme.breakpoints.down(1150)]: {
    marginBottom: -10,
  },
  [theme.breakpoints.down(1120)]: {
    marginBottom: -20,
  },
  [theme.breakpoints.down(1060)]: {
    marginBottom: -70,
  },
  [theme.breakpoints.down(1030)]: {
    marginBottom: -110,
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'left',
    padding: '19px 32px 32px 32px',
    marginBottom: 0,
  },
  [theme.breakpoints.down('xs')]: {
    padding: '19px 16px 32px 16px',
  }
  },
  grid: {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  padding: '96px 142px',
  '& > .MuiGrid-item': {
    paddingBottom: 56,
  },
  '& > .MuiGrid-item:last-child': {
    paddingBottom: 0,
  },
  [theme.breakpoints.down('sm')]: {
    '& > .MuiGrid-item': {
      paddingBottom: 32,
    },
    padding: '32px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '32px 16px 32px 16px',
  }	
},
aboutSection: {
  display: 'flex',
  alignItems: 'center',
  '& :first-child': {
    marginRight: 58,
      
  },
  '& :nth-child(n+1)': {
    width: '100%',
    height: '100%',
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& :first-child': {
      display: 'table',
      margin: '0 auto',
      marginBottom: 24,
    },
    '& :nth-child(2)': {
      marginBottom: 0,
    },
  },
},
sectionImage: {
  width: 482,
  height: 268,
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    width: 382,
    height: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '4px 4px 0px 0px',
    width: '95%',
    display: 'table',
    margin: '0 auto',
  },
  [theme.breakpoints.down('xs')]: {
    height: 'unset',
  }
},
greenBoxShadow: {
  boxShadow: `16px 16px 0 -4px ${Colors.GREEN_100}`,
  '& :first-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.down('xs')]: {
    boxShadow: `8px 8px 0 0 ${Colors.GREEN_100}`,
  },
},
blueBoxShadow: {
  boxShadow: `16px 16px 0 -4px ${Colors.BLUE_100}`,
  '& :first-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.down('xs')]: {
    boxShadow: `8px 8px 0 0 ${Colors.BLUE_100}`,
  },
}, 
orangeBoxShadow: {
  boxShadow: `16px 16px 0 -4px ${Colors.LIGHT_ORANGE_200}`,
  '& :first-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.down('xs')]: {
    boxShadow: `8px 8px 0 0 ${Colors.LIGHT_ORANGE_200}`,
  },
},
detailsDescription: {
  lineHeight: '32px',
  marginTop: 12,
  width: '100%',
  height: 'auto',
  '& :first-child': {
    marginRight: 0,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: 18,
    minWidth: 240,
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: 'unset',
    minWidth: 'unset',
    maxWidth: 'unset',
    fontSize: 16,
    lineHeight: '23px',
    '& :first-child': {
      marginBottom: 0,
    },
  },
},
orangeSection: {
  alignItems: 'center',
  flexWrap: 'wrap',
  lineHeight: '32px',
  fontSize: 18,
  backgroundColor: (props: Props) => (props.backgroundCol !== ColorSelect.WHITE)? props.backgroundCol : Colors.ORANGE_100,
  padding: '64px 143px 80px 143px',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 32px 60px 32px',
    fontSize: 16,
    lineHeight: '23px',
    textAlign: 'left',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '32px 16px 60px 16px',
  }
},
subTitle: {
  margin: '0 auto 32px',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: 24,
  },
},
imageGrid: {
  display: 'flex',
  alignItems: 'center',
  padding: '72px 0px 32px 0px',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 0px 0px 0px',
  },
},
images:{
  '& :first-child': {
    marginRight: 100,
  },
  '& :last-child': {
    marginLeft: 100,
  },
  [theme.breakpoints.down(1500)]: {
    '& :first-child': {
        marginRight: 60,
    },
    '& :last-child': {
        marginLeft: 60,
    },
  },
  [theme.breakpoints.down(1400)]: {
    '& :first-child': {
        marginRight: 50,
    },
    '& :last-child': {
        marginLeft: 50,
    },
  },
  [theme.breakpoints.down(1190)]: {
    '& :first-child': {
        marginRight: 32,
    },
    '& :last-child': {
        marginLeft: 32,
    },
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& :nth-child(n+1)': {
        display: 'table',
        margin: '0 auto',
        marginBottom: 16,
    },
    '& :last-child': {
        marginBottom: 32,
    },
  },	
  },
  orangeSectionImage: {
    width: 300,
    height: 250,
    [theme.breakpoints.down(1330)]: {
        width: 270,
        height: 225,
    },
    [theme.breakpoints.down(1260)]: {
        width: 240,
        height: 200,
    },
    [theme.breakpoints.down(1090)]: {
        width: 210,
        height: 175,
    },
    [theme.breakpoints.down(1000)]: {
        width: 180,
        height: 150,
    },
    [theme.breakpoints.up('md')]: {
        objectFit: 'cover',
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: '4px',
        width: '98.5%',
        height: 'auto',
        display: 'table',
        margin: '0 auto',
    },
    },
    paragraphSpace: {
      paddingTop: '24px',
      '& :first-child': {
          display: 'inline',
      },
      [theme.breakpoints.down('sm')]: {
          paddingTop: 0,
      }, 
    },
    hyperlink: {
      marginLeft: 5,
      [theme.breakpoints.down('sm')]: {
          paddingTop: '4px',
      }, 
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
  arrow: {
    transform: 'rotate(-90deg)',
  },
}));

// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 400;

interface Props {
  shrinkTopBar: boolean,
  backgroundCol: ColorSelect
}

function AboutPage( props: Props ) {
  const { shrinkTopBar, backgroundCol } = props;
  const classes = useStyles({ shrinkTopBar, backgroundCol });
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const contentContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
      setShowScrollToTop(false);
    }
  }

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && mobileView)
  }

  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(isSmallScreen || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainerRef} onScroll={onScroll}>
      <div className={classes.heroContainer}>
        <div className={classes.whiteBackground} />
          <div className={classes.imageContainer}>
            <img src='/images/aboutBanner.jpg' alt="" className={classes.heroImage} />
          </div>
          <div className={classes.titleContainer}>
            <Typography variant="h3" className={classes.title}>About</Typography>
            <Typography component="p" className={classes.proposition}>
              Simbi Learn Cloud is a central, easy-to-use curriculum platform for all of your supplementary 
              learning and teaching needs. On the platform, you can explore and use offline resources in 
              many subject areas, including Mathematics, Science, Languages, Literature, History, Geography, 
              Healthcare, and more. These learning resources were created by Simbi, Wikipedia, Khan Academy, 
              and other educational organizations and have been compiled into one space and brought to you by 
              Simbi Foundation.
            </Typography>
          </div>
        </div>
        <Grid direction="column" spacing={1} container className={classes.grid}>
			    <Grid item xs={12} sm={12} md={12}>
				    <div className={classes.aboutSection}>
              <div className={classes.greenBoxShadow} >
                <img src='/images/aboutPicture1.jpg' alt="Section Image" className={classes.sectionImage} />
              </div>
              <div className={classes.detailsDescription}>
                <Typography component="p">
                  As a teacher, there are many different ways to use Simbi Learn Cloud; you can browse the content to 
                  inform your lesson planning, you can use content directly with your students, and you can even create, 
                  upload, and save your own lessons to use in the classroom with your students. However you choose to use 
                  Simbi Learn Cloud, know that Simbi Foundation’s goal in providing this curriculum platform is not to replace 
                  your existing teacher efforts and methods, but rather to enhance them by giving you additional content to work with.
                </Typography>
                <Typography component="p" className={classes.paragraphSpace}>
                  If you’re looking to learn more about how you can use Simbi Learn Cloud, you can watch the series of training videos  
                  <Link to="/training-resources" className={classes.hyperlink}>here</Link>.
                </Typography>
              </div>	
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <div className={classes.aboutSection}>
              {mobileView && <div className={classes.blueBoxShadow} >
                <img src='/images/aboutPicture2.jpg' alt="Section Image" className={classes.sectionImage} />
              </div>}
              <div className={classes.detailsDescription}>
                <Typography component="p">
                  As a student, there are also many ways that you can access and enjoy the learning materials found on Simbi 
                  Learn Cloud. There are thousands of storybooks to explore on Simbi Reading, hundreds of Science and Mathematics 
                  video lessons on Khan Academy, and so much more content, ranging from information about the arts to interactive 
                  world maps to computer skills. Whether you are a primary school student, secondary school student, or an adult 
                  learner, there is fun, informative, and quality content for you on Simbi Learn Cloud.
                </Typography>
                <Typography component="p" className={classes.paragraphSpace}>
                  If you’re looking to learn more about how to use Simbi Learn Cloud and find the content you’re looking for, watch the short videos 
                  <Link to="/#howItWorks" className={classes.hyperlink}>here</Link>.  
                </Typography>
              </div>
              {!mobileView && <div className={classes.blueBoxShadow} >
                  <img src='/images/aboutPicture2.jpg' alt="Section Image" className={classes.sectionImage} />
              </div>}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <div className={classes.aboutSection}>
              <div className={classes.orangeBoxShadow} >
                <img src='/images/aboutPicture3.jpg' alt="Section Image" className={classes.sectionImage} />
              </div>
              <div className={classes.detailsDescription}>
                <Typography component="p">
                  We hope you enjoy exploring and using the educational content on Simbi Learn Cloud to supplement your classroom work! 
                </Typography>
                <Typography component="p" className={classes.paragraphSpace}>
                  We at Simbi Foundation are always looking for ways to improve Simbi Learn Cloud and add more relevant, useful 
                  content to the platform. If you have any suggestions for how we can improve the platform, or for education content 
                  that you would like to have available on the platform, please speak with your school administration to get in touch 
                  with Simbi Foundation, or if you are a teacher, you can submit a response to this 
                  <Link to="/feedback" className={classes.hyperlink}>form</Link>.
                </Typography>
              </div>
            </div>
          </Grid>
		    </Grid>
          <div className={classes.orangeSection}> 
            <Typography variant="h5" className={classes.subTitle}>Simbi Foundation</Typography>
            <Typography component="p">
              Simbi Foundation is a non-profit organization that collaborates with communities to enhance access to quality educational resources 
              and tools. The organization began its work in 2015 supporting remote school communities in eastern Uganda, and in northern India 
              in 2018. Since then, Simbi Foundation has partnered with the United Nations Refugee Agency to support schools in Bidibidi and 
              Palorinya refugee settlements in northern Uganda. 
            </Typography>
            <Grid direction="column" spacing={1} container className={classes.imageGrid} >
              <div className={classes.images} >
                <img src='/images/aboutPicture4.jpg' alt="Section Image" className={classes.orangeSectionImage} />
                <img src='/images/aboutPicture5.jpg' alt="Section Image" className={classes.orangeSectionImage} />
                <img src='/images/aboutPicture6.jpg' alt="Section Image" className={classes.orangeSectionImage} />
              </div>
            </Grid>
            <Typography component="p" >
              Simbi Foundation envisions a world in which any student, anywhere, can easily access the educational tools of the 21st Century. 
              We would like to acknowledge the incredible volunteer work of designers Paola Goldade, Miriam Bellon, Estella Lum, and Joshua Park, 
              and illustrators Helena Alonso, Tianqi Li, Katy Leuven, Maisie Westerman, Sara Tanner, and Maria Castro for envisaging, designing, 
              and illustrating the current version of Simbi Learn Cloud, and for helping Simbi Foundation and our partner communities step 
              closer towards our shared vision.
            </Typography>
          </div>
          {showScrollToTop && (
            <Fab className={classes.fab} onClick={scrollToTop}>
              <ArrowRightAlt className={classes.arrow} />
            </Fab>
          )}
        <Footer/>
    </div>
  );
}

export default AboutPage;