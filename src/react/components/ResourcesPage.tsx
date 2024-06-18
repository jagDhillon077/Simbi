import { useState, useEffect, useRef, useReducer } from 'react';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { Typography, InputBase, useMediaQuery, IconButton, Snackbar, Button, Fab, Dialog, Backdrop } from "@material-ui/core";
import Colors from '../css/Colors';
import { NAVBAR_HEIGHT } from './ClippedDrawer';
import SearchIcon from './icons/SearchIcon';
import Tabs from './Tabs';
import ResourceCard from './ResourceCard';
import { useDebounce, useThrottle } from '../../helpers';
import { ReduxState } from '../types';
import { loadResources, setResourceList } from '../actions';
import { connect, ConnectedProps } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from './icons/CloseIcon';
import ResourceService from '../../services/resources';
import { Resource } from '../Data';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { ArrowRightAlt } from '@material-ui/icons';
import { BackIcon } from "./icons/backIcon";
import { Link } from 'react-router-dom'
import { ColorSelect } from './AccessibilityPage';

const mapDispatchToProps = {
  loadResources,
  setResourceList,
}

const mapStateToProps = (state: ReduxState) => {
  return {
    resourceList: state.resourceList,
    user: state.user,
    styleSettings: state.styleSettings,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

interface StyleProps {
  backgroundCol: ColorSelect;
  copyCol: ColorSelect;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: NAVBAR_HEIGHT,
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    width: '100%',
    overflow: 'auto',
    padding: '48px 257px 24px 140px',
    textAlign: 'left',
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    [`& button span`]: {
      color: (props: StyleProps) => `${props.copyCol} !important`,
    },
    [theme.breakpoints.down(1400)]: {
      padding: '48px 15vw 24px 140px',
    },
    [theme.breakpoints.down(1320)]: {
      padding: '48px 12vw 24px 140px',
    },
    [theme.breakpoints.down(1280)]: {
      padding: '48px 140px 24px 140px',
    },
    [theme.breakpoints.down('sm')]: {
      scrollbarColor: `#A9A9A9 transparent`,
      padding: '24px 32px 24px 32px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '24px 16px 24px 16px',
      height: `calc(100vh - 54px)`,
      marginTop: 55,
    }
  },
  title: {
    width: '100%',
    fontSize: '36px',
    lineHeight: '48px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
      lineHeight: '32px',
    },
  },
  proposition: {
    padding: '40px 0 48px',
    lineHeight: '23px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      padding: '24px 0 26px',
    },
  },
  search: {
    display: 'flex',
    position: 'relative',
    borderRadius: 10,
    marginTop: 48,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    width: 568,
    height: 55,
    border: '1px solid black',
    cursor: 'text',
  },
  inputRoot: {
    color: 'inherit',
    paddingLeft: 20,
    border: '1px solid black',
    borderRadius: 10,
    width: 568,
    height: 55,
    marginTop: 48,
    [`& svg`]: {
      minWidth: '22px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 26,
      height: 48,
    },
    [theme.breakpoints.down(650)]: {
      width: '100%',
    },
  },
  inputInput: {
    fontFamily: 'Roboto Slab',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '28px',
    width: 502,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '20px',
    },
  },
  searchIcon: {
    width: 27,
    height: 27,
    marginRight: 15,
    cursor: 'text',
    opacity: 0.3,
    '& path': {
      fill: (props: StyleProps) => props.copyCol,
    },
    [theme.breakpoints.up('md')]: {
      width: 32,
      height: 32,
    },
    [theme.breakpoints.down('xs')]: {
      width: 22,
      height: 22,
      marginRight: 10
    },
  },
  searchButton: {
    '&&': {
      backgroundColor: Colors.LIGHT_ORANGE_300,
      borderRadius: '10px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    padding: '11px 17px',
    border: '1px solid black',
  },
  deletionAlert: {
    backgroundColor: Colors.CORAL_400,
    color: theme.palette.common.white,
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 600,
    padding: '12px 16px',
    borderRadius: 4,
    boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.25)',
  },
  updateAlert: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.BLUE_200,
    color: theme.palette.common.white,
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 600,
    padding: '11px 16px',
    borderRadius: 4,
    boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.25)',
  },
  nothing: {
    marginLeft: '0 0 0 8px',
  },
  snackbarClose: {
    color: theme.palette.common.white,
    marginLeft: 50,
    '&:hover': {
      color: '#ffffffee'
    }
  },
  checkmark: {
    fill: theme.palette.common.white,
    width: 37,
    height: 37,
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
  sticky: {
    position: 'sticky',
    top: -50,
    zIndex: 1,
    paddingBottom: 40,
    backgroundColor:  (props: StyleProps) => props.backgroundCol,
    [`& svg path`]: {
      fill: (props: StyleProps) => props.copyCol
    },
    '& .MuiTabs-scrollButtons.Mui-disabled': {
        opacity: 0.3,
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 26,
    }
  },
  loadMore: {
    display: 'block',
    backgroundColor: 'black',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    color: 'white',
    width: 147,
    height: 55,
    margin: '38px auto 0',
    '&:hover': {
      backgroundColor: '#222222',
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
  return: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0px',
    marginBottom: '32px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '24px',
    },
  },
  dialogContent: {
    textAlign: 'center',
    borderRadius: '4px',
    boxShadow: '4px 4px 8px 5px rgba(0, 0, 0, 0.25)',
    overflowX: 'hidden',

    [`& div`]: {
      padding: '48px 54px 40px',
      [theme.breakpoints.down('sm')]: {
        padding: '24px 32px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '24px 16px',
      },
      [`& p`]: {
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: '28px',
        marginBottom: 32,
        [theme.breakpoints.down('sm')]: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '23px',
          marginBottom: 24,
        },
      },
    },
  },
  deleteWarningButton: {
    
    fontSize: 17,
    fontWeight: 600,
    lineHeight: '20px',
    height: 55,
    width: 147,
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      height: 40,
      fontSize: 15,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
  deleteButton: {
    backgroundColor: Colors.CORAL_400,
    color: 'white',
    '&:hover': {
      backgroundColor: fade(Colors.CORAL_300, 0.9),
    },
    marginRight: 24,
  },
  cancelButton: {
    backgroundColor: 'white',
    color: Colors.CORAL_400,
    '&:hover': {
      backgroundColor: fade(Colors.GRAY_100, 0.9),
    },
    border: '1.5px solid #E25266',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 12,
    },
  },
  searchBackground: {
    backgroundColor: Colors.LIGHT_ORANGE_300,
    height: 53,
    width: 64,
    borderRadius: '0 8px 8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1px solid',
    [theme.breakpoints.down('sm')]: {
      height: 46,
    },
  },
  clearButton: {
    color: (props: StyleProps) => `${props.copyCol}`,
    fontSize: 16,
    lineHeight: '26px',
    marginRight: 12,
    '&:hover': {
      backgroundColor: 'inherit',
      textDecoration: 'underline'
    }
  },
}));

