import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { CardActionArea } from '@material-ui/core';
import { CardProps } from '../types';
import { getAnchorProps } from '../../helpers';
import { Link } from 'react-router-dom';
import Colors from '../css/Colors';
import { BACKEND_URL } from '../../services';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 32,
    borderRadius: 0,
    alignItems: 'center',
    backgroundColor: Colors.MAIN_WHITE,
    boxShadow: 'none',
    '&:hover': {
      // Offsets the added width/height from the border
      paddingLeft: 31,
      paddingBottom: 31,
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
        paddingBottom: 15,
        alignItems: 'left',
      },
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0 16px 1px',
      alignItems: 'start',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    [`& h6:first-of-type, p:first-of-type`]: {
			color: Colors.TEXT_PRIMARY,
      fontFamily: 'Roboto Slab',
		},
    [theme.breakpoints.down('xs')]: {
      padding: '16px 0 0 !important',

      [`& h6:first-of-type`]: {
        fontSize: '18px',
      },
    },
  },
  cover: {
    marginRight: '32px',
    width: 209,
    height: 130,
    paddingRight: '209px',
    [theme.breakpoints.down('xs')]: {
      width: 288,
      height: 186,
      paddingRight: 0,
      marginRight: 0
    },
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
  subtitle: {
    fontFamily: 'Roboto Slab',
    fontSize: '16px !important',
    fontWeight: 500,
    marginBottom: 8,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 4,
      fontSize: '14px !important',
    },
  }
}));

export default function ResultCard(props: CardProps) {
  const classes = useStyles();
  const anchorProps = getAnchorProps(props.port, props.url);

  return (
    <Link {...anchorProps} className={classes.anchor}>
      <CardActionArea>
        <Card style={{ height: '100%' }} className={classes.root}>
          <CardMedia
            className={classes.cover}
            image={props.image ? `${BACKEND_URL}/assets${props.image}` : "/images/master_illustration.jpg"}
            title="Live from space album cover"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="subtitle2" component="p" className={classes.subtitle}>
                {props.author.toUpperCase()}
              </Typography>
              <Typography variant="h6" >
                {props.title}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </CardActionArea>
    </Link>
  );
}
