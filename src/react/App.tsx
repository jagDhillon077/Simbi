import './App.css';
import '../react/css/header.css'
import React from 'react';
import ClippedDrawer from './components/ClippedDrawer'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
//import { createTheme } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import ErrorBoundary from './ErrorBoundary';
import Colors from './css/Colors';
import { AccessibilityContentCookies, AccessibilityStyleCookies, ColorSelect } from './components/AccessibilityPage';

import { ReduxState } from './types';
import { connect, ConnectedProps } from 'react-redux';

const mapDispatchToProps = {
}

const mapStateToProps = (state: ReduxState) => {
	return {
		contentSettings: state.contentSettings,
		styleSettings: state.styleSettings,
	}
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const generateTheme = (contentSettings: AccessibilityContentCookies, styleSettings: AccessibilityStyleCookies) => {
  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 614,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            backgroundColor: Colors.MAIN_WHITE,
            color: Colors.TEXT_PRIMARY,
          },
          /*"*::-webkit-scrollbar": {
            width: "65px"
          },
          "*::-webkit-scrollbar-track": {
            background: "#E4EFEF"
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#1D388F61",
            borderRadius: "2px"
          }*/
        }
      },
      MuiButton: {
        root: {
          color: Colors.TEXT_PRIMARY,
        },
        contained: {
          fontFamily: 'Roboto Slab',
          fontWeight: 600,
          textTransform: 'none',
        },
        text: {
          fontFamily: 'Roboto Slab',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
      MuiTypography: {
        h1: {
          fontFamily: 'Lora',
          fontWeight: 700,
        },
        h2: {
          fontFamily: 'Lora',
          fontWeight: 700,
        },
        h3: {
          fontFamily: 'Lora',
          fontWeight: 700,
        },
        h4: {
          fontSize: '2.25rem',
          fontFamily: 'Lora',
          fontWeight: 700,
        },
        h5: {
          fontFamily: 'Lora',
          fontWeight: 700,
        },
        h6: {
          fontFamily: 'Roboto Slab',
          fontWeight: 700,
        },
        subtitle1: {
          fontSize: '1.125rem',
          fontFamily: 'Roboto Slab',
        },
        body1: {
          fontFamily: 'Roboto Slab',
          fontSize: '1.125rem',
        },
        body2: {
          fontFamily: 'Roboto Slab',
          fontSize: '1rem',
        },
        colorTextPrimary: {
          color: (styleSettings && styleSettings.copyCol)? styleSettings.copyCol : Colors.ORANGE_100,
        },
        colorTextSecondary: {
          color: Colors.TEXT_SECONDARY,
        },
        colorPrimary: {
          color: (styleSettings && styleSettings.copyCol)? styleSettings.copyCol : Colors.ORANGE_100,
        }
      },
      MuiListSubheader: {
        root: {
          fontFamily: 'Lora',
          fontWeight: 700,
          fontSize: 30,
          color: (styleSettings && styleSettings.headingsCol)? styleSettings.headingsCol : Colors.ORANGE_300,
        }
      },
      MuiPaper: {
        root: {
          color: Colors.TEXT_PRIMARY,
        }
      },
      MuiLinearProgress: {
        colorPrimary: {
          backgroundColor: Colors.GREEN_50,
        },
        barColorPrimary: {
          backgroundColor: Colors.GREEN_300,
        },
      },
      MuiOutlinedInput: {
        root: {
          '&$focused $notchedOutline': {
            borderColor: '#4D6DCB'
          }
        }
      },
      MuiFormHelperText: {
        root: {
          marginTop: 10,
        }
      },
      MuiMenuItem: {
        root: {
          transition: 'unset',
          color: Colors.TEXT_PRIMARY,
          '&:hover': {
            '&$selected': {
              color: Colors.TEXT_PRIMARY,
            }
          }
        },
      },
      MuiChip: {
        label: {
          '&&': {
            fontSize: 14,
          }
        }
      }
    },
  });
}

