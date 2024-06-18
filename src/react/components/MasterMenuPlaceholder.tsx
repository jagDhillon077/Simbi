import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { sources, subjects } from '../Data';
import { formatString } from '../../helpers';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Link, useLocation } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { setView, loadCategoryModules, setResults } from '../actions';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Colors from '../css/Colors';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from './icons/CloseIcon';
import Toolbar from '@material-ui/core/Toolbar';

type DrawerVariant = "temporary" | "permanent" | "persistent";

const mapDispatchToProps = {
  setView,
  loadCategoryModules,
  setResults,
}

const connector = connect(null, mapDispatchToProps);

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
} & ConnectedProps<typeof connector>;

const drawerWidth = 279;
const smallDrawerWidth = 221;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down('xs')]: {
      width: smallDrawerWidth,
    }
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.down('xs')]: {
      width: smallDrawerWidth,
    }
  },
  drawerContainer: {
    overflow: 'overlay',
    fallbacks: {
      overflow: 'auto',
    },
  },
  list: {
    backgroundColor: Colors.LIGHT_ORANGE_50,
    paddingTop: 32,
    '&:last-child': {
      paddingTop: 24,
      paddingBottom: 52,
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 8,
      '&:last-child': {
        paddingTop: 8,
        paddingBottom: 24,
      },
    }
  },
  listItem: {
    paddingLeft: 36,
    '&:hover': {
      backgroundColor: 'inherit',
      color: Colors.ORANGE_400,
    },
    '&:active': {
      color: Colors.ORANGE_600,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '26px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '5px 0 5px 16px',
    }
  },
  selected: {
    '&&': {
      backgroundColor: Colors.LIGHT_ORANGE_100,
    },
    '&&:hover': {
      backgroundColor: Colors.LIGHT_ORANGE_100,
      color: 'inherit',
    },
    '& span': {
      fontWeight: 'bold',
    }
  },
  divider: {
    height: 5,
    backgroundColor: 'white',
  },
  toolbar: {
    minHeight: 96,
    [theme.breakpoints.down('sm')]: {
      minHeight: 0,
    }
  },
  grayBar: {
    backgroundColor: Colors.GRAY_400,
    userSelect: 'none', // supported by Chrome, Edge, Opera and Firefox only!
    position: 'relative',
	overflow: 'hidden',
},
  subheader: {
    color: Colors.GRAY_400,
    paddingLeft: theme.spacing(3),
    paddingBottom: 12,
    fontFamily: 'Roboto Slab',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
      paddingBottom: 0,
      fontSize: 18,
    },
  },
  closeButton: {
    margin: 4,
    [theme.breakpoints.only('sm')]: {
      marginLeft: 25,
      paddingTop: 0,
    },
    [theme.breakpoints.down('xs')]: {
      margin: 4,
      padding: 12,
    }
  },
  text: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    }
  },
  subheaderListItem: {
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0,
    }
  },


  grayBackground: {
    backgroundColor: Colors.GRAY_50,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    height: '170px',
  },
  subjects: {
    height: '520px',
    [theme.breakpoints.down('sm')]: {
        height: '320px',
    }
  },
  sources: {
    height: '845px',
    [theme.breakpoints.down('sm')]: {
        height: '550px',
    }
},

// Animations
shimmerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: `$loading 1500ms ${theme.transitions.easing.easeInOut} 500ms infinite`,
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

function MasterMenuPlaceholder(props: Props) {
  const { open, setOpen, loadCategoryModules } = props;
  const classes = useStyles();
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const location = useLocation();

  const pathname = location.pathname.slice(1);

  const responsiveDrawerProps: { variant: DrawerVariant } = {
    variant: mobileView ? 'temporary' : 'permanent'
  }

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      {...responsiveDrawerProps}
      open={open}
      onClick={() => setOpen(false)}
    >
      <Toolbar className={classes.toolbar}/>
      <div className={classes.drawerContainer}>
        <List component='nav' className={`${classes.grayBackground} ${classes.subjects}`}>
          
          {mobileView && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                className={classes.closeButton}
                aria-label="open drawer"
                onClick={() => setOpen(false)}
              >
                <CloseIcon shrink={isSmallScreen}/>
              </IconButton>
              
              <Divider className={classes.divider} />
            </>
          )}
          <div className={`${classes.grayBackground} ${classes.subjects}`}>
          <div className={classes.shimmerWrapper}>
			  <div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
		  </div>
          {/*<ListItem >
            <ListSubheader className={classes.subheader}> <span className={classes.grayBar}>Subjects
              <div className={classes.shimmerWrapper}>
				<div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
			  </div> </span>
              </ListSubheader>
          </ListItem>*/}
          </div>
          
          
        </List>
        <Divider className={classes.divider} />
        <List component='nav' className={`${classes.grayBackground} ${classes.sources}`}>
          <ListItem className={classes.subheaderListItem}>
            {/*<ListSubheader className={classes.subheader}> <span className={classes.grayBar}>Sources</span>
              <div className={classes.shimmerWrapper}>
				<div className={`${classes.shimmer} ${classes.darkShimmer}`}></div>
			  </div>
              </ListSubheader>*/}
          </ListItem>
          <div className={classes.shimmerWrapper}>
			<div className={`${classes.shimmer} ${classes.lightShimmer}`}></div>
		  </div>
        </List>
      </div>
    </Drawer >
  );
}

export default connector(MasterMenuPlaceholder);