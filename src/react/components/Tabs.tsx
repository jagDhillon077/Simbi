import React from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Colors from '../css/Colors';

interface StyledTabProps {
  label: string;
  value: string;
}

interface Props {
  onTabChange: (grades: string[]) => void;
  size: number;
}

const AntTabs = withStyles({
  root: {
    //"& :first-child": {
    //  paddingLeft: 0
    //}
  },
  indicator: {
    backgroundColor: Colors.TEAL_200,
    height: 6,
    borderRadius: 2,
    zIndex: 1,
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 100,
      // fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontSize: 16,
      fontFamily: 'Roboto Slab',
      [theme.breakpoints.down('sm')]: {
        fontSize: 14,
      },
      '&:hover': {
        // fontWeight: theme.typography.fontWeightMedium,
      },
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    selected: {
      // fontWeight: theme.typography.fontWeightMedium, 
    }
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      marginRight: -16,
      marginLeft: -16,
    },
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  test: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: Colors.GRAY_600,
    left: 0,
    bottom: 2,
  }
}));

export default function CustomizedTabs(props: Props) {
  const classes = useStyles();
  const [value, setValue] = React.useState<string>("All");

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    if (newValue !== 'All') {
      props.onTabChange(newValue.split(', '));
    } else {
      props.onTabChange([]);
    }
    setValue(newValue);
  };

  const allLabel = (value === "All") ? "All ("+props.size+")" : "All";
  const prePrimaryLabel = (value === "Pre-primary") ? "Pre-primary ("+props.size+")" : "Pre-primary";
  const p1p3Label = (value === "P1, P2, P3") ? "P1 - P3 ("+props.size+")" : "P1 - P3";
  const p4p7Label = (value === "P4, P5, P6, P7") ? "P4 - P7 ("+props.size+")" : "P4 - P7";
  const s1s4Label = (value === "S1, S2, S3, S4") ? "S1 - S4 ("+props.size+")" : "S1 - S4";
  const s5s6Label = (value === "S5, S6") ? "S5 - S6 ("+props.size+")" : "S5 - S6";
  const postSecLabel = (value === "Post-secondary") ? "Post-secondary ("+props.size+")" : "Post-secondary";

  return (
    <div className={classes.root}>
      <AntTabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="on">
        <AntTab label={allLabel} value="All" />
        <AntTab label= {prePrimaryLabel} value="Pre-primary" />
        <AntTab label={p1p3Label} value="P1, P2, P3" />
        <AntTab label={p4p7Label} value="P4, P5, P6, P7" />
        <AntTab label={s1s4Label} value="S1, S2, S3, S4" />
        <AntTab label={s5s6Label} value="S5, S6" />
        <AntTab label={postSecLabel} value="Post-secondary" />
      </AntTabs>
      <span className={classes.test} />
    </div>
  );
}