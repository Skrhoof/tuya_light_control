import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, ViewPropTypes } from 'react-native';
// import { Utils, LinearGradient, IconFont } from '@tuya-rn/tuya-native-components';
import { Utils, LinearGradient, IconFont } from 'tuya-panel-kit';
import { Circle } from 'react-native-svg';
import PropTypes from 'prop-types';

import icons from './icons';

const { convertX: cx } = Utils.RatioUtils;

const maxSize = cx(340);
const minSize = cx(178);
const offsetSize = (maxSize - minSize) / 3;

export default class MusicSuccess extends Component {
  static propTypes = {
    iconTintColor: PropTypes.string.isRequired,
    musicBgOnImg: PropTypes.any.isRequired,
    musicBgOnImgStyle: ViewPropTypes.style,
    ringMaxColor: PropTypes.string.isRequired,
    ringMinColor: PropTypes.string.isRequired,
  };

  static defaultProps = {
    musicBgOnImgStyle: {},
  };

  // constructor(props) {
  //   super(props);
  //   this.state = { openMike: 1 };
  // }

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
  timer;

  updateCircles() {
    this.sizes = this.sizes.map((size, index) => {
      let nextSize = size + this.sizeSpeed;
      if (size > maxSize) {
        nextSize = minSize;
      }
      this.circleRefs[index].setNativeProps({
        style: {
          opacity: 1 - nextSize / maxSize,
          transform: [
            {
              scale: nextSize / minSize,
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
  }
  playAnimation = () => {
    this.updateCircles();
    if (this.isAnimating) {
      // eslint-disable-next-line no-undef
      this.animateId = requestAnimationFrame(this.playAnimation);
    }
  };

  render() {
    const {
      iconTintColor,
      musicBgOnImg,
      musicBgOnImgStyle,
      ringMaxColor,
      ringMinColor,
    } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.box}>
          {this.sizes.map((size, index) => {
            return (
              <View
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                ref={this.setCircleRef(index)}
                style={[
                  styles.circle1,
                  {
                    opacity: (1 - size / maxSize) * 0.3,
                    transform: [
                      {
                        scale: size / minSize,
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  style={{ width: minSize, height: minSize }}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  stops={{
                    '0%': ringMinColor,
                    '100%': ringMaxColor,
                  }}
                >
                  <Circle cx={minSize / 2} cy={minSize / 2} r={minSize / 2} />
                </LinearGradient>
              </View>
            );
          })}
          <ImageBackground source={musicBgOnImg} style={[styles.music, musicBgOnImgStyle]}>
            <IconFont d={icons.music} size={cx(66)} color={iconTintColor} useART={true} />
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  music: {
    width: minSize,
    height: minSize,
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
    position: 'absolute',
    top: 0,
    left: 0,
  },
  // img: {
  //   width: cx(84),
  //   height: cx(84),
  // },
});
