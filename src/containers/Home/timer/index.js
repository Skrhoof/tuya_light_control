import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter
} from 'react-native';
import { Slider, Utils, IconFont } from 'tuya-panel-kit';
import { connect } from 'react-redux';
import { electricity, convertRadix, getDeviceCloudData, saveDeviceCloudData, putDeviceData } from '../../../utils';
import Strings from '../../../i18n';

const { convertX } = Utils.RatioUtils;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 0, // 1的倒计时
            nowDate: new Date().getTime(), // 获取当前的时间戳
            cloudDate: 0, // 云端获取的设置的时间戳
            resCloud: 0, // 剩余倒计时
            finalTime: '', // 最终显示的倒计时
            switch_led: false, // 开关状态
        };
    }

    componentDidMount() {
        DeviceEventEmitter.addListener("newTimer", (param) => {
            const timer = param;
            if (timer !== undefined) {
                //console.log(timer);
                const hour = convertRadix(timer.substring(2, 4), 16, 10, 2);
                const min = convertRadix(timer.substring(4, 6), 16, 10, 2);
                const setTime = (parseInt(hour) * 3600 + parseInt(min) * 60) * 1000;
                // 云端应该存的设置的时间的时间戳
                const resTime = setTime + new Date().getTime();
                saveDeviceCloudData('countDown', { countDown: resTime }).then(
                    () => {
                        // 获取云端存的定时
                        getDeviceCloudData('countDown').then(res => {
                            const setTime = res.countDown;
                            // 剩余时间
                            const resCloud = setTime - new Date().getTime();
                            if (resCloud <= 0 || isNaN(resCloud)) {
                                this.setState({ resCloud: 0 });
                                clearInterval(this.timer1);
                            } else {
                                this.setState({ resCloud }, () => {
                                    this.handleCloudTime(resCloud);
                                });
                            }
                        })
                    }
                );
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { dpState, devInfo, schema, home, onSaveHome } = this.props;
        const { devId, name } = devInfo;
        const { timer, switch_led } = dpState;
        const { finalTime, resCloud } = this.state;
        // console.log("componentDidUpdate");
        // console.log(timer, prevProps.dpState.timer);
        // console.log('time', timer);
        if (home.timer === 0) {
            clearInterval(this.timer1);
            home.timer = 1;
            onSaveHome();
        }
        if (dpState !== prevProps.dpState) {
            this.setState({
                timer,
            });
        }
        if (switch_led !== prevProps.dpState.switch_led) {
            this.setState({ switch_led })
        }
        if (timer !== prevProps.dpState.timer) {
            // console.log(timer, prevProps.dpState.timer);
            if (timer !== undefined) {
                const hour = convertRadix(timer.substring(2, 4), 16, 10, 2);
                const min = convertRadix(timer.substring(4, 6), 16, 10, 2);
                const setTime = (parseInt(hour) * 3600 + parseInt(min) * 60) * 1000;
                // 云端应该存的设置的时间的时间戳
                const resTime = setTime + new Date().getTime();
                saveDeviceCloudData('countDown', { countDown: resTime }).then(
                    () => {
                        // 获取云端存的定时
                        getDeviceCloudData('countDown').then(res => {
                            const setTime = res.countDown;
                            // 剩余时间
                            const resCloud = setTime - new Date().getTime();
                            if (resCloud <= 0 || isNaN(resCloud)) {
                                this.setState({ resCloud: 0 });
                                clearInterval(this.timer1);
                            } else {
                                this.setState({ resCloud }, () => {
                                    this.handleCloudTime(resCloud);
                                });
                            }
                        })
                    }
                );
            }
            // 开始计时器
            // home.timer = 1;
            // onSaveHome();
        }
        if (finalTime !== prevState.finalTime) {
            if (resCloud == 0) {
                putDeviceData({
                    timer: '00000000',
                })
                //console.log(finalTime, prevState.finalTime);
                clearInterval(this.timer1);
            }
        }
    }
    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners();
        clearInterval(this.timer1);
    }
    // 将剩余时间的时间戳转成 时：分：秒
    handleCloudTime = countDown => {
        if (typeof countDown === 'number' && countDown >= 0 && !isNaN(countDown)) {
            let time = parseInt(countDown / 1000);
            if (this.timer1) {
                clearInterval(this.timer1);
            }
            this.timer1 = setInterval(() => {
                time--;
                if (time <= 0) {
                    this.setState({ resCloud: 0 });
                }
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



    // componentWillUnmount() {
    //     clearInterval(this.timer1);
    // }

    unTimerto = () => {
        const { navigator } = this.props;
        navigator && navigator.push({ id: 'Countdown' });
    };
    render() {
        const { finalTime, resCloud, switch_led, timer } = this.state;
        const { isWhite } = this.props;
        const status = switch_led ? Strings.getLang('dsc_off_in') : Strings.getLang('dsc_on_in');
        return (
            <TouchableOpacity style={{
                height: convertX(62),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}
                onPress={() => this.unTimerto()}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{
                        fontSize: convertX(16),
                        left: convertX(20),
                        color: isWhite ? '#2D365F' : '#fff',
                    }}>{Strings.getLang('dsc_Timer')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: convertX(13), right: convertX(25),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>
                            {(resCloud > 0 && timer !== '00000000') ? `${status}${finalTime}` : null}
                        </Text>
                        <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                    </View>
                </View>
            </TouchableOpacity>
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