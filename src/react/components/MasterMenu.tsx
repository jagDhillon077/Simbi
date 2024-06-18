import React from 'react';
import { Drawer, List, ListItem, ListSubheader, ListItemText, Divider, IconButton, Toolbar, Button, Badge } from "@material-ui/core";
import { makeStyles, fade } from '@material-ui/core/styles';
import { Source, sources, subjects } from '../Data';
import { formatString, useDebounce } from '../../helpers';
import { Link, useLocation } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { setView, loadCategoryModules, setResults } from '../actions';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Colors from '../css/Colors';
import { ReduxState } from '../types';
import CloseIcon from './icons/CloseIcon';
import { CustomToolTip } from './CustomToolTip';
import { ColorSelect, ColorSelectContrast } from './AccessibilityPage';

type DrawerVariant = "temporary" | "permanent" | "persistent";

const mapDispatchToProps = {
  setView,
  loadCategoryModules,
  setResults,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.user,
    backgroundCol: state.styleSettings.backgroundCol,
    textCol: state.styleSettings.copyCol,
    headerCol: state.styleSettings.headingsCol
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  open: boolean;
  onSignup: boolean;
  unreadNotifications: number;
  onboarding: boolean;
  setOpen: (open: boolean) => void;
} & ConnectedProps<typeof connector>;

const drawerWidth = 279;
const smallDrawerWidth = 221;

interface StyleProps {
  backgroundCol: ColorSelect;
  textCol: ColorSelect;
  headerCol: ColorSelect;
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [`& nav a`]: {
      backgroundColor: 'inherit',
      width: 'auto'
    },
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
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.LIGHT_ORANGE_50 : props.backgroundCol,
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
    [`& span:first-of-type`]: {
      color: (props: StyleProps) => props.textCol,
    },
    '&:hover': {
      backgroundColor: 'inherit',
      [`& span:first-of-type`]: {
        color: Colors.ORANGE_400,
      }
    },
    '&:active': {
      color: Colors.ORANGE_600,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '26px',
      [`& li`]: {
        //color: (props: StyleProps) => props.headerCol,
      }
    },
    [theme.breakpoints.down('xs')]: {
      padding: '5px 0 5px 16px',
    }
  },
  selected: {
    '&&': {
      backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.LIGHT_ORANGE_100 : Object.values(ColorSelectContrast)[Object.values(ColorSelect).indexOf(props.backgroundCol)],
    },
    '&&:hover': {
      backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.LIGHT_ORANGE_100 : Object.values(ColorSelectContrast)[Object.values(ColorSelect).indexOf(props.backgroundCol)],
    },
    '&:hover': {
      '& span': {
        color: `${Colors.TEXT_PRIMARY} !important`,
      }
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
  subheader: {
    marginLeft: theme.spacing(3),
    marginBottom: 12,
    fontFamily: 'Lora', 
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginBottom: 0,
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
    [`& li`]: {
      color: (props: StyleProps) => props.headerCol,
    },
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0,
    }
  },
  teacherPortalButton: {
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: fade('#222222', 0.9),
    },
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '20px',
    height: 40,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 16,
    paddingBottom: 16,
    width: 204,
    borderRadius: 8,
    margin: '8px 0 16px 36px',
    [theme.breakpoints.down('xs')]: {
      width: 189,
      margin: '5px 0 16px 16px',
    },
  },
  notificationBage: {
    right: -20,
    top: 17,
    fontSize: 12,
    fontWeight: 600,
    width: 19,
    height: 19,
    borderRadius: 24,
    color: 'white !important',
    backgroundColor: Colors.CORAL_400,
    border: '1px solid white',
    [theme.breakpoints.down('xs')]: {
      right: -18,
    },
  },
  badgeMargin: {
    right: 2,
    top: 10,
    fontSize: 16,
    fontWeight: 600,
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: Colors.BLUE_200,
    [theme.breakpoints.down('xs')]: {
      width: 20,
      height: 20,
      fontSize: 14,
      borderRadius: 10,
      right: '-9px',
    },
  }
}));