function App(props: Props) {
  const { contentSettings, styleSettings } = props;

  //const [theme, setTheme] = React.useState(generateTheme(contentSettings, styleSettings));

  React.useEffect(() => {
    //console.log(styleSettings);
    //setTheme(generateTheme(contentSettings, styleSettings));
  }, [contentSettings, styleSettings]);

  const theme = React.useMemo(
    () =>
    createMuiTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 614,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
      overrides: {
        MuiCssBaseline: {
          '@global': {
            body: {
              backgroundColor: Colors.MAIN_WHITE,
              color: Colors.TEXT_PRIMARY,
            },
            /*"*::-webkit-scrollbar": {
              width: "65px"
            },
            "*::-webkit-scrollbar-track": {
              background: "#E4EFEF"
            },
            "*::-webkit-scrollbar-thumb": {
              background: "#1D388F61",
              borderRadius: "2px"
            }*/
          }
        },
        MuiButton: {
          root: {
            color: Colors.TEXT_PRIMARY,
          },
          contained: {
            fontFamily: 'Roboto Slab',
            fontWeight: 600,
            textTransform: 'none',
          },
          text: {
            fontFamily: 'Roboto Slab',
            fontWeight: 500,
            textTransform: 'none',
          },
        },
        MuiTypography: {
          h1: {
            fontFamily: 'Lora',
            fontWeight: 700,
          },
          h2: {
            fontFamily: 'Lora',
            fontWeight: 700,
          },
          h3: {
            fontFamily: 'Lora',
            fontWeight: 700,
          },
          h4: {
            fontSize: '2.25rem',
            fontFamily: 'Lora',
            fontWeight: 700,
          },
          h5: {
            fontFamily: 'Lora',
            fontWeight: 700,
          },
          h6: {
            fontFamily: 'Roboto Slab',
            fontWeight: 700,
          },
          subtitle1: {
            fontSize: '1.125rem',
            fontFamily: 'Roboto Slab',
          },
          body1: {
            fontFamily: 'Roboto Slab',
            fontSize: '1.125rem',
          },
          body2: {
            fontFamily: 'Roboto Slab',
            fontSize: '1rem',
          },
          colorTextPrimary: {
            color: (styleSettings && styleSettings.copyCol)? styleSettings.copyCol : Colors.ORANGE_100,
          },
          colorTextSecondary: {
            color: Colors.TEXT_SECONDARY,
          },
          colorPrimary: {
            color: (styleSettings && styleSettings.copyCol)? styleSettings.copyCol : Colors.ORANGE_100,
          }
        },
        MuiListSubheader: {
          root: {
            fontFamily: 'Lora',
            fontWeight: 700,
            fontSize: 30,
            color: (styleSettings && styleSettings.headingsCol)? styleSettings.headingsCol : Colors.ORANGE_300,
          }
        },
        MuiPaper: {
          root: {
            color: Colors.TEXT_PRIMARY,
          }
        },
        MuiLinearProgress: {
          colorPrimary: {
            backgroundColor: Colors.GREEN_50,
          },
          barColorPrimary: {
            backgroundColor: Colors.GREEN_300,
          },
        },
        MuiOutlinedInput: {
          root: {
            '&$focused $notchedOutline': {
              borderColor: '#4D6DCB'
            }
          }
        },
        MuiFormHelperText: {
          root: {
            marginTop: 10,
          }
        },
        MuiMenuItem: {
          root: {
            transition: 'unset',
            color: Colors.TEXT_PRIMARY,
            '&:hover': {
              '&$selected': {
                color: Colors.TEXT_PRIMARY,
              }
            }
          },
        },
        MuiChip: {
          label: {
            '&&': {
              fontSize: 14,
            }
          }
        }
      },
    }),
    [contentSettings, styleSettings],
  );

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <div className="App">
          <ClippedDrawer />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
