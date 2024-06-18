import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { useMediaQuery } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import { RedErrorPaper } from './icons/ErrorPaper';
import { ThankYouPaper } from './icons/ThankYouPaper';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from './icons/CloseIcon';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'black',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    color: 'white',
    width: 147,
    height: 55,
    float: 'right',
    '&:hover': {
      backgroundColor: '#222222',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  icon: {
    margin: '1rem 0'
  },
  content: {
    maxWidth: 700,
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
  }
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  handleActionButtonClick: () => void;
  contentText: string;
}

export default function ErrorDialog(props: Props) {
  const classes = useStyles();
  const { open, handleClose, handleActionButtonClick } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      PaperProps={{ className: classes.content }}
    >
      <DialogContent>
        <RedErrorPaper className={classes.icon} />
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          <CloseIcon shrink={isSmallScreen}/>
        </IconButton>
        <DialogContentText id="error-dialog-description">
          We're having trouble submitting data to our server. This isn't your fault.
        </DialogContentText>
        <DialogContentText>
          Please click "Try again". If this problem persists, please contact your school's administrator, who
          will be able to contact Simbi Foundation for support.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleActionButtonClick} className={classes.button}>
          Try again
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ThankYouDialog(props: Props) {
  const classes = useStyles();
  const { open, handleClose, handleActionButtonClick, contentText } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ className: classes.content }}
    >
      <DialogContent>
        <ThankYouPaper className={classes.icon} />
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          <CloseIcon shrink={isSmallScreen}/>
        </IconButton>
        <DialogTitle>
          Thank You!
        </DialogTitle>
        <DialogContentText>
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleActionButtonClick} className={classes.button}>
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
