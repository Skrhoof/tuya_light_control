import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Utils, Popup, SwitchButton, Collapsible, Toast } from 'tuya-panel-kit';
import moment from 'moment';
import Echarts from '../../../components/Echarts';
import JSONView from '../../../components/JSONView';
import BottomBar from '../../../components/BottomBar';
import TopBar from '../../../components/TopBar';
import jt_shang from '../../../assets/img/jt_shang.png';
import jt_xia from '../../../assets/img/jt_xia.png';

const { viewWidth, convertX, convertY, isIos } = Utils.RatioUtils;

export default class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isWhite: true, // 是否是light
            switchBtn: false,
            active: 'power',
            volumeBtn: false,
            timely: 'weekly',
            days: []
        }
        this.volunmArr = [...Array(101).keys()];
        this.data = [];
    }

    onValueChange = (type) => {
        const { switchBtn, volumeBtn } = this.state;
        switch (type) {
            case 'switch_btn':
                this.setState({ switchBtn: !switchBtn })
                break;
            case 'volume_btn':
                this.setState({ volumeBtn: !volumeBtn })
                break;
            default:
                break;
        }
    }

    handleNavChange = (type) => {
        switch (type) {
            case 'power':
                this.setState({ active: type })
                break;
            case 'light':
                this.setState({ active: type })
                break;
            case 'weekly':
                this.setState({ timely: type })
                break;
            case 'monthly':
                this.setState({ timely: type });
                break;
            default:
                break;
        }

    }

    timeForMat = (count) => {
        // 拼接时间
        const time1 = new Date()
        const time2 = new Date()
        if (count === 1) {
            time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
        } else {
            if (count >= 0) {
                time1.setTime(time1.getTime())
            } else {
                if (count === -2) {
                    time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000) * 2)
                } else {
                    time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000))
                }
            }
        }

        const Y1 = time1.getFullYear()
        const M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
        const D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
        const timer1 = Y1 + '-' + M1 + '-' + D1  // 当前时间

        time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
        const Y2 = time2.getFullYear()
        const M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
        const D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
        const timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的时间
        return [timer2, timer1]
    }

    getDayArr(startDay, endDay) {
        let startVal = moment(new Date(startDay)).format('YYYY-MM-DD')
        let dayArr = []
        while (moment(startVal).isBefore(endDay)) {
            dayArr.push(startVal)
            // 自增
            startVal = moment(new Date(startVal)).add(1, 'day').format('YYYY-MM-DD')
        }
        // 将结束日期的天放进数组
        dayArr.push(moment(new Date(endDay)).format('YYYY-MM-DD'))
        return dayArr
    }

    radomDate = (num, min, max) => {
        return Array(num).fill(1).map(v => Math.floor(Math.random() * (max - min)) + min);
    }

    render() {
        const { countData } = this.props;
        const { powerSwitch, lightSwitch, volunmArr } = countData;
        const { isWhite, switchBtn, active, volumeBtn, timely } = this.state;
        let days = [], radomDate = [], interval = 0;
        let startendTime = [];
        if (timely == 'weekly') {
            startendTime = this.timeForMat(6)
            days = this.getDayArr(...startendTime);
            radomDate = this.radomDate(7, 4, 16);
        } else {
            startendTime = this.timeForMat(30)
            days = this.getDayArr(...startendTime);
            radomDate = this.radomDate(31, 4, 16);
            interval = 4
        }

        const option = {
            xAxis: {
                data: days,
                axisLabel: {
                    rotate: 45,
                    interval: interval
                }
            },
            yAxis: {
                name: 'h'
            },
            series: [
                {
                    name: '光照时间',
                    data: radomDate,
                    type: 'line',
                }
            ],
            title: {
                text: "光照时间统计",
                left: "center",
                subtext: `${startendTime[0]}至${startendTime[1]}`,
                textStyle: {
                    fontSize: 15
                },
                subtextStyle: {
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        type: 'dashed',
                        color: '#919191',
                    },
                    axis: 'x',
                    snap: true,
                    label: {
                        show: false,
                    },
                },
                showContent: true,
                confine: true,
                backgroundColor: '#4A4A4A',
                borderColor: '#FF5050',
                borderWidth: 2,
                transitionDuration: 0,
                textStyle: {
                    color: '#fff',
                },
            },
        }

        const seriesOpiton = {
            barWidth: '40%',
            itemStyle: {
                color: '#73c0de',
            }
        }

        const powerOption = {
            xAxis: {
                data: ['电源开关次数']
            },
            yAxis: {
                minInterval: 1,
                name: '次'
            },
            series: [
                {
                    type: 'bar',
                    data: [powerSwitch],
                    ...seriesOpiton
                }
            ],
            title: {
                text: "电源开关次数统计",
                left: "center",
                textStyle: {
                    fontSize: 15
                },
            }
        };

        const lightOption = {
            xAxis: {
                data: ['灯光开关次数']
            },
            yAxis: { minInterval: 1, name: '次' },
            series: [
                {
                    type: 'bar',
                    data: [lightSwitch],
                    ...seriesOpiton
                }
            ],
            title: {
                text: "灯光开关次数统计",
                left: "center",
                textStyle: {
                    fontSize: 15
                },
            }
        };

        const volumeOption = {
            xAxis: {
                data: this.volunmArr,
                axisLabel: {
                    interval: 10
                }
            },
            yAxis: {
                minInterval: 1,
                name: '次'
            },
            series: [
                {
                    name: '音量',
                    data: volunmArr,
                    type: 'line',
                }
            ],
            title: {
                text: "音量选择统计",
                left: "center",
                textStyle: {
                    fontSize: 15
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        type: 'dashed',
                        color: '#919191',
                    },
                    axis: 'x',
                    snap: true,
                    label: {
                        show: false,
                    },
                },
                showContent: true,
                confine: true,
                backgroundColor: '#4A4A4A',
                borderColor: '#FF5050',
                borderWidth: 2,
                transitionDuration: 0,
                textStyle: {
                    color: '#fff',
                },
            },
        }

        return (
            <View style={[
                { flex: 1, backgroundColor: '#2d385f' },
                isWhite ? { backgroundColor: '#fff' } : null,
            ]}>
                <TopBar isWhite={isWhite} />
                <ScrollView>
                    <View style={{
                        borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                        borderBottomWidth: convertX(1),
                    }}>
                        {/* tab */}
                        <View style={{ alignItems: 'center' }}>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: convertX(343), height: convertX(40), borderRadius: convertX(20) }, isWhite ? { backgroundColor: '#cbdcec' } : { backgroundColor: '#212b4c' }]}>
                                <TouchableOpacity onPress={() => this.handleNavChange('weekly')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, timely === 'weekly' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>每周</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleNavChange('monthly')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, timely === 'monthly' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>每月</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Echarts
                            option={option}
                            width={isIos ? viewWidth : viewWidth - convertX(20)}
                            height={convertY(200)}
                        />
                    </View>
                    {/* 开关数据 */}
                    <View style={{
                        borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                        borderBottomWidth: convertX(1),
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: convertX(20) }}>
                            <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>开关次数数据统计</Text>
                            <TouchableOpacity onPress={() => this.onValueChange('switch_btn')}>
                                <Image source={switchBtn ? jt_xia : jt_shang} style={{ height: convertX(25), width: convertX(18), marginRight: convertX(20) }} />
                            </TouchableOpacity>
                        </View>
                        <Collapsible
                            collapsed={switchBtn}
                            align="top"
                        >
                            {/* tab */}
                            <View style={{ alignItems: 'center' }}>
                                <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: convertX(343), height: convertX(40), borderRadius: convertX(20) }, isWhite ? { backgroundColor: '#cbdcec' } : { backgroundColor: '#212b4c' }]}>
                                    <TouchableOpacity onPress={() => this.handleNavChange('power')}>
                                        <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'power' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                            <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>电源开关</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleNavChange('light')}>
                                        <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'light' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                            <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>灯光开关</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                active === 'power' ? (<Echarts
                                    option={powerOption}
                                    width={isIos ? viewWidth : viewWidth - convertX(20)}
                                    height={convertY(200)}
                                />) : (<Echarts
                                    option={lightOption}
                                    width={isIos ? viewWidth : viewWidth - convertX(20)}
                                    height={convertY(200)}
                                />)
                            }
                        </Collapsible>
                    </View>
                    {/* 音量数据 */}
                    <View style={{
                        borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                        borderBottomWidth: convertX(1),
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: convertX(20) }}>
                            <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>音量数据统计</Text>
                            <TouchableOpacity onPress={() => this.onValueChange('volume_btn')}>
                                <Image source={volumeBtn ? jt_xia : jt_shang} style={{ height: convertX(25), width: convertX(18), marginRight: convertX(20) }} />
                            </TouchableOpacity>
                        </View>
                        <Collapsible
                            collapsed={volumeBtn}
                            align="top"
                        >
                            <Echarts
                                option={volumeOption}
                                width={isIos ? viewWidth : viewWidth - convertX(20)}
                                height={convertY(200)}
                            />
                        </Collapsible>
                    </View>

                </ScrollView>
                <BottomBar isWhite={isWhite} navigator={this.props.navigator} />
            </View>
        )
    }
}
