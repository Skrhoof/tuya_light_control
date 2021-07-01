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
import music from '../../../assets/img/music.png';
import music2 from '../../../assets/img/music2.png';
import { LullabyMap, NaturemusicMap, SleepmusicMap } from './utils';

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
        const { onselect, selectIndex, dataSource, handleD1Change, activeKey, isWhite } = this.props;
        return (
            <View style={{
                minHeight: convertX(62),
                borderBottomWidth: convertX(1),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text
                        style={{
                            fontSize: convertX(16),
                            left: convertX(20),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>{Strings.getLang('dsc_Sounds')}</Text>
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
                            tabContentStyle={styles.tabContentStyle}
                            activeKey={activeKey}
                            dataSource={dataSource}
                            onChange={handleD1Change}
                            maxItem={2}
                            background={isWhite ? '#CBDDEC' : '#212B4C'}
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
                                                        key={item.value}
                                                        style={styles.musicMap1}
                                                        onPress={() => {
                                                            onselect && onselect(item.code, item.value)
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={{
                                                                fontSize: convertX(16),
                                                                color: isWhite ? null : '#fff',
                                                            }}>{item.text}</Text>
                                                            {selectIndex === item.value ? <Image source={isWhite ? music2 : music} style={{ width: convertX(20), height: convertX(20) }} /> : null}
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
                                        <Text
                                            style={{
                                                color: isWhite ? '#2D365F' : '#fff',
                                                fontSize: convertX(14)
                                            }}>{Strings.getLang('dsc_Nature')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {NaturemusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.value}
                                                        style={selectIndex === item.value ?
                                                            {
                                                                width: convertX(56),
                                                                height: convertX(56),
                                                                borderRadius: convertX(40),
                                                                backgroundColor: isWhite ? '#868EAA' : '#2E5288',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginBottom: convertX(16),
                                                                borderWidth: convertX(3),
                                                                borderColor: '#FDDA24',
                                                            } : {
                                                                width: convertX(56),
                                                                height: convertX(56),
                                                                borderRadius: convertX(40),
                                                                backgroundColor: isWhite ? '#868EAA' : '#2E5288',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginBottom: convertX(16),
                                                            }}
                                                        onPress={() => {
                                                            onselect && onselect(item.code, item.value)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={{
                                                        fontSize: convertX(14),
                                                        marginBottom: convertX(16),
                                                        color: isWhite ? null : '#fff',
                                                    }}>{item.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{ alignItems: 'center', marginTop: convertX(20), marginBottom: convertX(16) }}>
                                        <Text style={{
                                            fontSize: convertX(14),
                                            color: isWhite ? '#2D365F' : '#fff',
                                        }}>{Strings.getLang('dsc_Sleep')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {SleepmusicMap.map((item, index) => {
                                            return (
                                                <View style={{ width: '25%', flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TouchableOpacity
                                                        key={item.value}
                                                        style={selectIndex === item.value ? {
                                                            width: convertX(56),
                                                            height: convertX(56),
                                                            borderRadius: convertX(40),
                                                            backgroundColor: isWhite ? '#868EAA' : '#2E5288',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginBottom: convertX(16),
                                                            borderWidth: convertX(3),
                                                            borderColor: '#FDDA24',
                                                        } :
                                                            {
                                                                width: convertX(56),
                                                                height: convertX(56),
                                                                borderRadius: convertX(40),
                                                                backgroundColor: isWhite ? '#868EAA' : '#2E5288',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginBottom: convertX(16),
                                                            }}
                                                        onPress={() => {
                                                            onselect && onselect(item.code, item.value)
                                                        }}
                                                    >
                                                        <Image source={item.icon} style={styles.ImageStyles}></Image>
                                                    </TouchableOpacity>
                                                    <Text style={{
                                                        fontSize: convertX(14),
                                                        marginBottom: convertX(16),
                                                        color: isWhite ? null : '#fff',
                                                    }}>{item.text}</Text>
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
    callapsibleStyle: {
        height: convertX(556),
    },
    ImageStyles: {
        width: convertX(25),
        height: convertX(25),
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
