import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Slider, Utils, IconFont } from 'tuya-panel-kit';
import Strings from '../../../i18n';

const { convertX } = Utils.RatioUtils;
export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    unTimerto = () => {
        const { navigator } = this.props;
        navigator && navigator.push({ id: 'Countdown' });
    };
    render() {
        const { isWhite } = this.props;
        return (
            <TouchableOpacity style={{
                height: convertX(62),
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}
                onPress={() => this.unTimerto()}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: convertX(20) }}>
                    <Text style={{
                        fontSize: convertX(16),
                        left: convertX(20),
                        color: isWhite ? '#2D365F' : '#fff',
                    }}>{Strings.getLang('dsc_Timer')}</Text>
                    <IconFont name="arrow" size={convertX(14)} color="#CDCDCD" style={{ right: convertX(20) }} />
                </View>
            </TouchableOpacity>
        );
    }
}
