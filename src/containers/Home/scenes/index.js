import _, { sum } from 'lodash';
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
import { parseScene, combineScene } from './utils';
import { MusicMap } from '../sounds/utils';
import { putDeviceData, convertRadix } from '../../../utils';
import strings from '../../../i18n/strings';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, //折叠
            delete: false,
            selectedScene: 0
        }
    }
    tapBtn = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    unfoldTo = index => {
        const { navigator, onSaveHome, home } = this.props;
        const { customList } = home;
        let newSelectedIndex = null;
        customList.some((item, index) => {
            if (item === null || item.State !== '02') {
                newSelectedIndex = index;
                return true;
            }
        });
        onSaveHome({
            customIndex: newSelectedIndex,
        });
        navigator && navigator.push({ id: 'Addscenes' });
    };

    sceneTo = index => {
        if (index == null) {
            putDeviceData({
                scene_idx: `none`,
            });
        } else {
            putDeviceData({
                scene_idx: `scene_${index + 5}`,
            });
        }
    }

    deleteScene = () => {
        this.setState({ delete: !this.state.delete })
        // const { navigator } = this.props;
        // navigator && navigator.push({ id: 'CustomEdit' });
    }

    componentDidMount() {
        const { onSaveHome, dpState, home } = this.props;
        const { customList } = home;
        const { scene } = dpState;
        if (scene == 0) {
            const arr = parseScene('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
            onSaveHome({
                customList: [...arr],
            });
        } else {
            // scene.padEnd(136, '0');
            const arr = parseScene(scene);
            onSaveHome({
                customList: [...arr],
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { dpState: prevDPState } = prevProps;
        const { dpState, onSaveHome } = this.props;
        const { scene } = dpState;
        if (dpState.scene !== prevDPState.scene) {
            const arrlist = scene.padEnd(136, 'f');
            const arr = parseScene(arrlist);
            onSaveHome({
                customList: [...arr],
            });
        }
    }

    onlistdelete = index => {
        const { home, onSaveHome } = this.props;
        const { customList } = home;
        customList[index] = null;
        const arr = customList.filter((v, i) => {
            return v != null
        })
        arr.map((item, index) => {
            item.CustomScene = `${index + 4}`
        })
        onSaveHome({
            customList: [...customList],
        });
        if (customList[0] == null && customList[1] == null && customList[2] == null && customList[3] == null) {
            putDeviceData({
                scene: '00',
                // del_scene: "aa"
            });
        } else {
            putDeviceData({
                scene: combineScene(customList),
            });
        }
    };

    onAlldelete = () => {
        putDeviceData({
            scene: '00',
            // del_scene: "aa",
        });
    }

    render() {
        const { home, isWhite, dpState } = this.props;
        const { customList } = home;
        const { selectedScene } = this.state;
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: convertX(23) }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.sceneView1, selectedScene == 1 ? { borderWidth: convertX(2.5), borderColor: '#1875A8' } : null]}
                            onPress={() => {
                                putDeviceData({
                                    scene_idx: 'scene_1',
                                    // scene: '0002010100f003e8032000000000010332'
                                });
                                //this.setState({ selectedScene: 1 })
                            }}>
                            <Image source={icon1} style={styles.sceneIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.sceneView2, selectedScene == 2 ? { borderWidth: convertX(2.5), borderColor: '#1875A8' } : null]}
                            onPress={() => {
                                putDeviceData({
                                    scene_idx: 'scene_2',
                                })
                                // this.setState({ selectedScene: 2 })
                            }}>
                            <Image source={icon2} style={styles.sceneIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.sceneView3, selectedScene == 3 ? { borderWidth: convertX(2.5), borderColor: '#1875A8' } : null]}
                            onPress={() => {
                                putDeviceData({
                                    scene_idx: 'scene_3',

                                })
                                //this.setState({ selectedScene: 3 })
                            }
                            }>
                            <Image source={icon3} style={styles.sceneIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.sceneView4, selectedScene == 4 ? { borderWidth: convertX(2.5), borderColor: '#1875A8' } : null]}
                            onPress={() => {
                                putDeviceData({
                                    scene_idx: 'scene_4',
                                })
                                //this.setState({ selectedScene: 4 })
                            }}>
                            <Image source={icon4} style={styles.sceneIcon} />
                        </TouchableOpacity>

                    </View>
                </View>
                {/* 文字 */}
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(23)
                }}>
                    <Text style={{
                        fontSize: convertX(14),
                        marginTop: convertX(12),
                        color: isWhite ? '#2D385F' : '#fff',
                    }}>{Strings.getLang('dsc_Relaxing_Time')}
                    </Text>

                    <Text style={{
                        fontSize: convertX(14),
                        marginTop: convertX(12),
                        color: isWhite ? '#2D385F' : '#fff',
                    }}>{Strings.getLang('dsc_Story_Time')}</Text>

                    <Text style={{
                        fontSize: convertX(14),
                        marginTop: convertX(12),
                        color: isWhite ? '#2D385F' : '#fff',
                    }}>{Strings.getLang('dsc_Night_Task')}</Text>

                    <Text style={{
                        fontSize: convertX(14),
                        marginTop: convertX(12),
                        color: isWhite ? '#2D385F' : '#fff',
                    }}>{Strings.getLang('dsc_Meditation')}</Text>

                </View>
                <Collapsible
                    collapsed={this.state.collapsed}
                    align="top"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: convertX(20) }}>
                        <View style={{ marginLeft: convertX(150) }}>
                            <Text style={{
                                color: isWhite ? '#2D365F' : '#fff'
                            }}>
                                {Strings.getLang('dsc_Custom_Scenes')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                width: convertX(20),
                                height: convertX(20),
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: convertX(20),
                            }}
                            onPress={this.deleteScene}
                        >
                            <Image
                                source={isWhite ? Delete : Delete2}
                                style={{ width: convertX(15), height: convertX(15) }}
                            />
                        </TouchableOpacity>
                    </View>
                    {this.state.delete === true ?
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(20) }}>
                                {customList.map((item, index) =>
                                    item === null || item.State !== '02' ? null
                                        :
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{
                                                fontSize: convertX(14),
                                                marginBottom: convertX(12),
                                                color: 'red',
                                            }}>
                                                {Strings.getLang('dsc_delete')}
                                            </Text>
                                            <TouchableOpacity key={index} style={{
                                                justifyContent: 'center',
                                                width: convertX(56),
                                                height: convertX(56),
                                                alignItems: 'center',
                                                borderRadius: convertX(40),
                                                backgroundColor: item.pattern == '01' ? Color.hsb2hex(...[item.H, item.S, item.V]) : '#FBF1D4',
                                            }}
                                                onPress={() => this.onlistdelete(index)}
                                            >
                                                {item.music &&
                                                    <Image source={MusicMap[item.music - 1].icon} style={styles.sceneIcon} />
                                                }
                                            </TouchableOpacity>
                                            <Text style={{
                                                fontSize: convertX(14),
                                                marginTop: convertX(12),
                                                color: isWhite ? '#2D385F' : '#fff',
                                            }}>{item.text}
                                            </Text>
                                        </View>
                                )}
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: convertX(12) }}>
                                <TouchableOpacity onPress={() => this.onAlldelete()}>
                                    <Text>{Strings.getLang('dsc_all_delete')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> :
                        <View>
                            {customList[0] == null && customList[1] == null && customList[2] == null && customList[3] == null ?
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
                                    {customList.map((item, index) => {
                                        return (
                                            item === null || item.State !== '02' ?
                                                <TouchableOpacity key={index} onPress={() => this.unfoldTo(index)}>
                                                    <Image source={isWhite ? scenes : scenes2} style={{ width: convertX(56), height: convertX(56) }} />
                                                </TouchableOpacity>
                                                :
                                                <View style={{ alignItems: 'center' }}>
                                                    <TouchableOpacity key={index} style={[{
                                                        justifyContent: 'center',
                                                        width: convertX(56),
                                                        height: convertX(56),
                                                        alignItems: 'center',
                                                        borderRadius: convertX(40),
                                                        backgroundColor: item.pattern == '01' ? Color.hsb2hex(...[item.H, item.S, item.V]) : '#FBF1D4',
                                                    },
                                                    selectedScene == index + 5 ? { borderWidth: convertX(2.5), borderColor: '#1875A8' } : null
                                                    ]}
                                                        onPress={() => {
                                                            this.sceneTo(index)
                                                            // this.setState({ selectedScene: index + 5 })
                                                        }}
                                                    >
                                                        {item.music &&
                                                            <Image source={MusicMap[item.music - 1].icon} style={styles.sceneIcon} />
                                                        }
                                                    </TouchableOpacity>
                                                    <Text style={{
                                                        fontSize: convertX(14),
                                                        marginTop: convertX(12),
                                                        color: isWhite ? '#2D385F' : '#fff',
                                                    }}>{item.text}
                                                    </Text>
                                                </View>
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
