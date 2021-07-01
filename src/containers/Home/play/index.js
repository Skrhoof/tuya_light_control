import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Slider, Utils } from 'tuya-panel-kit';
import cycle from '../../../assets/img/cycle.png';
import random from '../../../assets/img/random.png';
import next_song from '../../../assets/img/next_song.png';
import prev_song from '../../../assets/img/prev_song.png';
import playpause from '../../../assets/img/play_pause.png';
import mute from '../../../assets/img/Mute.png';
import voice from '../../../assets/img/voice.png';
import suspendIcon from '../../../assets/img/suspend.png';
import Strings from '../../../i18n';

const { convertX } = Utils.RatioUtils;
export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { handleChangeDp, volume, overValueChange, onChangeDp, play_pause, isWhite } = this.props;
        return (
            <View style={styles.playContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: convertX(30) }}>
                    <TouchableOpacity onPress={() => onChangeDp && onChangeDp('cycle')}>
                        <Image source={cycle} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeDp && onChangeDp('prev_song')}>
                        <Image source={prev_song} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeDp && onChangeDp('play_pause')}>
                        {play_pause === false ? (
                            <Image source={suspendIcon}
                                style={{
                                    width: convertX(14),
                                    height: convertX(16),
                                }}
                            />
                        ) : (
                            <Image source={playpause}
                                style={{
                                    width: convertX(14),
                                    height: convertX(16),
                                    backgroundColor: isWhite ? "#fff" : null,
                                }} />
                        )}
                        {/* <Image source={play_pause} style={styles.icon} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeDp && onChangeDp('next_song')}>
                        <Image source={next_song} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChangeDp && onChangeDp('random')}>
                        <Image source={random} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: convertX(36), flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={mute} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                    <Slider.Horizontal
                        style={{ width: 278 }}
                        maximumValue={16}
                        minimumValue={0}
                        value={volume}
                        maximumTrackTintColor="#E5F2E7"
                        minimumTrackTintColor={isWhite ? "#6E8F73" : '#FFAE9D'}
                        thumbTintColor={isWhite ? "#6E8F73" : '#FFAE9D'}
                        onSlidingComplete={val => overValueChange && overValueChange(val)}
                    />
                    <Image source={voice} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    playContainer: {
        height: convertX(139),
        flexDirection: 'column',
        borderBottomColor: '#DFEAF4',
        borderBottomWidth: convertX(1),
    },
    icon: {
        width: convertX(14),
        height: convertX(16),
    },
});