function MasterMenu(props: Props) {
  const { open, setOpen, loadCategoryModules, onSignup, user, unreadNotifications, onboarding, backgroundCol, textCol, headerCol } = props;
  const classes = useStyles({backgroundCol, textCol, headerCol});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileScreen = useMediaQuery(theme.breakpoints.down(696));
  const shrinkCloseIcon = useMediaQuery(theme.breakpoints.down('xs'));
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [oboardingTooltip, setOboardingTooltip] = React.useState(false);


  /* Create an array without Curriculum Guides so it does not appear on the menue */
  const index = sources.indexOf(Source.CurriculumGuides);
  const displaySources = [...sources];
  if (index > -1) {
    displaySources.splice(index, 1);
  }

  /* Using this debounce allows the tooltip to render in the correct spot after the menue is fully created */
  const debounce = useDebounce(() => {
    onboarding? setOboardingTooltip(true) : setOpenTooltip(true);
  }, 400);

  const responsiveDrawerProps: { variant: DrawerVariant } = {
    variant: isSmallScreen ? 'temporary' : 'permanent'
  }

  React.useEffect(() => {
    if (open && (onSignup || onboarding)) {
      debounce("true");
    } else {
      setOboardingTooltip(false);
      setOpenTooltip(false);
    }
  }, [open, onSignup, onboarding]);

  const teacherPortalItem = () => {
    return(
      <>
      {user.token?
        <Link to="/teacher-portal" style={{textDecoration: 'none'}} >
          <Button variant="contained" className={classes.teacherPortalButton}>
            {user.token? "Dashboard" : "Teacher's Portal"} 
          </Button>
        </Link> :
        <ListItem
          button
          key={"Teacher's Portal"}
          selected={formatString('teacher-portal') === pathname}
          classes={{ selected: classes.selected }}
          className={classes.listItem}
          onClick={() => setOpen(false)}
          component={Link}
          to={"/teacher-portal"}>
          <ListItemText primary={"Teacher's Portal"} primaryTypographyProps={{ className: classes.text }} />
        </ListItem>}
      </>
    );
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
        <List component='nav' className={classes.list}>
          {isSmallScreen && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                className={classes.closeButton}
                aria-label="open drawer"
                onClick={() => setOpen(false)}
              >
                <CloseIcon shrink={shrinkCloseIcon} style={{color: textCol}}/>
              </IconButton>
              {['Simbi Reading', 'Resources', 'Accessibility'].map((text) => (
                <ListItem
                  button
                  key={text}
                  selected={formatString(text) === pathname}
                  classes={{ selected: classes.selected }}
                  className={classes.listItem}
                  onClick={() => setOpen(false)}
                  component={Link}
                  to={"/" + formatString(text)}
                >
                  <ListItemText primary={text} primaryTypographyProps={{ className: classes.text }} />
                </ListItem>
              ))}
              {user.token && ['Notifications'].map((text) => (
                
                  <ListItem
                    button
                    key={text}
                    selected={formatString(text) === pathname}
                    classes={{ selected: classes.selected }}
                    className={classes.listItem}
                    onClick={() => setOpen(false)}
                    component={Link}
                    to={"/" + formatString(text)}
                  >
                    <CustomToolTip title={`Click here to open the notifications page.`}
                  placement={ mobileScreen ? "bottom-start" : "right"} arrow open={oboardingTooltip}>
                    <Badge
                      badgeContent={unreadNotifications}
                      classes={{ badge: classes.notificationBage}}>
                      <ListItemText primary={text} primaryTypographyProps={{ className: classes.text }} />
                    </Badge>
                    </CustomToolTip>
                  </ListItem>
                
              ))}
              {!onSignup && <>
              {teacherPortalItem()}
              </>}
              {onSignup && (
                <CustomToolTip
                title={`Click here to sign in to your new account!`}
                placement={ mobileScreen ? "bottom-start" : "right"}
                arrow
                open={openTooltip}
              >
                <Badge
                badgeContent={"!"}
                classes={{ badge: classes.badgeMargin}}
                >
                  {teacherPortalItem()}
                </Badge>
              </CustomToolTip>
              )}
                  <Divider className={classes.divider} />
                </>
          )}
          <ListItem className={classes.subheaderListItem}>
            <ListSubheader className={classes.subheader}>Subjects</ListSubheader>
          </ListItem>
          {subjects.map((text) => (
            <ListItem
              button
              key={text}
              selected={formatString(text) === pathname}
              classes={{ selected: classes.selected }}
              className={classes.listItem}
              onClick={() => {
                loadCategoryModules({
                  type: 'subject',
                  title: text,
                });
                setOpen(false);
              }}
              component={Link}
              to={"/" + formatString(text)}
            >
              <ListItemText primary={text} primaryTypographyProps={{ className: classes.text }} />
            </ListItem>
          ))}
        </List>
        <Divider className={classes.divider} />
        <List component='nav' className={classes.list}>
          <ListItem className={classes.subheaderListItem}>
            <ListSubheader className={classes.subheader}>Sources</ListSubheader>
          </ListItem>
          {displaySources.map((text) => (
            <ListItem
              button
              key={text}
              selected={formatString(text) === pathname}
              classes={{ selected: classes.selected }}
              className={classes.listItem}
              onClick={() => {
                
                loadCategoryModules({
                  type: 'source',
                  title: text,
                });
                setOpen(false);
              }}
              component={Link}
              to={"/" + formatString(text)}
            >
              <ListItemText primary={text} primaryTypographyProps={{ className: classes.text }} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer >
  );
}

export default connector(MasterMenu);
