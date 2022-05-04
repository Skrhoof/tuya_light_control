import _ from 'lodash';
import React from 'react';
import { StatusBar, NativeModules } from 'react-native';
import { TYSdk, NavigatorLayout, GlobalToast } from 'tuya-panel-kit';
import composeLayout from './composeLayout';
import configureStore from './redux/configureStore';
import { formatUiConfig } from './utils';
import Home from './containers/Home';
import Countdown from './containers/Home/timer/countdown';
import Addscenes from './containers/Home/scenes/Addscenes';
import Preview from './containers/Home/scenes/Preview';
import Around from './containers/Home/around';
import Statistics from './containers/Home/statistics'

console.disableYellowBox = true;
const DorelManager = NativeModules.TYRCTDorelManager;
export const store = configureStore();

const countConfig = {
  powerSwitch: -1,
  lightSwitch: -1,
  volunmArr: new Array(101).fill(0)
}

class MainLayout extends NavigatorLayout {
  state = { roomName: '' }
  /**
   *
   * @desc
   * hookRoute 可以在这里针对特定路由做一些控制处理
   *
   * @param {Object} route
   * @return {Object} - 提供给当前页面组件父容器布局的一些控制值
   * {
   * style: ViewPropTypes.style, // 容器样式，可在此调整背景颜色
   * background: backgroundImage | linearGradientBackground, // 面板图片背景或渐变背景，渐变格式可参考LinearGradient和RadialGradient组件
   * topbarStyle: ViewPropTypes.style, // TopBar 样式，可在调整TopBar背景色
   * topbarTextStyle: Text.propTypes.style, // TopBar的文字样式
   * title: string, // TopBar 文字
   * renderTopBar: () => {}, // 自定义渲染TopBar
   * hideTopbar: true | false,   // 控制是否隐藏 TopBar
   * renderStatusBar: () => {}, // 自定义渲染StatusBar，IOS only
   * showOfflineView: true | false, // 控制是否渲染 OfflineView
   * OfflineView: ReactComponent, // 自定义的 OfflineView 组件
   * }
   */
  // eslint-disable-next-line
  hookRoute(route) {
    let params;
    switch (route.id) {
      case 'main':
        params = {
          hideTopbar: true,
        };
        break;
      case 'Countdown':
        params = {
          hideTopbar: true,
        };
        break;
      case 'Addscenes':
        params = {
          hideTopbar: true,
        };
        break;
      case 'Preview':
        params = {
          hideTopbar: true,
        };
        break;
      case 'Around':
        params = {
          hideTopbar: true,
        };
        break;
      case 'Statistics':
        params = {
          hideTopbar: true,
        };
        break;
      default:
        break;
    }
    return {
      ...params,
      renderStatusBar: () => <StatusBar barStyle="default" />,
    };
  }




  /**
   * @desc
   * 在此可以通过route中的id来判断使用哪个页面组件，
   * 此外如果有额外的props需要传递给页面组件的，可以在此进行传递。
   *
   * @param {Object} route - route对象
   * @param {object} navigator - Navigator对象，具体使用方法可参考https://facebook.github.io/react-native/docs/0.43/navigator.html
   */
  renderScene(route, navigator) {
    let component;
    let schema = {};
    let uiConfig = {};
    const { dispatch, devInfo, dpState } = this.props;

    // if (this.prevDp !== dpState) {
    //   GlobalToast.show({
    //     text: JSON.stringify({ customize_scene_set: dpState.customize_scene_set }),
    //     text: test,
    //     showIcon: false,
    //     contentStyle: {},
    //     showPosition: 'bottom',
    //     onFinish: () => {
    //       GlobalToast.hide();
    //     },
    //   });
    // }
    if (this.prevDp && this.prevDp.power_switch !== dpState.power_switch) {
      countConfig.powerSwitch++;
    }

    if (this.prevDp && this.prevDp.switch_led !== dpState.switch_led) {
      countConfig.lightSwitch++;
    }

    if (this.prevDp && this.prevDp.volume !== dpState.volume) {
      countConfig.volunmArr[dpState.volume]++;
    }

    this.prevDp = dpState;

    if (!_.isEmpty(devInfo)) {
      schema = devInfo.schema || {};
      uiConfig = formatUiConfig(devInfo);
    }

    if (this.prevDevId === undefined || this.prevDevId !== devInfo.devId) {
      if (DorelManager && DorelManager.getRoomName) {
        DorelManager.getRoomName(devInfo.devId, res => {
          if (typeof res === 'string' && res.length !== 0) {
            this.setState({ roomName: res })
          }
        });
      }
    }
    this.prevDevId = devInfo.devId;

    switch (route.id) {
      case 'main':
        component = (
          <Home
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
            roomName={this.state.roomName}
          />
        );
        break;
      case 'Countdown':
        component = (
          <Countdown
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
          />
        );
        break;
      case 'Addscenes':
        component = (
          <Addscenes
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
          />
        );
        break;
      case 'Preview':
        component = (
          <Preview
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
          />
        );
        break;
      case 'Around':
        component = (
          <Around
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
          />
        );
        break;
      case 'Statistics':
        // case 'main':
        component = (
          <Statistics
            devInfo={devInfo}
            // dpData={{ state: dpState, schema, uiConfig }}
            dpState={dpState}
            schema={schema}
            uiConfig={uiConfig}
            dispatch={dispatch}
            navigator={navigator}
            countData={countConfig}
          />
        );
        break;
      default:
        break;
    }

    return component;
  }
}

export default composeLayout(store, MainLayout);
