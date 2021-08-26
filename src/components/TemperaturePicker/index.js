import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, PanResponder, Image, ImageBackground, ViewPropTypes, TouchableOpacity } from 'react-native';
import ReactNativeComponentTree from './reactnativeComponentTree';
import { isEmpty } from '../../utils/index'
import { Utils } from 'tuya-panel-kit';
import { TemperaturePicker } from '@tuya/tuya-panel-lamp-sdk'
import colorPicker from './res/color-picker2.png';
import thumb from './res/thumb2.png';
import white from './res/white.png';


const { ColorUtils, RatioUtils } = Utils;
const { convert } = RatioUtils;
const Color = ColorUtils.color;
const defaultThumbSize = convert(40);
const defaultThumbInnerSize = convert(28);
const minBrightness = 0;
const maxBrightness = 100;
const minSaturation = 0;
const maxSaturation = 100;

export default class ColorPicker extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    width: PropTypes.number,
    height: PropTypes.number,
    temp_value: PropTypes.number,
    disabled: PropTypes.bool,
    //h值反转，默认false，反转true，正常的是0-360，反转就是y轴镜像，即原来45度对应h是45，反转后315度才是h45
    reversal: PropTypes.bool,
    //沿逆时针方向偏移角度度数
    offsetAngle: PropTypes.number,
    mode: PropTypes.oneOf(['colour', 'white']),
    colorPickerImage: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        uri: PropTypes.string.isRequired,
      }),
    ]),
    innerRadius: PropTypes.number,
    hasInner: PropTypes.bool,
    innerElement: PropTypes.element,
    onPress: PropTypes.func,
    onStart: PropTypes.func,
    onValueChange: PropTypes.func,
    onComplete: PropTypes.func,
  };



  static defaultProps = {
    style: null,
    width: convert(239),
    height: convert(239),
    temp_value: 10,
    disabled: false,
    reversal: false,
    offsetAngle: 0,
    mode: 'colour',
    colorPickerImage: colorPicker,
    innerRadius: convert(64 / 2),
    hasInner: true,
    innerElement: null,
    onPress() { },
    onStart() { },
    onValueChange() { },
    onComplete() { },
  };


  static getBrightnessRate(brightness) {
    const range = maxBrightness - minBrightness;
    return (brightness - minBrightness) / range;
  }

  static getSaturationRate(saturation) {
    const range = maxSaturation - minSaturation;
    return (saturation - minSaturation) / range;
  }

  constructor(props) {
    super(props);

    const { temp_value, reversal, offsetAngle, min, max } = props;
    const { cx, cy, r } = this.getCircleInfo(props);

    this.reversal = reversal;
    this.offsetAngle = offsetAngle;
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.min = min;
    this.max = max;
    this.valueRange = max - min;

    this.offserY = null;

    this.temp_value = temp_value;
    //h值中心点
    const xyRelativeOrigin = this.mapValueToXYRelativeOrigin(temp_value);
    //画触摸的圈圈的左上角坐标
    this.thumbXY = this.getThumbCoord(xyRelativeOrigin.x, xyRelativeOrigin.y);

    this._panResponder = PanResponder.create({
      //用户开始触摸屏幕的时候，是否愿意成为响应者；
      onStartShouldSetPanResponder: e => {
        const { xRelativeOrigin, yRelativeOrigin } = this.getStartOriginCoordByTouchEvent(e);
        const distance = this.getLengthTouchPointToCenterPoint(xRelativeOrigin, yRelativeOrigin);
        const { disabled, onPress, innerRadius } = this.props;
        if (disabled) return !disabled;
        if (typeof onPress === 'function') {
          if (distance < innerRadius) {
            onPress();
          } else if (distance < this.r) {
            // onPress('colour');
          }
        }
        return this.shouldSetPanHandle(e);
      },
      //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
      onMoveShouldSetPanResponder: this.shouldSetPanHandle,
      onMoveShouldSetPanResponderCapture: () => false,
      //开始手势操作，也可以说按下去。给用户一些视觉反馈，让他们知道发生了什么事情！（如：可以修改颜色）
      onPanResponderGrant: this.panResponderGrantHandle,
      // 用户滑动手指时，调用该方法
      onPanResponderMove: this.panResponderMoveHandle,
      // 手势点击时候的事件
      onPanResponderRelease: this.panResponderCompleteHandle,
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: this.panResponderCompleteHandle,
      // 返回值为布尔值, 如果返回值为 true，则表示这个 View 能够响应触摸手势, 两者有一个为true即可响应
      onStartShouldSetResponderCapture: () => false,
    });

    this.xRelativeOriginStart = 0;
    this.yRelativeOriginStart = 0;

  }

  componentWillReceiveProps(nextProps) {
    const { width: newWidth, height: newHeight, temp_value: newTemp_value } = nextProps;
    const { width, height } = this.props;

    if (this.xRelativeOriginStart || this.yRelativeOriginStart) return;

    let shouldUpdate = false;

    if (width * height !== newWidth * newHeight) {
      const { cx, cy, r } = this.getCircleInfo(nextProps);
      this.cx = cx;
      this.cy = cy;
      this.r = r;
      shouldUpdate = true;
    }


    if (Math.abs(newTemp_value - this.temp_value) > 0.5) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.temp_value = newTemp_value
      const xyRelativeOrigin = this.mapValueToXYRelativeOrigin(newTemp_value);
      this.eventHandle(xyRelativeOrigin.x, xyRelativeOrigin.y);
      this.forceUpdate();
    }
    this.shouldUpdate = shouldUpdate;
  }

  shouldComponentUpdate(nextProps) {
    const shouldUpdate = !!this.shouldUpdate;
    this.shouldUpdate = false;
    if (this.props.mode !== nextProps.mode) {
      return true;
    }
    return this.isTouching ? false : shouldUpdate;
  }

  /**
   * 获取左上角坐标
   */
  getThumbCoord(xRelativeOrigin, yRelativeOrigin) {
    return {
      x: xRelativeOrigin - defaultThumbSize / 2,
      y: yRelativeOrigin - defaultThumbSize / 2,
    };
  }

  getCircleInfo(props) {
    const { width, height } = props;
    const size = Math.min(width, height);
    const r = size / 2;

    return {
      r,
      cx: r + defaultThumbSize / 2,
      cy: r + defaultThumbSize / 2,
    };
  }

  getLengthTouchPointToCenterPoint(x, y) {
    // eslint-disable-next-line no-unused-vars
    const { cx, cy, r } = this;
    // eslint-disable-next-line no-restricted-properties
    return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
  }

  getSaturationByCoord(x, y) {
    const { innerRadius } = this.props;
    const maxLen = this.r - innerRadius;
    let b = this.getLengthTouchPointToCenterPoint(x, y) - innerRadius;
    b = b < 0 ? 0 : b > maxLen ? maxLen : b;
    const range = maxSaturation - minSaturation;
    return minSaturation + (b * range) / maxLen;
  }

  getRadian(xRelativeOrigin, yRelativeOrigin) {
    const xRelativeCenter = xRelativeOrigin - this.cx;
    //计算角度时，如需反向，直接y轴数据反向即可，因为原本45度是h45，现在315是h45，45度Y轴镜像就是315
    const yRelativeCenter = yRelativeOrigin - this.cy;

    let rad = Math.atan2(yRelativeCenter, xRelativeCenter);

    if (xRelativeCenter > 0 && yRelativeCenter > 0) rad = Math.PI * 2 - rad;
    if (xRelativeCenter < 0 && yRelativeCenter > 0) rad = Math.PI * 2 - rad;
    if (xRelativeCenter < 0 && yRelativeCenter < 0) rad = Math.abs(rad);
    if (xRelativeCenter > 0 && yRelativeCenter < 0) rad = Math.abs(rad);

    if (xRelativeCenter === 0 && yRelativeCenter > 0) rad = (Math.PI * 3) / 2;
    if (xRelativeCenter === 0 && yRelativeCenter < 0) rad = Math.PI / 2;
    return rad;
  }

  getDegree(xRelativeOrigin, yRelativeOrigin) {
    //获取当前角度
    const rad = this.getRadian(xRelativeOrigin, yRelativeOrigin);

    //返回h值
    return (rad * 180) / Math.PI;
  }

  getStartOriginCoordByTouchEvent(e) {
    const { locationX, locationY } = e.nativeEvent;
    return {
      xRelativeOrigin: locationX,
      yRelativeOrigin: locationY,
    };
  }

  getETargetInstance(e) {
    return ReactNativeComponentTree.getInstanceFromNode(e.target);
  }

  getETargetElement(e) {
    const inst = this.getETargetInstance(e);
    return inst._currentElement;
  }

  valueToRGB = (value) => {
    const tmpKelvin = value * 3.9 + 10;
    let rgb = [];
    //求red
    if (tmpKelvin <= 66) {
      rgb[0] = 255;
    } else {
      let tmpCalc = tmpKelvin - 60;
      tmpCalc = 329.698727446 * Math.pow(tmpCalc, -0.1332047592);
      rgb[0] = tmpCalc;
      if (rgb[0] < 0) {
        rgb[0] = 0
      }
      if (rgb[0] > 255) {
        rgb[0] = 255
      }
    }
    //求green
    if (tmpKelvin <= 66) {
      let tmpCalc = tmpKelvin - 60;
      tmpCalc = 99.4708025861 * Math.log(tmpCalc) - 161.1195681661;
      rgb[1] = tmpCalc;
      if (rgb[1] < 0) {
        rgb[1] = 0
      }
      if (rgb[1] > 255) {
        rgb[1] = 255
      }
    } else {
      let tmpCalc = tmpKelvin - 60;
      tmpCalc = 288.1221695283 * Math.pow(tmpCalc, -0.0755148492);
      rgb[1] = tmpCalc;
      if (rgb[1] < 0) {
        rgb[1] = 0
      }
      if (rgb[1] > 255) {
        rgb[1] = 255
      }
    }
    //求blue
    if (tmpKelvin >= 66) {
      rgb[2] = 255;
    } else if (tmpKelvin <= 19) {
      rgb[2] = 0;
    } else {
      let tmpCalc = tmpKelvin - 10;
      tmpCalc = 138.5177312231 * Math.log(tmpCalc) - 305.0447927307;
      rgb[2] = tmpCalc;
      if (rgb[2] < 0) {
        rgb[2] = 0
      }
      if (rgb[2] > 255) {
        rgb[2] = 255
      }
    }

    return rgb;

  }

  getMiddleView = () => {
    const { innerElement, innerRadius, mode, hasInner, temp_value } = this.props;
    const Res = { white };
    const isColorMode = mode === 'colour';
    const rgb = this.valueToRGB(temp_value);
    console.log(temp_value);
    const newrgb = ColorUtils.color.brightKelvin2rgb(1000, temp_value*10);
    //console.log(newrgb);
    const r = Number(newrgb.slice(4, 7));
    const g = Number(newrgb.slice(9, 12));
    const b = Number(newrgb.slice(14, 17));
    console.log('rgb', r, g, b);
    // console.log(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
    if (!hasInner) return null;
    if (innerElement) return innerElement;
    return (
      <TouchableOpacity 
        style={{
          width: innerRadius * 2,
          height: innerRadius * 2,
          borderRadius: innerRadius,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: convert(56),
            height: convert(56),
            borderRadius: innerRadius,
            backgroundColor: `rgb(${r},${g},${b})`,
            borderWidth: convert(4),
            borderColor: '#fff',
          }}
        />
        <Image
          source={Res.white}
          resizeMode="contain"
          style={{
            width: innerRadius * 2,
            height: innerRadius * 2,
            borderRadius: innerRadius,
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: isColorMode ? 0 : 1,
          }}
        />
      </TouchableOpacity>
    );
  };

  eventHandle(xRelativeOrigin, yRelativeOrigin, fn) {
    const { xFixedRelativeOrigin, yFixedRelativeOrigin } = this.fixXYRelativeOrigin(
      xRelativeOrigin,
      yRelativeOrigin
    );
    this.thumbXY = this.getThumbCoord(xFixedRelativeOrigin, yFixedRelativeOrigin);

    if (this.thumbWrapRef) {
      const style = {
        left: this.thumbXY.x,
        top: this.thumbXY.y,
      };
      this.thumbWrapRef.setNativeProps({ style });
    }
    const value = this.getValueInfo(xFixedRelativeOrigin, yFixedRelativeOrigin);
    this.temp_value = value;
    this.forceUpdate();
    typeof fn === 'function' && fn(value);
  }


  shouldSetPanHandle = e => {
    const { disabled, innerRadius } = this.props;
    if (disabled) return !disabled;

    //计算是否再圈圈内，是则接收事件，否则不接收
    const { xRelativeOrigin, yRelativeOrigin } = this.getStartOriginCoordByTouchEvent(e);
    const thumbX1 = this.thumbXY.x - defaultThumbSize / 2;
    const thumbY1 = this.thumbXY.y - defaultThumbSize / 2;
    const thumbX2 = this.thumbXY.x + defaultThumbSize / 2;
    const thumbY2 = this.thumbXY.y + defaultThumbSize / 2;

    if (
      thumbX1 < xRelativeOrigin &&
      xRelativeOrigin < thumbX2 &&
      thumbY1 < yRelativeOrigin &&
      yRelativeOrigin < thumbY2
    ) {
      return true;
    }
    const distance = this.getLengthTouchPointToCenterPoint(xRelativeOrigin, yRelativeOrigin);
    if (distance < innerRadius) return false;
    return distance <= this.r && distance >= innerRadius;
  };

  panResponderGrantHandle = e => {
    const { onStart } = this.props;
    const { xRelativeOrigin, yRelativeOrigin } = this.getStartOriginCoordByTouchEvent(e);
    this.xRelativeOriginStart = xRelativeOrigin;
    this.yRelativeOriginStart = yRelativeOrigin;
    this.eventHandle(xRelativeOrigin, yRelativeOrigin, onStart);
  };

  panResponderMoveHandle = (e, gestureState) => {
    const { onValueChange } = this.props;
    this.isTouching = true;
    const { dx, dy } = gestureState;
    const xRelativeOrigin = this.xRelativeOriginStart + dx;
    const yRelativeOrigin = this.yRelativeOriginStart + dy;
    this.eventHandle(xRelativeOrigin, yRelativeOrigin, onValueChange);
  };

  panResponderCompleteHandle = (e, gestureState) => {
    const { onComplete } = this.props;
    const { dx, dy } = gestureState;
    const xRelativeOrigin = this.xRelativeOriginStart + dx;
    const yRelativeOrigin = this.yRelativeOriginStart + dy;
    this.eventHandle(xRelativeOrigin, yRelativeOrigin, onComplete);
    this.xRelativeOriginStart = 0;
    this.yRelativeOriginStart = 0;
    this.isTouching = false;
  };

  fixXYRelativeOrigin(xRelativeOrigin, yRelativeOrigin) {
    const { innerRadius } = this.props;
    const { r, cx, cy } = this;
    const distance = this.getLengthTouchPointToCenterPoint(xRelativeOrigin, yRelativeOrigin);
    const xRelativeCenter = xRelativeOrigin - cx;
    const yRelativeCenter = yRelativeOrigin - cy;
    const angle = Math.atan2(yRelativeCenter, xRelativeCenter);
    let xFixedRelativeOrigin = xRelativeOrigin;
    let yFixedRelativeOrigin = yRelativeOrigin;
    if (distance > r) {
      xFixedRelativeOrigin = r * Math.cos(angle) + cx;
      yFixedRelativeOrigin = r * Math.sin(angle) + cy;
    } else if (distance < innerRadius) {
      xFixedRelativeOrigin = innerRadius * Math.cos(angle) + cx;
      yFixedRelativeOrigin = innerRadius * Math.sin(angle) + cy;
    }
    return {
      xFixedRelativeOrigin,
      yFixedRelativeOrigin,
    };
  }

  /**
  * 根据value值计算出显示位置
  */
  mapValueToXYRelativeOrigin(value) {
    const { max, min, innerRadius } = this.props
    const length = 2 * this.r
    const x = (value - min) / this.valueRange * length + defaultThumbSize / 2
    let y = this.cy;
    //圆环中小一边的色温值
    const minPlaceValue = this.valueRange / length * (this.r - innerRadius) + this.min;
    //圆环中大一边的色温值
    const maxPlaceValue = this.valueRange / length * (this.r + innerRadius) + this.min;
    //中间色温值
    const midValue = this.valueRange / 2 + min;
    if (value >= minPlaceValue && value <= maxPlaceValue) {
      if (value < midValue) {
        y = this.cy - Math.abs(value - minPlaceValue) * (innerRadius / (midValue - minPlaceValue));
      } else {
        y = this.cy - Math.abs(value - maxPlaceValue) * (innerRadius / (midValue - minPlaceValue));
      }
    } else {
      y = this.cy;
    }
    if (this.offserY != null) {
      y = this.offserY;
    }
    return { x, y }
  }

  /**
 * 根据触摸位置计算出value值
 */
  getValueInfo(xRelativeOrigin, yRelativeOrigin) {
    const { width } = this.props
    this.offserY = Math.floor(yRelativeOrigin);
    return Math.floor((xRelativeOrigin - defaultThumbSize / 2) * this.valueRange / width) + this.min;
  }

  mapSaturationToLength(s) {
    const { innerRadius } = this.props;
    const maxLen = this.r - innerRadius;
    const range = maxSaturation - minSaturation;

    return (maxLen / range) * (s - minSaturation) + innerRadius;
  }

  render() {
    const { height, width, mode, style, colorPickerImage, boxStyle, disabled } = this.props;
    const _width = width + defaultThumbSize;
    const _height = height + defaultThumbSize;
    const isColorMode = mode === 'colour';
    const Res = {
      colorPicker: colorPickerImage,
      thumb,
    };
    const middleView = this.getMiddleView();
    return (
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            width: _width,
            height: _height,
          },
          style,
        ]}
        {...this._panResponder.panHandlers}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width,
            height,
          }}
        >
          <Image
            source={Res.colorPicker}
            style={{
              width,
              height,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
            resizeMode="contain"
          >
          </Image>
          {middleView}
        </View>
        <View
          style={{
            width: defaultThumbSize,
            height: defaultThumbSize,
            position: 'absolute',
            borderRadius: defaultThumbSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isColorMode ? 1 : 0,
            top: this.thumbXY.y,
            left: this.thumbXY.x,
          }}
          ref={ref => {
            this.thumbWrapRef = ref;
          }}
        >
          <View
            ref={ref => {
              this.thumbRef = ref;
            }}
            style={{
              width: defaultThumbInnerSize,
              height: defaultThumbInnerSize,
              borderRadius: defaultThumbInnerSize / 2,
              backgroundColor: "transparent",
            }}
          />
          <Image
            source={Res.thumb}
            resizeMode="contain"
            style={{
              width: defaultThumbSize,
              height: defaultThumbSize,
              borderRadius: defaultThumbSize / 2,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </View>

        <View
          style={[
            {
              width: _width,
              height: _height,
              position: 'absolute',
              left: 0,
              top: 0,
            },
            boxStyle,
          ]}
          pointerEvents="box-only"
        />
      </View>
    );
  }
}
