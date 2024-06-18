import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, useMediaQuery, IconButton, Dialog, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
//import CloseIcon from '@material-ui/icons/Close';
import CloseIcon from './icons/CloseIcon';
import { ErrorPaper } from './icons/ErrorPaper';

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
    color: theme.palette.grey[500],
  },
  errorIcon: {
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
  handleRetry: () => void;
}

export default function ErrorDialog(props: Props) {
  const classes = useStyles();
  const { open, handleClose, handleRetry } = props;
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
        <ErrorPaper className={classes.errorIcon} />
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
        <Button onClick={handleRetry} className={classes.button}>
          Try again
        </Button>
      </DialogActions>
    </Dialog>
  );
}
