import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { Dialog, Utils, IconFont, Popup } from 'tuya-panel-kit';
import Strings from '../../../../i18n';
import { convertX, goBack, putDeviceData, convertRadix } from '../../../../utils';
import icon1 from '../../../../assets/img/icon1.png';
import Light from '../../light';
import CustomSounds from '../../sounds/customSounds';
import { combineScene } from '../utils';
import { MusicMap } from '../../sounds/utils';
import TopBar from '../../../../components/TopBar';
const DorelManager = NativeModules.TYRCTDorelManager;
const { ColorUtils } = Utils;
const Color = ColorUtils.color;

class Addscenes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newlist: [],
            customIndex: null,
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
        };
    };
    handleD1Change = (tab) => {
        const { customIndex, newlist } = this.state;
        newlist[customIndex].pattern = tab.value;
        this.setState({
            work_mode: tab.value,
            newlist,
        });
        this.onScenes('color')
    };

    onValueChange = type => {
        const { customIndex, newlist } = this.state;
        switch (type) {
            case 'switch_led':
                newlist[customIndex].LightSwitch = !newlist[customIndex].LightSwitch;
                this.setState({
                    newlist,
                });
                this.onScenes('color')
                break;
            case 'musicSwitch':
                newlist[customIndex].musicSwitch = !newlist[customIndex].musicSwitch;
                this.setState({
                    newlist,
                });
                this.onScenes('sound')
                break;
            default:
                break;
        };
    };
    //保存
    preservation = () => {
        const { newlist, customIndex } = this.state;
        const { onSaveHome, home } = this.props;
        const { customList } = home;
        newlist[customIndex].State = '02';
        if (newlist[customIndex].pattern === '1') {
            newlist[customIndex].temp_value = '0';
            newlist[customIndex].bright_value = '0';
        } else {
            newlist[customIndex].S = '0';
            newlist[customIndex].V = '0';
            newlist[customIndex].H = '0';
        }
        this.setState({
            newlist,
        }),
            onSaveHome({
                customList1: [...newlist],
            });
        putDeviceData({
            scene: combineScene(customList) + combineScene(newlist),
        });
        goBack();
    };

    //预览
    preview = () => {
        const { navigator, onSaveHome } = this.props;
        const { newlist, customIndex } = this.state;
        newlist[customIndex].State = '01';
        this.setState({
            newlist,
        }),
            onSaveHome({
                customList1: [...newlist],
            });
        // putDeviceData({
        //     scene: combineScene(newlist),
        // });
        navigator && navigator.push({ id: 'Preview' });
    };

    // 滑动结束松手后(亮度)
    onComplete = (type, value) => {
        const { customIndex, newlist } = this.state;
        switch (type) {
            case 'temp_value':
                newlist[customIndex].temp_value = Math.round(value) * 10;
                this.setState({
                    newlist,
                });
                break;
            case 'bright_value':
                newlist[customIndex].bright_value = Math.round(value);
                this.setState({
                    newlist,
                });
                break;
            case 'volume':
                newlist[customIndex].volume = value;
                this.setState({
                    newlist,
                });
                break;
            case 'brightness':
                const { hsb } = this.state;
                hsb[2] = value;
                this.setState({
                    hsb: [...hsb],
                });
                newlist[customIndex].H = hsb[0];
                newlist[customIndex].S = hsb[1];
                newlist[customIndex].V = hsb[2];
                this.setState({
                    newlist,
                });
                break;
            default:
                break;
        };
    };

    onCompleteChange = (hsb) => {
        this.setState({
            hsb,
        });
        const { customIndex, newlist } = this.state;
        newlist[customIndex].H = Math.round(hsb[0]);
        newlist[customIndex].S = Math.round(hsb[1]);
        newlist[customIndex].V = Math.round(hsb[2]);
        this.setState({
            newlist,
        });
    };

    componentWillMount() {
        const { home, onSaveHome } = this.props;
        const { customIndex, customList1 } = home;
        // const { newlist } = this.state;
        const newlist = _.cloneDeep(customList1);
        if (newlist[customIndex] === null || newlist[customIndex].State !== '02') {
            newlist[customIndex] = {
                CustomScene: customIndex + 4, // 自定义场景 array || null
                State: '00',//状态
                LightSwitch: true, // 灯光开光 bool || null
                pattern: '1', // 灯光模式 string
                H: '0000', // 
                S: '0000', // 
                V: '0000', //
                temp_value: '0010',//白光色温
                bright_value: '0000',//白光亮度
                musicSwitch: true,
                music: '1',
                volume: '00',
            };
        }
        this.setState({
            newlist,
            customIndex,
        });
    }

    componentDidMount() {
        // DorelManager.isInDarkMode(res => {
        //     this.setState({ isWhite: !res });
        // });
    }
    // componentDidUpdate(prevProps) {
    //     this.onScenes
    // }

    onselect = (code, value) => {
        const { customIndex, newlist } = this.state;
        newlist[customIndex].music = value;
        this.setState({
            selectIndex: value,
            newlist,
        });
        this.onScenes('sound');
    };

    onScenes = type => {
        const { customIndex, newlist, hsb, isWhite } = this.state;
        const { LightSwitch, temp_value, bright_value, musicSwitch, volume, pattern, music } = newlist[customIndex];
        switch (type) {
            case 'color':
                Popup.custom({
                    content: (
                        <View style={[
                            {
                                backgroundColor: '#2d385f',

                            },
                            isWhite ? { backgroundColor: '#fff' } : null,
                        ]}>
                            <Light
                                hsb={hsb}
                                brightness={Math.round(hsb[2])}
                                switch_led={LightSwitch}
                                temp_value={temp_value}
                                bright_value={bright_value}
                                onComplete={this.onComplete}
                                onValueChange={this.onValueChange}
                                onCompleteChange={this.onCompleteChange}
                                dataSource={this.state.dataSource}
                                activeKey={pattern}
                                handleD1Change={this.handleD1Change}
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
                                onPress={Popup.close}
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
                        color: isWhite ? '#2d385f' : '#fff',
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
                                musicSwitch={musicSwitch}
                                volume={volume}
                                onValueChange={this.onValueChange}
                                onComplete={this.onComplete}
                                onselect={this.onselect}
                                selectIndex={music}
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
                                onPress={Popup.close}
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
                        color: isWhite ? '#2d385f' : '#fff',
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
        const { customIndex, newlist } = this.state;
        Dialog.prompt({
            title: Strings.getLang('dsc_Scenes_Name'),
            cancelText: Strings.getLang('dsc_cancel'),
            confirmText: Strings.getLang('dsc_confirm'),
            defaultValue: this.state.text,
            placeholder: "",
            onConfirm: (text, { close }) => {
                newlist[customIndex].text = text;
                this.setState({
                    text: text,
                    newlist,
                });
                close();
            },
        });
    }

    render() {
        const { hsb, newlist, selectIndex, text, isWhite } = this.state;
        return (
            <View
                style={[
                    { flex: 1, backgroundColor: '#2d385f' },
                    isWhite ? { backgroundColor: '#fff' } : null,
                ]}
            >
                {/* <TopBar
                    background="#fff"
                    title={Strings.getLang('dsc_Custom_Scenes')}
                    color="#000"
                    onBack={goBack}
                /> */}
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
                        backgroundColor: Color.hsb2hex(...hsb),
                        borderRadius: convertX(60),
                    }}>
                        <Image source={MusicMap[selectIndex - 1].icon} style={styles.sceneIcon} />
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
                        <Text style={{ fontSize: convertX(14), left: convertX(90) }}>{text}</Text>
                        <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }} onPress={() => this.onScenes('color')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                        <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Scenes_Color')}</Text>
                        <View style={{
                            width: convertX(30),
                            height: convertX(30),
                            borderRadius: convertX(15),
                            backgroundColor: Color.hsb2hex(...hsb),
                            left: convertX(100),
                        }}
                        />
                        <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: convertX(62),
                    borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                    borderBottomWidth: convertX(1),
                }} onPress={() => this.onScenes('sound')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                        <Text style={{ fontSize: convertX(16), left: convertX(20), color: isWhite ? '#2D365F' : '#fff', }}>{Strings.getLang('dsc_Scenes_Sound')}</Text>
                        <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
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
                        marginTop: convertX(50),
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
                <TouchableOpacity
                    style={{
                        borderWidth: convertX(1),
                        borderColor: '#C2C6D4',
                        width: convertX(343),
                        height: convertX(48),
                        backgroundColor: '#C2C6D4',
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
