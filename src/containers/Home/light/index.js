import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Slider, Utils, SwitchButton, Collapsible } from 'tuya-panel-kit';
import ColorPicker from '../../../components/color-picker/color-picker';
import ColorSlider from '../../../components/ColorSlider';
import light1 from '../../../assets/img/light1.png';
import light2 from '../../../assets/img/light2.png';
import light3 from '../../../assets/img/light3.png';
import light4 from '../../../assets/img/light4.png';
import TempPicker from '../../../components/TemperaturePicker';
import Strings from '../../../i18n';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
const { ColorTempSlider2 } = ColorSlider;
const { ColorTempSlider1 } = ColorSlider;
export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            onValueChange,
            switch_led,
            temp_value,
            bright_value,
            onComplete,
            hsb,
            onCompleteChange,
            brightness,
            handleChange,
            active,
            isWhite,
            onStopScroll
        } = this.props;
        return (
            <View style={{
                minHeight: switch_led ? convertX(441) : convertX(69),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_light')}</Text>
                    <SwitchButton
                        value={switch_led}
                        size={{ width: convertX(48), height: convertX(30), activeSize: convertX(25) }}
                        style={{ right: convertX(20) }}
                        onTintColor={isWhite ? '#55A074' : '#3E9AB7'}
                        tintColor={'#868EAA'}
                        onValueChange={() => onValueChange && onValueChange('switch_led')}
                    />
                </View>
                <Collapsible
                    collapsed={!switch_led}
                    align="top"
                >
                    <View style={{
                        marginTop: convertX(18)
                    }}>
                        {/* tab */}
                        <View style={{ alignItems: 'center' }}>
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: convertX(343), height: convertX(40), borderRadius: convertX(20) }, isWhite ? { backgroundColor: '#cbdcec' } : { backgroundColor: '#212b4c' }]}>
                                <TouchableOpacity onPress={() => handleChange && handleChange('colour')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'colour' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_colours')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleChange && handleChange('white')}>
                                    <View style={[{ width: convertX(168), height: convertX(38), justifyContent: 'center', alignItems: 'center', borderRadius: convertX(20) }, active === 'white' ? (!isWhite ? { backgroundColor: '#2e5288' } : { backgroundColor: '#FFF' }) : null]}>
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_white')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            height: convertX(335),
                        }}>
                            {active === 'colour' ?
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: convertX(335),
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
                                                width: convertX(75),
                                                height: convertX(75),
                                                backgroundColor: '#fff',
                                                borderRadius: convertX(50),
                                                borderWidth: convertX(2),
                                                borderColor: '#000',
                                                justifyContent: "center",
                                                alignItems: 'center'
                                            }}>
                                                <View style={{
                                                    width: convertX(67),
                                                    height: convertX(67),
                                                    backgroundColor: Color.hsb2hex(...hsb),
                                                    borderRadius: convertX(50),

                                                }}
                                                ></View>
                                            </View>
                                            }
                                            innerRadius={35}
                                            // colorPickerImage={color}
                                            hsb={hsb}
                                            onValueChange={onStopScroll && onStopScroll}
                                            onComplete={onCompleteChange && onCompleteChange}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: convertX(343) }}>
                                        <Image source={isWhite ? light1 : light3} style={{ width: convertX(20), height: convertX(20) }} />
                                        <ColorTempSlider1
                                            value={brightness}
                                            min={1}
                                            max={100}
                                            onComplete={value => {
                                                onComplete && onComplete("brightness", value)
                                            }}
                                            trackStyle={styles.trackStyle}
                                            thumbStyle={styles.thumbStyle}
                                            hsb={hsb}
                                            containerStyle={{ width: convertX(285) }}
                                        />
                                        <Image source={isWhite ? light2 : light4} style={{ width: convertX(22), height: convertX(22) }} />
                                    </View>
                                </View> :
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: convertX(335),
                                    }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: 'center', width: convertX(343) }}>
                                        <TempPicker
                                            width={convertX(239)}
                                            height={convertX(239)}
                                            hasInner={true}
                                            offsetAngle={90}
                                            reversal={true}
                                            // innerElement={
                                            //     <TouchableOpacity style={{
                                            //         width: convertX(79),
                                            //         height: convertX(79),
                                            //         backgroundColor: '#3F4C7A',
                                            //         borderRadius: convertX(50),
                                            //         justifyContent: 'center',
                                            //         alignItems: 'center',
                                            //         zIndex: 99,
                                            //     }}
                                            //     >
                                            //     </TouchableOpacity>
                                            // }
                                            innerRadius={convertX(35)}
                                            temp_value={temp_value / 10}
                                            min={0}
                                            max={100}
                                            onValueChange={onStopScroll && onStopScroll}
                                            onComplete={(value) => {
                                                onComplete && onComplete("temp_value", value)
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
                                            onComplete={(value) => onComplete && onComplete("bright_value", value)}
                                            // containerStyle={styles.containerStyle}
                                            trackStyle={styles.trackStyle}
                                            thumbStyle={styles.thumbStyle}
                                        />
                                        <Image source={isWhite ? light2 : light4} style={{ width: convertX(23), height: convertX(23) }} />
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </Collapsible>
            </View >
        );
    }
}
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
