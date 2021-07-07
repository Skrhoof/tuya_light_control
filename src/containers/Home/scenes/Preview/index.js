import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Slider, Utils, TopBar } from 'tuya-panel-kit';
import { convertX, goBack } from '../../../../utils';
import Strings from '../../../../i18n';
import Open from './Animated/index';
import { MusicMap } from '../../sounds/utils';
// import TopBar from '../../../../components/TopBar';

const { ColorUtils } = Utils;
const Color = ColorUtils.color;

class Index extends Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
    };

    CancelPreview = () => {
        const { onSaveHome, home } = this.props;
        const { customList1, customIndex } = home;
        customList1[customIndex].State = '00';
        onSaveHome({
            customList1: [...customList1],
        });
        goBack();
    }

    render() {
        const { home } = this.props;
        const { customIndex, customList1 } = home;
        const { H, S, V, music, text } = customList1[customIndex];
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.hsb2hex(...[H, S, V]),
            }}>
                <TopBar
                    background={Color.hsb2hex(...[H, S, V])}
                    title={Strings.getLang('dsc_preview')}
                    color="#fff"
                    onBack={goBack}
                />
                {/* <TopBar isWhite={isWhite} /> */}
                <View style={{ justifyContent: 'center', alignItems: 'center', height: convertX(50), borderBottomWidth: convertX(1), borderBottomColor: '#fff' }}>
                    <Text style={{ color: '#fff' }}>PREVIEW ON DEVICE</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: convertX(450), flexDirection: 'column', marginTop: convertX(54) }}>
                    <Text style={{ color: '#fff', fontSize: convertX(18) }}>
                        {Strings.getLang('dsc_Custom_Scenes')}：{text}</Text>
                    <Open
                        iconTintColor={'#464646'}
                        ringBorderColor={'#FFF'}
                        musicSmImg={MusicMap[music - 1].icon}
                    // musicBgImgStyle={{
                    //     justifyContent: 'center',
                    //     width: convertX(100),
                    //     height: convertX(100),
                    //     alignItems: 'center',
                    //     backgroundColor: '#FFFFFF',
                    //     borderRadius: convertX(60),
                    // }}
                    />
                    <Text style={{ fontSize: convertX(44), color: '#fff' }}>10</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ color: '#fff' }}>{Strings.getLang('dsc_Sending_device')}</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: convertX(1),
                            borderColor: '#fff',
                            width: convertX(343),
                            height: convertX(48),
                            backgroundColor: Color.hsb2hex(...[H, S, V]),
                            borderRadius: convertX(24),
                            marginTop: convertX(34),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={this.CancelPreview}
                    >
                        <Text style={{
                            fontSize: convertX(15),
                            color: '#fff',
                        }}>{Strings.getLang('dsc_cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
