import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, StyleSheet, NativeModules, Platform } from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { TYSdk, Utils } from 'tuya-panel-kit';
import { convertX, getLang } from '../../utils';
import home_on_dark from '../../res/home_on_dark.png';
import home_off_dark from '../../res/home_off_dark.png';
import monitor_on_dark from '../../res/monitor_on_dark.png';
import monitor_off_dark from '../../res/monitor_off_dark.png';
import routines_on_dark from '../../res/routines_on_dark.png';
import routines_off_dark from '../../res/routines_off_dark.png';
import settings_on_dark from '../../res/settings_on_dark.png';
import settings_off_dark from '../../res/settings_off_dark.png';
import home_on_light from '../../res/home_on_light.png';
import home_off_light from '../../res/home_off_light.png';
import monitor_on_light from '../../res/monitor_on_light.png';
import monitor_off_light from '../../res/monitor_off_light.png';
import routines_on_light from '../../res/routines_on_light.png';
import routines_off_light from '../../res/routines_off_light.png';
import settings_on_light from '../../res/settings_on_light.png';
import settings_off_light from '../../res/settings_off_light.png';

const { viewWidth } = Utils.RatioUtils;
// const DorelManager = NativeModules.TYRCTDorelManager;
// const { TYRCTStateSharingManager, TYRCTDorelManager: DorelManager } = NativeModules;
// const { queryStateValue } = TYRCTStateSharingManager;

const darkBar = [
  {
    text: getLang('dsc_home'),
    onIcon: home_on_dark,
    offIcon: home_off_dark,
  },
  {
    text: '周边',
    onIcon: monitor_on_dark,
    offIcon: monitor_off_dark,
  },
  {
    text: '统计',
    onIcon: routines_on_dark,
    offIcon: routines_off_dark,
  },
  // {
  //   text: getLang('dsc_setting'),
  //   onIcon: settings_on_dark,
  //   offIcon: settings_off_dark,
  // },
];

const lightBar = [
  {
    text: getLang('dsc_home'),
    onIcon: home_on_light,
    offIcon: home_off_light,
  },
  {
    text: '周边',
    onIcon: monitor_on_light,
    offIcon: monitor_off_light,
  },
  {
    text: '统计',
    onIcon: routines_on_light,
    offIcon: routines_off_light,
  },
  // {
  //   text: getLang('dsc_setting'),
  //   onIcon: settings_on_light,
  //   offIcon: settings_off_light,
  // },
];

export default class BottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      isWhite: false,
      redStatus: 0,
    };
  }

  componentDidMount() {
    const { isWhite, navigator } = this.props;
    this.setState({ isWhite: !isWhite });
    const routes = navigator.getCurrentRoutes();
    const currentRoute = routes.pop();
    const { index } = currentRoute;
    console.log(index);
    if (index) {
      this.setState({ activeIndex: index })
    }

  }


  handleBtn = index => {
    this.setState({ activeIndex: index });
    const { navigator } = this.props;
    console.log(index);
    switch (index) {
      case 0:
        navigator && navigator.push({ id: 'main', index: index });
        break;
      case 1:
        navigator && navigator.push({ id: 'Around', index: index });
        break;
      case 2:
        navigator && navigator.push({ id: 'Statistics', index: index });
        break;

      default:
        break;
    }

  };

  render() {
    const { activeIndex, isWhite, redStatus } = this.state;
    const arr = isWhite ? lightBar : darkBar;
    return (
      <View style={{}}>
        <View style={styles.Container}>
          {arr.map((item, index) => {
            return (
              <TouchableOpacity key={item.text} onPress={() => this.handleBtn(index)}>
                <View
                  style={
                    isWhite
                      ? [
                        styles.itemWhiteBox,
                        activeIndex === index ? styles.selectedLightBox : null,
                      ]
                      : [styles.itemBox, activeIndex === index ? styles.selectedBox : null]
                  }
                >
                  {index === 3 && redStatus === 1 ?
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'red',
                        position: 'absolute',
                        right: (viewWidth / 8 - convertX(14)),
                        top: convertX(10),
                      }}
                    /> :
                    null}
                  <Image
                    source={activeIndex === index ? item.onIcon : item.offIcon}
                    style={{ width: convertX(24), height: convertX(24) }}
                  />
                  <Text
                    style={
                      isWhite
                        ? [
                          styles.textWhite,
                          activeIndex === index ? styles.selectedWhiteText : null,
                        ]
                        : [styles.text, activeIndex === index ? styles.selectedText : null]
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // dark主题边框
  itemBox: {
    width: viewWidth / 3,
    height: convertX(70),
    borderTopColor: '#3f4c7a',
    borderTopWidth: convertX(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // light主题边框
  itemWhiteBox: {
    width: viewWidth / 3,
    height: convertX(70),
    borderTopColor: '#e6eef4',
    borderTopWidth: convertX(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // dark选中的边框
  selectedBox: {
    borderTopColor: '#7dd2e4',
    borderTopWidth: convertX(2),
  },
  // light选中的边框
  selectedLightBox: {
    borderTopColor: '#3e9ab7',
    borderTopWidth: convertX(2),
  },
  // dark默认文字
  text: {
    marginTop: convertX(3),
    color: '#83a8ca',
    fontSize: convertX(12),
  },
  // white默认文字
  textWhite: {
    marginTop: convertX(3),
    color: '#5e7794',
    fontSize: convertX(12),
  },
  // dark选中的文字
  selectedText: {
    marginTop: convertX(3),
    color: '#7dd2e4',
    fontSize: convertX(12),
  },
  // light选中的文字
  selectedWhiteText: {
    marginTop: convertX(3),
    color: '#2d385f',
    fontSize: convertX(12),
  },
});
