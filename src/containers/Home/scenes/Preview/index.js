import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, NativeModules, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { TYSdk, Utils } from 'tuya-panel-kit';
import { convertX, goBack, putDeviceData } from '../../../../utils';
import Strings from '../../../../i18n';
import Open from './Animated/index';
import { MusicMap } from '../../sounds/utils';
import TopBar from '../../../../components/TopBar';
import { combineScene } from '../utils';

const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const DorelManager = NativeModules.TYRCTDorelManager;

class Index extends Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        isbackground: true,
        isWhite: false,
        timer: 10,
    };

    componentDidMount() {
        if (DorelManager && DorelManager.isInDarkMode) {
            DorelManager.isInDarkMode(res => {
                this.setState({ isWhite: !res });
            });
        }
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
        );
    }

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
            const { onSaveHome, home } = this.props;
            const { customIndex, customList } = home;
            customList[customIndex].State = '00';
            // onSaveHome({
            //     customList: [...customList],
            // });
            putDeviceData({
                scene: combineScene(customList),
            });
            goBack()
            this.setState({ timer: 10 });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    CancelPreview = () => {
        const { onSaveHome, home } = this.props;
        const { customList, customIndex } = home;
        customList[customIndex].State = '00';
        onSaveHome({
            customList: [...customList],
        });
        putDeviceData({
            scene: combineScene(customList),
        });
        goBack();
    }

    render() {
        const { isWhite, isbackground } = this.state;
        const { home } = this.props;
        const { customIndex, customList } = home;
        const { H, S, V, music, text, pattern } = customList[customIndex];
        return (
            <View style={{
                flex: 1,
                backgroundColor: pattern == '1' ? Color.hsb2hex(...[H, S / 10, V / 10]) : '#FBF1D4',
            }}>
                {/* <TopBar
                    background={Color.hsb2hex(...[H, S, V])}
                    title={Strings.getLang('dsc_preview')}
                    color="#fff"
                    onBack={goBack}
                /> */}
                <TopBar
                    isWhite={isWhite}
                    isbackground={isbackground}
                    pattern={pattern}
                    H={H}
                    S={S / 10}
                    V={V / 10}
                />
                {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: convertX(50), borderBottomWidth: convertX(1), borderBottomColor: '#fff' }}>
                    <Text style={{ color: '#fff' }}>PREVIEW ON DEVICE</Text>
                </View> */}
                <View style={{ justifyContent: 'center', alignItems: 'center', height: convertX(50), borderBottomWidth: convertX(1), borderBottomColor: '#DFEAF4' }}>
                    <Text
                        style={[
                            { color: '#fff', fontSize: convertX(14) },
                        ]}
                    >
                        {Strings.getLang('dsc_preview_device')}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: convertX(450), flexDirection: 'column', marginTop: convertX(54) }}>
                    <Text style={{ color: '#fff', fontSize: convertX(18) }}>
                        {Strings.getLang('dsc_Custom_Scenes')}：{text}</Text>
                    <Open
                        iconTintColor={'#464646'}
                        ringBorderColor={'#FFF'}
                        musicSmImg={MusicMap[music - 1].icon}
                    // musicBgImgStyle={{
                    //     justifyContent: 'center',
                    //     width: convertX(100),
                    //     height: convertX(100),
                    //     alignItems: 'center',
                    //     backgroundColor: '#FFFFFF',
                    //     borderRadius: convertX(60),
                    // }}
                    />
                    <Text style={{ fontSize: convertX(44), color: '#fff' }}>{this.state.timer}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ color: '#fff' }}>{Strings.getLang('dsc_Sending_device')}</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: convertX(1),
                            borderColor: '#fff',
                            width: convertX(343),
                            height: convertX(48),
                            backgroundColor: pattern == '1' ? Color.hsb2hex(...[H, S / 10, V / 10]) : '#FBF1D4',
                            borderRadius: convertX(24),
                            marginTop: convertX(34),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={this.CancelPreview}
                    >
                        <Text style={{
                            fontSize: convertX(15),
                            color: '#fff',
                        }}>{Strings.getLang('dsc_cancel')}</Text>
                    </TouchableOpacity>
                </View>
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