const LOAD_MORE_LIMIT = 50;

// Show the "scroll to top" button after scrolling "BACK_TO_TOP_THRESHOLD" pixels
const BACK_TO_TOP_THRESHOLD = 205;

type State = {
  search: string
};

const initialState:State = {
  search: '',
};

type Action = { type: 'setSearch', payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setSearch': 
      return {
        ...state,
        search: action.payload
      };
  }
}
function ResourcesPage(props: Props) {
  const { loadResources, setResourceList, resourceList, user, styleSettings } = props;
  const { backgroundCol, copyCol, readableFont, highlightHeading, headingsCol, highlightLink } = styleSettings;

  const classes = useStyles({backgroundCol, copyCol});
  const theme = useTheme();
  const tabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const searchRef = useRef<HTMLElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const [grades, setGrades] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);

  const [resourceID, setResourceID] = useState(0);
  const [resourceName, setResourceName] = useState('Title');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const getResources = (append: boolean) => {
    if (user) { 
      loadResources({ name: state.search, grades, offset, limit: LOAD_MORE_LIMIT, username: state.search.replaceAll(' ', '-'), isPublic: user.isAdmin ? undefined : true, approved: user.isAdmin ? undefined : true }, append);
    } else {
      loadResources({ name: state.search, grades, offset, limit: LOAD_MORE_LIMIT, username: state.search.replaceAll(' ', '-'), isPublic: true, approved: true }, append);
    }  
  }

  const updateResource = async (newResource: Resource) => {
    await ResourceService.update(newResource.id, newResource);

    const newResources = resourceList.resources.map(res => res.id === newResource.id ? newResource : res);

    setResourceList({
      ...resourceList,
      resources: newResources,
    });
    setShowUpdateAlert(true);
  }

  const setDeleteWarning = async (resource: Resource) => {
    setResourceName(resource.name);
    setResourceID(resource.id);
    setShowDeleteWarning(true);
  }

  const closeDeleteWarning = () => {
    setShowDeleteWarning(false);
  }

  const deleteResource = async () => {
    try {
      await ResourceService.delete(resourceID);
    } catch (e) {
      console.error(e);
    }
    setShowDeleteWarning(false);

    // Update frontend list
    const newResources = resourceList.resources.filter((res) => res.id !== resourceID);
    const newCount = resourceList.count - 1;

    setResourceList({
      resources: newResources,
      count: newCount,
    });
    setShowDeleteAlert(true);
  }

  const handleClose = (alert: 'delete' | 'update', reason?: string) => {
    if (reason !== 'clickaway') {
      if (alert === 'delete') {
        setShowDeleteAlert(false);
      } else {
        setShowUpdateAlert(false);
      }
    }
  }

  const handleCloseDelete = (_event?: React.SyntheticEvent, reason?: string) => handleClose('delete', reason);

  const handleCloseUpdate = (_event?: React.SyntheticEvent, reason?: string) => handleClose('update', reason);

  const focusSearch = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }

  const getLatestResources = () => {
    setOffset(0);
    getResources(false);
  }

  const scrollToTop = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
      setShowScrollToTop(false);
    }
  }

  const onScroll = useThrottle(() => {
    setShowScrollToTop(!!(contentContainerRef.current && contentContainerRef.current.scrollTop > BACK_TO_TOP_THRESHOLD));
  }, 500);

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setSearch',
        payload: event.target.value
      });
    };

    const resetSearch = () => {
      dispatch({
        type: 'setSearch',
        payload: ''
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getLatestResources, [grades, state.search]);

  useEffect(() => {
    if (offset > 0) {
      getResources(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return (
    <div className={classes.contentContainer} ref={contentContainerRef} onScroll={onScroll}>
      <div className={classes.return}>
        <Link to='/resources'> <BackIcon color={highlightLink? Colors.TEXT_PRIMARY : copyCol}/> </Link>
      </div>
      <Typography variant="h4" className={classes.title}>Full list: Additional Study Materials</Typography>
      <Typography component="p" className={classes.proposition}>
        The following is the complete list of documents uploaded by the teachers in your school.
      </Typography>
      <div className={classes.sticky}>
        <Tabs onTabChange={(grades) => setGrades(grades)} size={resourceList.count} />
        <InputBase
          placeholder={searchFocused ? '' : !mobileView ? 'Search a study material or teacher’s name' : 'Search here'}
          value={state.search}
          inputRef={searchRef}
          onChange={handleSearchChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          startAdornment={searchFocused ? null : <SearchIcon className={classes.searchIcon} onClick={focusSearch}/>}
          endAdornment={(state.search === '') ? null : 
          <Button variant="text" className={classes.clearButton}
            onClick={() => {
              resetSearch();
            }}>
            Clear
          </Button>}
        />
      </div>
      <div style={{height: tabletView ? "10px" : "40px"}}></div>
      {resourceList.resources.map(resource => {
        if (!(!resource.approved && resource.isPublic)) 
          return <ResourceCard key={resource.id} resource={resource} deleteResource={setDeleteWarning} updateResource={updateResource}  user={user} dashboardView={false} backgroundCol={backgroundCol} readableFont={readableFont} highlightHeading={highlightHeading} headingsCol={headingsCol} copyCol={copyCol}/>;
      })}
      {resourceList.resources.length < resourceList.count && (
        <Button className={classes.loadMore} onClick={() => setOffset(offset + LOAD_MORE_LIMIT)}>
          Load more
        </Button>
      )}
      <Snackbar
        open={showDeleteAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleCloseDelete}
      >
        <Alert
          classes={{ icon: classes.nothing }}
          icon={<></>}
          className={classes.deletionAlert}
          onClose={handleCloseDelete}
          action={
            <IconButton className={classes.snackbarClose} onClick={handleCloseDelete}>
              <CloseIcon className={classes.closeIcon} shrink={mobileView}/>
            </IconButton>
          }
        >
          Study material deleted from this list.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showUpdateAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleCloseUpdate}
      >
        <Alert
          icon={<CheckCircle className={classes.checkmark} />}
          className={classes.updateAlert}
          onClose={handleCloseUpdate}
          action={
            <IconButton className={classes.snackbarClose} onClick={handleCloseUpdate}>
              <CloseIcon className={classes.closeIcon} shrink={mobileView}/>
            </IconButton>
          }
        >
          Your changes have been saved
        </Alert>
      </Snackbar>
      {showScrollToTop && (
        <Fab className={classes.fab} onClick={scrollToTop}>
          <ArrowRightAlt className={classes.arrow} />
        </Fab>
      )}
      <Dialog
        open={showDeleteWarning}
        //onClose={handleClose}
        PaperProps={{ className: classes.dialogContent }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <div>
          <Typography component="p">Are you sure you want to permanently delete “{resourceName}” from this list?</Typography>
          {mobileView && <Button variant="contained" onClick={closeDeleteWarning} className={`${classes.deleteWarningButton} ${classes.cancelButton}`}> Cancel </Button>}
          <Button variant="contained" onClick={deleteResource} className={`${classes.deleteWarningButton} ${classes.deleteButton}`}> Delete </Button>
          {!mobileView && <Button variant="contained" onClick={closeDeleteWarning} className={`${classes.deleteWarningButton} ${classes.cancelButton}`}> Cancel </Button>}
        </div>
      </Dialog>
    </div>
  );
}

export default connector(ResourcesPage);
