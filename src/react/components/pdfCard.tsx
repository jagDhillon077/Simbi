import React from 'react';
import { makeStyles, useMediaQuery, Card, CardContent, CardMedia, Typography,
 CardActionArea, Theme, useTheme, } from '@material-ui/core';
import { CardProps } from '../types';
import { getAnchorProps } from '../../helpers';
import { Link } from 'react-router-dom';
import Colors from '../css/Colors';
import { CustomToolTip } from './CustomToolTip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 92,
    boxShadow: 'none',
    backgroundColor: Colors.GRAY_50,
    borderRadius: 0,
    '&:hover': {
      backgroundColor: Colors.GRAY_50,
      color: Colors.ORANGE_400,
    }
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flex: '1 0 auto',
    textAlign: 'left',
    alignItems: 'center',
    '&&': {
      paddingTop: 34,
      paddingBottom: 34,
    },
    [`& h6:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
  },
  cover: {
    width: 49,
    height: 60,
    marginLeft: 34,
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
    alignItems: 'center'
  },
  cardButton: {
    height: '100%',
    minHeight: 92,
    '& .MuiCardActionArea-focusHighlight': {
      backgroundColor: Colors.GRAY_50,
    },
  }
}));

export default function PDFCard(props: CardProps) {
  const { onClick, tooltip } = props;
  const classes = useStyles();
  const anchorProps = getAnchorProps(props.port, props.url);

  const theme = useTheme();
  const setTooltipTop = useMediaQuery(theme.breakpoints.down(1032));

  const getCardContent = () => {
    return(<>
    <CardMedia className={classes.imageContainer}>
      <img src="/images/textIcon.png" alt="Text document" className={classes.cover} />
    </CardMedia>
    <div className={classes.details}>
      <CardContent className={classes.content}>
        <Typography variant="h6"> {props.title} </Typography>
      </CardContent>
    </div>
    </>);
  }

  return (
    <Link {...anchorProps} className={classes.anchor}>
      <CardActionArea className={classes.cardButton} onClick={onClick}>
        <Card className={classes.root} style={{zIndex: tooltip ? 1001 : '', position: 'relative'}} >
          {tooltip && 
          <CustomToolTip title={`Click on the resource to open it in a new tab.`} placement={ setTooltipTop? "top-start" : "right" } arrow open={tooltip} smallScreenMargins={"24px"} >
            <div style={{display: 'flex',}}>{getCardContent()}</div>
          </CustomToolTip>}
          {!tooltip && getCardContent()}
        </Card>
      </CardActionArea>
    </Link>
  );
}