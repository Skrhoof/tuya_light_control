import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, Text, Image, ViewPropTypes } from 'react-native';
import triangleIcon from './triangle.png';

export default class Roulette extends Component {
  static propTypes = {
    outerDiameter: PropTypes.number, // 容器直径
    innerDiameter: PropTypes.number, // 圆直径
    trackHeight: PropTypes.number, // 轨道高度
    onStart: PropTypes.func, // 开始转动
    onMove: PropTypes.func, // 转动中
    onEnd: PropTypes.func, // 转动结束
    text: PropTypes.string, // 文本
    textSize: PropTypes.number, // 文本尺寸大小
    textColor: PropTypes.string, // 文本颜色
    containerStyle: ViewPropTypes.style, // 容器样式
    innerStyle: ViewPropTypes.style, // 圆样式
  };

  static defaultProps = {
    outerDiameter: 300,
    innerDiameter: 263,
    trackHeight: 20,
    onStart: () => { },
    onMove: () => { },
    onEnd: () => { },
    text: 'START',
    textSize: 20,
    textColor: '#fff',
    containerStyle: null,
    innerStyle: null,
  };

  constructor(props) {
    super(props);
    const { outerDiameter, innerDiameter, trackHeight } = props;
    this.outerDiameter = outerDiameter; // 容器盒子半径
    this.innerDiameter = innerDiameter; // 轮盘盒子半径
    this.trackHeight = trackHeight; // 箭头轨道的高
    this.outerLayout = {
      // 容器layout
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.origin = {
      // 轮盘圆中心点的坐标
      x: 0,
      y: 0,
    };
    this.state = {
      angle: 0, // 当前角度，以3点钟方向为0度
      left: this.outerDiameter - this.trackHeight, // 三角箭头的left
      top: this.outerDiameter / 2 - this.trackHeight / 2, // 三角箭头的top
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderRelease,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => { },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    const { x: outX, y: outY, width: outW, height: outH } = this.outerLayout;
    if (x !== outX || y !== outY || width !== outW || height !== outH) {
      this.outerLayout = {
        x,
        y,
        width,
        height,
      };
      this.origin = {
        x: x + width / 2,
        y: y + height / 2,
      };
    }
  };

  // 计算角度
  getAngle = (x, y) => {
    const { x: originX, y: originY } = this.origin;
    const a = x - originX;
    const b = y - originY;
    const r = Math.sqrt(a ** 2 + b ** 2);
    const sin = b / r;
    let angle = (Math.asin(sin) * 180) / Math.PI;
    if (a < 0 && b < 0) {
      // 第四象限
      angle = -180 - angle;
    } else if (a < 0 && b > 0) {
      // 第三象限
      angle = 180 - angle;
    }
    if (x < originX && angle === 0) {
      angle = -180;
    }
    return angle;
  };

  // 计算三角left和top
  getLeftAndTop = angle => {
    const r = (this.outerDiameter - this.trackHeight) / 2;
    let a, b, left, top, transitionAngle;
    if (0 <= angle && angle < 90) {
      // 第三象限
      transitionAngle = (angle * Math.PI) / 180;
      a = r * Math.cos(transitionAngle);
      b = r * Math.sin(transitionAngle);
      left = r + a;
      top = r + b;
    } else if (-90 <= angle && angle < 0) {
      // 第一象限
      transitionAngle = (-angle * Math.PI) / 180;
      a = r * Math.cos(transitionAngle);
      b = r * Math.sin(transitionAngle);
      left = r + a;
      top = r - b;
    } else if (-180 <= angle && angle < -90) {
      // 第四象限
      transitionAngle = ((180 + angle) * Math.PI) / 180;
      a = r * Math.cos(transitionAngle);
      b = r * Math.sin(transitionAngle);
      left = r - a;
      top = r - b;
    } else if (90 <= angle && angle <= 180) {
      transitionAngle = ((180 - angle) * Math.PI) / 180;
      a = r * Math.cos(transitionAngle);
      b = r * Math.sin(transitionAngle);
      left = r - a;
      top = r + b;
    }
    return {
      left,
      top,
    };
  };

  handlePanResponderGrant = (evt, gestureState) => {
    const { pageX, pageY } = evt.nativeEvent;
    this.handleTouch(pageX, pageY, 'start');
  };

  handlePanResponderMove = (evt, gestureState) => {
    const { pageX, pageY } = evt.nativeEvent;
    this.handleTouch(pageX, pageY, 'move');
  };

  handlePanResponderRelease = (evt, gestureState) => {
    const { pageX, pageY } = evt.nativeEvent;
    this.handleTouch(pageX, pageY, 'end');
  };

  handleTouch = (pageX, pageY, type) => {
    const newAngle = this.getAngle(pageX, pageY);
    const { left, top } = this.getLeftAndTop(newAngle);
    const { onStart, onMove, onEnd } = this.props;
    switch (type) {
      case 'start':
        typeof onStart === 'function' && onStart(newAngle);
        break;
      case 'move':
        typeof onMove === 'function' && onMove(newAngle);
        break;
      case 'end':
        typeof onEnd === 'function' && onEnd(newAngle);
        break;
      default:
        break;
    }
    this.setState({
      angle: newAngle,
      left,
      top,
    });
  };

  render() {
    const { angle, left, top } = this.state;
    const { text, containerStyle, textStyle, innerStyle, textSize, textColor } = this.props;
    return (
      <View
        onLayout={this.onLayout}
        style={[
          {
            width: this.outerDiameter,
            height: this.outerDiameter,
            borderRadius: this.outerDiameter / 2,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          },
          containerStyle,
        ]}
      >
        <Image
          source={triangleIcon}
          style={{
            position: 'absolute',
            width: this.trackHeight,
            height: this.trackHeight,
            left,
            top,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
        <View
          {...this._panResponder.panHandlers}
          style={[
            {
              width: this.innerDiameter,
              height: this.innerDiameter,
              borderRadius: this.innerDiameter / 2,
              backgroundColor: 'rgba(0,0,0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            },
            innerStyle,
          ]}
        >
          <View
            style={{
              width: this.innerDiameter,
              height: textSize,
              paddingRight: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              transform: [{ rotate: `${angle}deg` }],
            }}
          >
            <Text
              style={[
                {
                  color: textColor,
                  fontSize: textSize,
                },
              ]}
            >
              {text}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
