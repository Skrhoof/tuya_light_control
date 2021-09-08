import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, StyleSheet, Text, TouchableOpacity, NativeModules, DeviceEventEmitter
} from 'react-native';
import { Popup, Utils } from 'tuya-panel-kit';
import { connect } from 'react-redux';
import Strings from '../../../../i18n';
import TimeCt from '../TimeCt';
import { goBack, putDeviceData, convertRadix, getDeviceCloudData, saveDeviceCloudData } from '../../../../utils';
import TopBar from '../../../../components/TopBar';
const DorelManager = NativeModules.TYRCTDorelManager;

const { convertX } = Utils.RatioUtils;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listValue: '00',
            hour: '00',
            min: '00',
            second: '00',
            isWhite: true,
            finalTime: '', // 最终显示的时间
            resCloud: 0, // 剩余倒计时
        };
    }

    componentDidMount() {
        const { dpState } = this.props;
        const { timer } = dpState;
        // 获取云端存的定时
        getDeviceCloudData('countDown').then(res => {
            const setTime = res.countDown;
            // 剩余时间
            const resCloud = setTime - new Date().getTime();
            if (resCloud <= 0 || isNaN(resCloud)) {
                this.setState({ resCloud: 0 });
            } else {
                this.setState({ resCloud }, () => {
                    this.handleCloudTime(resCloud);
                });
            }
        });
        if (DorelManager && DorelManager.isInDarkMode) {
            DorelManager.isInDarkMode(res => {
                this.setState({ isWhite: !res });
            });
        }
        const listValue = convertRadix(timer.substring(0, 2), 16, 10, 2);
        const hour = convertRadix(timer.substring(2, 4), 16, 10, 2);
        const min = convertRadix(timer.substring(4, 6), 16, 10, 2);
        const second = convertRadix(timer.substring(6, 8), 16, 10, 2);
        if (timer == '00000000') {
            this.setState({
                listValue: '00',
                hour: '00',
                min: '00',
                second: '00',
            });
        } else {
            this.setState({
                listValue: listValue,
                hour: hour,
                min: min,
                second: second,
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { dpState } = this.props;
        const { timer } = dpState;
        const listValue = convertRadix(timer.substring(0, 2), 16, 10, 2);
        const hour = convertRadix(timer.substring(2, 4), 16, 10, 2);
        const min = convertRadix(timer.substring(4, 6), 16, 10, 2);
        const second = convertRadix(timer.substring(6, 8), 16, 10, 2);
        // console.log("内部倒计时",timer,prevProps.dpState.timer);
        if (timer !== prevProps.dpState.timer) {

            if (timer == '00000000') {
                this.setState({
                    listValue: '00',
                    hour: '00',
                    min: '00',
                    second: '00',
                });

            } else {
                this.setState({
                    listValue: listValue,
                    hour: hour,
                    min: min,
                    second: second,
                });
                const setTime = (parseInt(hour) * 3600 + parseInt(min) * 60) * 1000;
                // 云端应该存的设置的时间的时间戳
                const resTime = setTime + new Date().getTime();
                saveDeviceCloudData('countDown', { countDown: resTime });
            }
            clearInterval(this.timer2);
            getDeviceCloudData('countDown').then(res => {
                const setTime = res.countDown;
                // 剩余时间
                const resCloud = setTime - new Date().getTime();
                if (resCloud <= 0 || isNaN(resCloud)) {
                    this.setState({ resCloud: 0 });
                } else {
                    this.setState({ resCloud }, () => {
                        this.handleCloudTime(resCloud);
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer2);
    }

    timerend = () => {
        const { isWhite } = this.state;
        Popup.list({
            type: "radio",
            dataSource: [
                {
                    key: "1",
                    title: Strings.getLang('dsc_off'),
                    value: "00",
                },
                {
                    key: "2",
                    title: Strings.getLang('dsc_on'),
                    value: "01",
                },
            ],
            title: Strings.getLang('dsc_Timer'),
            cancelText: Strings.getLang('dsc_cancel'),
            confirmText: Strings.getLang('dsc_confirm'),
            value: this.state.listValue,
            onMaskPress: ({ close }) => {
                close();
            },
            onConfirm: (value, { close }) => {
                this.setState({ listValue: value });
                close();
            },
        });
    }

    _handleChange = type => value => {
        switch (type) {
            case 'Hour':
                this.setState({
                    hour: value,
                })
                break;
            case 'Min':
                this.setState({
                    min: value,
                })
                break;
            default:
                break;
        };
    }

    // 将剩余时间的时间戳转成 时：分：秒
    handleCloudTime = countDown => {
        if (typeof countDown === 'number' && countDown >= 0 && !isNaN(countDown)) {
            let time = parseInt(countDown / 1000);
            this.timer2 = setInterval(() => {
                if (time <= 0) {
                    this.setState({ resCloud: 0 });
                    putDeviceData({
                        timer: '00000000',
                    })
                    clearInterval(this.timer2);
                    //console.log(111111111);
                }
                time--;
                const h = Math.floor(time / 3600);
                const m = Math.floor(time / 60) % 60;
                const s = time % 60;
                const H = `${h}`.padStart(2, '0');
                const M = `${m}`.padStart(2, '0');
                const S = `${s}`.padStart(2, '0');
                const finalTime = `${H}:${M}:${S}`;
                this.setState({ finalTime });
            }, 1000);
        } else {
            this.setState({ resCloud: 0 });
        }
    };

    Onstart = () => {
        const { dpState, home, onSaveHome } = this.props;
        const { timer } = dpState;
        const { hour, min, listValue, second, resCloud } = this.state;
        if (timer === '00000000' || resCloud === 0) {
            const setTime = (parseInt(hour) * 3600 + parseInt(min) * 60) * 1000;
            // 云端应该存的设置的时间的时间戳
            const resTime = setTime + new Date().getTime();
            saveDeviceCloudData('countDown', { countDown: resTime });
            putDeviceData({ timer: `${listValue}${convertRadix(hour, 10, 16, 2)}${convertRadix(min, 10, 16, 2)}${second}`, });
            // console.log("Onstart DeviceEventEmitter");
            DeviceEventEmitter.emit("newTimer", `${listValue}${convertRadix(hour, 10, 16, 2)}${convertRadix(min, 10, 16, 2)}${second}`);
            setTimeout(goBack, 800);
        } else {
            putDeviceData({
                timer: '00000000',
            })
            home.timer = 0;
            onSaveHome();
            // goBack();
        }
    }

    render() {
        const { dpState } = this.props;
        const { timer } = dpState;
        const { hour, min, second, listValue, isWhite, finalTime, resCloud } = this.state;
        return (
            <View style={[
                { flex: 1, backgroundColor: '#2d385f' },
                isWhite ? { backgroundColor: '#fff' } : null,
            ]} >
                <TopBar isWhite={isWhite} />
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }}>
                    <Text
                        style={{
                            fontSize: convertX(15),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>{Strings.getLang('dsc_SET_TIMER')}</Text>
                </View>
                {resCloud === 0 || timer === '00000000' ?
                    <TimeCt
                        hour={hour}
                        min={min}
                        onChangeHour={this._handleChange('Hour')}
                        onChangeMin={this._handleChange('Min')}
                        isWhite={isWhite}
                    />
                    :
                    <View style={{ height: convertX(171), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{
                            fontSize: convertX(30),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>
                            {finalTime}
                        </Text>
                    </View>
                }
                <View style={{
                    width: convertX(343),
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                    borderTopColor: '#DFEAF4',
                    borderTopWidth: convertX(1),
                    marginLeft: convertX(16),
                }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                        <Text
                            style={{
                                fontSize: convertX(17),
                                color: isWhite ? '#2D365F' : '#fff',
                            }}>{Strings.getLang('dsc_time_end')}</Text>
                        <Text style={{
                            color: isWhite ? '#2D365F' : '#fff',
                            fontSize: convertX(13),
                            right: convertX(12)
                        }}>{this.state.listValue === '00' ? Strings.getLang('dsc_off') : Strings.getLang('dsc_on')}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        width: convertX(343),
                        height: convertX(48),
                        backgroundColor: Strings.getLang('dsc_version') == 'maxi' ? '#1875A8' : '#FDDA24',
                        borderRadius: convertX(24),
                        marginTop: convertX(24),
                        marginLeft: convertX(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => this.Onstart()}
                >
                    <Text style={{
                        fontSize: convertX(16),
                        color: Strings.getLang('dsc_version') == 'maxi' ? '#FFFFFF' : '#2D385F',
                    }}>
                        {timer === '00000000' || resCloud === 0 ? Strings.getLang('dsc_start') : Strings.getLang('dsc_cancel')}
                    </Text>
                </TouchableOpacity>

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

