import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { TYSdk, Utils } from 'tuya-panel-kit';
import { convertX, goBack } from '../../utils';
import arrowIcon from '../../res/arrow.png';
import LogoIcon from '../../res/Safety1st_Logo_White.png';
import LogoLightIcon from '../../res/Safety1st_Logo_yellow.png';
import settingIcon from '../../res/Settings.png';
import subtractIcon from '../../res/Subtract.png';

const { isIphoneX } = Utils.RatioUtils;
// iphoneX以上88，iphoneX以下64，安卓56
const topBarHeight = Platform.OS === 'android' ? 56 : isIphoneX ? 88 : 64;
const TYNative = TYSdk.native;

export default function TopBar(props) {
  const { isWhite } = props;

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
            <TouchableOpacity onPress={() => goBack()}>
              <Image source={arrowIcon} style={{ width: convertX(20), height: convertX(20) }} />
            </TouchableOpacity>
          </View>
          <Image
            source={isWhite ? LogoLightIcon : LogoIcon}
            style={{ width: convertX(110), height: convertX(34) }}
          />
          <View style={{ flexDirection: 'row', width: convertX(70) }}>
            <TouchableOpacity>
              <Image
                source={settingIcon}
                style={{ width: convertX(24), height: convertX(24), marginRight: convertX(14) }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => TYNative.showDeviceMenu()}>
              <Image source={subtractIcon} style={{ width: convertX(24), height: convertX(24) }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
