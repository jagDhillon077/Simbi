import React, { useState } from 'react';
import { Box, Dialog, makeStyles, IconButton, DialogContent, DialogContentText, DialogActions,
  Button, Typography, LinearProgress, FormControl, InputLabel, FormHelperText, OutlinedInput,
  Select, MenuItem, DialogTitle, Tooltip, TextField, Popper, withStyles, useTheme }  from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from './icons/UploadIcon';
import Colors from '../css/Colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useEffect } from 'react';
import { RedErrorPaper } from './icons/ErrorPaper';
import { ThankYouPaper } from './icons/ThankYouPaper';
import CloseIcon from './icons/CloseIcon';
import InfoIcon from '@material-ui/icons/Info';
import ResourceService from '../../services/resources';
import { BACKEND_URL } from '../../services';
import { useCallback } from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getAnchorProps } from '../../helpers';
import { Link } from 'react-router-dom';
import { CustomToolTip } from './CustomToolTip';
import { AccessibilityStyleCookies, ColorSelect } from './AccessibilityPage';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props: StyleProps) => props.backgroundCol,
    [`& p, label, input, textarea, div div`]: {
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Roboto Slab',
      color: (props: StyleProps) => props.copyCol,    
    },
    [`& h4`]: {
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Lora',
      color: (props: StyleProps) => props.headingsCol,
      backgroundColor: (props: StyleProps) => props.highlightHeading? 'yellow' : '',
      width: 'fit-content'
    }, 
  },
  actionButton: {
    backgroundColor: 'black',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    color: 'white',
    width: 147,
    height: 55,
    marginTop: 38,
    '&:hover': {
      backgroundColor: '#222222',
    },
    '&:disabled': {
      backgroundColor: Colors.GRAY_300,
      color: Colors.TEXT_DISABLED,
    },
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
  },
  closeButton: {
    height: 40,
    width: 40,
    position: 'absolute',
    padding: 0,
    right: 5,
    top: 3,

    [theme.breakpoints.down('xs')]: {
      height: 30,
      width: 30,
        top: 11,
        right: 5
    },
  },
  noticeActionButton: {
    marginTop: 14
  },
  thankYouIcon: {
    margin: '48px 0 16px 0',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px',
      marginBottom: '32px',
      height: '105px',
      width: '105px'
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: '8px',
      marginBottom: '32px',
      height: '90px',
      width: '90px'
    },
  },
  thankYouTitle: {
    fontSize: '36px',
    margin: '16px auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '22px',
    },
  },
  errorIcon: {
    margin: '9px 0 8px 0',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 3,
    },
    [theme.breakpoints.down('xs')]: {
      width: 57,
      height: 72
    },
  },
  errorTitle: {
    fontSize: 30,
    margin: '0 auto 16px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22,
    }
  },
  noticeText: {
    marginBottom: 10,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  content: {
    maxWidth: 900,
    textAlign: 'center',
    overflowX: 'hidden',
    maxHeight: 'calc(100% - 32px)',
    [theme.breakpoints.up('sm')]: {
      maxHeight: 'calc(100% - 32px)',
    },
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      maxHeight: '100%',
    }
  },
  formContent: {
    maxWidth: 900,
    textAlign: 'center',
    maxHeight: 'calc(100% - 32px)',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      maxHeight: '100%',
    }
  },
  actions: {
    justifyContent: 'center',
  },
  dialogContent: {
    padding: '56px 66px 61px',
    [theme.breakpoints.down('sm')]: {
      padding: '52px 32px 24px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '62px 16px 24px'
    },
  },
  thankYouContent: {
    padding: '32px 59px',
    backgroundColor: Colors.LIGHT_ORANGE_100,
    '&&': {
      paddingTop: 32,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '40px 32px 24px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '40px 16px 24px',
    }
  },
  errorContent: {
    padding: '32px 59px',
    backgroundColor: Colors.CORAL_200,
    '&&': {
      paddingTop: 32,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '32px 32px 24px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '32px 16px 24px',
    }
  },
  noticeActions: {
    justifyContent: 'center',
    padding: 0,
  },
  uploadArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    marginBottom: 48,
    width: '44vw',
    maxWidth: '768px',
    [theme.breakpoints.down(1366)]: {
      width: 580,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 32,
    },
    [theme.breakpoints.down(862)]: {
      width: '78%',
    },
    height: 194,
    border: '2px dashed #56585B',
    borderRadius: 0,
    cursor: 'pointer',
    '&&': {
      backgroundColor: Colors.GREEN_50,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '30vh',
      minHeight: '124px'
    }
  },
  cancelButton: {
    backgroundColor: 'white',
    border: '2px solid black',
    borderRadius: 8,
    width: 147,
    height: 55,
    marginTop: 38,
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
  },
  title: {
    fontSize: 30,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
      marginBottom: -5
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  progressDialogContent: {
    width: 774,
    '&&': {
      padding: '64px 70px 32px 70px',
      [theme.breakpoints.down('sm')]: {
        width: '90vw',
        padding: '40px 32px 24px',
      },
      [theme.breakpoints.down('xs')]: {
        width: 'calc(100vw - 32px)',
        padding: '40px 16px 24px',
      },
    }
  },
  linearProgress: {
    height: 24,
    borderRadius: 4,
    [theme.breakpoints.down('xs')]: {
      [`& p`]: {
        fontSize: 16
      }
    },
    [`& p`]: {
      fontSize: 18
    }
  },
  formDialogContent: {
    textAlign: 'left',
    width: 863,
    '&&': {
      padding: '40px 64px 48px',
      [theme.breakpoints.down('sm')]: {
        width: '90vw',
        padding: '16px 32px 24px',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        padding: '16px 16px 24px',
      },
    }
  },
  inputLabel: {
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
    '&&': {
      transform: 'translate(0, -32px)',
      fontFamily: (props: StyleProps) => props.readableFont? 'Helvetica' : 'Lora',
      color: (props: StyleProps) => props.headingsCol,
      backgroundColor: (props: StyleProps) => props.highlightHeading? 'yellow' : '',
      width: 'fit-content'
    }
  },
  form: {
    '& *': {
      fontSize: 18,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16,
      },
    }
  },
  formInput: {
    marginTop: 28,
  },
  formInputInput: {
    padding: '16.5px 14px',
  },
  formTitle: {
    fontSize: 24,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      margin: '0 auto 8px auto'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: '24px'
    },
  },
  formDescription: {
    fontSize: 20,
    margin: '21px 0 29px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      margin: '0 0 24px 0',
      fontSize: 16
    },
  },
  helperText: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 24,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginBottom: 16,
    },
  },
  formActions: {
    padding: 0,
    justifyContent: 'flex-start',
    '& :not(:first-child)': {
      marginLeft: 24,
    },
    '& > *': {
      marginTop: 32,
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  checkmarkIcon: {
    width: 59,
    height: 59,
    fill: Colors.GREEN_300,
    marginRight: 18,
    marginLeft: -5,
    [theme.breakpoints.down('sm')]: {
      width: 49,
      height: 49,
      display: 'flex',
      margin: '0 auto 12px auto',
    },
    [theme.breakpoints.down('xs')]: {
      width: 40,
      height: 40,
    },
  },
  cancelContent: {
    width: 548,
    padding: '40px 24px',
    [theme.breakpoints.down('xs')]: {
      padding: '32px 16px 24px !important',
      width: "calc(100vw - 32px)",
    },
  },
  cancelText: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    margin: '20px 40px 40px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0 0 24px 0',
      fontSize: 16,
    },
  },
  cancelActions: {
    padding: 0,
    '& button': {
      width: 238,
      margin: 0,
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: 'unset',
      [theme.breakpoints.down('sm')]: {
        fontSize: '15px',
      },
    },
    '& :not(:first-child)': {
      marginLeft: 24,
    }
  },
  destructiveButton: {
    backgroundColor: Colors.CORAL_400,
    color: 'white',
    height: 55,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: Colors.CORAL_300,
    },
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
  },
  uploadIcon: {
    [theme.breakpoints.down('xs')]: {
      width: 50,
    }
  },
  filename: {
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
  infoIcon: {
    pointerEvents: 'all',
    marginLeft: 8,
    marginBottom: -3,
    marginTop: 3,
    width: 21,
    height: 21,
  },
  menuPaper: {
    maxHeight: 204,
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
  clearButton: { 
    marginLeft: 'auto',
  },
  clearIcon: {
    width: 15,
    height: 15,
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
  classSelector: {
    [`& span:first-of-type`]: {
      color: Colors.TEXT_SECONDARY
    }
  },
  checkboxPaper: {
    fontSize: 18,
    fontFamily: 'Roboto Slab',
    color: `${Colors.TEXT_SECONDARY} !important`,
    overflow: 'auto',
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
  popper: {
    position: 'absolute',
    top: 54,
  },
  outlinedInput: {
    [`& textarea`]: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 15,
      },
      [theme.breakpoints.down(344)]: {
        fontSize: 14,
      }
    }
  }
}));

