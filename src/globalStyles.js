import {
  createGlobalStyle,
} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 16px;
    line-height: 24px;
    height: 100%;
  }

  bold: 700,
      semiBold: 600,
      medium: 500,
      normal: 400,
    },
    400,

  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Black.woff) format('woff');
    font-weight: 900;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-ExtraBold.woff) format('woff');
    font-weight: 800;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Bold.woff) format('woff');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-SemiBold.woff) format('woff');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Medium.woff) format('woff');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Regular.woff) format('woff');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Light.woff) format('woff');
    font-weight: 300;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-ExtraLight.woff) format('woff');
    font-weight: 200;
  }
  @font-face {
    font-family: 'Pretendard';
    src: local('Pretendard'), url(/font/Pretendard-Thin.woff) format('woff');
    font-weight: 100;
  }

  body {
    height: 100%;
    font-family: "Pretendard Std Variable", "Pretendard Std", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: 0px;
    word-spacing: 0px;
    margin: 0px;

    &.no-scroll {
      overflow-y: hidden;
    }


    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  p, ul, ol, pre, table, blockquote {
    margin-top: 0px;
    margi-bottom: 0px;
  }

  ul ul, ol ol, ul ol, ol ul {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  ul {
    list-style-type: none;

    li {
      display: inline;
      margin: 0px;
    }
  }

  #app {

  }

  #root {

  }

  #app {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100%;
    height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100%;
    height: 100%;
    width: 100%;
  }


  .ReactCollapse--collapse {
    transition: height 250ms ease-in-out;
  }


  // toastify

  :root {
    --toastify-toast-width: 480px;

    .offcanvas {
      /* --cui-offcanvas-zindex: 1; */
    }
  }
  .Toastify__toast {
    border-radius: 15px;
    box-shadow: rgba(30, 30, 30, 0.3) 5px 5px 20px;
  }

  .ReactModal__Body--open {
    overscroll-behavior: none;
  }

.ph-rrweb-player {
  height: 100%;
  width: 100%;
  overflow: hidden;

  position: relative;
  > div:first-child {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .replayer-mouse-tail {
    transform-origin: top left;
    position: absolute;
  }

  iframe {
    border: 0px;
    background-color: white;
  }
}

.ph-rrweb-bottom {
    box-sizing: border-box;
    width: 100%;
    padding: 6px;

    background-color: #333;
    color: white;
    align-self: flex-end;

    .ph-rrweb-progress {
        width: 100%;
        cursor: pointer;
    }

    .ph-rrweb-controller {
        display: flex;

        > * {
            flex: 1 0 0;
            display: flex;
            align-items: center;
        }

        .ph-rrweb-controller-icon {
            margin-right: 8px;
            font-size: 24px;
            cursor: pointer;
            display: flex;

            &.ph-rrweb-controller-icon-play-pause {
                margin-right: 0px;
            }
        }
    }


    .ph-rrweb-speed-toggle {
        cursor: pointer;
        margin-right: 5px;
    }

}

.ph-rrweb-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 10;

    .ph-rrweb-play-pause-overlay {
        background-color: #333;
        color: white;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;

        opacity: 0;
        height: 60px;
        width: 60px;
        font-size: 24px;

        svg {
            height: 48px;
            width: 48px;
            display: flex;
        }
    }

    .ph-rrweb-skipping {
        position: absolute;

        display: flex;
        justify-content: center;
        align-items: center;

        height: 100%;
        width: 100%;

        background-color: #333;
        opacity: 0.7;

        font-size: 40px;
        color: white;
    }
}

.rc-tooltip-placement-top {
    padding: 14px 0 0px 0;
}

.rc-tooltip-arrow {
    display: none;
}
`;
export default GlobalStyle;
