import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { ErrorPaper } from './icons/ErrorPaper';
import Colors from '../css/Colors';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: Colors.GREEN_200,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.GREEN_200,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 32,
    maxWidth: '74%',
    [theme.breakpoints.down('sm')]: {
      display: 'table',
      padding: '40px 36px 0',
      maxWidth: 'unset',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '40px 16px 0',
    }
  },
  button: {
    backgroundColor: 'black',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
    color: 'white',
    width: 174,
    height: 55,
    '&:hover': {
      backgroundColor: '#222222',
    },
    display: 'table',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: 255,
      height: 40,
    }
  },
  flex: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center',
    textAllign: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  },
  errorIcon: {
    marginTop: -24,
    [theme.breakpoints.down('sm')]: {
      display: 'table',
      margin: '0 auto',
    }
  },
  heading: {
    color: Colors.TEXT_PRIMARY,
    fontSize: '30px',
    lineHeight: '40px',
    textAlign: 'left',
    paddingBottom: 32,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: '22px',
      lineHeight: '32px',
      paddingBottom: 16,
    }
  },
  mobileErrorIcon: {
    justifyContent: 'center',
    marginLeft: '85px',
  },
  errorText: {
    color: Colors.TEXT_PRIMARY,
    textAlign: 'left',
    fontSize: '18px',
    paddingBottom: 32,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: '16px',
      lineHeight: '23px',
    }
  },
  errorText2: {
    color: Colors.TEXT_PRIMARY,
    textAlign: 'left',
    fontSize: '18px',
    paddingBottom: '64px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: '16px',
      lineHeight: '23px',
      paddingBottom: 32,
    }
  }
}));

function ErrorFallback() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.flex}>
        <ErrorPaper className={classes.errorIcon} />
        <div className={classes.container}>
          <Typography variant="h4" className={classes.heading}>This page is having a problem loading</Typography>
          <Typography className={classes.errorText} variant="body1">
            Don't worry, you didn't do anything wrong! Our system is having some issues at the moment.
            You can try clicking the 'reload' button below or please try coming back later.
          </Typography>
          <Typography className={classes.errorText2} variant="body1">
            If this problem persists, please contact your school's administrator, who will be able to
            contact Simbi Foundation for support.
          </Typography>
          <Button className={classes.button} onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
