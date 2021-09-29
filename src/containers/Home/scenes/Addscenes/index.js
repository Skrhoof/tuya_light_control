import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { Dialog, Utils, IconFont, Popup, Toast } from 'tuya-panel-kit';
import Strings from '../../../../i18n';
import { convertX, goBack, putDeviceData, convertRadix, saveDeviceCloudData, getLang } from '../../../../utils';
import CustomLight from '../../light/customLight';
import CustomSounds from '../../sounds/customSounds';
import { combineScene, isEmpty } from '../utils';
import { MusicMap } from '../../sounds/utils';
import TopBar from '../../../../components/TopBar';
const DorelManager = NativeModules.TYRCTDorelManager;
const { ColorUtils } = Utils;
const Color = ColorUtils.color;

class Addscenes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: true,
            hsb: [180, 100, 100],
            selectIndex: '1',
            dataSource: [
                { value: '1', label: Strings.getLang('dsc_colours') },
                { value: '0', label: Strings.getLang('dsc_white') },
            ],
            work_mode: '1',
            text: '',
            isWhite: true,
            show: false,
            isSave: false,
        };
    };

    //保存
    preservation = () => {
        const { onSaveHome, home } = this.props;
        const { customIndex, customList } = home;
        customList[customIndex].State = '02';
        if (customList[customIndex].pattern === '1') {
            customList[customIndex].temp_value = '0';
            customList[customIndex].bright_value = '0';
            onSaveHome({
                customList: [...customList],
            });
        } else {
            customList[customIndex].S = '0';
            customList[customIndex].V = '0';
            customList[customIndex].H = '0';
            onSaveHome({
                customList: [...customList],
            });
        }
        if (customList[customIndex].musicSwitch == false && customList[customIndex].LightSwitch == false) {
            this.setState({ show: true });
        } else {
            onSaveHome({
                customList: [...customList],
            });
            putDeviceData({
                scene: combineScene(customList),
            });
            goBack();
        }
    };

    //预览
    preview = () => {
        const { navigator, onSaveHome, home } = this.props;
        const { customIndex, customList } = home;
        customList[customIndex].State = '01';
        onSaveHome({
            customList: [...customList],
        });
        putDeviceData({
            scene: combineScene(customList),
        });
        saveDeviceCloudData('10seconds', { seconds: 10 });
        navigator && navigator.push({ id: 'Preview' });
    };


    componentWillMount() {
        const { home, onSaveHome } = this.props;
        const { customIndex, customList } = home;
        // const { newlist } = this.state;
        // const newlist = _.cloneDeep(customList);
        if (isEmpty(customList[customIndex]) || customList[customIndex].State !== '02') {
            customList[customIndex] = {
                CustomScene: customIndex + 4, // 自定义场景 array || null
                State: '00',//状态
                LightSwitch: true, // 灯光开光 bool || null
                pattern: '1', // 灯光模式 string
                H: '225', // 
                S: '230', // 
                V: '620', //
                temp_value: '0010',//白光色温
                bright_value: '0000',//白光亮度
                musicSwitch: true,
                music: '1',
                volume: '00',
            };
        }
        // this.setState({
        //     newlist,
        //     customIndex,
        // });
        onSaveHome({
            customList: [...customList]
        })
    }

    componentDidMount() {
        if (DorelManager && DorelManager.isInDarkMode) {
            DorelManager.isInDarkMode(res => {
                this.setState({ isWhite: !res });
            });
        }
    }
    // componentDidUpdate(prevProps) {
    //     this.onScenes
    // }

    onScenes = type => {
        const { home } = this.props;
        const { customList, customIndex } = home;
        const { isWhite } = this.state;
        // const { LightSwitch, temp_value, bright_value, pattern } = customList[customIndex];
        switch (type) {
            case 'color':
                const { onSaveHome } = this.props;
                //console.log('customList', customList);
                customList[customIndex].pattern = '1';
                onSaveHome({
                    customList: [...customList],
                });
                Popup.custom({
                    content: (
                        <View style={
                            isWhite ? { backgroundColor: '#fff' } : { backgroundColor: '#2d385f' }
                        }>
                            <CustomLight
                                newlist={customList}
                                customIndex={customIndex}
                                isWhite={isWhite}
                            />
                            <TouchableOpacity
                                style={{
                                    width: convertX(343),
                                    height: convertX(48),
                                    backgroundColor: Strings.getLang('dsc_version') == 'maxi' ? '#00699b' : '#FDDA24',
                                    borderRadius: convertX(24),
                                    marginTop: convertX(24),
                                    marginLeft: convertX(16),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => { Popup.close(); this.setState({ isSave: true }) }}
                            >
                                <Text style={{
                                    fontSize: convertX(15),
                                    color: isWhite ? '#fff' : '#474747',
                                }}>{Strings.getLang('dsc_save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: convertX(343),
                                    height: convertX(48),
                                    marginTop: convertX(24),
                                    marginLeft: convertX(16),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: convertX(20),
                                }}
                                onPress={Popup.close}
                            >
                                <Text style={{
                                    fontSize: convertX(15),
                                    color: isWhite ? '#2D365F' : '#fff',
                                }}>{Strings.getLang('dsc_cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                    title: Strings.getLang('dsc_Scenes_Color'),
                    cancelText: '',
                    confirmText: '',
                    titleWrapperStyle: {
                        backgroundColor: isWhite ? '#fff' : '#2d385f',
                        height: convertX(81),
                        borderBottomWidth: convertX(1),
                        borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    },
                    titleTextStyle: {
                        fontSize: convertX(18),
                        color: isWhite ? '#2D365F' : '#fff',
                    },
                    footerWrapperStyle: { display: 'none' },
                });
                break;
            case 'sound':
                Popup.custom({
                    content: (
                        <View style={[
                            {
                                backgroundColor: '#2d385f',
                            },
                            isWhite ? { backgroundColor: '#fff' } : null,
                        ]}>
                            <CustomSounds
                                customList={customList}
                                customIndex={customIndex}
                                isWhite={isWhite}
                            />
                            <TouchableOpacity
                                style={{
                                    width: convertX(343),
                                    height: convertX(48),
                                    backgroundColor: '#FDDA24',
                                    borderRadius: convertX(24),
                                    marginTop: convertX(24),
                                    marginLeft: convertX(16),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => { Popup.close(); this.setState({ isSave: true }) }}
                            >
                                <Text style={{
                                    fontSize: convertX(15),
                                    color: isWhite ? '#fff' : '#474747',
                                }}>{Strings.getLang('dsc_save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: convertX(343),
                                    height: convertX(48),
                                    marginTop: convertX(24),
                                    marginLeft: convertX(16),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: convertX(20),
                                }}
                                onPress={Popup.close}
                            >
                                <Text style={{
                                    fontSize: convertX(15),
                                    color: isWhite ? '#2D365F' : '#fff',
                                }}>{Strings.getLang('dsc_cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                    title: Strings.getLang('dsc_Scenes_Sound'),
                    cancelText: '',
                    confirmText: '',
                    titleWrapperStyle: {
                        backgroundColor: isWhite ? '#fff' : '#2d385f',
                        height: convertX(81), borderBottomWidth: convertX(1),
                        borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    },
                    footerWrapperStyle: { display: 'none' },
                    titleTextStyle: {
                        fontSize: convertX(18),
                        color: isWhite ? '#2D365F' : '#fff',
                    },
                });
                break;
        }
    }

    Textbox = () => {
        const { onSaveHome, home } = this.props;
        const { customIndex, customList } = home;
        Dialog.prompt({
            title: Strings.getLang('dsc_Scenes_Name'),
            cancelText: Strings.getLang('dsc_cancel'),
            confirmText: Strings.getLang('dsc_confirm'),
            defaultValue: this.state.text,
            placeholder: "",
            onConfirm: (text, { close }) => {
                saveDeviceCloudData(`a${customList[customIndex].CustomScene}`,  {name:text} );
                console.log('text',text);
                customList[customIndex].text = text;
                onSaveHome({
                    customList: [...customList]
                })
                this.setState({ isSave: true });
                close();
            },
        });
    }



    render() {
        const { home } = this.props;
        const { customList, customIndex } = home;
        //console.log('render customList customIndex', customList, customIndex);
        const { music, H, S, V, text, pattern } = customList[customIndex];
        const { isWhite, isSave } = this.state;
        return (
            <View
                style={[
                    { flex: 1, backgroundColor: '#2d385f' },
                    isWhite ? { backgroundColor: '#fff' } : null,
                ]}
            >
                <TopBar isWhite={isWhite} />
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }}>
                    <Text
                        style={{
                            fontSize: convertX(15),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>{Strings.getLang('dsc_Custom_Scenes')}</Text>
                </View>
                <View style={{ height: convertX(200), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        justifyContent: 'center',
                        width: convertX(100),
                        height: convertX(100),
                        alignItems: 'center',
                        backgroundColor: pattern == '1' ? Color.hsb2hex(...[H, S / 10, V / 10]) : '#FBF1D4',
                        borderRadius: convertX(60),
                    }}>
                        <Image source={MusicMap[music - 1].icon} style={styles.sceneIcon} />
                    </View>
                </View>
                <TouchableOpacity style={{
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }}
                    onPress={this.Textbox}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: convertX(20),
                    }}>
                        <Text style={{
                            fontSize: convertX(16),
                            left: convertX(20),
                            color: isWhite ? '#2D365F' : '#fff',
                        }}>{Strings.getLang('dsc_Scenes_Name')}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{
                                fontSize: convertX(14),
                                right: convertX(25),
                                color: isWhite ? '#2D365F' : '#fff',
                            }}>{text}</Text>
                            <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }} onPress={() => this.onScenes('color')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(16) }}>
                        <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Scenes_Color')}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: convertX(30),
                                height: convertX(30),
                                borderRadius: convertX(15),
                                backgroundColor: pattern == '1' ? Color.hsb2hex(...[H, S / 10, V / 10]) : '#FBF1D4',
                                right: convertX(25),
                            }}
                            />
                            <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }} onPress={() => this.onScenes('sound')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                        <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Scenes_Sound')}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: convertX(14),
                                right: convertX(25),
                                color: isWhite ? '#2D365F' : '#fff',
                            }}>{MusicMap[music - 1].text}</Text>
                            <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        borderWidth: convertX(1),
                        borderColor: '#89898A',
                        width: convertX(343),
                        height: convertX(48),
                        backgroundColor: isWhite ? '#fff' : '#2D385F',
                        borderRadius: convertX(24),
                        marginTop: convertX(40),
                        marginLeft: convertX(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this.preview}
                >
                    <Text style={{
                        fontSize: convertX(15),
                        color: '#89898A',
                    }}>{Strings.getLang('dsc_preview_device')}</Text>
                </TouchableOpacity>
                <Toast
                    show={this.state.show}
                    text={Strings.getLang('dsc_baocun_tishi')}
                    onFinish={() => this.setState({ show: false })}
                />
                <TouchableOpacity
                    style={{
                        borderWidth: convertX(1),
                        borderColor: Strings.getLang('dsc_version') == 'maxi' ? isSave ? '#00699b' : '#C2C6D4' : isSave ? '#FDDA24' : '#C2C6D4',
                        width: convertX(343),
                        height: convertX(48),
                        backgroundColor: Strings.getLang('dsc_version') == 'maxi' ? isSave ? '#00699b' : '#C2C6D4' : isSave ? '#FDDA24' : '#C2C6D4',
                        borderRadius: convertX(24),
                        marginTop: convertX(24),
                        marginLeft: convertX(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this.preservation}
                >
                    <Text style={{
                        fontSize: convertX(15),
                        color: isWhite ? '#fff' : '#474747',
                    }}>{Strings.getLang('dsc_save')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: convertX(343),
                        height: convertX(48),
                        marginTop: convertX(24),
                        marginLeft: convertX(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={goBack}
                >
                    <Text style={{
                        fontSize: convertX(15),
                        color: isWhite ? '#2D365F' : '#fff',
                    }}>{Strings.getLang('dsc_cancel')}</Text>
                </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(Addscenes);
const styles = StyleSheet.create({
    sceneView: {
        justifyContent: 'center',
        width: convertX(100),
        height: convertX(100),
        alignItems: 'center',
        backgroundColor: '#212B4C',
        borderRadius: convertX(60),

    },
    sceneIcon: {
        width: convertX(35),
        height: convertX(35),
    },
    Container: {
        height: convertX(62),
        borderBottomColor: '#DFEAF4',
        borderBottomWidth: convertX(1),
    },
    soundContainer: {
        height: convertX(312),
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
    ImageStyles: {
        width: convertX(25),
        height: convertX(25),
    },
    musicMap2: {
        width: convertX(56),
        height: convertX(56),
        borderRadius: convertX(40),
        backgroundColor: '#E5F2E7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: convertX(16),
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
