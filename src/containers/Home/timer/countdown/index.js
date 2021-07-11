import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, StyleSheet, Text, TouchableOpacity, NativeModules
} from 'react-native';
import { Popup, Utils } from 'tuya-panel-kit';
import Strings from '../../../../i18n';
import TimeCt from '../TimeCt';
import { goBack, putDeviceData, convertRadix } from '../../../../utils';
import TopBar from '../../../../components/TopBar';
const DorelManager = NativeModules.TYRCTDorelManager;

const { convertX } = Utils.RatioUtils;

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listValue: '00',
            hour: '00',
            min: '00',
            second: '00',
            isWhite: true,
        };
    }

    componentDidMount() {
        const { dpState } = this.props;
        const { timer } = dpState;
        if (DorelManager && DorelManager.isInDarkMode) {
            DorelManager.isInDarkMode(res => {
                this.setState({ isWhite: !res });
            });
        }
        const listValue = convertRadix(timer.substring(0, 2), 16, 10, 2);
        const hour = convertRadix(timer.substring(2, 4), 16, 10, 2);
        const min = convertRadix(timer.substring(4, 6), 16, 10, 2);
        const second = convertRadix(timer.substring(6, 8), 16, 10, 2);
        if (timer == '') {
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
        if (timer !== prevProps.dpState.timer) {
            if (timer == '') {
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

    handelChangeTime = type => value => {
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

    render() {
        const { dpState } = this.props;
        const { timer } = dpState;
        const { hour, min, second, listValue, isWhite } = this.state;
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
                {timer === '' ?
                    <View>
                        <TimeCt
                            hour={hour}
                            min={min}
                            onChangeHour={this.handelChangeTime('Hour')}
                            onChangeMin={this.handelChangeTime('Min')}
                            isWhite={isWhite}
                        />
                    </View>
                    :
                    <View style={{ height: convertX(171), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{
                            fontSize: convertX(30),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>
                            {hour}:{min}:{second}
                        </Text>
                    </View>
                }
                <TouchableOpacity style={{
                    width: convertX(343),
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                    borderTopColor: '#DFEAF4',
                    borderTopWidth: convertX(1),
                    marginLeft: convertX(16),
                }} onPress={() => this.timerend()}>
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
                </TouchableOpacity>
                {timer === '' ?
                    <TouchableOpacity
                        style={{
                            width: convertX(343),
                            height: convertX(48),
                            backgroundColor: '#1875A8',
                            borderRadius: convertX(24),
                            marginTop: convertX(24),
                            marginLeft: convertX(16),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            putDeviceData({
                                timer: `${listValue}${convertRadix(hour, 10, 16, 2)}${convertRadix(min, 10, 16, 2)}${second}`,
                            });
                            goBack()
                        }
                        }
                    >
                        <Text style={{
                            fontSize: convertX(15),
                            color: '#fff',
                        }}>{Strings.getLang('dsc_start')}</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        style={{
                            width: convertX(343),
                            height: convertX(48),
                            backgroundColor: '#1875A8',
                            borderRadius: convertX(24),
                            marginTop: convertX(24),
                            marginLeft: convertX(16),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => putDeviceData({
                            timer: '',
                        })}
                    >
                        <Text style={{
                            fontSize: convertX(15),
                            color: '#fff',
                        }}>{Strings.getLang('dsc_cancel')}</Text>
                    </TouchableOpacity>
                }

            </View>
        );
    }
}

