import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ReduxState } from '../types';
import { setView, loadCategoryModules, loadSearchResults } from "../actions";
import { makeStyles, Typography, Theme, useTheme, Grid, useMediaQuery, } from "@material-ui/core";
import { Display, Module } from '../Data';
import ModuleCard from './Card';
import SecondaryCard from './SecondaryCard';
import PDFCard from './pdfCard';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { useLocation, Link } from 'react-router-dom';
import Colors from '../css/Colors';
import CatagoryPlaceholder, { Type } from './CatagoryPlaceholder';
import { CustomToolTip } from './CustomToolTip';

interface StyleProps {
  curriculumGuides: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    font: 'Roboto Slab',
  },
  leftAlignText: {
    textAlign: 'left',
  },
  textCard: {
    '&&': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  active: {
    fontWeight: 700,
    textDecoration: 'underline',
    color: Colors.TEXT_LINK,
    '&:hover': {
      color: Colors.BLUE_100,
    },
  },
  flexBasis: {
    [theme.breakpoints.down(1310)]: {
      flexBasis: '50%',
      maxWidth: '50%',
    },
    [theme.breakpoints.between('md', 1010)]: {
      flexBasis: (props: StyleProps) => props.curriculumGuides? '50%' : '100%',
      maxWidth: (props: StyleProps) => props.curriculumGuides? '50%' : '100%',
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
      maxWidth: '50%',
    },
    [theme.breakpoints.down(674)]: {
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  firstpdf: {
    '& .MuiCardContent-root': {
      paddingTop: 40,
    },
    '& div': {
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
    },
  },
  lastpdf: {
    '&&': {
      paddingBottom: 32,
    },
    '& div': {
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
  },
  lastMiniCard: {
    '&&': {
      paddingBottom: 32,
    },
  },
  title: {
    margin: '40px 0 24px',
  },
  current: {
    cursor: 'default',
    textDecoration: 'none',
    color: Colors.TEXT_PRIMARY,
    backgroundColor: 'transparent !important',
  },
  hide: {
    visibility: 'hidden'
  },
  dashboardIcon: {
    zIndex: 1001, 
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '6px',
    position:'relative'
  }
}));

const mapDispatchToProps = {
  setView,
  loadCategoryModules,
  loadSearchResults,
}

const mapStateToProps = (state: ReduxState) => ({
  results: state.results,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = {
  curriculumGuides: boolean;
  onboarding: boolean;
  onDoneOnboarding: () => void;
  setDashboardStep: () => void;
} & ConnectedProps<typeof connector>;

const bcPlaceholder = new BroadcastChannel('SubmoduleViewPH');
const bcDisablePlaceholder = new BroadcastChannel('DisablePlaceholder');

function SubmoduleView(props: Props) {
  const location = useLocation();
  const { results, curriculumGuides, onboarding, onDoneOnboarding, setDashboardStep } = props;
  const classes = useStyles({ curriculumGuides });

  const theme = useTheme();
  const centerTooltip = useMediaQuery(theme.breakpoints.down(674));

  const first = results[0];
  const segments = location.pathname.split('/');
  const [placeholder, setPlaceholder] = React.useState(false);
  const [placeholderType, setPlaceholderType] = React.useState(Type.PDF_VIEW);
  const [hideCards, setHideCards] = React.useState(true);
  const [dashboardTooltip, setDashboardTooltip] = React.useState(false);
  //const secondaryCards = document.getElementById("SecCard");
  //const pdfCards = document.getElementById("PDFCard");

  const onPDFSelect = () => {
    if (onboarding) {setDashboardTooltip(true); setDashboardStep();}
  }

  const onGoToDashboard = () => {
    if (dashboardTooltip) onDoneOnboarding();
  }

  const getCardByDisplay = (module: Module, idx: number, arr: Module[]) => {
    switch (module.display) {
      case Display.Primary:
        returnDelay();
        return <Grid item xs={12} sm={6} md={4}><ModuleCard image={module.image} title={module.name} author={module.source} port={module.port} url={module.url} /></Grid>
      case Display.Secondary:
        returnDelay();
        if (module.url === "/curriculum-guides/primary/P2") {
          return <CustomToolTip title={`Select the class level you are looking for.`} placement={ centerTooltip? "top" : "top-start" } arrow open={onboarding} smallScreenMargins={"30px"} > 
            <Grid item xs={12} sm={6} md={4} id='SecCard' className={`${classes.flexBasis} ${idx === arr.length - 1 ? classes.lastMiniCard : ''} ${hideCards ? classes.hide : ''}`}><SecondaryCard image={module.image} title={module.name} author={module.source} port={module.port} url={module.url} index={idx} tooltip={onboarding} /></Grid>
          </CustomToolTip>;
        } else return <Grid item xs={12} sm={6} md={4} id='SecCard' className={`${classes.flexBasis} ${idx === arr.length - 1 ? classes.lastMiniCard : ''} ${hideCards ? classes.hide : ''}`}><SecondaryCard image={module.image} title={module.name} author={module.source} port={module.port} url={module.url} index={idx} /></Grid>;
      case Display.Text:
        returnDelay();
        if (module.url === "/modules/en-guides/primary/P2/Introduction _ Themes - P2.pdf") {
          return <Grid item xs={12} sm={12} md={12} id='PDFCard' className={`${classes.textCard} ${idx === 0 ? classes.firstpdf : ''} ${idx === arr.length - 1 ? classes.lastpdf : ''} ${hideCards ? classes.hide : ''}`}><PDFCard image={module.image} title={module.name} author={module.source} port={module.port} url={module.url} onClick={onPDFSelect} tooltip={onboarding && !dashboardTooltip}/></Grid>;
        } else return <Grid item xs={12} sm={12} md={12} id='PDFCard' className={`${classes.textCard} ${idx === 0 ? classes.firstpdf : ''} ${idx === arr.length - 1 ? classes.lastpdf : ''} ${hideCards ? classes.hide : ''}`}><PDFCard image={module.image} title={module.name} author={module.source} port={module.port} url={module.url} /></Grid>
    }
  }

  const returnDelay = () => {
    setTimeout(async () => {
      setHideCards(false);
    }, 90)
  }

  /*const setCardDisplay = () => {
    if(secondaryCards) {
      secondaryCards.style.display = 'none';
    }
    if(pdfCards) {
      pdfCards.style.display = 'none';
    }
  }*/

  React.useEffect(() => {
    bcDisablePlaceholder.onmessage = event => { setHideCards(true); setPlaceholder(false); }
    bcPlaceholder.onmessage = event => { /*setCardDisplay();*/ setPlaceholder(true); setPlaceholderType(event.data);}
  }, []);

  return (
    <Grid container spacing={4}>
      {placeholder ? <CatagoryPlaceholder type={placeholderType} ></CatagoryPlaceholder> : <>
      <Grid item xs={12} sm={12} md={12} className={classes.leftAlignText}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {curriculumGuides && (
            <CustomToolTip
            title={`Go back to the dashboard.`}
            placement={ "bottom-start" }
            arrow
            open={dashboardTooltip}
          >
            <Link className={`${dashboardTooltip? classes.dashboardIcon : '' } ${classes.active} `} to={"/teacher-portal"} onClick={onGoToDashboard}> 
            {"Dashboard"} </Link>
          </CustomToolTip> 
          )}
          <Link className={classes.active} to={segments.slice(0, 2).join('/')}>
            {results[0].source}
          </Link>
          <Link className={!first.parent_module?.parent_module ? classes.current : classes.active} to={segments.slice(0, 3).join('/')}>
            {first.parent_module?.parent_module?.name || first.parent_module?.name}
          </Link>
          {first.parent_module?.parent_module && (
            <Link className={first.parent_module?.parent_module ? classes.current : classes.active} to={segments.slice(0, 4).join('/')}>
              {first.parent_module?.name}
            </Link>
          )}
        </Breadcrumbs>
        <Typography variant="h4" className={classes.title}>{first.parent_module?.parent_module && first.parent_module.parent_module.name + ': '} {first.parent_module?.name}</Typography>
      </Grid>
      {results.map(getCardByDisplay)}
      </>}
        
    </Grid>
  );
}

export default connector(SubmoduleView);
