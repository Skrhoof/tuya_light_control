import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  ViewPropTypes,
} from 'react-native';
import { Utils, TYText, TYSdk, IconFont, TopBar } from 'tuya-panel-kit';
// import { Utils, TYText, TYNative, IconFont } from '@tuya-rn/tuya-native-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import Color from 'color';
import { goBack, showDeviceMenu } from '../../utils';

import resource from './res';
import Open from './Open';
import Success from './Success';
import icons from './icons';
import Strings from './i18n';

const { convertX: cx } = Utils.RatioUtils;
const { color: ColorUtilsObj } = Utils.ColorUtils;
const TYNative = TYSdk.native;
const DeviceEvent = TYSdk.DeviceEventEmitter;

TYNative.startVoice = async () =>
  new Promise((resolve, reject) => {
    TYNative.startVoice(
      d => {
        // @ts-ignore
        TYNative.screenAlwaysOn(true);
        resolve(d);
      },
      () => {
        reject();
      }
    );
  });

TYNative.stopVoice = async () =>
  new Promise((resolve, reject) => {
    TYNative.stopVoice(d => {
      // @ts-ignore
      TYNative.screenAlwaysOn(false);
      resolve(d);
    }, reject);
  });

function toFixed16(v, length = 2) {
  let d = parseInt(v, 10).toString(16);
  if (d.length < length) {
    d = '0'.repeat(length - d.length) + d;
  } else {
    d = d.slice(0, length);
  }
  return d;
}
function encodeControlData(h, s, v, b, k) {
  const hsvbk = [h, s, v, b, k].reduce((total, next) => total + toFixed16(next, 4), '');
  return `1${hsvbk}`;
}

const musicCode = 'music_data';

const maxSize = cx(300);
const minSize = cx(178);
const offsetSize = (maxSize - minSize) / 4;

