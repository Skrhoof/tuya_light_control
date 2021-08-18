import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, StyleSheet, ViewPropTypes } from 'react-native';
import { LinearGradient, Utils } from 'tuya-panel-kit';
import { Rect } from 'react-native-svg';

const { viewWidth } = Utils.RatioUtils;

export default class ColoursSlider extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style, // 容器样式
    trackStyle: ViewPropTypes.style, // 轨道样式
    thumbStyle: ViewPropTypes.style, // 滑块样式
    onChange: PropTypes.func, // 颜色改变 onChange({r, g, b})
    onComplete: PropTypes.func, // 颜色改变结束事件 onComplete({r, g, b})
    hsl: PropTypes.object, // 当前颜色 { h: 0, s: 100, l: 50 },
  };

  static defaultProps = {
    containerStyle: null,
    trackStyle: null,
    thumbStyle: null,
    onChange: () => { },
    onComplete: () => { },
    hsl: { h: 0, s: 100, l: 50 },
  };

  constructor(props) {
    super(props);
    const { hsl, containerStyle, trackStyle, thumbStyle } = props;
    const { width: containerWidh = viewWidth } = StyleSheet.flatten(containerStyle) || {};
    const { width: trackWidh = 350, height: trackHeight = 16 } =
      StyleSheet.flatten(trackStyle) || {};
    const { width: thumbWidh = 36 } = StyleSheet.flatten(thumbStyle) || {};
    this.state = {
      left: 0,
      hsl: { ...hsl },
    };
    this.trackX = (containerWidh - trackWidh) / 2;
    this.trackWidh = trackWidh;
    this.thumbWidh = thumbWidh;
    this.dimension = { width: trackWidh, height: trackHeight };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => { },
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: this.handlePanResponderRelease,
      onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  componentDidMount() {
    const { hsl = { h: 0, s: 100, l: 50 } } = this.props;
    this.rgb2Percent(hsl);
  }

  componentDidUpdate(prevProps) {
    const { hsl: prevHsl } = prevProps;
    const { hsl } = this.props;
    if (JSON.stringify(hsl) !== JSON.stringify(prevHsl)) {
      this.rgb2Percent(hsl);
    }
  }

  handlePanResponderMove = (evt, gestureState) => {
    const { moveX } = gestureState;
    const halfThumbWidth = this.thumbWidh / 2;
    let newLeft = moveX - halfThumbWidth;
    if (newLeft < this.trackX) {
      newLeft = this.trackX;
    }
    if (newLeft + this.thumbWidh > this.trackWidh + this.trackX) {
      newLeft = this.trackWidh + this.trackX - this.thumbWidh;
    }
    const percent = (newLeft - this.trackX) / (this.trackWidh - this.thumbWidh);
    const h = 287 * percent;
    const s = 100;
    const l = 50;
    const hsl = {
      h,
      s,
      l,
    };
    this.setState({
      left: newLeft,
      hsl,
    });
    const { onChange } = this.props;
    typeof onChange === 'function' && onChange({ ...hsl });
  };

  handlePanResponderRelease = (evt, gestureState) => {
    const { moveX } = gestureState;
    if (moveX === 0) {
      return
    }
    else {
      const halfThumbWidth = this.thumbWidh / 2;
      let newLeft = moveX - halfThumbWidth;
      if (newLeft < this.trackX) {
        newLeft = this.trackX;
      }
      if (newLeft + this.thumbWidh > this.trackWidh + this.trackX) {
        newLeft = this.trackWidh + this.trackX - this.thumbWidh;
      }
      const percent = (newLeft - this.trackX) / (this.trackWidh - this.thumbWidh);
      const h = 287 * percent;
      const s = 100;
      const l = 50;
      const hsl = {
        h,
        s,
        l,
      };
      this.setState({
        left: newLeft,
        hsl,
      });
      const { onComplete } = this.props;
      typeof onComplete === 'function' && onComplete({ ...hsl });
    }
  };

  rgb2Percent = ({ h, s, l }) => {
    let newLeft = this.trackX + (h / 287) * (this.trackWidh - this.thumbWidh);
    if (newLeft > this.trackX + this.trackWidh - this.thumbWidh) {
      newLeft = this.trackX + this.trackWidh - this.thumbWidh;
    }
    if (newLeft < this.trackX) {
      newLeft = this.trackX;
    }
    const newHsl = { h, s, l };
    this.setState({
      left: newLeft,
      hsl: newHsl,
    });
  };

  render() {
    const { hsl, left } = this.state;
    const { containerStyle, trackStyle, thumbStyle } = this.props;
    return (
      <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, containerStyle]}>
        <View
          style={[
            this.dimension,
            trackStyle,
            { borderRadius: 8, overflow: 'hidden', position: 'relative' },
          ]}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            this.trackWidh = width;
            this.trackX = x;
          }}
        >
          <LinearGradient
            style={this.dimension}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            stops={{
              '0%': 'hsl(0, 100%, 50%)',
              '16.6%': 'hsl(31, 100%, 50%)',
              '33.3%': 'hsl(56, 100%, 50%)',
              '50%': 'hsl(109, 100%, 50%)',
              '66.7%': 'hsl(173, 100%, 50%)',
              '83.3%': 'hsl(231, 100%, 50%)',
              '100%': 'hsl(287, 100%, 50%)',
            }}
          >
            <Rect {...this.dimension} />
          </LinearGradient>
        </View>
        <View
          style={[
            {
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
              position: 'absolute',
              borderColor: '#fff',
              borderWidth: 2,
              left,
            },
            thumbStyle,
          ]}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            this.thumbWidh = width;
          }}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }
}
