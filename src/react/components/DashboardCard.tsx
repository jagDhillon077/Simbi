import React from 'react';
import { makeStyles, Typography, useTheme, Card, CardActionArea, CardContent, Badge } from "@material-ui/core";
import Backdrop from '@mui/material/Backdrop';
import { getAnchorProps } from '../../helpers';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-router-dom';
import { CustomToolTip } from './CustomToolTip';
import Colors from '../css/Colors';

interface Props {
  title: string;
  url: string;
  description: string;
  linkText: string;
  image: string;
  large?: boolean;
  button?: boolean;
  onClick?: () => void;
  svg?: JSX.Element;
  openTooltip?: boolean;
  tooltipMessage?: string;
}

interface StyleProps {
  large?: boolean;
}

const PICTURE_HEIGHT = 70;

const useStyles = makeStyles((theme) => ({
  root: {
    //display: 'flex',
    flexBasis: (props: StyleProps) => props.large ? 'calc(50% - 12px)' : 'calc(33% - 12px)',
    height: 275,
    textAlign: 'left',
    backgroundColor: Colors.MAIN_WHITE,
    boxShadow: '0px 3px 6px rgba(202, 202, 202, 0.5)',
    borderRadius: 15,
    [`& span`]: {
      width: '100%',
      height: '100%'
    },
    [theme.breakpoints.down(1340)]: {
      flexBasis: (props: StyleProps) => props.large ? 'calc(50% - 13px)' : 'calc(33% - 13px)',
    },
    [theme.breakpoints.down(1177)]: {
      flexBasis: (props: StyleProps) => 'calc(50% - 13px)',
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      height: 300,
    },
    [theme.breakpoints.down(803)]: {
      height: 315,
    },
    [theme.breakpoints.down('xs')]: {
      height: 300,
      flexBasis: (props: StyleProps) => 'calc(100% - 0px)',
    },
    [theme.breakpoints.down(339)]: {
      height: 315,
    },
  },
  media: {
    height: PICTURE_HEIGHT,
    [theme.breakpoints.up('md')]: {
      marginRight: 16,
    },
  },
  action: {
    height: '100%',
    padding: 32,
    [theme.breakpoints.down('sm')]: {
      padding: '22px 16px 24px',
    },
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 0,
    [`& h2:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
    [`& p:first-of-type`]: {
			color: Colors.TEXT_SECONDARY
		},
    [`& a:first-of-type`]: {
			color: Colors.TEXT_LINK
		},
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      height: '100%',
      //display: 'flex'
    },
  },
  title: {
    //height: 64,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '28px !important',
    fontSize: '24px !important',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px !important',
      lineHeight: '24px !important',
      margin: '21px 0 16px'
    },
  },
  link: {
    '&&&': {
      color: Colors.TEXT_LINK,
    },
    fontFamily: 'Roboto Slab',
    fontSize: 18,
    fontWeight: 'bold',
    width: 'fit-content',
    position: 'absolute',
    bottom: '32px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '23px',
      margin: 'auto auto 0',
      bottom: '24px',
      left: 0,
      right: 0,
    },
  },
  description: {
    height: 100,
    fontSize: '16px !important',
    lineHeight: '24px !important',
    letterSpacing: 'normal !important',
    [theme.breakpoints.down('sm')]: {
      height: 80,
      lineHeight: '23px !important',
    },
    [theme.breakpoints.down(803)]: {
      height: 95,
    },
    [theme.breakpoints.down(689)]: {
      height: 115,
    },
    [theme.breakpoints.down('xs')]: {
      height: 80,
    },
    [theme.breakpoints.down(399)]: {
      height: 95,
    },
    [theme.breakpoints.down(339)]: {
      height: 115,
    },
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    [`& svg`]: {
      minWidth: '70px',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      flexDirection: 'column',
    },
  },
  badgeMargin: {
    right: 20,
    top: 20,
    fontSize: 16,
    fontWeight: 600,
    width: '25px !important',
    height: '25px !important',
    borderRadius: 12,
    color: 'white',
    backgroundColor: Colors.BLUE_200
  }
}));

export default function SoftwareCard(props: Props) {
  const theme = useTheme();
  const { title, description, url, linkText, image, large, button, onClick, svg, openTooltip, tooltipMessage} = props;
  const classes = useStyles({ large });
  const anchorProps = getAnchorProps(undefined, url);
  const twoColumns = useMediaQuery(theme.breakpoints.down(1177));
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isGuides = () => { return (title === "Teacher Curriculum Guides"); }
  const isUploads = () => { return (title === "Upload Materials"); }
  const isFeedback =() => { return (title === "Give Feedback to SLC"); }

  const returnContent = () => {
    return (
      <CardContent className={classes.text}>
        <div className={classes.cardTitle}>
          {svg ? svg : <img src={image} className={classes.media} alt="" />}
          <Typography variant="h5" component="h2" className={classes.title} style={{marginLeft: (svg && !mobileView) ? 16 : 0}}>
            {title}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
          {description ? description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.'}
        </Typography>
        {button && (
          <a className={classes.link} style={{textDecoration: 'underline'}}> {linkText} </a>
        )}
        {!button && (
          <Link to={url} className={classes.link}> {linkText} </Link>
        )}
      </CardContent>  
    );
  }
  return (
    <CustomToolTip
      title={tooltipMessage || `Tool tip message`}
      placement={((isGuides() && !twoColumns) || ((isUploads() || isFeedback()) && twoColumns))? "top-end" : isUploads()? "top" : "top-start"}
      arrow
      open={openTooltip || false}
    >
      <Card className={classes.root} style={{zIndex: openTooltip? 1201 : ''}}>
        <Badge
          badgeContent={"!"}
          classes={{ badge: classes.badgeMargin}}
          invisible={!openTooltip}
          > 
          {button && (
            <CardActionArea className={classes.action} onClick={onClick}>
              {returnContent()}
            </CardActionArea>
          )}
          {!button && (
            <CardActionArea className={classes.action}>
              <Link {...anchorProps} className={classes.anchor}>
                {returnContent()}
              </Link>
            </CardActionArea>
          )}
        </Badge>
      </Card>
    </CustomToolTip>
  );
}
