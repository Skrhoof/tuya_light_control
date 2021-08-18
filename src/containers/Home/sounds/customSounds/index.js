import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { Utils, Collapsible, Tabs, Slider, SwitchButton } from 'tuya-panel-kit';
import { connect } from 'react-redux';
import Strings from '../../../../i18n';
import mute from '../../../../assets/img/Mute.png';
import voice from '../../../../assets/img/voice.png';
import mute2 from '../../../../assets/img/Mute2.png';
import voice2 from '../../../../assets/img/voice2.png';
import music1 from '../../../../assets/img/music.png';
import music2 from '../../../../assets/img/music2.png';
import { LullabyMap, NaturemusicMap, SleepmusicMap } from '../utils';

const { convertX } = Utils.RatioUtils;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            active: 'lullabies',
            music: '1',
            customList: [],
        }
    }

    tapBtn = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };
    handleChange = (tab) => {
        this.setState({ active: tab });
    };

    onValueChange = () => {
        const { customIndex, customList, onSaveHome } = this.props;
        customList[customIndex].musicSwitch = !customList[customIndex].musicSwitch;
        onSaveHome({
            customList: [...customList],
        });
    };

    onselect = (value) => {
        const { customIndex, customList, onSaveHome } = this.props;
        customList[customIndex].music = value;
        this.setState({
            music: value,
        });
        onSaveHome({
            customList: [...customList],
        });
    };

    componentWillMount(){
        const { customIndex, customList, onSaveHome } = this.props;
        customList[customIndex].volume = 30;
        onSaveHome({
            customList: [...customList],
        });
    }

    // 滑动结束松手后(音量)
    onComplete = (value) => {
        const { customIndex, customList, onSaveHome } = this.props;
        customList[customIndex].volume = Math.ceil(value);
        onSaveHome({
            customList: [...customList],
        });
    };

    render() {
        const { isWhite, customList, customIndex } = this.props;
        const { musicSwitch, volume, music } = customList[customIndex];
        const { active } = this.state;
        return (
            <View style={{
                width: '100%',
                minHeight: convertX(62),
                borderBottomWidth: convertX(1),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(17), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Sounds')}</Text>
                    {/* <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} /> */}
                    <SwitchButton
                        value={musicSwitch}
                        size={{ width: convertX(48), height: convertX(30), activeSize: convertX(25) }}
                        style={{ right: convertX(20) }}
                        onTintColor={isWhite ? '#55A074' : '#3E9AB7'}
                        tintColor={'#868EAA'}
                        onValueChange={() => this.onValueChange()}
                    />
                </View>
                <View style={{ marginTop: convertX(16), flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                    <Image source={isWhite ? mute : mute2} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                    <Slider.Horizontal
                        style={{ width: 278 }}
                        maximumValue={100}
                        minimumValue={0}
                        value={volume}
                        maximumTrackTintColor={isWhite ? "#E5F2E7" : '#2E5288'}
                        minimumTrackTintColor={isWhite ? "#6E8F73" : '#FFAE9D'}
                        thumbTintColor={isWhite ? "#6E8F73" : '#FFAE9D'}
                        onSlidingComplete={val => this.onComplete(val)}
                    />
                    <Image source={isWhite ? voice : voice2} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                </View>
                <View style={styles.callapsibleStyle}>
                    <View style={{
                        marginTop: convertX(18)
                    }}>
                        {/* tab */}
                        <View style={{ alignItems: 'center' }}>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: convertX(343), height: convertX(40), borderRadius: convertX(20) }, isWhite ? { backgroundColor: '#cbdcec' } : { backgroundColor: '#212b4c' }]}>
                                <TouchableOpacity onPress={() => this.handleChange('lullabies')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'lullabies' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Lullabies')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleChange('soothing')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'soothing' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Soothing')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {active === 'lullabies' ?
                            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    {LullabyMap.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                                <TouchableOpacity
                                                    key={item.code}
                                                    style={styles.musicMap1}
                                                    onPress={() => {
                                                        this.onselect(item.value)
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={{
                                                            fontSize: convertX(16),
                                                            color: isWhite ? null : '#fff',
                                                        }}>{item.text}</Text>
                                                        {music === item.value ? <Image source={isWhite ? music2 : music1} style={{ width: convertX(20), height: convertX(20) }} /> : null}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                            :
                            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                                <View style={{ height: convertX(490) }}>
                                    <View style={{ alignItems: 'center', marginTop: convertX(20), marginBottom: convertX(16) }}>
                                        <Text style={{
                                            color: isWhite ? '#2D365F' : '#fff',
                                            fontSize: convertX(14)
                                        }}>{Strings.getLang('dsc_Nature')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {NaturemusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        style={music === item.value ? styles.musicMap3 : styles.musicMap2}
                                                        onPress={() => {
                                                            this.onselect(item.value)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={{
                                                        textAlign: 'center',
                                                        fontSize: convertX(16),
                                                        marginBottom: convertX(16),
                                                        color: isWhite ? null : '#fff',
                                                    }}>{item.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{ alignItems: 'center', marginTop: convertX(20), marginBottom: convertX(16) }}>
                                        <Text style={{
                                            color: isWhite ? '#2D365F' : '#fff',
                                            fontSize: convertX(14)
                                        }}>{Strings.getLang('dsc_Sleep')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {SleepmusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', flex: 0, alignItems: 'center', }}>
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        style={music === item.value ? styles.musicMap3 : styles.musicMap2}
                                                        onPress={() => {
                                                            this.onselect(item.value)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={{
                                                        fontSize: convertX(16),
                                                        marginBottom: convertX(16),
                                                        color: isWhite ? null : '#fff',
                                                    }}>{item.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            </ScrollView>
                        }
                    </View>
                </View>
            </View >
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
const styles = StyleSheet.create({
    tabsStyle: {
        height: convertX(38),
        borderRadius: convertX(19),
        marginTop: convertX(25),
    },
    tabActiveStyle: {
        borderRadius: convertX(17),
        backgroundColor: '#fff',
        width: convertX(178),
        height: convertX(36),
    },
    tabTextStyle: {
        color: '#2D365F',
        fontSize: convertX(15),
    },
    underlineStyle: {
        backgroundColor: '#ffffff00',
    },
    // wrapperStyle: {
    //     marginLeft: convertX(16)
    // },
    callapsibleStyle: {
        height: convertX(400),
    },
    ImageStyles: {
        width: convertX(25),
        height: convertX(25),
    },
    musicMap2: {
        width: convertX(56),
        height: convertX(56),
        borderRadius: convertX(40),
        backgroundColor: '#868EAA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: convertX(16),
    },
    musicMap3: {
        width: convertX(56),
        height: convertX(56),
        borderRadius: convertX(40),
        backgroundColor: '#868EAA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: convertX(16),
        borderWidth: convertX(3),
        borderColor: '#FDDA24',
    },
    text: {
        fontSize: convertX(13),
        marginBottom: convertX(16),
    },
    musicMap1: {
        height: convertX(62),
        width: convertX(343),
        justifyContent: 'center',
    },
});
