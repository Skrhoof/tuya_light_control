import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, Platform, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { TYSdk, Utils } from 'tuya-panel-kit';
import { convertX, goBack, getLang } from '../../utils';
import arrowIcon from '../../res/arrow.png';
import LogoIcon from '../../res/Maxi-Cosi_White.png';
import LogoLightIcon from '../../res/Maxi-Cosi_Dark.png';

import LogoIconsf1 from '../../res/Safety1st_Logo_White.png';
import LogoLightIconsf1 from '../../res/Safety1st_Logo_yellow.png';
import settingIcon from '../../res/Settings.png';
import subtractIcon from '../../res/Subtract.png';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { isIphoneX } = Utils.RatioUtils;
// iphoneX以上88，iphoneX以下64，安卓56
const topBarHeight = Platform.OS === 'android' ? 56 : isIphoneX ? 88 : 64;
const TYNative = TYSdk.native;

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWhite: true, // 是否是light
    };
  }

  handleGoBack = () => {
    goBack();
    // const { home, sendAction } = this.props;
    // home.timer = 1;
    // sendAction();
  };

  handleBtn = () => {
    // TYNative.jumpTo(getLang('dsc_webUrl'));
    const { devInfo } = this.props;
    const { devId, name } = devInfo;
    // this.gotoDeviceFaqPage(devId, name);
  };

  gotoDeviceFaqPage(devId, name) {
    return NativeModules.TYRCTDorelManager.gotoDeviceFaqPage(devId, name);
  }

  render() {
    const { isWhite, isbackground, pattern, H, S, V } = this.props;
    return (
      <View>
        {/* topBar */}
        <View
          style={[
            {
              backgroundColor: '#2d385f',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: topBarHeight,
              paddingBottom: convertX(10),
              paddingHorizontal: convertX(10),
            },
            isWhite ? { backgroundColor: '#fff' } : null,
            isbackground ? { backgroundColor: Color.hsb2hex(...[H, S, V]) } : null,
            pattern == '1' ? { backgroundColor: Color.hsb2hex(...[H, S, V]) } : pattern == null ? null : { backgroundColor: '#FBF1D4' }
          ]}
        >
          <View
            style={{
              width: '100%',
              height: convertX(36),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ width: convertX(50), height: convertX(36), justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.handleGoBack()}>
                <Image source={arrowIcon} style={{ width: convertX(20), height: convertX(20) }} />
              </TouchableOpacity>
            </View>
            {/* <Image
              source={getLang('dsc_version') == 'maxi' ? isWhite ? LogoLightIcon : LogoIcon : isWhite ? LogoLightIconsf1 : LogoIconsf1}
              style={{ width: convertX(110), height: convertX(34) }}
            /> */}
            <Text style={{ height: convertX(34), fontSize: 20 }}>智能灯控系统</Text>
            <View style={{ flexDirection: 'row', width: convertX(70) }}>
              <TouchableOpacity onPress={() => TYNative.showDeviceMenu()}>
                <Image
                  source={settingIcon}
                  style={{ width: convertX(24), height: convertX(24), marginRight: convertX(14) }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleBtn()}>
                <Image source={subtractIcon} style={{ width: convertX(24), height: convertX(24) }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    sendAction: () => {
      dispatch({
        type: 'change_timer',
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
