import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Select, Card, CardContent, CardMedia, CardActionArea, useMediaQuery, MenuItem, InputLabel, Popper} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from 'react-router-dom';
import LinkButton from '@material-ui/core/Link';
import Colors from '../css/Colors';
import { Delete, Edit, CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import { Resource, FullUser, Notification } from '../Data';
import TextField from '@material-ui/core/TextField';
import CloseIcon from './icons/CloseIcon';
import SaveIcon from './icons/SaveIcon';
import { BACKEND_URL } from '../../services';
import { DocumentIconGrey } from './icons/DocumentIcon';
import { ColorSelect, ColorSelectContrast } from './AccessibilityPage';

interface Props {
  resource: Resource;
  deleteResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => Promise<void>;
  user: FullUser;
  dashboardView: boolean;
  backgroundCol: ColorSelect;
  headingsCol: ColorSelect;
  readableFont: boolean;
  highlightHeading: boolean;
  copyCol: ColorSelect;
}

interface StyleProps {
  isEditing: boolean;
  backgroundCol: ColorSelect;
  headingsCol: ColorSelect;
  readableFont: boolean;
  highlightHeading: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: 96,
    boxShadow: 'none',
    overflow: 'visible',
    backgroundColor: (props: StyleProps) => props.backgroundCol,
  },
  lightHover: {
    '&:hover': {
      backgroundColor: (props: StyleProps) => Object.values(ColorSelectContrast)[Object.values(ColorSelect).indexOf(props.backgroundCol)],
    }
  },
  darkHover: {
    backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_50 : props.backgroundCol,
    '&:hover': {
      backgroundColor: (props: StyleProps) => (props.backgroundCol === ColorSelect.WHITE)? Colors.GRAY_100 : Object.values(ColorSelectContrast)[Object.values(ColorSelect).indexOf(props.backgroundCol)],
    }
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 1000,
  },
  content: {
    display: 'flex',
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
  cover: {
    width: 45,
    height: 56,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
  imageContainer: {
    display: 'flex',
  },
  cardButton: {
    minHeight: 92,
    '& .MuiCardActionArea-focusHighlight': {
      backgroundColor: Colors.GRAY_50,
    },
  },
  title: {
    fontSize: 20,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      fontWeight: 600,
    },
  },
  description: {
    fontSize: 18,
    marginTop: 4,
    [theme.breakpoints.down('sm')]: {
      marginTop: 13,
      fontSize: 16,
    },
  },
  info: {
    marginTop: 12,
    color: Colors.TEXT_SECONDARY,
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 8,
      fontSize: '16px',
      lineHeight: '23px',
    },
  },
  linkContainer: {
    margin: '16px 0 48px -4px',
    marginLeft: (props: StyleProps) => props.isEditing ? -4 : 56,
    [theme.breakpoints.down('sm')]: {
      margin: '12px 0 48px -4px',
      marginLeft: (props: StyleProps) => props.isEditing ? -4 : 0,
    },
  },
  linkButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: Colors.TEXT_LINK,
    marginRight: 16,
  },
  linkIcon: {
    fill: Colors.TEXT_LINK,
  },
  cancelIcon: {
    fill: Colors.TEXT_LINK,
    width: 20,
    height: 20,
    margin: '0 4px',
  },
  saveIcon: {
    fill: Colors.TEXT_LINK,
    marginRight: 5,
  },
  placeholder: {
    fontFamily: 'Arial',
  },
  editTitle: {
    '& input': {
      padding: '8px 10px',
      fontFamily: 'Roboto Slab',
      fontSize: 20,
      fontWeight: 700,
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    '& > *': {
      borderRadius: 1,
    },
    marginTop: 2,
    marginRight: 2,
    maxWidth: 730,
  },
  editDescription: {
    '& input': {
      padding: '12px 10px',
      fontFamily: 'Roboto Slab',
      fontSize: 18,
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
      },
    },
    '& > *': {
      borderRadius: 1,
    },
    marginTop: 10,
    marginRight: 2,
  },
  editMarker: {
    width: 10,
    height: 325,
    borderRadius: 3,
    backgroundColor: Colors.BLUE_400,
    marginRight: 4,
    [theme.breakpoints.down('sm')]: {
      width: 5,
      height: 280,
    },
    [theme.breakpoints.down('xs')]: {
      height: 389,
    },
  },
  formInputInput: {
    padding: '12px',
    [theme.breakpoints.down('sm')]: {
      padding: '8px 10px',
    },
  },
  menuItem: {
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
    '&:hover': {
      backgroundColor: Colors.BLUE_200,
      color: 'white',
    }
  },
  inputLabel: {
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
    },
    '&&': {
      transform: 'translate(0, -32px)',
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Lora',
      color: (props: StyleProps) => props.headingsCol,
      backgroundColor: (props: StyleProps) => props.highlightHeading? 'yellow' : '',
      width: 'fit-content',
      marginTop: '36px',
      marginBottom: '-24px',
    }
  },
  classSelector: {
    [`& span:first-of-type`]: {
      color: Colors.TEXT_SECONDARY
    }
  },
  checkboxMenu: {
    zIndex: 1302,
    width: 'fit-content',
    position: 'absolute',
    top: '54px',
  },
  checkboxList: {
    paddingInlineStart: 0,
    maxHeight: 204,
    margin: 0,
  },
  checkboxPaper: {
    fontSize: 18,
    fontFamily: 'Roboto Slab',
    color: `${Colors.TEXT_SECONDARY} !important`,
    overflow: 'auto',
  },
  popper: {
    position: 'absolute',
    zIndex: 1350,
    overflow: 'visable',
  }
}));

