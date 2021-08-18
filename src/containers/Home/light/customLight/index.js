import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Slider, Utils, Tabs, SwitchButton } from 'tuya-panel-kit';
import ColorPicker from '../../../../components/color-picker/color-picker';
import { connect } from 'react-redux';
import ColorSlider from '../../../../components/ColorSlider';
import light1 from '../../../../assets/img/light1.png';
import light2 from '../../../../assets/img/light2.png';
import light3 from '../../../../assets/img/light3.png';
import light4 from '../../../../assets/img/light4.png';
import TempPicker from '../../../../components/TemperaturePicker';
import Strings from '../../../../i18n';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
const { ColorTempSlider2 } = ColorSlider;
const { ColorTempSlider1 } = ColorSlider;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: true,
            hsb: [180, 100, 100],
            dataSource: [
                { value: '1', label: Strings.getLang('dsc_colours') },
                { value: '0', label: Strings.getLang('dsc_white') },
            ],
            work_mode: '1',
            isWhite: true,
        };
    }

    // componentDidUpdate(prevProps,prevState){
    //     if(this.state!==prevState){
    //         this.setState({
    //             hsb,
    //         });
    //     }
    // }

    componentDidMount() {
        const { newlist, customIndex } = this.props;
        this.setState({ hsb: [newlist[customIndex].H, newlist[customIndex].S / 10, newlist[customIndex].V / 10] });
    }

    handleChange = (tab) => {
        const { customIndex, newlist, onSaveHome } = this.props;
        newlist[customIndex].pattern = tab;
        this.setState({
            work_mode: tab,
        });
        onSaveHome({
            customList: [...newlist],
        });
    };

    // 滑动结束松手后(亮度)
    onComplete = (type, value) => {
        const { customIndex, newlist, onSaveHome } = this.props;
        switch (type) {
            case 'temp_value':
                newlist[customIndex].temp_value = Math.round(value) * 10;
                onSaveHome({
                    customList: [...newlist],
                });
                break;
            case 'bright_value':
                newlist[customIndex].bright_value = Math.round(value);
                onSaveHome({
                    customList: [...newlist],
                });
                break;
            case 'brightness':
                const { hsb } = this.state;
                hsb[2] = Math.ceil(value);
                this.setState({
                    hsb: [...hsb],
                });
                newlist[customIndex].H = hsb[0];
                newlist[customIndex].S = hsb[1] * 10;
                newlist[customIndex].V = hsb[2] * 10;
                onSaveHome({
                    customList: [...newlist],
                });
                break;
            default:
                break;
        };
    };

    onValueChange = () => {
        const { customIndex, newlist, onSaveHome } = this.props;
        newlist[customIndex].LightSwitch = !newlist[customIndex].LightSwitch;
        onSaveHome({
            customList: [...newlist],
        });
    };

    onCompleteChange = (hsb) => {
        this.setState({
            hsb,
        });
        const { customIndex, newlist, onSaveHome } = this.props;
        newlist[customIndex].H = Math.round(hsb[0]);
        newlist[customIndex].S = Math.round(hsb[1]) * 10;
        newlist[customIndex].V = Math.round(hsb[2]) * 10;
        onSaveHome({
            customList: [...newlist],
        });
    };

    render() {
        const { hsb, work_mode, dataSource } = this.state;
        const { isWhite, newlist, customIndex } = this.props;
        const { LightSwitch, temp_value, bright_value, H, S, V, brightness } = newlist[customIndex];
        return (
            <View style={{
                minHeight: convertX(69),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_light')}</Text>
                    <SwitchButton
                        value={LightSwitch}
                        size={{ width: convertX(48), height: convertX(30), activeSize: convertX(25) }}
                        style={{ right: convertX(20) }}
                        onTintColor={isWhite ? '#55A074' : '#3E9AB7'}
                        tintColor={'#868EAA'}
                        onValueChange={() => this.onValueChange()}
                    />
                </View>
                <View style={{
                    marginTop: convertX(18)
                }}>
                    {/* tab */}
                    <View style={{ alignItems: 'center' }}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: convertX(343), height: convertX(40), borderRadius: convertX(20) }, isWhite ? { backgroundColor: '#cbdcec' } : { backgroundColor: '#212b4c' }]}>
                            <TouchableOpacity onPress={() => this.handleChange('1')}>
                                <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, work_mode === '1' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                    <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_colours')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleChange('0')}>
                                <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, work_mode === '0' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                    <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_white')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        height: convertX(335),
                    }}>
                        {this.state.work_mode === '1' ?
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ alignItems: 'center', width: convertX(343) }}>
                                    <ColorPicker
                                        style={{}}
                                        width={convertX(239)}
                                        height={convertX(239)}
                                        boxStyle={{}}
                                        hasInner={true}
                                        offsetAngle={90}
                                        reversal={true}
                                        innerElement={
                                            <View style={{
                                                width: convertX(79),
                                                height: convertX(79),
                                                backgroundColor: Color.hsb2hex(...hsb),
                                                borderRadius: convertX(50),
                                            }}
                                            ></View>
                                        }
                                        innerRadius={35}
                                        // colorPickerImage={color}
                                        hsb={hsb}
                                        // onValueChange={this.handleValueChange}
                                        onComplete={this.onCompleteChange}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: convertX(343) }}>
                                    <Image source={isWhite ? light1 : light3} style={{ width: convertX(20), height: convertX(20) }} />
                                    <ColorTempSlider1
                                        value={V / 10}
                                        // onChange={this.handleWto}
                                        onComplete={value => {
                                            this.onComplete("brightness", value)
                                        }}
                                        min={1}
                                        max={100}
                                        // containerStyle={styles.containerStyle}
                                        trackStyle={styles.trackStyle}
                                        thumbStyle={styles.thumbStyle}
                                        hsb={hsb}
                                        containerStyle={{ width: convertX(301) }}
                                    />
                                    <Image source={isWhite ? light2 : light4} style={{ width: convertX(22), height: convertX(22) }} />
                                </View>
                            </View>
                            :

                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: convertX(343) }}>
                                    <TempPicker
                                        width={convertX(239)}
                                        height={convertX(239)}
                                        hasInner={true}
                                        offsetAngle={90}
                                        reversal={true}
                                        innerRadius={convertX(35)}
                                        temp_value={temp_value / 10}
                                        min={0}
                                        max={100}
                                        onComplete={(value) => {
                                            this.onComplete("temp_value", value)
                                        }}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: convertX(343) }}>
                                    <Image source={isWhite ? light1 : light3} style={{ width: convertX(20), height: convertX(20) }} />
                                    <ColorTempSlider2
                                        value={bright_value}
                                        min={10}
                                        max={1000}
                                        // onChange={this.handleWto}
                                        onComplete={(value) => this.onComplete("bright_value", value)}
                                        // containerStyle={styles.containerStyle}
                                        trackStyle={styles.trackStyle}
                                        thumbStyle={styles.thumbStyle}
                                        containerStyle={{ width: convertX(300) }}
                                    />
                                    <Image source={isWhite ? light2 : light4} style={{ width: convertX(23), height: convertX(23) }} />
                                </View>
                            </View>
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
    lightContainer: {
        minHeight: convertX(69),
        borderBottomColor: '#DFEAF4',
        borderBottomWidth: convertX(1),
    },
    tabsStyle: {
        height: convertX(38),
        borderRadius: convertX(19),
        marginTop: convertX(25),
    },
    underlineStyle: {
        backgroundColor: '#ffffff00',
    },
    callapsibleStyle: {
        minHeight: convertX(392),
    },
    thumb: {
        width: convertX(28),
        height: convertX(28),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerStyle: {
        width: convertX(345),
        backgroundColor: '#454545',
        height: convertX(60),
    },
    trackStyle: {
        width: convertX(285),
        height: convertX(16),
    },
    thumbStyle: {
        width: convertX(30),
        height: convertX(30),
        borderWidth: convertX(2),
        backgroundColor: '#eeeeee',
    },
    SliderStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
