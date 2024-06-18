import { Tooltip, withStyles } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Colors from '../css/Colors';

export interface WithStyleProps {
    smallScreenMargins?: string;
    posTopMarginTop?: number;
    posBotMarginBottom?: string;
    arrowLeftPosition?: number;
    arrowLeftPositionXS?: number;
}

// Creating a customly styled tool tip with animation
export const CustomToolTip = withStyles((theme) => ({
    "@keyframes bouncing": {
      "0%": { transform: "translateY(-30%)" },
      "50%": { transform: "translateY(30%)" },
      "100%": { transform: "translateY(-30%)" },
    },
    "@keyframes bottomBouncing": {
      "0%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(40px)" },
      "100%": { transform: "translateY(0px)" },
    },
    "@keyframes topBouncing": {
      "0%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(-40px)" },
      "100%": { transform: "translateY(0px)" },
    },
    "@keyframes leftBouncing": {
        "0%": { transform: "translateX(0px)" },
        "50%": { transform: "translateX(-40px)" },
        "100%": { transform: "translateX(0px)" },
    },
    "@keyframes rightBouncing": {
        "0%": { transform: "translateX(0px)" },
        "50%": { transform: "translateX(40px)" },
        "100%": { transform: "translateX(0px)" },
    },
    popper: {
      '&[x-placement*="bottom"]': { // Adds css for placements bottom, bottom-end, bottom-start
        //: (props: WithStyleProps) => props.marginTopPlacementBottom ? props.marginTopPlacementBottom : "",
      },
      '&[x-placement*="top"]': { // Adds css for placements top, top-end, top-start
        top: (props: WithStyleProps) => props.posTopMarginTop ? `${props.posTopMarginTop}px !important` : "",
      },
      '&[x-placement*="top"] .MuiTooltip-arrow': { // Removes arrow gap when animating on top
        bottom: 1,
      },
      '&[x-placement*="bottom"] .MuiTooltip-arrow': { // Removes arrow gap when animating on bottom
        top: 1,
      },
      '&[x-placement*="right"] .MuiTooltip-arrow': { // Removes arrow gap when animating on right
        left: 1,
      },
      '&[x-placement*="left"] .MuiTooltip-arrow': { // Removes arrow gap when animating on left
        right: 1,
      },
    },
    tooltip: {
      fontSize: '20px',
      fontWeight: 600,
      padding: '13px 20px',
      minWidth: 530,
      textAlign: 'center',
      backgroundColor: Colors.BLUE_200,
      fontFamily: 'Roboto Slab',
  
      animation: `$bouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`, // Default animation
      '&.MuiTooltip-tooltipPlacementBottom': {
        animation: `$bottomBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
      },
      '&.MuiTooltip-tooltipPlacementTop': {
        animation: `$topBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
      },
      '&.MuiTooltip-tooltipPlacementLeft': {
        animation: `$leftBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
      },
      '&.MuiTooltip-tooltipPlacementRight': {
        animation: `$rightBouncing 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
      },
  
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        minWidth: 460,
        padding: '12px 16px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '16px',
        margin: '0',
        minWidth: (props: WithStyleProps) => props.smallScreenMargins ? `calc(100vw - ${props.smallScreenMargins} - ${props.smallScreenMargins})` : 'calc(100vw - 31.5px)',
      }
    },
    arrow: {
      fontSize: 28,
      color: Colors.BLUE_200,
      [theme.breakpoints.only('sm')]: {
        fontSize: 22,
      },
      [theme.breakpoints.up('sm')]: {
        left: (props: WithStyleProps) => props.arrowLeftPosition? `${props.arrowLeftPosition}px !important` : ``,
      },
      [theme.breakpoints.between(376, 'sm')]: {
        left: (props: WithStyleProps) => props.arrowLeftPositionXS? `${props.arrowLeftPositionXS}px !important` : ``,
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
      },
    }
  }))(Tooltip);