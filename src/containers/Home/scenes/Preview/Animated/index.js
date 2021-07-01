import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, ViewPropTypes, Image } from 'react-native';
// import { Utils, IconFont } from '@tuya-rn/tuya-native-components';
import { Utils, IconFont } from 'tuya-panel-kit';
import PropTypes from 'prop-types';

const { convertX: cx } = Utils.RatioUtils;

const maxSize = cx(340);
const minSize = cx(178);
const offsetSize = (maxSize - minSize) / 3;

export default class MusicOpen extends Component {
    static propTypes = {
        iconTintColor: PropTypes.string.isRequired,
        ringBorderColor: PropTypes.string.isRequired,
        musicBgImg: PropTypes.any.isRequired,
        musicBgImgStyle: ViewPropTypes.style,
    };

    static defaultProps = {
        musicBgImgStyle: {},
    };

    constructor(props) {
        super(props);
        this.state = { openMike: 1 };
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentWillUnmount() {
        this.stopAnimation();
    }

    setCircleRef = index => ref => {
        this.circleRefs[index] = ref;
    };

    isAnimating = false;
    sizes = [minSize + offsetSize, minSize + offsetSize * 2, minSize + offsetSize * 3];
    sizeSpeed = 1;
    circleRefs = [];

    updateCircles() {
        this.sizes = this.sizes.map((size, index) => {
            let nextSize = size + this.sizeSpeed;
            if (size > maxSize) {
                nextSize = minSize;
            }
            const offset = nextSize / 2;
            this.circleRefs[index].setNativeProps({
                style: {
                    width: nextSize,
                    height: nextSize,
                    opacity: 1 - nextSize / maxSize,
                    transform: [
                        {
                            translate: [-offset, -offset],
                        },
                    ],
                },
            });
            return nextSize;
        });
    }
    stopAnimation() {
        if (this.isAnimating) {
            // eslint-disable-next-line no-undef
            cancelAnimationFrame(this.animateId);
        }
        clearInterval(this.timer);
        this.isAnimating = false;
    }
    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.playAnimation();
        }
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.setState(({ openMike }) => {
                // eslint-disable-next-line no-param-reassign
                openMike += 1;
                if (openMike > 3) {
                    // eslint-disable-next-line no-param-reassign
                    openMike = 1;
                }
                return {
                    openMike,
                };
            });
        }, 500);
    }
    playAnimation = () => {
        this.updateCircles();
        if (this.isAnimating) {
            // eslint-disable-next-line no-undef
            this.animateId = requestAnimationFrame(this.playAnimation);
        }
    };

    render() {
        const { iconTintColor, ringBorderColor, musicBgImg, musicBgImgStyle, musicSmImg } = this.props;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.box}>
                    {this.sizes.map((size, index) => {
                        const offset = size / 2;
                        return (
                            <View
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                ref={this.setCircleRef(index)}
                                style={[
                                    styles.circle1,
                                    {
                                        width: size,
                                        height: size,
                                        borderColor: ringBorderColor,
                                        opacity: (1 - size / maxSize) * 0.3,
                                        transform: [
                                            {
                                                translate: [-offset, -offset],
                                            },
                                        ],
                                    },
                                ]}
                            />
                        );
                    })}
                    <ImageBackground source={musicBgImg} style={[styles.music, musicBgImgStyle]}>
                        {/* <IconFont
                            d={icons[`mic_${this.state.openMike}`]}
                            size={cx(84)}
                            color={iconTintColor}
                            useART={true}
                        /> */}
                        <Image source={musicSmImg} style={{ width: cx(99), height: cx(99) }} />
                    </ImageBackground>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    music: {
        width: cx(178),
        height: cx(178),
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: minSize,
        height: minSize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle1: {
        width: minSize,
        height: minSize,
        borderRadius: maxSize / 2,
        borderWidth: 1,
        position: 'absolute',
        top: minSize / 2,
        left: minSize / 2,
    },
    // img: {
    //   width: cx(84),
    //   height: cx(84),
    // },
});
