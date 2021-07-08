import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Utils, Collapsible } from 'tuya-panel-kit';
import icon1 from '../../../assets/img/icon1.png';
import icon2 from '../../../assets/img/icon2.png';
import icon3 from '../../../assets/img/icon3.png';
import icon4 from '../../../assets/img/icon4.png';
import scenes from '../../../assets/img/scenes.png';
import Delete from '../../../assets/img/delete.png';
import scenes2 from '../../../assets/img/scenes2.png';
import Delete2 from '../../../assets/img/delete2.png';
import jt_shang from '../../../assets/img/jt_shang.png';
import jt_xia from '../../../assets/img/jt_xia.png';
import Strings from '../../../i18n';
import { parseScene, combineScene, electricity } from './utils';
import { MusicMap } from '../sounds/utils';
import { putDeviceData } from '../../../utils';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true, //折叠
            delete: false,
        }
    }
    tapBtn = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    unfoldTo = index => {
        const { navigator, onSaveHome } = this.props;
        // let newSelectedIndex = null;
        // Timelist.some((item, index) => {
        //     if (item === null) {
        //         newSelectedIndex = index;
        //         return true;
        //     }
        // });
        onSaveHome({
            customIndex: index,
        });
        navigator && navigator.push({ id: 'Addscenes' });
    };

    deleteScene = () => {
        this.setState({ delete: !this.state.delete })
        // const { navigator } = this.props;
        // navigator && navigator.push({ id: 'CustomEdit' });
    }

    componentDidMount() {
        const { onSaveHome, dpState } = this.props;
        const { scene } = dpState;
        if (scene == '') {
            const arr = electricity('0002010100f003e803200000000001033201020101000003e803200000000001023202020101000000000000032001f4010c3203020101007803e8032000000000011232ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            const arrlist1 = parseScene(arr[0]);
            const arrlist2 = parseScene(arr[1]);
            onSaveHome({
                customList: [...arrlist1],
                customList1: [...arrlist2],
            });
        } else {
            const arr = electricity(scene);
            // const arr = electricity('0002010100f003e803200000000001033201020101000003e803200000000001023202020101000000000000032001f4010c3203020101007803e8032000000000011232ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            const arrlist1 = parseScene(arr[0]);
            const arrlist2 = parseScene(arr[1]);
            onSaveHome({
                customList: [...arrlist1],
                customList1: [...arrlist2],
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { dpState: prevDPState } = prevProps;
        const { dpState, onSaveHome } = this.props;
        if (dpState.scene !== prevDPState.scene) {
            const arr = electricity(dpState.scene);
            // const arr = electricity('0002010100f003e803200000000001033201020101000003e803200000000001023202020101000000000000032001f4010c3203020101007803e8032000000000011232ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            const arrlist1 = parseScene(arr[0]);
            const arrlist2 = parseScene(arr[1]);
            onSaveHome({
                customList: [...arrlist1],
                customList1: [...arrlist2],
            });
        }
    }

    onlistdelete = index => {
        const { home, onSaveHome } = this.props;
        const { customList, customList1 } = home;
        customList1[index] = null;
        onSaveHome({
            customList1: [...customList1],
        });
        putDeviceData({
            scene: combineScene(customList) + combineScene(customList1),
        });
    };

    render() {
        const { home, isWhite, dpState } = this.props;
        const { customList, customList1 } = home;
        return (
            <View style={{
                minHeight: convertX(62),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Scenes')}</Text>
                    <TouchableOpacity style={{ marginRight: convertX(20) }} onPress={this.tapBtn}>
                        <Image source={this.state.collapsed ? jt_xia : jt_shang} style={{ height: convertX(25), width: convertX(18) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: convertX(23), marginBottom: convertX(23) }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.sceneView1}
                            onPress={() => putDeviceData({
                                volume: 8,
                                colour_data: '00f003e80320',
                                song: '3',
                                work_mode: 'colour',
                            })}>
                            <Image source={icon1} style={styles.sceneIcon} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: convertX(14),
                            marginTop: convertX(12),
                            color: isWhite ? '#2D385F' : '#fff',
                        }}>{Strings.getLang('dsc_Relaxing_Time')}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.sceneView2}
                            onPress={() => putDeviceData({
                                volume: 8,
                                colour_data: '000003e80320',
                                song: '2',
                                work_mode: 'colour',
                            })}>
                            <Image source={icon2} style={styles.sceneIcon} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: convertX(14),
                            marginTop: convertX(12),
                            color: isWhite ? '#2D385F' : '#fff',
                        }}>{Strings.getLang('dsc_Story_Time')}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.sceneView3}
                            onPress={() => putDeviceData({
                                volume: 8,
                                colour_data: '000000000000',
                                song: '12',
                                work_mode: 'white',
                                bright_value: 800,
                                temp_value: 500,
                            })}>
                            <Image source={icon3} style={styles.sceneIcon} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: convertX(14),
                            marginTop: convertX(12),
                            color: isWhite ? '#2D385F' : '#fff',
                        }}>{Strings.getLang('dsc_Night_Task')}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.sceneView4}
                            onPress={() => putDeviceData({
                                volume: 8,
                                colour_data: '007803e80320',
                                song: '18',
                                work_mode: 'colour',
                            })}>
                            <Image source={icon4} style={styles.sceneIcon} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: convertX(14),
                            marginTop: convertX(12),
                            color: isWhite ? '#2D385F' : '#fff',
                        }}>{Strings.getLang('dsc_Meditation')}</Text>
                    </View>
                </View>
                <Collapsible
                    collapsed={this.state.collapsed}
                    align="top"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: convertX(20) }}>
                        <Text style={{ color: isWhite ? '#2D365F' : '#fff' }}>{Strings.getLang('dsc_Custom_Scenes')}</Text>
                        <TouchableOpacity onPress={this.deleteScene}>
                            <Image source={isWhite ? Delete : Delete2} style={{ width: convertX(15), height: convertX(15), left: convertX(120) }} />
                        </TouchableOpacity>
                    </View>
                    {this.state.delete === true ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(20) }}>
                            {customList1.map((item, index) =>
                                item === null || item.State !== '02' ? null
                                    :
                                    <TouchableOpacity key={index} style={{
                                        justifyContent: 'center',
                                        width: convertX(56),
                                        height: convertX(56),
                                        alignItems: 'center',
                                        borderRadius: convertX(40),
                                        backgroundColor: Color.hsb2hex(...[item.H, item.S, item.V]),
                                    }}
                                        onPress={() => this.onlistdelete(index)}
                                    >
                                        {item.music &&
                                            <Image source={MusicMap[item.music - 1].icon} style={styles.sceneIcon} />
                                        }
                                    </TouchableOpacity>
                            )}
                        </View> :
                        <View>
                            {customList1[0] == null && customList1[1] == null && customList1[2] == null && customList1[3] == null ?
                                < View style={{ alignItems: 'center', marginBottom: convertX(20) }}>
                                    <TouchableOpacity style={{
                                        width: convertX(343),
                                        height: convertX(48),
                                        borderRadius: convertX(244),
                                        borderWidth: convertX(1.5),
                                        borderColor: isWhite ? '#5E7794' : '#fff',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                        onPress={() => this.unfoldTo(0)}
                                    >
                                        <Text style={{ fontSize: convertX(16), color: isWhite ? '#2D365F' : '#fff', }}>+ Custom Scenes (0/4)</Text>
                                    </TouchableOpacity>
                                </View> :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(20) }}>
                                    {customList1.map((item, index) => {
                                        return (
                                            item === null || item.State !== '02' ?
                                                <TouchableOpacity key={index} onPress={() => this.unfoldTo(index)}>
                                                    <Image source={isWhite ? scenes : scenes2} style={{ width: convertX(56), height: convertX(56) }} />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity key={index} style={{
                                                    justifyContent: 'center',
                                                    width: convertX(56),
                                                    height: convertX(56),
                                                    alignItems: 'center',
                                                    borderRadius: convertX(40),
                                                    backgroundColor: Color.hsb2hex(...[item.H, item.S, item.V]),
                                                }}>
                                                    {item.music &&
                                                        <Image source={MusicMap[item.music - 1].icon} style={styles.sceneIcon} />
                                                    }
                                                </TouchableOpacity>
                                        )
                                    }
                                    )}
                                </View>
                            }
                        </View>
                    }
                </Collapsible>
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
    soundContainer: {
        minHeight: convertX(62),
        borderBottomColor: '#DFEAF4',
        borderBottomWidth: convertX(1),
    },
    sceneView1: {
        justifyContent: 'center',
        width: convertX(56),
        height: convertX(56),
        alignItems: 'center',
        backgroundColor: '#6BDDD6',
        borderRadius: convertX(40),
    },
    sceneView2: {
        justifyContent: 'center',
        width: convertX(56),
        height: convertX(56),
        alignItems: 'center',
        backgroundColor: '#FAA7E3',
        borderRadius: convertX(40),
    },
    sceneView3: {
        justifyContent: 'center',
        width: convertX(56),
        height: convertX(56),
        alignItems: 'center',
        backgroundColor: '#C79DE8',
        borderRadius: convertX(40),
    },
    sceneView4: {
        justifyContent: 'center',
        width: convertX(56),
        height: convertX(56),
        alignItems: 'center',
        backgroundColor: '#71D2EB',
        borderRadius: convertX(40),
    },
    sceneIcon: {
        width: convertX(25),
        height: convertX(25),
    },
});
