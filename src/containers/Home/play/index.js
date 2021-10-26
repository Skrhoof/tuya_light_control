import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View, Image, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Slider, Utils } from 'tuya-panel-kit';
import cycle from '../../../assets/img/cycle.png';
import cycle2 from '../../../assets/img/cycle2.png';
import cycle3 from '../../../assets/img/cycle3.png';
import random from '../../../assets/img/random.png';
import random2 from '../../../assets/img/random2.png';
import random3 from '../../../assets/img/random3.png';
import next_song from '../../../assets/img/next_song.png';
import prev_song from '../../../assets/img/prev_song.png';
import mute from '../../../assets/img/Mute.png';
import voice from '../../../assets/img/voice.png';
import next_song2 from '../../../assets/img/next_song2.png';
import prev_song2 from '../../../assets/img/prev_song2.png';
import playpause from '../../../assets/img/play_pause.png';
import playpause2 from '../../../assets/img/play_pause2.png';
import mute2 from '../../../assets/img/Mute2.png';
import voice2 from '../../../assets/img/voice2.png';
import suspendIcon from '../../../assets/img/suspend.png';
import suspendIcon2 from '../../../assets/img/suspend2.png';
const { convertX } = Utils.RatioUtils;
export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { volume, overValueChange, onChangeDp, play_pause, isWhite, play_way } = this.props;
        return (
            <View style={{
                width: '100%',
                height: convertX(139),
                flexDirection: 'column',
                borderBottomColor: isWhite ? '#DFEAF4' : '#3F4C7A',
                borderBottomWidth: convertX(1),
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: convertX(30),marginHorizontal:convertX(30) }}>
                    {/* <TouchableOpacity
                        onPress={() => onChangeDp && onChangeDp('cycle')}>
                        <View style={styles.iconBox}>
                            {isWhite ?
                                <Image source={play_way === 'cycle' ? cycle3 : cycle} style={styles.icon} /> :
                                <Image source={play_way === 'cycle' ? cycle2 : cycle} style={styles.icon} />
                            }
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => onChangeDp && onChangeDp('prev_song')}>
                        <View style={styles.iconBox}>
                            <Image source={isWhite ? prev_song : prev_song2} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeDp && onChangeDp('play_pause')}>
                        <View style={styles.iconBox}>
                            {play_pause === false ? (
                                <Image source={isWhite ? suspendIcon : suspendIcon2}
                                    style={styles.icon}
                                />
                            ) : (
                                <Image source={isWhite ? playpause : playpause2}
                                    style={styles.icon} />
                            )}
                        </View>

                        {/* <Image source={play_pause} style={styles.icon} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeDp && onChangeDp('next_song')}>
                        <View style={styles.iconBox}>
                            <Image source={isWhite ? next_song : next_song2} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => onChangeDp && onChangeDp('random')}>
                        <View style={styles.iconBox}>
                            {isWhite ?
                                <Image source={play_way === 'random' ? random3 : random} style={styles.icon} /> :
                                <Image source={play_way === 'random' ? random2 : random} style={styles.icon} />
                            }
                        </View>
                    </TouchableOpacity> */}
                </View>
                <View style={{ marginTop: convertX(20), flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                    <Image source={isWhite ? mute : mute2} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                    <Slider.Horizontal
                        style={{ width: 278 }}
                        maximumValue={100}
                        minimumValue={0}
                        value={volume}
                        maximumTrackTintColor={isWhite ? "#FCE5E0" : '#2E5288'}
                        minimumTrackTintColor={isWhite ? "#E46B52" : '#FFAE9D'}
                        thumbTintColor={isWhite ? "#E46B52" : '#FFAE9D'}
                        onSlidingComplete={val => overValueChange && overValueChange(val)}
                    />
                    <Image source={isWhite ? voice : voice2} style={{ width: convertX(20), height: convertX(14), marginLeft: convertX(20), marginRight: convertX(9) }} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    icon: {
        width: convertX(14),
        height: convertX(16),
    },
    iconBox: {
        width: convertX(36),
        height: convertX(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
