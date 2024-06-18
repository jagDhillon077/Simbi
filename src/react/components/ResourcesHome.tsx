import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Dimensions } from 'react-native';
import { Typography, Card, CardContent, CardMedia, CardActionArea, useMediaQuery, Fab } from "@material-ui/core";
import Colors from '../css/Colors';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import { ReduxState } from '../types';
import { loadResources, setResourceList } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import { Resource } from '../Data';
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import SoftwareCard from './SoftwareCard';
import { useHistory } from 'react-router-dom';
import Footer from './Footer';
import { DocumentIconBlack } from './icons/DocumentIcon';
import { BACKEND_URL } from '../../services';
import { Link } from 'react-router-dom';
import { useThrottle } from '../../helpers';
import { ArrowRightAlt } from '@material-ui/icons';
import { ColorSelect } from './AccessibilityPage';

const mapDispatchToProps = {
  loadResources,
  setResourceList,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    resourceList: state.resourceList,
    backgroundCol: state.styleSettings.backgroundCol
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  shrinkTopBar: boolean;
} & ConnectedProps<typeof connector>;

interface StyleProps {
  shrinkTopBar: boolean;
  backgroundCol: ColorSelect
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: (props: StyleProps) => props.shrinkTopBar? 56 : NAVBAR_HEIGHT,
    height: (props: StyleProps) => `calc(100vh - ${props.shrinkTopBar? 56 : NAVBAR_HEIGHT}px)`,
    width: '100%',
    overflow: 'overlay',
    backgroundColor: (props: StyleProps) => props.backgroundCol,
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
    backgroundColor: (props: StyleProps) => (props.backgroundCol !== ColorSelect.WHITE)? props.backgroundCol : Colors.GREEN_50,
    paddingBottom: 36,
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
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  imageContainer: {
    flexBasis: '175%',
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
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
    padding: '0 48px',
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
      fontSize: '16px',
      lineHeight: '23px',
      padding: '24px 36px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '24px 16px',
    }
  },
  resourcesAndSoftware: {
    padding: '96px 142px 80px',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 0 0px',
    }
  },
  studyText: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    }
  },
  additionalStudyText: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      marginBottom: 24,
      paddingLeft: 36,
      paddingRight: 36,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    }
  },
  additionalStudyTextDescription: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      marginBottom: 32,
      paddingLeft: 36,
      paddingRight: 36,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    }
  },
  recentUploadTitle: {
    marginBottom: 48,
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      marginBottom: 24,
      paddingLeft: 36,
      paddingRight: 36,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
    }
  },
  recentResources: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.YELLOW_100,
    padding: 32,
    marginBottom: 80,
    [theme.breakpoints.down('sm')]: {
      padding: '24px 32px 60px',
      marginBottom: 0,
    },
    [theme.breakpoints.down('xs')]: {
      padding: '24px 16px 60px',
    }
  },
  cardButton: {
    minHeight: 92,
    '& .MuiCardActionArea-focusHighlight': {
      backgroundColor: Colors.GRAY_50,
    },
  },
  card: {
    display: 'flex',
    boxShadow: 'none',
    backgroundColor: 'inherit',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  cardContent: {
    flexDirection: 'column',
    textAlign: 'left',
    '&&': {
      padding: 0,
      paddingLeft: 16,
    },
    [theme.breakpoints.down('sm')]: {
      '&&': {
        paddingLeft: 0,
      }
    }
  },
  cardCover: {
    width: 45,
    height: 56,
  },
  cardInfo: {
    marginTop: 12,
    color: Colors.TEXT_SECONDARY,
  },
  cardMedia: {
    display: 'flex',
  },
  buttonContainer: {
    display: 'flex',
    flexBasis: '100%',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      alignItems: 'end'
    },
  },
  seeListButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    color: 'white',
    width: 288,
    height: 60,
    marginTop: 24,
    '&:hover': {
      backgroundColor: '#222222',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
      height: 40,
      width: '100%',
      padding: 'inherit 36px inherit'
    },
    [theme.breakpoints.down('xs')]: {
      padding: 'inherit 16px inherit'
    }
  },
  softwareGrid: {
    display: 'grid',
    gap: 'clamp(10px, 1%, 48px)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    [theme.breakpoints.down(1530)]: {
      gap: 'clamp(10px, 5vw, 48px)',
      rowGap: 'clamp(10px, 5vw, 48px)',
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  softwareStudyText: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
  cardContainer: {
    display: 'flex',
    flexBasis: '48%',
    marginBottom: 48,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24,
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
    }
  },
  singleCard: {
    flexBasis: '100%',
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
  }
}));

// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 400;

