import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, Image, ScrollView, TouchableOpacity, NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import { convertX, showDeviceMenu, putDeviceData, goBack, convertRadix, electricityTo } from '../../utils';
import { SwitchButton, LinearGradient } from 'tuya-panel-kit';
import { Rect } from "react-native-svg";
import { BoxShadow } from 'react-native-shadow'
import styles from './styles';
import Switch from '../../assets/img/switch.png';
import Play from './play';
import Sounds from './sounds';
import Light from './light';
import Scenes from './scenes';
import Timer from './timer';
import Strings from '../../i18n';
import { MusicMap } from '../Home/sounds/utils';
import BottomBar from '../../components/BottomBar';
import TopBar from '../../components/TopBar';
const DorelManager = NativeModules.TYRCTDorelManager;
const dimension = { width: convertX(375), height: convertX(150) };
class Index extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      hsb: [180, 100, 100],
      dataSource: [
        { value: 'colour', label: Strings.getLang('dsc_colours') },
        { value: 'white', label: Strings.getLang('dsc_white') },
      ],
      work_mode: 'colour',
      selectIndex: '1',
      type: 'lullabies',
      dataSource2: [
        { value: 'lullabies', label: Strings.getLang('dsc_Lullabies') },
        { value: 'soothing', label: Strings.getLang('dsc_Soothing') },
      ],
      isWhite: true, // 是否是light
    };
  }

  handleD1Change = (tab) => {
    this.setState({ work_mode: tab.value });
    putDeviceData({
      work_mode: tab.value,
    });
  };
  handleD1Change2 = (tab) => {
    this.setState({ type: tab.value });
    putDeviceData({
      type: tab.value,
    });
  };
  onValueChange = type => {
    const { dpState } = this.props;
    switch (type) {
      case 'child_lock':
        putDeviceData({
          child_lock: !dpState.child_lock,
        });
        break;
      case 'switch_led':
        putDeviceData({
          switch_led: !dpState.switch_led,
        });
        break;
      default:
        break;
    }
  };
  //滑动条调节亮度
  onComplete = (type, value) => {
    switch (type) {
      case 'temp_value':
        putDeviceData({
          temp_value: Math.ceil(value) * 10,
        });
        break;
      case 'bright_value':
        putDeviceData({
          bright_value: Math.ceil(value),
        });
        break;
      case 'brightness':
        const { hsb } = this.state;
        hsb[2] = value;
        this.setState({
          hsb: [...hsb],
        });
        const H = convertRadix(hsb[0], 10, 16, 4);
        const S = convertRadix(hsb[1], 10, 16, 4);
        const V = convertRadix(hsb[2], 10, 16, 4);
        putDeviceData({
          colour_data: H + S + V,
        });
        break;
      default:
        break;
    };
  }

  overValueChange = value => {
    putDeviceData({
      volume: Math.ceil(value),
    });
  };

  onselect = (code, value) => {
    putDeviceData({
      song: value,
    });
    this.setState({
      selectIndex: value,
    });
  };

  // 控制暂停和播放按钮
  handlePause = type => {
    const { dpState } = this.props;
    switch (type) {
      case 'play_pause':
        putDeviceData({
          play_pause: !dpState.play_pause,
        });
        break;
      case 'prev_song':
        putDeviceData({
          prev_next: 'prev_song',
        });
        break;
      case 'next_song':
        putDeviceData({
          prev_next: 'next_song',
        });
        break;
      case 'cycle':
        putDeviceData({
          play_way: 'cycle',
        });
        break;
      case 'random':
        putDeviceData({
          play_way: 'random',
        });
        break;
      default:
        break;
    };
  };

  onCompleteChange = (hsb) => {
    this.setState({
      hsb,
    });
    const H = convertRadix(hsb[0], 10, 16, 4);
    const S = convertRadix(hsb[1], 10, 16, 4);
    const V = convertRadix(hsb[2], 10, 16, 4);
    putDeviceData({
      colour_data: H + S + V,
    });
  };

  componentDidMount() {
    const { onSaveHome, dpState } = this.props;
    const { song, colour_data, work_mode, scene } = dpState;
    DorelManager.isInDarkMode(res => {
      this.setState({ isWhite: !res });
    });
    const hsvArr = electricityTo(colour_data);
    const H = Number(convertRadix(hsvArr[0], 16, 10));
    const S = Number(convertRadix(hsvArr[1], 16, 10));
    const V = Number(convertRadix(hsvArr[2], 16, 10));
    if (colour_data) {
      this.setState({
        hsb: [H, S, V],
      });
    }
    if (work_mode) {
      this.setState({
        work_mode: work_mode,
      });
    }
    if (song) {
      this.setState({
        selectIndex: song,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { dpState: prevDPState } = prevProps;
    const { dpState } = this.props;
    const { colour_data = '', song, work_mode } = dpState;
    const H = Number(convertRadix(colour_data.substring(0, 4), 16, 10));
    const S = Number(convertRadix(colour_data.substring(4, 8), 16, 10));
    const V = Number(convertRadix(colour_data.substring(8, 12), 16, 10));
    if (colour_data && dpState.colour_data !== prevDPState.colour_data) {
      this.setState({
        hsb: [H, S, V],
      });
    }
    if (dpState.song !== prevDPState.song) {
      this.setState({
        selectIndex: song,
      });
    }
    // if (dpState.work_mode !== prevDPState.work_mode) {
    //   this.setState({
    //     work_mode: work_mode,
    //   });
    // }
  }

  render() {
    const { dpState, home, devInfo, navigator } = this.props;
    const { child_lock, switch_led, volume, play_pause, temp_value, bright_value, power_switch, timer, scene } = dpState;
    const { hsb, selectIndex, isWhite } = this.state;
    return (
      <View style={[
        { flex: 1, backgroundColor: '#2d385f' },
        isWhite ? { backgroundColor: '#fff' } : null,
      ]} >
        <TopBar isWhite={isWhite} />
        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
          <View style={styles.topstyle}>
            <Text style={{ color: isWhite ? '#2D365F' : '#fff' }}>SOOTHER</Text>
            <Text style={{ color: isWhite ? '#2D365F' : '#fff' }} >Noah's Room</Text>
          </View>
          <View style={styles.switchstyle}>
            {dpState.power_switch === false ? null :
              <LinearGradient
                style={dimension}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                stops={{
                  "0%": "#212B4C",
                  "60%": "#212B4C",
                  "100%": "#C79DE8",
                }}
              >
                <Rect {...dimension} />
              </LinearGradient>}
            <View style={styles.switchIcon}>
              {dpState.song && (
                <View style={{ alignItems: 'center', }}>
                  <Image
                    source={MusicMap[selectIndex - 1].icon}
                    style={{
                      width: convertX(40),
                      height: convertX(45)
                    }}
                  />
                  <Text style={{ color: '#fff', top: convertX(16) }}>{MusicMap[selectIndex - 1].text}</Text>
                </View>
              )}
              {/* {dpState.timer ? <View style={styles.timerstyle}>
                <Text style={{ fontSize: convertX(13), color: '#212B4C' }}>OFF in
                  {timerhour}:{timerMin}
                </Text>
              </View> : null
              } */}
              <TouchableOpacity
                onPress={() => putDeviceData({ power_switch: !power_switch })}>
                <Image
                  source={Switch}
                  style={{
                    width: convertX(70),
                    height: convertX(70),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Play
            volume={volume}
            play_pause={play_pause}
            onChangeDp={this.handlePause}
            overValueChange={this.overValueChange}
            isWhite={isWhite}
          />
          <Sounds
            onselect={this.onselect}
            selectIndex={selectIndex}
            dataSource={this.state.dataSource2}
            activeKey={this.state.type}
            handleD1Change={this.handleD1Change2}
            isWhite={isWhite}
          />
          <Light
            switch_led={switch_led}
            hsb={hsb}
            brightness={Math.round(hsb[2])}
            temp_value={temp_value}
            bright_value={bright_value}
            onComplete={this.onComplete}
            onValueChange={this.onValueChange}
            onCompleteChange={this.onCompleteChange}
            dataSource={this.state.dataSource}
            activeKey={this.state.work_mode}
            handleD1Change={this.handleD1Change}
            isWhite={isWhite}
          />
          <Scenes
            {...this.props}
            navigator={navigator}
            isWhite={isWhite}
          />
          <Timer
            {...this.props}
            navigator={navigator}
            isWhite={isWhite}
            timer={timer}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: convertX(20), marginBottom: convertX(50) }}>
            <View style={{ width: convertX(271) }}>
              <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dp_child_lock')}</Text>
              <Text style={{ fontSize: convertX(14), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', marginTop: convertX(4) }}>{Strings.getLang('dsc_child_tishi')}</Text>
            </View>
            <SwitchButton
              value={child_lock}
              size={{ width: convertX(48), height: convertX(30), activeSize: convertX(25) }}
              style={{ right: convertX(20) }}
              onTintColor={isWhite ? '#55A074' : '#3E9AB7'}
              tintColor={'#868EAA'}
              onValueChange={() => this.onValueChange('child_lock')}
            />
          </View>
          <BottomBar isWhite={isWhite} />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    home: state.home,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onSaveHome: obj => {
      dispatch({
        type: 'SAVE_HOME',
        payload: obj,
      });
    },
    onInitData: (obj = {}) => {
      dispatch({
        type: 'INIT_DATA',
        payload: obj,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);