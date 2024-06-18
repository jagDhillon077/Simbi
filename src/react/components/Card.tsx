
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { CardProps } from '../types';
import { getAnchorProps } from '../../helpers';
import { Link } from 'react-router-dom';
import Colors from '../css/Colors';
import { BACKEND_URL } from '../../services';
import { Calculate } from '@mui/icons-material';

const PICTURE_HEIGHT = '186px';

interface StyleProps {
	fontSize: number | number[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 288,
    minWidth: 288,
    height: 312,
    textAlign: 'left',
    [theme.breakpoints.down(668)]: {
      maxWidth: '100%',
      minWidth: 475,
    },
    [theme.breakpoints.down('xs')]: {
      [`& div p`]: {
        fontSize: (props: StyleProps) => `calc(14px + calc(${props.fontSize}px / 25))`,
      }
    },
    [theme.breakpoints.down(550)]: {
      maxWidth: '100%',
      minWidth: 'unset',
    },
    [theme.breakpoints.down(340)]: {
      maxWidth: 'calc(100vw - 40px)',
    },
    [theme.breakpoints.down(330)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 20px 0px 16px',
    },
    [theme.breakpoints.down(321)]: {
      maxWidth: 'calc(100vw - 32px)',
    },
  },
  withoutMasterMenu: {
    margin: '0px 32px 0px 0px',
    [theme.breakpoints.down(752)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.down(336)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 20px 0px 0px',
    },
    [theme.breakpoints.down(688)]: {
      maxWidth: '100%',
      minWidth: 545,
    },
    [theme.breakpoints.down(590)]: {
      minWidth: 'unset',
    },
  },
  regularView: {
    margin: '0px 16px 0px',
    [theme.breakpoints.between(1303, 1439)]: { // padding removed from cards to make cards fit withing specific breakpoints 
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.between(995, 1059)]: {  // padding removed from cards to make cards fit withing specific breakpoints 
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.between('md', 995)]: {
      maxWidth: '100%',
      minWidth: 475,
    },
    [theme.breakpoints.between(668, 734)]: {   // padding removed from cards to make cards fit withing specific breakpoints
      margin: '0px 0px 0px',
    },
    [theme.breakpoints.down(460)]: {
      margin: '0px 0px 0px',
    },
  },
  media: {
    height: PICTURE_HEIGHT,
  },
  action: {
    height: '100%',
  },
  text: {
    height: `calc(100% - ${PICTURE_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [`& h2:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
    [`& p:first-of-type`]: {
			color: Colors.TEXT_SECONDARY
		},
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '28px',
    margin: 'auto 0',
    fontFamily: 'Roboto Slab !important',
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px',
      lineHeight: '24px'
    },
  },
}));

export default function ModuleCard(props: CardProps) {
  const { tooltip, } = props;
  const fontSize = (props.fontSize)? props.fontSize : 0;
  const classes = useStyles({fontSize});
  const anchorProps = getAnchorProps(props.port, props.url);

  return (
    <Card  className={`${classes.root} ${props.guidesPageView ? classes.withoutMasterMenu : classes.regularView}`} style={{zIndex: tooltip ? 1001 : '', position: 'relative',}}>
      <Link {...anchorProps} className={classes.anchor}>
        <CardActionArea className={classes.action}>
          <CardMedia
            className={classes.media}
            image={props.image ? `${BACKEND_URL}/assets${props.image}` : '/images/master_illustration.jpg'}
          />
          <CardContent className={classes.text}>
            <Typography variant="h6" component="h2" className={classes.title}>
              {props.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{marginTop: 14}}>
              {`By ${props.author}`}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