const gradeOptions = ['Pre-primary', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Post-secondary', 'Not applicable'];

interface Props {
  firstName: string;
  username: string;
  admin: boolean;
  open: boolean;
  tooltip: boolean;
  styleSettings: AccessibilityStyleCookies;
  handleClose: () => void;
}

interface StyleProps {
  backgroundCol: ColorSelect;
  copyCol: ColorSelect;
  headingsCol: ColorSelect;
  readableFont: boolean;
  highlightHeading: boolean;
}

const bc = new BroadcastChannel('Add new private upload');

type DialogView = "selectFile" | "uploading" | "form" | "done" | "error";

export default function UploadDialog(props: Props) {
  const { open, tooltip, styleSettings } = props;
  const classes = useStyles({...styleSettings});
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [grades, setGrades] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [fileError1, setFileError1] = useState("We're having trouble submitting data to our server. This isn't your fault.");
  const [fileError2, setFileError2] = useState(`Please click "Try again". If this problem persists, please contact your school's administrator, who
  will be able to contact Simbi Foundation for support.`);
  const [view, setView] = useState<DialogView>("selectFile");
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const anchorProps = getAnchorProps(undefined, '/resource-list');
  const history = useHistory(); 

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const onDrop = React.useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleClose = (e?: any) => {
    setFile(null);
    setFileName("");
    setFileDescription("");
    setGrades([]);
    setIsPublic(false);
    setProgress(0);
    setFileId(null);
    setShowCancelDialog(false);
    props.handleClose();
    if (e) e.preventDefault();
    history.goBack();
  }

  const goToResources = () => {
    setFile(null);
    setFileName("");
    setFileDescription("");
    setGrades([]);
    setIsPublic(false);
    setProgress(0);
    setFileId(null);
    setShowCancelDialog(false);
    props.handleClose();
  }

  const submitFile = useCallback(() => {
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('file', file!);
    xhr.open('POST', `${BACKEND_URL}/api/resources`);

    xhr.upload.onerror = (e) => {
      setErrorMessages(e);
      setView("error");
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.floor((e.loaded / e.total) * 100));
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        setFileId(JSON.parse(xhr.response).id);
        setView("form");
      } else {
        setErrorMessages(xhr.response);
        setView("error");
      }
    }

    xhr.send(formData);
  }, [file]);

  const setErrorMessages = (response: any) => {
    if (response === "File too large") {
      setFileError1("This file is too large to be submitted.");
      setFileError2('Please click "Try again" and try a smaller file, the size limit is 2 megabytes.');
    } else if (response === "File upload only supports PDFs.") {
      setFileError1("This file is not a PDF. The submitted file must be a PDF.");
      setFileError2(`Please click "Try again" and try submitting your file in PDF form.`);
    } else {
      setFileError1("We're having trouble submitting data to our server. This isn't your fault.");
      setFileError2(`Please click "Try again". If this problem persists, please contact your school's administrator, who
      will be able to contact Simbi Foundation for support.`);
    }
  }

  useEffect(() => {
    if (file && view === "selectFile") {
      console.log(file);
      setView("uploading");
      submitFile();
    }
  }, [file, submitFile, view]);

  /* This is to prevent a flicker from view changing before dialog can finish closing */
  useEffect(() => {
    if (open) { setView("selectFile"); setOpenDialog(true); }
    else setOpenDialog(false);
  }, [open]);

  const submitForm = async () => {
    try {
      await ResourceService.update(fileId!, {
        name: fileName,
        description: fileDescription,
        firstName: props.firstName ? props.firstName : "",
        username: props.username ? props.username : "",
        grades: grades,
        isPublic: isPublic,
        approved: props.admin
      });
    } catch (e) {
      setView("error");
    }
    if (!isPublic) {
      bc.postMessage({name: fileName, description: fileDescription, firstName: props.firstName ? props.firstName : "", username: props.username ? props.username : "",
        grades: grades, isPublic: isPublic,});
    }
    setView("done");
  }

  const cancelUpload = async () => {
    if (fileId) {
      // Q for UX: Wait for deletion and display feedback before closing? If yes, add await here.
      try {
        await ResourceService.delete(fileId);
      } catch (e) {
        setView("error");
      }
    }

    handleClose();
  }

  const FileTypeTooltip = withStyles({
    tooltip: {
      fontSize: '16px',
      padding: '13px 20px',
      minWidth: 468,
      textAlign: 'center',
      backgroundColor: Colors.GRAY_900,
      marginLeft: 22,
      marginRight: 0,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        marginLeft: 18,
        minWidth: 400,
        padding: '12px 16px',
      },
      [theme.breakpoints.down(650)]: {
        minWidth: 'calc(100vw - 250px)',
      },
      [theme.breakpoints.down('xs')]: {
        margin: '14px 0 14px 11.3px',
        minWidth: 'calc(100vw - 31.5px)',
      }
    },
    arrow: {
      fontSize: 28,
      color: Colors.GRAY_900,
      [theme.breakpoints.down('sm')]: {
        fontSize: 22,
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
        left: '95px !important',
      }
    }
  })(Tooltip);

  const selectFile = () => {
    return (
      <>
        <CustomToolTip title={`Go back to the dashboard.`} placement={ "left" } arrow open={tooltip} smallScreenMargins={"62px"} >
          <IconButton edge="start" aria-label="close" className={classes.closeButton} onClick={handleClose} onTouchStart={handleClose}>
            <CloseIcon style={{color: styleSettings.copyCol}} shrink={isSmallScreen}/>
          </IconButton>
        </CustomToolTip>
        <DialogContent className={classes.dialogContent}>
          <Button {...getRootProps()} className={classes.uploadArea}>
            <input {...getInputProps()} multiple={false} accept="application/pdf" />
            <UploadIcon className={classes.uploadIcon} />
          </Button>
          <DialogContentText id="error-dialog-description" 
          style={{fontSize: mobileView ? 16 : 18,}}>
            Select a pdf file from your device or drag it here. The largest upload size is 2 megabytes.
            <br />
            <br />
            After review, public uploads will be available to all students and teachers at your school. Private uploads will be visible only to you.
          </DialogContentText>
          <DialogActions className={classes.actions}>
            <Button {...getRootProps()} className={classes.actionButton}
            style={{width: isSmallScreen ? "100%" : "", height: isSmallScreen ? 40 : "", marginTop: mobileView ? 8 : ""}}>
              <input {...getInputProps()} multiple={false} accept="application/pdf" />
              Choose a file
            </Button>
          </DialogActions>
        </DialogContent>
      </>
    )
  }

  const uploadProgress = () => {
    return (
      <DialogContent className={classes.progressDialogContent}>
        <Typography variant="h4" className={classes.title}>
          Uploading your file
        </Typography>
        <Box minWidth={35} textAlign="left" mt={4.5} mb={1.5}>
          <Typography variant="body2" color="textPrimary" className={classes.filename}>
            {file?.name}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1} mb={1.5}>
            <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />
          </Box>
        </Box>
        <Box minWidth={35} textAlign="left">
          <Typography variant="body2" color="textPrimary">
            {progress}% Complete
          </Typography>
        </Box>
        <DialogActions>
          <Button className={classes.cancelButton} onClick={() => setShowCancelDialog(true)} 
            style={{width: isSmallScreen ? "100%" : "", height: isSmallScreen ? 40 : "", marginTop: mobileView ? 24 : ""}}>
            Cancel upload
          </Button>
        </DialogActions>
      </DialogContent>
    );
  }

  const uploadForm = () => {
    return (
      <DialogContent className={classes.formDialogContent}>
        {mobileView && <CheckCircleIcon className={classes.checkmarkIcon} />}
        <Box display="flex" alignItems="center">
          {!mobileView && <CheckCircleIcon className={classes.checkmarkIcon} />}
          <Typography variant="h4" className={classes.formTitle}>
            Your file has been uploaded.
          </Typography>
        </Box>
        <Typography variant="body1" className={classes.formDescription}>
          Please fill out this form. All fields are mandatory.
        </Typography>
        <form autoComplete="off" className={classes.form}>
          <FormControl fullWidth className={classes.formInput}>
            <InputLabel htmlFor="file-name-input" shrink variant="outlined" className={classes.inputLabel}>Give a name to this file</InputLabel>
            <OutlinedInput
              id="file-name-input"
              aria-describedby="file-name-helper-text"
              placeholder="File name"
              inputProps={{ className: classes.formInputInput }}
              value={fileName}
              onChange={(e) => setFileName(e.target.value.slice(0, 70))}
            />
            <FormHelperText id="file-name-helper-text" className={classes.helperText}>{fileName.length} / 70</FormHelperText>
          </FormControl>
          <FormControl fullWidth className={classes.formInput}>
            <InputLabel htmlFor="file-description-input" shrink variant="outlined" className={classes.inputLabel}>Add a short description to this file</InputLabel>
            <OutlinedInput
              id="file-description-input"
              aria-describedby="file-description-helper-text"
              placeholder="Write a description here about your file. This will help you or your students understand what to expect in the file."
              multiline className={classes.outlinedInput}
              rows={isSmallScreen ? 3 : 2}
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value.slice(0, 114))}
            />
            <FormHelperText id="file-description-helper-text" className={classes.helperText}>{fileDescription.length} / 114</FormHelperText>
          </FormControl>
          <FormControl style={{ width: isSmallScreen ? "100%" : 418, marginBottom: 24 }} className={`${classes.formInput} ${classes.classSelector}`}>
            <InputLabel htmlFor="file-grade-select" shrink variant="outlined" className={classes.inputLabel}>Select the classes that this file is for</InputLabel>
            <Autocomplete
              multiple
              options={gradeOptions}
              disableCloseOnSelect
              disablePortal
              openOnFocus
              onChange={(_e, newValue) => setGrades(newValue)}
              getOptionLabel={(option) => option}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                    {selected ?
                      <CheckBoxIcon htmlColor={Colors.BLUE_200} style={{ marginRight: 8, }} /> :
                      <CheckBoxOutlineBlankIcon htmlColor={Colors.BLUE_200} style={{ marginRight: 8,  }} />
                    }
                  {option}
                </React.Fragment>
              )}
              style={{ width: isSmallScreen ? "100%" : 500 }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder={grades.length ? "" : "Select classes(s)"} />
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
          </FormControl>
          <FormControl style={{ width: isSmallScreen ? "100%" : 418, marginBottom: isPublic? 24 : 0 }} className={classes.formInput}>
            <InputLabel
              htmlFor="file-privacy-select"
              shrink variant="outlined"
              className={classes.inputLabel}
            >
              Type of file
              <FileTypeTooltip
                title={`
                  A "Public" file will appear under the 'Additional Study Materials' page,
                  which is accessible to students and other teachers.
                  A "Private" document is only visible to you and will appear in your Teacher Dashboard.
                `}
                placement={isSmallScreen ? "bottom" : "right"}
                arrow
              >
                <InfoIcon className={classes.infoIcon} />
              </FileTypeTooltip>
            </InputLabel>
            <Select
              id="file-privacy-select"
              aria-describedby="file-privacy-helper-text"
              defaultValue="private"
              variant="outlined"
              onChange={(e) => setIsPublic(e.target.value === "public")}
              inputProps={{ className: classes.formInputInput }}
              MenuProps={{
                style: { zIndex: 1302 },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left" 
                },
                getContentAnchorEl: null
              }}
            >
              <MenuItem value="public" className={classes.menuItem}>Public</MenuItem>
              <MenuItem value="private" className={classes.menuItem}>Private</MenuItem>
            </Select>
          </FormControl>
        </form>
        <DialogActions className={classes.formActions}>
          {!isSmallScreen && <Button
            className={classes.cancelButton}
            style={{ width: 197 }}
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel upload
          </Button>}
          <Button
            disabled={!fileName.trim() || !fileDescription.trim() || (grades.length === 0)}
            className={classes.actionButton}
            style={{ width: isSmallScreen ? "100%" : 197, marginTop: isSmallScreen ? 24 : 32 }}
            onClick={submitForm}
          >
            Submit
          </Button>
          {isSmallScreen && <Button
            className={classes.cancelButton}
            style={{ width: "100%", marginLeft: 0, marginTop: 12 }}
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel upload
          </Button>}
        </DialogActions>
      </DialogContent>
    );
  }

  const errorDialog = () => (
    <DialogContent className={classes.errorContent}>
      <RedErrorPaper className={classes.errorIcon} />
      <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose} onTouchStart={handleClose}>
        <CloseIcon shrink={isSmallScreen}/>
      </IconButton>
      <DialogTitle disableTypography>
        <Typography variant="h5" className={classes.errorTitle}>We are sorry!</Typography>
      </DialogTitle>
      <DialogContentText id="error-dialog-description" color="primary" style={{fontSize: isSmallScreen ? 16 : 18}}>
        {fileError1}
      </DialogContentText>
      <DialogContentText className={classes.noticeText} color="primary">
        {fileError2}
      </DialogContentText>
      <DialogActions className={classes.noticeActions}>
        <Button
          onClick={() => {
            setFile(null);
            setFileId(null);
            setProgress(0);
            setView("selectFile");
          }}
          className={`${classes.actionButton} ${classes.noticeActionButton}`}
          style={{width: isSmallScreen ? "100%" : "", height: isSmallScreen ? 40 : "", marginTop: mobileView ? "" : 22}}
        >
          Try again
        </Button>
      </DialogActions>
    </DialogContent>
  );

  const thankYouDialog = () => (
    <DialogContent className={classes.thankYouContent}>
      <ThankYouPaper className={classes.thankYouIcon} />
      <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose} onTouchStart={handleClose}>
        <CloseIcon shrink={isSmallScreen}/>
      </IconButton>
      <Typography variant="h4" className={classes.thankYouTitle}>Thank you!</Typography>
      <DialogContentText className={classes.noticeText} color="primary">
        {isPublic ? "Your file has been successfully uploaded and is pending approval from your school administrator. Once approved, you will receive a notification and your file will be visible to students and other teachers in your school’s location."
        : 'Your file is now private and only visible to you. Your file is located in the teacher dashboard, under the "Teacher Notes" section. Scroll down in the dashboard to find your Teacher Notes.'}
      </DialogContentText>
      <DialogActions className={classes.noticeActions}>
        {/*(isPublic && !isSmallScreen) && <Link {...anchorProps} className={classes.anchor}> 
          <Button onClick={goToResources} className={`${classes.actionButton} ${classes.noticeActionButton}`} 
            style={{width: isSmallScreen ? "100%" : 185, height: isSmallScreen ? "40px" : ""}}>
            Go to resources
          </Button>
        </Link>*/}
        <Button onClick={handleClose} onTouchStart={handleClose} className={`${classes.actionButton} ${classes.noticeActionButton}`} 
          style={{width: isSmallScreen ? "100%" : 185, height: isSmallScreen ? "40px" : ""}}>
          Back to dashboard
        </Button>
      </DialogActions>
      {/*(isPublic && isSmallScreen) && <Link {...anchorProps} className={classes.anchor}> 
        <Button onClick={goToResources} className={`${classes.actionButton} ${classes.noticeActionButton}`} 
          style={{width: isSmallScreen ? "100%" : 185, height: isSmallScreen ? "40px" : ""}}>
          Go to resources
        </Button>
      </Link>*/}
    </DialogContent>
  );

  const cancelDialog = () => (
    <DialogContent className={classes.cancelContent}>
      <DialogContentText className={classes.cancelText} color="primary">
        Are you sure you want to cancel the upload of this file?
      </DialogContentText>
      <DialogActions className={classes.cancelActions}>
        {!isSmallScreen && <Button
          className={classes.destructiveButton}
          onClick={cancelUpload}
        >
          Yes, cancel the upload
        </Button>}
        <Button
          className={classes.cancelButton}
          style={{width: isSmallScreen ? "100%" : "", height: isSmallScreen ? 40 : ""}}
          onClick={() => setShowCancelDialog(false)}
        >
          No, continue uploading
        </Button>
      </DialogActions>
      {isSmallScreen && <Button
          className={classes.destructiveButton}
          style={{width: '100%', marginTop: 12, height: 40}}
          onClick={cancelUpload}
        >
          Yes, cancel the upload
      </Button>}
    </DialogContent>
  );

  const getView = () => {
    switch (view) {
      case "selectFile": return selectFile();
      case "uploading": return uploadProgress();
      case "form": return uploadForm();
      case "done": return thankYouDialog();
      case "error": return errorDialog();
    }
  }

  return (
    <Dialog
      open={openDialog}
      //onClose={handleClose}
      PaperProps={{ className: `${(view === "form") ? classes.formContent : classes.content} ${classes.root}` }}
      style={{ zIndex: 1302, }}
    >
      {showCancelDialog ? cancelDialog() : getView()}
    </Dialog>
  );
}
