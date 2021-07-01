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
import jt_shang from '../../../assets/img/jt_shang.png';
import jt_xia from '../../../assets/img/jt_xia.png';
import Strings from '../../../i18n';
import { parseScene, combineScene } from './utils';
import { MusicMap } from '../sounds/utils';
import { putDeviceData } from '../../../utils';
const { ColorUtils } = Utils;
const Color = ColorUtils.color;
const { convertX } = Utils.RatioUtils;
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, //折叠
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
            const arr = parseScene(
                'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            );
            onSaveHome({
                customList: [...arr],
            });
        } else {
            const arr = parseScene(scene);
            // const arr = parseScene(
            //     'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            // );
            onSaveHome({
                customList: [...arr],
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { dpState: prevDPState } = prevProps;
        const { dpState, onSaveHome } = this.props;
        if (dpState.scene !== prevDPState.scene) {
            const arr = parseScene(dpState.scene);
            // const arr = parseScene(
            //     'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            // );
            onSaveHome({
                customList: [...arr],
            });
        }
    }
    onlistdelete = index => {
        const { home, onSaveHome } = this.props;
        const { customList } = home;
        customList[index] = null;
        onSaveHome({
            customList: [...customList],
        });
        putDeviceData({
            scene: combineScene(customList),
        });
    };

    render() {
        const { home } = this.props;
        const { customList } = home;
        return (
            <View style={styles.soundContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{ fontSize: convertX(16), left: convertX(20), color: '#2D365F' }}>{Strings.getLang('dsc_Scenes')}</Text>
                    <TouchableOpacity style={{ marginRight: convertX(20) }} onPress={this.tapBtn}>
                        <Image source={this.state.collapsed ? jt_xia : jt_shang} style={{ height: convertX(25), width: convertX(18) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: convertX(23), marginBottom: convertX(23) }}>
                    <TouchableOpacity style={styles.sceneView1} onPress={() => putDeviceData({
                        volume: 8,
                        colour_data: '00f003e80320',
                        song: '3',
                        work_mode: 'colour',
                    })}>
                        <Image source={icon1} style={styles.sceneIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sceneView2} onPress={() => putDeviceData({
                        volume: 8,
                        colour_data: '000003e80320',
                        song: '2',
                        work_mode: 'colour',
                    })}>
                        <Image source={icon2} style={styles.sceneIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sceneView3} onPress={() => putDeviceData({
                        volume: 8,
                        colour_data: '000000000000',
                        song: '12',
                        work_mode: 'white',
                        bright_value: 800,
                        temp_value: 500,
                    })}>
                        <Image source={icon3} style={styles.sceneIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sceneView4} onPress={() => putDeviceData({
                        volume: 8,
                        colour_data: '007803e80320',
                        song: '18',
                        work_mode: 'colour',
                    })}>
                        <Image source={icon4} style={styles.sceneIcon} />
                    </TouchableOpacity>
                </View>
                <Collapsible
                    collapsed={this.state.collapsed}
                    align="top"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: convertX(20) }}>
                        <Text>{Strings.getLang('dsc_Custom_Scenes')}</Text>
                        <TouchableOpacity onPress={this.deleteScene}>
                            <Image source={Delete} style={{ width: convertX(15), height: convertX(15), left: convertX(120) }} />
                        </TouchableOpacity>
                    </View>
                    {this.state.delete === true ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(20) }}>
                            {customList.map((item, index) =>
                                item === null || item.State !== '02' ? null
                                    // <TouchableOpacity key={index} onPress={() => this.unfoldTo(index)}>
                                    //     <Image source={scenes} style={{ width: convertX(56), height: convertX(56) }} />
                                    // </TouchableOpacity>
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
                        </View> : <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: convertX(20) }}>
                            {customList.map((item, index) =>
                                item === null || item.State !== '02' ?
                                    <TouchableOpacity key={index} onPress={() => this.unfoldTo(index)}>
                                        <Image source={scenes} style={{ width: convertX(56), height: convertX(56) }} />
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
                            )}
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
