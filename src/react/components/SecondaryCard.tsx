import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import { getAnchorProps } from '../../helpers';
import { CardProps } from '../types';
import { Link } from 'react-router-dom';
import * as AFS from './icons/cardIcons/AfricanStorybooks';
import * as CK12 from './icons/cardIcons/CK12';
import Colors from '../css/Colors';

interface ColorIcon {
  color: string;
  icon: JSX.Element;
}

const cardColors = [Colors.GREEN_200, Colors.YELLOW_300, Colors.BLUE_100, Colors.LIGHT_ORANGE_200, Colors.ORANGE_300]

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    minWidth: 300,
    height: 122,
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    padding: '20px 24px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingRight: 16,
    width: '50%',
    [`& h6:first-of-type`]: {
			color: Colors.TEXT_PRIMARY
		},
  },
  cover: {
    display: 'flex',
    justifyContent: 'center',
  },
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  }
}));

const getColorIcon = (title: string, index?: number): ColorIcon => {
  switch (title) {
    case 'First words':
      return {
        color: Colors.GREEN_200,
        icon: <AFS.FirstWordsIcon />
      };
    case 'First sentences':
      return {
        color: Colors.YELLOW_300,
        icon: <AFS.FirstSentencesIcon />,
      };
    case 'First paragraphs':
      return {
        color: Colors.BLUE_100,
        icon: <AFS.FirstParagraphsIcon />, 
      };
    case 'Longer paragraphs':
      return {
        color: Colors.LIGHT_ORANGE_200,
        icon: <AFS.LongerParagraphsIcon />, 
      };
    case 'Read aloud':
      return {
        color: Colors.ORANGE_300,
        icon: <AFS.ReadAloudIcon />, 
      };
    case 'Textbook':
      return {
        color: Colors.BLUE_100,
        icon: <CK12.TextbookIcon />, 
      };
    case 'Workbook':
      return {
        color: Colors.GREEN_200,
        icon:  <CK12.WorkbookIcon />, 
      };
    case 'Tests':
      return {
        color: Colors.YELLOW_300,
        icon: <CK12.TestsIcon />, 
      };
  }

  if (index) {
    return {
      color: cardColors[index % cardColors.length],
      icon: <CK12.TextbookIcon />,
    };
  } else {
    return {
      color: Colors.GREEN_200,
      icon: <CK12.TextbookIcon />,
    };
  }
}

const getIconBasis = (author: string) => {
  if (author === 'African Storybooks') {
    return '40%';
  }
  if (author === 'CK-12 Textbooks') {
    return '30%';
  }
}

export default function SecondaryCard(props: CardProps) {
  const classes = useStyles();
  const anchorProps = getAnchorProps(props.port, props.url);
  const colorIcon = getColorIcon(props.title, props.index);

  return (
    <Card style={{ backgroundColor: colorIcon.color, zIndex: props.tooltip ? 1001 : '', position: 'relative'}}>
      <Link {...anchorProps} className={classes.anchor}>
        <CardActionArea className={classes.root}>
          <CardContent className={classes.content}>
            <Typography variant="h6">
              {props.title}
            </Typography>
          </CardContent>
          {/* <CardMedia
            className={classes.cover}
            image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
          /> */}
          <div className={classes.cover} style={{ flexBasis: getIconBasis(props.author) }}>
            {colorIcon.icon}
          </div>
        </CardActionArea>
      </Link>
    </Card>
  );
}
