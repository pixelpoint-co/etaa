import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Provider,
} from 'react-redux';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Modal from 'react-modal';
import {
  toast,
} from 'react-toastify';
import {
  HttpLink,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
} from '@apollo/client';
import {
  WebSocketLink,
} from '@apollo/client/link/ws';
import {
  getMainDefinition,
} from '@apollo/client/utilities';
import {
  SubscriptionClient,
} from 'subscriptions-transport-ws'; // <- import this

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

const queryClient = new QueryClient();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

dayjs.tz.setDefault('Asia/Seoul');
moment.tz.setDefault('Asia/Seoul');
moment.locale('ko');

// const httpLinkUri = process.env.REACT_APP_HTTPLINK_URI;
// const wsLinkUri = process.env.REACT_APP_WSLINK_URI; /** */

// const httpLink = new HttpLink({
//   uri: `${httpLinkUri}`,
//   cache: new InMemoryCache(),
//   name: 'ERP',
//   version: '0.0.1',
// });

// const wsClient = new SubscriptionClient(
//   wsLinkUri,
//   // { reconnect: true },
// );

// const wsLink = new WebSocketLink(wsClient);
// const WSReloadButton = () => <Button label="새로고침" palette="red" onClick={() => window.location.reload()} />;
// // wsClient.onConnected(() => console.log('websocket connected!!'));
// // wsClient.onDisconnected((d) => {
//   // console.log(
//   //   'onDisconnect!',
//   //   d,
//   // );
//   requestAnimationFrame((s) => {
//     console.log(
//       '로드 후 경과: ',
//       s,
//     );
//     if (s > 1000) {
//       // toast(
//       //   '서버와의 연결이 끊어졌습니다.',
//       //   {
//       //     autoClose: false,
//       //     type: toast.TYPE.ERROR,
//       //     toastId: 'WS_DISCONNECT',
//       //     closeButton: WSReloadButton,
//       //   },
//       // );
//     }
//   });
// });
// wsClient.onReconnected(() => console.log('websocket reconnected!!'));
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition'
//       && definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
//   // defaultOptions: {
//   //   watchQuery: {
//   //     fetchPolicy: 'no-cache',
//   //     errorPolicy: 'ignore',
//   //   },
//   //   query: {
//   //     fetchPolicy: 'no-cache',
//   //     errorPolicy: 'all',
//   //   },
//   // },
// });
const currentUrl = new URL(window.location);
const isRemote = !!process.env.REACT_APP_IS_REMOTE;
global.api = apiService.create({ defaultUrl: isRemote ? `${process.env.REACT_APP_CHEF_URL_REMOTE}/api/v1` : `${process.env.REACT_APP_CHEF_URL}/api/v1` });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading="loading" persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback="loading">
            <Router basename={process.env.REACT_APP_BASE_URL || ''}>
              {/* <ApolloProvider client={client}> */}
              <ThemeProvider theme={theme}>
                <GlobalStyled />
                <App />
              </ThemeProvider>
              {/* </ApolloProvider> */}
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
