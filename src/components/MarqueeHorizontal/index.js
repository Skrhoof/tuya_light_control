/**
 * 走马灯组件
 * 文档：https://github.com/ZhangTaoK/react-native-marquee-ab
 */
import React, { Component } from 'react';
import { View, Animated, Easing, Text, TouchableOpacity } from 'react-native';

const styles = {
  bgContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  textMeasuringViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0,
  },
  textMeasuringTextStyle: {
    fontSize: 16,
  },
  textStyle: {
    fontSize: 16,
    color: '#000000',
  },
};

export default class MarqueeHorizontal extends Component {
  static defaultProps = {
    duration: 10000,
    speed: 0,
    textList: [],
    width: 375,
    height: 50,
    direction: 'left',
    reverse: false,
    separator: 20,
    onTextClick: () => {},
    showIcon: false,
  };

  state = {
    animation: null,
    textList: [],
    textWidth: 0,
    viewWidth: 0,
  };

  componentWillMount() {
    this.setState({
      // eslint-disable-next-line react/prop-types
      textList: this.props.textList || [],
    });
    this.animatedTransformX = new Animated.Value(0);
  }

  // eslint-disable-next-line react/sort-comp
  componentDidUpdate() {
    const { textWidth, viewWidth } = this.state;
    // eslint-disable-next-line react/prop-types
    const { duration, speed, width, direction } = this.props;
    let mDuration = duration;
    if (speed && speed > 0) {
      mDuration = ((width + textWidth) / speed) * 1000;
    }
    if (!this.state.animation && textWidth && viewWidth) {
      this.animatedTransformX.setValue(
        direction === 'left' ? width : direction === 'right' ? -textWidth : width
      );
      this.setState(
        {
          animation: Animated.timing(this.animatedTransformX, {
            toValue: direction === 'left' ? -textWidth : direction === 'right' ? width : -textWidth,
            duration: mDuration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        },
        () => {
          this.state.animation &&
            this.state.animation.start(() => {
              this.setState({
                animation: null,
              });
            });
        }
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const newText = nextProps.textList || [];
    const oldText = this.props.textList || [];
    if (newText !== oldText) {
      this.state.animation && this.state.animation.stop();
      this.setState({
        textList: newText,
        animation: null,
      });
    }
  }

  componentWillUnmount() {
    this.state.animation && this.state.animation.stop();
  }

  textOnLayout = e => {
    // eslint-disable-next-line prefer-destructuring
    const width = e.nativeEvent.layout.width;
    // eslint-disable-next-line react/prop-types
    const { textList, separator } = this.props;
    this.setState({
      textWidth: width + (textList.length - 1) * separator,
    });
  };

  viewOnLayout = e => {
    // eslint-disable-next-line prefer-destructuring
    const width = e.nativeEvent.layout.width;
    this.setState({
      viewWidth: width,
    });
  };

  textView(list) {
    // eslint-disable-next-line react/prop-types
    const { textStyle, onTextClick, reverse, separator } = this.props;
    const { textWidth } = this.state;
    const itemView = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (reverse) {
        item.value = item.value
          .split('')
          .reverse()
          .join('');
      }
      itemView.push(
        <TouchableOpacity
          key={`${i}`}
          activeOpacity={0.9}
          onPress={() => {
            onTextClick && onTextClick(item);
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: i < list.length - 1 ? separator : 0,
              backgroundColor: '#123456',
              borderRadius: 13,
              height: 26,
            }}
          >
            <Text
              style={{
                ...styles.textStyle,
                ...textStyle,
              }}
              numberOfLines={1}
            >
              {item.value}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          width: textWidth,
          transform: [{ translateX: this.animatedTransformX }],
        }}
        onLayout={event => this.viewOnLayout(event)}
      >
        {itemView}
      </Animated.View>
    );
  }

  textLengthView(list) {
    const { textStyle } = this.props;
    let text = '';
    for (let i = 0; i < list.length; i++) {
      text += list[i].value;
    }
    const w = text.length * 30;
    return (
      <View
        style={{
          ...styles.textMeasuringViewStyle,
          width: w,
        }}
      >
        <Text
          style={{
            ...styles.textMeasuringTextStyle,
            ...textStyle,
          }}
          onLayout={event => this.textOnLayout(event)}
          numberOfLines={1}
        >
          {text}
        </Text>
      </View>
    );
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { width, height, bgContainerStyle } = this.props;
    const { textList } = this.state;
    return (
      <View
        style={{
          ...styles.bgContainerStyle,
          width,
          height,
          ...bgContainerStyle,
        }}
        opacity={this.state.animation ? 1 : 0}
      >
        {this.textView(textList)}
        {this.textLengthView(textList)}
      </View>
    );
  }
}