export default class Music extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    issueDataSpeed: PropTypes.number,
    isSupportColor: PropTypes.bool,
    isSupportWhiteTemp: PropTypes.bool,
    failureText: PropTypes.string,
    openingText: PropTypes.string,
    beginText: PropTypes.string,
    retryText: PropTypes.string,
    endText: PropTypes.string,
    iconTintColor: PropTypes.string,
    musicTipTextStyle: Text.propTypes.style,
    btnNormalStyle: ViewPropTypes.style,
    btnStyle: ViewPropTypes.style,
    btnNormalTextStyle: Text.propTypes.style,
    btnTextStyle: Text.propTypes.style,
    musicBgImg: PropTypes.any,
    musicBgImgStyle: ViewPropTypes.style,
    musicBgOnImg: PropTypes.any,
    musicBgOnImgStyle: ViewPropTypes.style,
    ringBorderColor: PropTypes.string,
    ringMaxColor: PropTypes.string,
    ringMinColor: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    issueDataSpeed: 300,
    isSupportColor: true,
    isSupportWhiteTemp: true,
    failureText: '',
    openingText: '',
    beginText: '',
    retryText: '',
    endText: '',
    iconTintColor: '#464646',
    musicTipTextStyle: {},
    btnNormalStyle: {},
    btnStyle: {},
    btnNormalTextStyle: {},
    btnTextStyle: {},
    musicBgImg: null,
    musicBgOnImg: null,
    musicBgImgStyle: {},
    musicBgOnImgStyle: {},
    ringBorderColor: '#FFF',
    ringMaxColor: '#96E6A1',
    ringMinColor: '#D4FC79',
  };

  constructor(props) {
    super(props);
    this.hueVolume = 0;
    this.minVolume = 1000;
    this.color = new Color('#FFFFFF');
    this.color.saturationv(100).value(100);
    this.state = {
      voiceStatus: 'none',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { disabled } = nextProps;
    if (disabled) {
      this.setState({ voiceStatus: 'none' });
      this.stopMusic();
    }
  }

  componentWillUnmount() {
    this.stopMusic();
  }

  handleRgbChange = throttle(({ R, G, B, C: temperature, L: bright }) => {
    const { isSupportColor, isSupportWhiteTemp } = this.props;
    if (this.state.voiceStatus !== 'normal') {
      this.setState({
        voiceStatus: 'normal',
      });
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }

    let h = 0;
    let s = 0;
    let v = 0;
    let b = 0;
    let t = 0;

    if (isSupportColor) {
      [h, s, v] = ColorUtilsObj.rgb2hsb(R, G, B);
    } else {
      // 是否支持白光音乐功能
      if (typeof bright === 'undefined' || typeof temperature === 'undefined') {
        return;
      }
      b = bright * 10;
      t = temperature * 10;
      if (!isSupportWhiteTemp) {
        t = 1000;
      }
    }

    const encodedControlColor = encodeControlData(h, s * 10, v * 10, b, t);
    TYNative.putDpData({
      [musicCode]: encodedControlColor,
    });
  }, this.props.issueDataSpeed || 300);

  startMusic = async () => {
    try {
      await TYNative.startVoice();
      DeviceEvent.addListener('audioRgbChange', this.handleRgbChange);
    } catch (err) {
      this.setState({ voiceStatus: 'none' });
    }
  };

  stopMusic = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    TYNative.stopVoice();
    DeviceEvent.removeListener('audioRgbChange');
    this.handleRgbChange.cancel();
  };

  sizes = [minSize + offsetSize, minSize + offsetSize * 2, minSize + offsetSize * 3];

  handleMusic = async () => {
    const { voiceStatus } = this.state;
    if (/failure|none/.test(voiceStatus)) {
      this.setState({ voiceStatus: 'opening' });
      this.startMusic();
      this.timer = setTimeout(() => {
        this.setState({ voiceStatus: 'failure' });
        this.stopMusic();
      }, 60000);
    } else {
      this.setState({ voiceStatus: 'none' });
      this.stopMusic();
    }
  };

  render() {
    const { voiceStatus } = this.state;
    const {
      disabled,
      failureText,
      openingText,
      beginText,
      retryText,
      endText,
      iconTintColor,
      musicTipTextStyle,
      btnNormalStyle,
      btnStyle,
      btnNormalTextStyle,
      btnTextStyle,
      musicBgImg,
      musicBgOnImg,
      musicBgImgStyle,
      musicBgOnImgStyle,
      ringBorderColor,
      ringMaxColor,
      ringMinColor,
    } = this.props;

    let musicTip = '';
    let musicBtnLabel = '';
    if (voiceStatus === 'failure') {
      musicTip = failureText || Strings.getLang('music_failure');
    } else if (voiceStatus === 'opening') {
      musicTip = openingText || Strings.getLang('music_opening');
    }

    if (voiceStatus === 'none') {
      musicBtnLabel = beginText || Strings.getLang('music_begin');
    } else if (voiceStatus === 'failure') {
      musicBtnLabel = retryText || Strings.getLang('music_retry');
    } else {
      musicBtnLabel = endText || Strings.getLang('music_end');
    }
    return (
      <View style={{ flex: 1, marginBottom: cx(100) }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* {voiceStatus === 'none' && (
            <View style={styles.box}>
              <ImageBackground
                source={musicBgImg || resource.musicBg}
                style={[styles.music, musicBgImgStyle]}
              >
                <IconFont d={icons.mic_none} size={cx(84)} color={iconTintColor} useART={true} />
              </ImageBackground>
            </View>
          )} */}
          {voiceStatus === 'opening' && (
            <Open
              iconTintColor={iconTintColor}
              ringBorderColor={ringBorderColor}
              musicBgImg={musicBgImg || resource.musicBg}
              musicBgImgStyle={musicBgImgStyle}
            />
          )}
          {/* {voiceStatus === 'failure' && (
            <View style={styles.box}>
              <ImageBackground
                source={musicBgImg || resource.musicBg}
                style={[styles.music, musicBgImgStyle]}
              >
                <IconFont d={icons.mic_fail} size={cx(84)} color={iconTintColor} useART={true} />
              </ImageBackground>
            </View>
          )} */}
          {/* {voiceStatus === 'normal' && (
            <Success
              iconTintColor={iconTintColor}
              musicBgOnImg={musicBgOnImg || resource.musicBgOn}
              musicBgOnImgStyle={musicBgOnImgStyle}
              ringMaxColor={ringMaxColor}
              ringMinColor={ringMinColor}
            />
          )} */}
        </View>
        <View style={styles.textBox}>
          <TYText style={[{ color: '#fff', fontSize: 16 }, musicTipTextStyle]}>{musicTip}</TYText>
        </View>
        <View style={[styles.bottom, disabled && { opacity: 0.4 }]}>
          {voiceStatus !== 'opening' && (
            <TouchableOpacity
              onPress={this.handleMusic}
              activeOpacity={0.8}
              disabled={disabled}
              style={[
                styles.outBtn,
                {
                  backgroundColor: voiceStatus === 'normal' ? '#262626' : '#fff',
                },
                voiceStatus === 'normal' ? btnNormalStyle : btnStyle,
              ]}
            >
              <TYText
                style={[
                  styles.outBtnText,
                  { color: voiceStatus === 'normal' ? '#fff' : '#000' },
                  voiceStatus === 'normal' ? btnNormalTextStyle : btnTextStyle,
                ]}
              >
                {musicBtnLabel}
              </TYText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  music: {
    width: cx(178),
    height: cx(178),
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: minSize,
    height: minSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    height: cx(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: cx(48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: cx(20),
  },
  outBtn: {
    width: cx(150),
    height: cx(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: cx(24),
  },
  outBtnText: {
    width: cx(150),
    fontSize: 16,
    textAlign: 'center',
  },
  // img: {
  //   width: cx(84),
  //   height: cx(84),
  // },
});
