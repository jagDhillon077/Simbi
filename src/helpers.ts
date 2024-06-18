import debounce from '@material-ui/core/utils/debounce';
import throttle from 'lodash.throttle';
import React from 'react';

export const formatString = (text: string) => text.toLocaleLowerCase().replace(/[^A-Z0-9]+/ig, "-");

export const getHref = (port: string, path: string) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  return `${protocol}//${hostname}:${port}${path}`;
}

export const getAnchorProps = (port: string | undefined, path: string) => {
  const urlPort = port || window.location.port;

  if (urlPort !== window.location.port && urlPort !== '80') {
    return {
      to: {
        pathname: getHref(urlPort, path),
      },
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return { to: path };
}

export const useDebounce = (callback: ((input: string) => void), wait?: number) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useCallback(debounce((input: string) => {
    callback(input);
  }, wait), []);

export const useThrottle = (callback: (() => void), wait?: number) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useCallback(throttle(() => {
    callback();
  }, wait), []);
