import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Provider,
} from 'react-redux';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  toast,
} from 'react-toastify';

import moment from 'moment-timezone';
import 'moment/locale/ko';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import duration from 'dayjs/plugin/duration';

import {
  PersistGate,
} from 'redux-persist/integration/react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import {
  ThemeProvider,
} from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';
import '@coreui/coreui/dist/css/coreui.min.css';

import _ from 'lodash';
import { PostHogProvider } from 'posthog-js/react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import GlobalStyled from './globalStyles';

import App from './App';
import {
  apiUrl,
} from './config';

import apiService from './services/api';

import theme from './theme';
import store, {
  persistor,
} from './store';
import Button from './components/atoms/Button';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: process.env.NODE_ENV === 'development'
        ? 1000
        : 1000 * 60 * 1, // minute
    },
  },
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

dayjs.tz.setDefault('Asia/Seoul');
moment.tz.setDefault('Asia/Seoul');
moment.locale('ko');

const currentUrl = new URL(window.location);
const isRemote = (
  currentUrl.hostname !== 'localhost' && currentUrl.hostname.slice(
    0,
    3,
  ) !== '192'
) || process.env.REACT_APP_IS_REMOTE;
global.api = apiService.create({
  defaultUrl: isRemote ? `${process.env.REACT_APP_CHEF_URL_REMOTE}/api/v1` : `${process.env.REACT_APP_CHEF_URL}/api/v1`,
  onError: (e) => {
    const errors = e.errors || [];
    const errorsLabel = errors.length > 0 ? `[${errors.join(', ')}]` : null;
    toast(
      [
        e.message,
        errorsLabel,
      ].filter((v) => !_.isNil(v)).join(' '),
      {
        autoClose: true,
        type: toast.TYPE.ERROR,
        toastId: 'WS_DISCONNECT',
      },
    );
  },
});

const posthogOptions = { api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST };

const PostHogProviderWrapper = ({ children }: PropsWithChildren) => {
  if (process.env.REACT_APP_ENV === 'development') return children;
  return (
    <PostHogProvider
      apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
      options={posthogOptions}
    >
      {children}
    </PostHogProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading="loading" persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback="loading">
            <Router basename={process.env.REACT_APP_BASE_URL || ''}>
              <ThemeProvider theme={theme}>
                <PostHogProviderWrapper>
                  <GlobalStyled />
                  <App />
                </PostHogProviderWrapper>
              </ThemeProvider>
            </Router>
          </Suspense>
        </QueryClientProvider>
      </PersistGate>
    </Provider>

  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