const gradeOptions = ['Pre-primary', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Post-secondary', 'Not applicable'];

export default function ResourceCard(props: Props) {
  const {
    filename,
    name: title,
    description,
    username,
    created_at,
    grades
  } = props.resource;

  const { updateResource, deleteResource, resource, backgroundCol, headingsCol, highlightHeading, readableFont, copyCol} = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedGrades, setGrades] = useState<string[]>(grades);
  const [editedDescription, setEditedDescription] = useState(description);
  const [canEdit, setCanEdit] = useState(false);
  const [isPublic, setIsPublic] = useState(props.resource.isPublic);

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const name = username ? username.split('-') : ["unknown", "user"];
  const firstName = name[0][0] ? name[0][0].toUpperCase() + name[0].slice(1) : "";
  const lastName = name[1] ? name[1][0].toUpperCase() + name[1].slice(1) : "";

  const classes = useStyles({ isEditing, backgroundCol, readableFont, highlightHeading, headingsCol });
  const anchorProps = {
    to: {
      pathname: `${BACKEND_URL}/files/${filename}`,
    },
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  const closeEdit = () => {
    setIsEditing(false);
    setEditedTitle(title);
    setEditedDescription(description);
  }

  const saveEdit = async () => {
    try {
      await updateResource({
        ...resource,
        name: editedTitle,
        description: editedDescription,
        grades: editedGrades,
        isPublic: isPublic,
      });

      setIsEditing(false);
      setEditedTitle(editedTitle);
      setEditedDescription(editedDescription);
    } catch (e) {
      // TODO: Add server error feedback alert
      console.error(e);
    }
  }

  useEffect(() => {
    if (props.user) {
      if ( (props.user.isAdmin === true) || (props.user.username === username) ) setCanEdit(true);
    }
  }, []);

  if (isEditing) {
    return (
      <Card className={`${classes.root} ${props.dashboardView ? classes.darkHover : classes.lightHover}`} style={{marginLeft: isSmallScreen ? -16 : 0, marginRight: isSmallScreen ? -3 : 0}}>
        <div className={classes.editMarker} />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <TextField
              value={editedTitle}
              variant="outlined"
              className={classes.editTitle}
              multiline={isSmallScreen}
              rows={isSmallScreen ? '2' : '1'}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              value={editedDescription}
              variant="outlined"
              className={classes.editDescription}
              multiline={isSmallScreen}
              rows={isSmallScreen ? '4' : '1'}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <Typography variant="body1" className={classes.info} style={{marginBottom: mobileView? 10 : 8}}>
              {props.dashboardView ? "Uploaded " : "Uploaded by "+firstName+' '+lastName+' · '}
              {new Date(created_at)
                .toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }
                )}
              {grades.length ? ` · ${grades.join(', ')}` : ''}
            </Typography>
            <div style={{ marginBottom: mobileView ? 10 : 14, position: 'relative', }} className={classes.classSelector}>
              <InputLabel htmlFor="file-grade-select" shrink variant="outlined" className={classes.inputLabel}>Select the classes that this file is for</InputLabel>
              <Autocomplete
                multiple
                options={gradeOptions}
                disableCloseOnSelect
                disablePortal
                openOnFocus
                defaultValue={grades}
                onChange={(_e, newValue) => setGrades(newValue)}
                getOptionLabel={(option) => option}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                      {selected ?
                        <CheckBox htmlColor={Colors.BLUE_200} style={{ marginRight: 8 }} /> :
                        <CheckBoxOutlineBlank htmlColor={Colors.BLUE_200} style={{ marginRight: 8 }} />
                      }
                    {option}
                  </React.Fragment>
                )}
                style={{ width: "100%" }}
                size={mobileView? 'small' : 'medium'}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder={editedGrades.length ? "" : "Select classes(s)"} />
                )}
                PopperComponent={(props) =>
                  <Popper
                    {...props}
                    className={classes.checkboxMenu}
                    modifiers={{
                      flip: { enabled: false },
                      preventOverflow: { enabled: false },
                    }}
                  />
                }
                ListboxProps={{ className: classes.checkboxList }}
                classes={{
                  paper: classes.checkboxPaper,
                  popper: classes.popper,
                }}
              />
            </div>
            <Select
              id="file-privacy-select"
              aria-describedby="file-privacy-helper-text"
              defaultValue={isPublic ? "public" : "private"}
              variant="outlined"
              onChange={(e) => setIsPublic(e.target.value === "public")}
              inputProps={{ className: classes.formInputInput }}
              style={{marginBottom: mobileView ? 10 : 14, color: copyCol}}
              MenuProps={{
                style: { zIndex: 1302, },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left" 
                },
                getContentAnchorEl: null
              }}
            >
              <MenuItem value="public" className={classes.menuItem}>{props.resource.isPublic ? "Keep public" : "Make public"}</MenuItem>
              <MenuItem value="private" className={classes.menuItem}>{props.resource.isPublic ? "Make private" : "Keep private"}</MenuItem>
            </Select>
            <div className={classes.linkContainer}>
              <LinkButton
                component="button"
                variant="body2"
                className={classes.linkButton}
                onClick={closeEdit}
              >
                <CloseIcon className={classes.cancelIcon} shrink={isSmallScreen}/>
                Cancel
              </LinkButton>
              <LinkButton
                component="button"
                variant="body2"
                className={classes.linkButton}
                style={{color: (editedGrades.length === 0 || editedTitle === '' || editedDescription === '')? Colors.GRAY_700 : ''}}
                disabled={editedGrades.length === 0 || editedTitle === '' || editedDescription === ''}
                onClick={saveEdit}
              >
                <SaveIcon className={classes.saveIcon} disabled={editedGrades.length === 0 || editedTitle === '' || editedDescription === ''}/>
                Save
              </LinkButton>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Link {...anchorProps} className={classes.anchor}>
        <CardActionArea className={classes.cardButton}>
          <Card className={`${classes.root} ${props.dashboardView ? classes.darkHover : classes.lightHover}`}>
            {!mobileView && <CardMedia className={classes.imageContainer}>
              <DocumentIconGrey color={copyCol} style={{width: 45, height: 56}}/>
            </CardMedia>}
            <div className={classes.details}>
              <CardContent className={classes.content}>
                {mobileView && <div style={{display: 'flex', flexDirection: 'row'}}>
                  <DocumentIconGrey color={copyCol}/>
                  <Typography variant="h6" className={classes.title} style={{marginLeft: 12, alignSelf: 'center'}}> {title} </Typography>
                </div>}
                {!mobileView && <Typography variant="h6" className={classes.title}>
                  {title}
                </Typography>}
                <Typography variant="body1" className={classes.description}>
                  {description}
                </Typography>
                <Typography variant="body1" className={classes.info}>
                  {props.dashboardView ? "Uploaded " : "Uploaded by "+firstName+' '+lastName+' · '}
                  {new Date(created_at)
                    .toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }
                    )}
                  {grades.length ? ` · ${grades.join(', ')}` : ''}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </CardActionArea>
      </Link>
      <div className={classes.linkContainer}>
        {canEdit && <>
          <LinkButton
            component="button"
            variant="body2"
            className={classes.linkButton}
            onClick={() => deleteResource(props.resource)}
          >
            <Delete className={classes.linkIcon} />
            Delete
          </LinkButton>
          <LinkButton
            component="button"
            variant="body2"
            className={classes.linkButton}
            onClick={() => setIsEditing(true)}
          >
            <Edit className={classes.linkIcon} />
            Edit
          </LinkButton>
        </>}
      </div>
    </>
  );
}
