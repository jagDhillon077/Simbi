import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { getAnchorProps } from '../../helpers';
import { Link } from 'react-router-dom';
import Colors from '../css/Colors';

interface Props {
  title: string;
  port: string;
  url: string;
  image: string;
  description: string;
  backgroundColor: Colors;
}

interface StyleProps {
  backgroundColor: string;
}

const PICTURE_HEIGHT = '186px';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 300,
    minWidth: 300,
    height: 385,
    textAlign: 'left',
    [theme.breakpoints.down(1530)]: {
      height: 356,
    },
    [theme.breakpoints.down(1102)]: {
      height: 371,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    }
  },
  media: {
    height: PICTURE_HEIGHT,
    backgroundSize: 90,
    backgroundColor: (props: StyleProps) => props.backgroundColor,
  },
  action: {
    height: '100%',
  },
  text: {
    height: `calc(100% - ${PICTURE_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down(1530)]: {
      paddingTop: '2.343vw',
    },
    [`& h2:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
    [`& p:first-of-type`]: {
			color: Colors.TEXT_SECONDARY,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0.01071em'
		},
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
  title: {
    //height: 64,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '28px',
    marginBottom: 6,
    [theme.breakpoints.down(1530)]: {
      marginBottom: 8,
    }
  },
  description: {
    paddingBottom: 38,
  },
}));

export default function SoftwareCard(props: Props) {
  const { backgroundColor, image, title, description, port, url } = props;
  const classes = useStyles({ backgroundColor });
  const anchorProps = getAnchorProps(port, url);

  return (
    <Card className={classes.root}>
      <Link {...anchorProps} className={classes.anchor}>
        <CardActionArea className={classes.action}>
          <CardMedia
            className={classes.media}
            image={image}
          />
          <CardContent className={classes.text}>
            <Typography variant="h6" component="h2" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}