import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, StyleSheet, ViewPropTypes } from 'react-native';
import { LinearGradient, Utils } from 'tuya-panel-kit';
import { Rect } from 'react-native-svg';

const { ColorUtils } = Utils;
const { viewWidth } = Utils.RatioUtils;
const Color = ColorUtils.color;

export default class ColorTempSlider extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style, // 容器样式
    trackStyle: ViewPropTypes.style, // 轨道样式
    thumbStyle: ViewPropTypes.style, // 滑块样式
    onChange: PropTypes.func, // 颜色改变 onChange({r, g, b})
    onComplete: PropTypes.func, // 颜色改变结束事件 onComplete({r, g, b})
    value: PropTypes.number, // 当前色温
    min: PropTypes.number, // 色温最小值
    max: PropTypes.number, // 色温最大值
    hsb: PropTypes.arrayOf(PropTypes.number),

  };

  static defaultProps = {
    containerStyle: null,
    trackStyle: null,
    thumbStyle: null,
    onChange: () => { },
    onComplete: () => { },
    value: 0,
    min: 0,
    max: 1000,
    hsb: [180, 100, 100],
  };

  constructor(props) {
    super(props);
    const { value, min, max, containerStyle, trackStyle, thumbStyle } = props;
    const { width: containerWidh = viewWidth } = StyleSheet.flatten(containerStyle) || {};
    const { width: trackWidh = 350, height: trackHeight = 16 } =
      StyleSheet.flatten(trackStyle) || {};
    const { width: thumbWidh = 36 } = StyleSheet.flatten(thumbStyle) || {};
    this.trackX = (containerWidh - trackWidh) / 2;
    this.trackWidh = trackWidh;
    this.thumbWidh = thumbWidh;
    this.dimension = { width: trackWidh, height: trackHeight };
    this.min = min;
    this.max = max;
    this.lastLeft = 0;
    this.state = {
      left: 0,
      value,
      hsl: { h: 40, s: 100, l: 68 },
    };
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
    const { value } = this.props;
    this.rgb2Percent(value);
  }

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps;
    const { value } = this.props;
    if (value !== prevValue) {
      this.rgb2Percent(value);
    }
  }

  handlePanResponderMove = (evt, gestureState) => {
    const { moveX, dx } = gestureState;
    const halfThumbWidth = this.thumbWidh / 2;
    let newLeft = this.lastLeft + dx;
    if (newLeft < this.trackX) {
      newLeft = this.trackX;
    }
    if (newLeft + this.thumbWidh > this.trackWidh + this.trackX) {
      newLeft = this.trackWidh + this.trackX - this.thumbWidh;
    }
    const percent = (newLeft - this.trackX) / (this.trackWidh - this.thumbWidh);
    const newValue = this.min + (this.max - this.min) * percent;
    const percent100 = percent * 100;
    let hsl;
    if (0 <= percent100 && percent100 < 50) {
      const percent2 = (percent100 - 0) / (50 - 0);
      hsl = {
        h: 40 - (40 - 0) * percent2,
        s: 100 - (100 - 0) * percent2,
        l: 68 + (100 - 68) * percent2,
      };
    } else {
      const percent2 = (percent100 - 50) / (100 - 50);
      hsl = {
        h: 0 + (203 - 0) * percent2,
        s: 0 + (100 - 0) * percent2,
        l: 100 - (100 - 90) * percent2,
      };
    }
    this.setState({
      left: newLeft,
      hsl,
    });
    const { onChange } = this.props;
    typeof onChange === 'function' && onChange(newValue);
  };

  handlePanResponderRelease = (evt, gestureState) => {
    const { moveX, dx } = gestureState;
    if (dx === 0) {
      return
    } else {
      const halfThumbWidth = this.thumbWidh / 2;
      let newLeft = this.lastLeft + dx;
      if (newLeft < this.trackX) {
        newLeft = this.trackX;
      }
      if (newLeft + this.thumbWidh > this.trackWidh + this.trackX) {
        newLeft = this.trackWidh + this.trackX - this.thumbWidh;
      }
      const percent = (newLeft - this.trackX) / (this.trackWidh - this.thumbWidh);
      const newValue = this.min + (this.max - this.min) * percent;
      const percent100 = percent * 100;
      let hsl;
      if (0 <= percent100 && percent100 < 50) {
        const percent2 = (percent100 - 0) / (50 - 0);
        hsl = {
          h: 40 - (40 - 0) * percent2,
          s: 100 - (100 - 0) * percent2,
          l: 68 + (100 - 68) * percent2,
        };
      } else {
        const percent2 = (percent100 - 50) / (100 - 50);
        hsl = {
          h: 0 + (203 - 0) * percent2,
          s: 0 + (100 - 0) * percent2,
          l: 100 - (100 - 90) * percent2,
        };
      }
      // console.log(newLeft, moveX);
      this.setState({
        left: newLeft,
        hsl,
      });
      const { onComplete } = this.props;
      typeof onComplete === 'function' && onComplete(newValue);
    }

  };

  rgb2Percent = value => {
    const percent = value / (this.max - this.min);
    const newLeft = this.trackX + percent * (this.trackWidh - this.thumbWidh);
    const percent100 = percent * 100;
    let hsl;
    if (0 <= percent100 && percent100 < 50) {
      const percent2 = (percent100 - 0) / (50 - 0);
      hsl = {
        h: 40 - (40 - 0) * percent2,
        s: 100 - (100 - 0) * percent2,
        l: 68 + (100 - 68) * percent2,
      };
    } else {
      const percent2 = (percent100 - 50) / (100 - 50);
      hsl = {
        h: 0 + (203 - 0) * percent2,
        s: 0 + (100 - 0) * percent2,
        l: 100 - (100 - 90) * percent2,
      };
    }
    this.lastLeft = newLeft;
    this.setState({
      left: newLeft,
      hsl,
    });
  };

  render() {
    const { hsl, left } = this.state;
    const { containerStyle, trackStyle, thumbStyle, hsb } = this.props;
    return (
      <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, containerStyle]}>
        <View
          style={[
            this.dimension,
            trackStyle,
            // { borderRadius: 8, overflow: 'hidden', position: 'relative' },
            { overflow: 'hidden', position: 'relative' },
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
            // stops={{
            //   '0%': 'hsl(0, 0%, 27.8%)',
            //   '50%': 'hsl(272, 27.8%, 73.9%)',
            //   '100%': 'hsl(273, 52.9%, 73.3%)',
            // }}
            stops={{
              '0%': 'hsl(0, 0%, 27.8%)',
              '100%': `rgb(${Color.hsb2rgb(...[hsb[0], 1000, 1000])})`,
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
