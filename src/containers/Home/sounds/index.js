import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Utils, Collapsible, Tabs } from 'tuya-panel-kit';
import Strings from '../../../i18n';
import jt_shang from '../../../assets/img/jt_shang.png';
import jt_xia from '../../../assets/img/jt_xia.png';
import music2 from '../../../assets/img/music2.png';
import { LullabyMap, NaturemusicMap, SleepmusicMap } from './utils';
import { putDeviceData } from '../../../utils';

const { convertX } = Utils.RatioUtils;
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        }
    }
    tapBtn = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };
    render() {
        const { onselect, selectIndex, dataSource, handleD1Change, activeKey } = this.props;
        return (
            <View style={styles.soundContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(16), left: convertX(20), color: '#2D365F' }}>{Strings.getLang('dsc_Sounds')}</Text>
                    {/* <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} /> */}
                    <TouchableOpacity style={{ marginRight: convertX(20) }} onPress={this.tapBtn}>
                        <Image source={this.state.collapsed ? jt_xia : jt_shang} style={{ height: convertX(25), width: convertX(18) }} />
                    </TouchableOpacity>
                </View>
                <Collapsible
                    collapsed={this.state.collapsed}
                    align="top"
                >
                    <View style={styles.callapsibleStyle}>
                        <Tabs
                            style={styles.tabsStyle}
                            tabActiveStyle={styles.tabActiveStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabActiveTextStyle={styles.tabTextStyle}
                            underlineStyle={styles.underlineStyle}
                            wrapperStyle={styles.wrapperStyle}
                            tabContentStyle={styles.tabContentStyle}
                            activeKey={activeKey}
                            dataSource={dataSource}
                            onChange={handleD1Change}
                            maxItem={2}
                            background={'#CBDDEC'}
                            swipeable={false}
                        // underlineWidth={{ marginTop: convertX(20) }}
                        >
                            <Tabs.TabPanel>
                                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        {LullabyMap.map((item, index) => {
                                            return (
                                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        style={styles.musicMap1}
                                                        onPress={() => {
                                                            onselect && onselect(item.code)
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={{ fontSize: convertX(15) }}>{item.text}</Text>
                                                            {selectIndex === item.code ? <Image source={music2} style={{ width: convertX(20), height: convertX(20) }} /> : null}
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            </Tabs.TabPanel>
                            <Tabs.TabPanel>
                                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                                    <View style={{ alignItems: 'center', marginTop: convertX(20), marginBottom: convertX(16) }}>
                                        <Text style={{ color: '#2D365F', fontSize: convertX(15) }}>{Strings.getLang('dsc_Nature')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {NaturemusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        style={selectIndex === item.code ? styles.musicMap3 : styles.musicMap2}
                                                        onPress={() => {
                                                            onselect && onselect(item.code)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={styles.text}>{item.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{ alignItems: 'center', marginTop: convertX(20), marginBottom: convertX(16) }}>
                                        <Text style={{ color: '#2D365F', fontSize: convertX(15) }}>{Strings.getLang('dsc_Sleep')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {SleepmusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        style={selectIndex === item.code ? styles.musicMap3 : styles.musicMap2}
                                                        onPress={() => {
                                                            onselect && onselect(item.code)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={styles.text}>{item.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            </Tabs.TabPanel>
                        </Tabs>
                    </View>
                </Collapsible>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    soundContainer: {
        minHeight: convertX(62),
        borderBottomColor: '#DFEAF4',
        borderBottomWidth: convertX(1),
    },
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
        height: convertX(556),
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
