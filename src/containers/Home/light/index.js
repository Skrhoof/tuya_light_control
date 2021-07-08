import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet, ImageBackground
} from 'react-native';
import { Slider, Utils, Tabs, SwitchButton, Collapsible, Progress } from 'tuya-panel-kit';
import ColorPicker from '../../../components/color-picker/color-picker';
import ColorSlider from '../../../components/ColorSlider';
import light1 from '../../../assets/img/light1.png';
import light2 from '../../../assets/img/light2.png';
import light3 from '../../../assets/img/light3.png';
import light4 from '../../../assets/img/light4.png';
import color from '../../../assets/img/color-picker2.png';
import Strings from '../../../i18n';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
const { ColorTempSlider2 } = ColorSlider;
const { ColorTempSlider1 } = ColorSlider;
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey1: 'CLS',
            d1: [
                { value: 'CLS', label: Strings.getLang('dsc_colours') },
                { value: 'WHI', label: Strings.getLang('dsc_white') },
            ],
        };
    }
    _handleD1Change = (tab) => {
        this.setState({ activeKey1: tab.value });
    };
    render() {
        const { onValueChange, switch_led, temp_value, bright_value, onComplete, hsb, onCompleteChange, brightness, dataSource, handleD1Change, activeKey, isWhite } = this.props;
        return (
            <View style={{
                minHeight: convertX(69),
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
                    <View style={styles.callapsibleStyle}>
                        <Tabs
                            style={styles.tabsStyle}
                            tabActiveStyle={{
                                borderRadius: convertX(17),
                                backgroundColor: isWhite ? '#fff' : '#2E5288',
                                width: convertX(178),
                                height: convertX(36),
                            }}
                            tabTextStyle={{
                                color: isWhite ? '#2D365F' : '#fff',
                                fontSize: convertX(15),
                            }}
                            tabActiveTextStyle={{
                                color: isWhite ? '#2D365F' : '#fff',
                                fontSize: convertX(15),
                            }}
                            underlineStyle={styles.underlineStyle}
                            wrapperStyle={styles.wrapperStyle}
                            activeKey={activeKey}
                            dataSource={dataSource}
                            onChange={handleD1Change}
                            maxItem={2}
                            background={isWhite ? '#CBDDEC' : '#212B4C'}
                            swipeable={false}
                        // underlineWidth={{ marginTop: convertX(20) }}
                        >
                            <Tabs.TabPanel>
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
                                            onComplete={onCompleteChange && onCompleteChange}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: convertX(343) }}>
                                        <Image source={isWhite ? light1 : light3} style={{ width: convertX(20), height: convertX(20) }} />
                                        <ColorTempSlider1
                                            value={brightness}
                                            // onChange={this.handleWto}
                                            onComplete={value => {
                                                onComplete && onComplete("brightness", value)
                                            }}
                                            // containerStyle={styles.containerStyle}
                                            trackStyle={styles.trackStyle}
                                            thumbStyle={styles.thumbStyle}
                                            hsb={hsb}
                                        />
                                        <Image source={isWhite ? light2 : light4} style={{ width: convertX(22), height: convertX(22) }} />
                                    </View>
                                </View>
                            </Tabs.TabPanel>
                            <Tabs.TabPanel>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: 'center', width: convertX(343) }}>
                                        <ImageBackground source={color} style={{ width: convertX(239), height: convertX(239), marginTop: convertX(20), marginBottom: convertX(20) }}>
                                            <Progress
                                                style={{ width: convertX(239), height: convertX(239), bottom: convertX(10), right: convertX(5) }}
                                                foreColor={{
                                                    "0%": "#fff",
                                                    "100%": "#fff",
                                                }}
                                                scaleHeight={convertX(40)}
                                                backStrokeOpacity={0}
                                                foreStrokeOpacity={0}
                                                thumbStrokeWidth={convertX(2)}
                                                thumbStroke={'#fff'}
                                                thumbFill={'#F4D779'}
                                                startDegree={270}
                                                andDegree={360}
                                                min={0}
                                                max={100}
                                                needMaxCircle={true}
                                                needMinCircle={true}
                                                thumbRadius={15}
                                                value={temp_value / 10}
                                                onSlidingComplete={(value) => {
                                                    onComplete && onComplete("temp_value", value)
                                                }}
                                            />
                                        </ImageBackground>
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
                            </Tabs.TabPanel>
                        </Tabs>
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
        width: convertX(20),
        height: convertX(20),
        borderWidth: convertX(2),
        backgroundColor: '#FFFFFF',
    },
    SliderStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
