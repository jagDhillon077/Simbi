import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useLocation } from 'react-router-dom'

const breakpoint = 860;

const useStyles = makeStyles((theme) => ({
  footer: {
    maxHeight: '228px',
    display: 'flex',
    marginTop: 'auto',
    width: '100%',
    background: 'black',
    justifyContent: 'space-between',
    padding: '60px 72px',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 400,
    [theme.breakpoints.down(1024)]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 36,
      paddingRight: 36
    },
    [theme.breakpoints.down(breakpoint)]: {
      flexDirection: 'column-reverse',
      paddingTop: 44,
      paddingBottom: 40,
      paddingLeft: 36,
      paddingRight: 0,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 24,
      //paddingTop: 220,  this padding for 3 links in footer
    },
    [theme.breakpoints.down(376)]: {
      paddingLeft: 20,
    },
    [theme.breakpoints.down(321)]: {
      paddingLeft: 16,
    },
  },
  links: {
    display: 'flex',
    fontWeight: 700,
    width: 'auto', // when adding back other 2 links, remove this line
    /*
    width: 356,
    justifyContent: 'space-between',
    [theme.breakpoints.down(1024)]: {
      width: 300,
    },
    [theme.breakpoints.down(940)]: {
      width: 356,
    },*/
    [theme.breakpoints.down(breakpoint)]: {
      flexDirection: 'column',
      marginBottom: theme.spacing(3),
    }
  },
  linkItem: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: 'white !important',
    backgroundColor: 'transparent !important',
    [theme.breakpoints.down(breakpoint)]: {
      marginBottom: theme.spacing(1)
    },
    [theme.breakpoints.down('xs')]: {
      paddingBottom: '16px',
    }
  }
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <div>
        &copy; 2022 Simbi Foundation
      </div>
       <div className={classes.links}>
        <Link to="/about" className={classes.linkItem}>
          <div>About</div>
        </Link>
        {/*
        <div className={classes.linkItem}>Terms of use</div>
        <div className={classes.linkItem}>Privacy policy</div>
          */}
      </div> 
    </div>
  );
}