function ResourcesHome(props: Props) {
  const { resourceList, shrinkTopBar, loadResources, backgroundCol } = props;

  const classes = useStyles({ shrinkTopBar, backgroundCol });
  const history = useHistory();

  const theme = useTheme();
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));

  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const contentContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
      setShowScrollToTop(false);
    }
  }

  const clipScreen = () => {
    return (((Dimensions.get('screen').height - Dimensions.get('window').height) > 10) && tabletView)
  }

  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  useEffect(() => {
    loadResources({ limit: 4, isPublic: true, approved: true });
  }, [loadResources]);

  const resourceCard = (resource: Resource) => {
    const name = resource.username ? resource.username.split('-') : ["unknown", "user"];
    const firstName = name[0][0].toUpperCase() + name[0].slice(1);
    const lastName = name[1] ? name[1][0].toUpperCase() + name[1].slice(1) : "";
    const singleCard = (resourceList.count == 1);

    const anchorProps = {
      to: {
        pathname: `${BACKEND_URL}/files/${resource.filename}`,
      },
      target: '_blank',
      rel: 'noopener noreferrer',
    };

    return (
      <div className={`${classes.cardContainer} ${singleCard ? classes.singleCard : ''}`}>
        <Link {...anchorProps} className={`${classes.anchor} `}>
          <CardActionArea className={classes.cardButton}>
            <Card className={classes.card} key={resource.id}>
              {!tabletView && <CardMedia className={classes.cardMedia}>
                <img src="/images/textIcon.png" alt="Text document" className={classes.cardCover} />
              </CardMedia>}
              <div className={classes.cardDetails}>
                <CardContent className={classes.cardContent}>
                  {tabletView && <div style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
                    <DocumentIconBlack/>
                    <Typography variant="h6" style={{marginLeft: 12, alignSelf: 'center', fontSize: 16}}> {resource.name} </Typography>
                  </div>}
                  {!tabletView && <Typography variant="h6">
                    {resource.name}
                  </Typography>}
                  <Typography variant="body1" style={{fontSize: tabletView ? 16 : 18}}>
                    {resource.description}
                  </Typography>
                  <Typography variant="body1" className={classes.cardInfo} style={{fontSize: tabletView ? 16 : 18}}>
                    Uploaded by {firstName+' '+lastName} ·{' '}
                    {new Date(resource.created_at)
                      .toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }
                      )}
                    {resource.grades.length ? ` · ${resource.grades.join(', ')}` : ''}
                  </Typography>
                </CardContent>
              </div>
            </Card>
          </CardActionArea>
        </Link>
      </div>
      
    );
  }

  return (
    <div className={classes.contentContainer} style={{maxHeight: (clipScreen())? `calc(${Dimensions.get('window').height}px - ${(mobileView || shrinkTopBar)? 56 : NAVBAR_HEIGHT}px)` : ''}} ref={contentContainerRef} onScroll={onScroll}>
      <div className={classes.heroContainer}>
        <div className={classes.whiteBackground} />
        <div className={classes.imageContainer}>
          <img src="/images/resourcesIllustration.jpg" alt="" className={classes.heroImage} />
        </div>
        <div className={classes.titleContainer}>
          <Typography variant="h3" className={classes.title}>Resources</Typography>
          <Typography component="p" className={classes.proposition}>
          Welcome to Resources. On this page, you can find even more quality learning content. 
          You can explore study materials that teachers at your school have uploaded, or you can 
          download software onto your computer that will help you to access even more learning resources.
          </Typography>
        </div>
      </div>

      <div className={classes.resourcesAndSoftware}>
        <Typography variant="h4" className={classes.additionalStudyText}>Additional Study Materials</Typography>
        <Typography component="p" className={classes.additionalStudyTextDescription}>
        The following learning resources have been created and uploaded by teachers at your school. 
        Click on the titles to open the documents.
        </Typography>
        <Typography variant="h5" className={classes.recentUploadTitle}>Recently uploaded materials</Typography>
        <div className={classes.recentResources}>
          {resourceList.resources.map(resource => resourceCard(resource))}
          <div className={classes.buttonContainer}>
            <Button className={classes.seeListButton} onClick={() => history.push('resource-list')}>
              See full list
            </Button>
          </div>
        </div>

        <Typography variant="h4" className={classes.softwareStudyText}>Software</Typography>
        <Typography component="p" className={classes.softwareStudyText}>
          If you have a personal computer, you will find the following software very useful! 
          To download the software and use it for your learning, click on the image.
        </Typography>
        <div className={classes.softwareGrid}>
          <SoftwareCard
            title="Firefox"
            port="8015"
            // TODO: Get these from the backend
            url="/modules/en-windows_apps/FirefoxPortable_44.0_English.paf.exe"
            description="Firefox is an open-source web browser. If you have access to the internet, 
            you can use Firefox to navigate the web and find even more learning resources."
            image="/images/firefox.png"
            backgroundColor={Colors.ORANGE_100}
          />
          <SoftwareCard
            title="Open Office Suite"
            port="8015"
            url="/modules/en-windows_apps/OpenOfficePortable_3.2.0_English.paf.exe"
            description="Open Office Suite from Apache is a free, open-source collection of software that you can use for
            word processing, creating spreadsheets, making presentations, and more!"
            image="/images/open_office_suite.png"
            backgroundColor={Colors.BLUE_50}
          />
          <SoftwareCard
            title="VLC Video Player"
            port="8015"
            url="/modules/en-windows_apps/VLCPortable_2.1.5.paf.exe"
            description="VLC is a free, open-source media player. 
            You can download it onto your computer if you need to play video, audio, or other media files."
            image="/images/vlc.png"
            backgroundColor={Colors.TEXT_SECONDARY}
          />
          <SoftwareCard
            title="Putty SSH"
            port="8015"
            url="/modules/en-windows_apps/putty.exe"
            description="Putty is a free and open-source terminal emulator, serial console and network file transfer application."
            image="/images/putty.png"
            backgroundColor={Colors.YELLOW_50}
          />
        </div>
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

export default connector(ResourcesHome);