import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    font: 'Roboto Slab',
  },
  background: {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(/images/404.jpg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      backgroundSize: '140vw 100vh',
      backgroundPosition: 'top',
    },
    [theme.breakpoints.down(500)]: {
      backgroundSize: '140vw 94vh',
    },
    [theme.breakpoints.down(470)]: {
      backgroundSize: '150vw 89vh',
    },
    [theme.breakpoints.down(440)]: {
      backgroundSize: '155vw 86vh',
    },
    [theme.breakpoints.down(420)]: {
      backgroundSize: '160vw 81vh',
      backgroundRepeat: 'repeat',
    },
    [theme.breakpoints.down(400)]: {
      backgroundSize: '165vw 79vh',
    },
    [theme.breakpoints.down(370)]: {
      backgroundSize: '165vw 76vh',
    },
    [theme.breakpoints.down(350)]: {
      backgroundSize: '170vw 74vh',
    },
  },
  container: {
    background: 'rgba(42, 39, 60, 0.87)',
    borderRadius: 10,
    margin: '65vh auto 0px auto',
    width: '55%',
    minWidth: 500,
    '& > *': {
      padding: '16px 24px',
      paddingBottom: 0,
    },
    [`& h6`]: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [`& h6, p`]: {
      color: 'white !important'
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 'unset',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      fontSize: 14,
      background: 'rgba(42, 39, 60, 1)',
      borderRadius: '100%/100px 100px 0 0',
    }
  },
  button: {
    color: 'black',
    backgroundColor: 'white', 
    width: '38%',
    minWidth: 200,
    height: 55,
    padding: 0,
    margin: 24,
    borderRadius: 8,
    border: '2px solid black',
    fontSize: 17,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.80)', 
    },
  },
  errorCode: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(30px, -58px)',
  }
}));

function PageNotFound() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.background}>
      <div className={classes.container}>
        <Typography variant="h6">PAGE NOT FOUND</Typography>
        <Typography variant="body2">
          It looks like the page you're looking for went through the clouds and got lost in the 404 space! 
          But don't worry!
          There are still several Simbi Learn Cloud pages you can browse for your learning.
        </Typography>
        <Button className={classes.button} onClick={() => history.push('/')}>Back to home</Button>
      </div>
    </div>
  );
}

export default PageNotFound;
