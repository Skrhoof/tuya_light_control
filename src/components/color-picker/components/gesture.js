import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';
// import ReactNativeComponentTree from 'react/lib/ReactNativeComponentTree';
import ReactNativeComponentTree from 'react-native/Libraries/Renderer/shims/ReactNativeComponentTree';

let eTargetId = 0;

export default class Gesture extends Component {
  static propTypes = {
    children: PropTypes.any,
    pointerEvents: PropTypes.oneOf(['box-none', 'none', 'box-only', 'auto']),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    pointerEvents: 'box-only',
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.eTargetId = eTargetId++;
    this.notHandleReceivePropsWhenTouching = false;

    let fixedEvent = {};

    const fixEventHandle = (e, gesture) => [
      {
        nativeEvent: {
          ...e.nativeEvent,
          ...fixedEvent,
        },
        originEvent: e,
      },
      {
        ...gesture,
        locationX: fixedEvent.locationX + gesture.dx,
        locationY: fixedEvent.locationY + gesture.dy,
        pageX: fixedEvent.pageX + gesture.dx,
        pageY: fixedEvent.pageY + gesture.dy,
      },
    ];

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => {
        if (this.props.disabled) return false;
        return this.onStartShouldSetResponder.call(this, e, gesture);
      },
      onMoveShouldSetPanResponder: (e, gesture) => {
        if (this.props.disabled) return false;
        return this.onMoveShouldSetResponder.call(this, e, gesture);
      },
      onPanResponderGrant: (e, gesture) => {
        // clearTimeout(this.timerId);
        const { nativeEvent } = e;
        const { locationX, locationY, pageX, pageY } = nativeEvent;

        fixedEvent = { locationX, locationY, pageX, pageY };
        const event = fixEventHandle(e, gesture);
        this.onGrant.call(this, ...event);
      },
      onPanResponderMove: (e, gesture) => {
        const event = fixEventHandle(e, gesture);
        if (this._initialMoveDirection === undefined) {
          const [_e, _gesture] = event;
          if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) return;
          const horizontal = Math.abs(gesture.dx) >= Math.abs(gesture.dy);
          const toRight =
            horizontal && _e.nativeEvent.locationX < _gesture.locationX;
          const toLeft = horizontal && !toRight;
          const toBottom =
            !horizontal && _e.nativeEvent.locationY < _gesture.locationY;
          const toTop = !horizontal && !toBottom;

          this._initialMoveDirection = {
            horizontal,
            toTop,
            toRight,
            toBottom,
            toLeft,
          };
        } else {
          this.notHandleReceivePropsWhenTouching = true;
          this.onMove.call(this, ...event);
        }
      },

      onPanResponderRelease: (e, gesture) => {
        this.notHandleReceivePropsWhenTouching = false;
        const event = fixEventHandle(e, gesture);
        this.onRelease.call(this, ...event);
        // this.timerId = setTimeout(() => {
        //   this.notHandleReceivePropsWhenTouching = false;
        // }, 300);
        this._initialMoveDirection = undefined;
      },

      onPanResponderTerminationRequest: () => false,

      onPanResponderTerminate: (e, gesture) => {
        this.notHandleReceivePropsWhenTouching = false;
        const event = fixEventHandle(e, gesture);
        this.onRelease.call(this, ...event);
        // this.timerId = setTimeout(() => {
        //   this.notHandleReceivePropsWhenTouching = false;
        // }, 300);
        this._initialMoveDirection = undefined;
      },

      onStartShouldSetResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
    });

    this.getResponder = () => ({
      ...responder.panHandlers,
      onLayout: this.onLayout,
      pointerEvents: this.props.pointerEvents,
    });

    this.onLayout = this.onLayout.bind(this);
    this.getLayout = this.getLayout.bind(this);
    this.getETargetElement = this.getETargetElement.bind(this);
    this.getETargetId = this.getETargetId.bind(this);
    this.getInitialMoveDirection = this.getInitialMoveDirection.bind(this);
    this.getTouchDirection = this.getTouchDirection.bind(this);
    this.checkETargetIsExpected = this.checkETargetIsExpected.bind(this);
  }

  onLayout({ nativeEvent }) {
    if (this._layout !== undefined) return;
    this._layout = { ...nativeEvent.layout };
    this.forceUpdate();
  }

  onStartShouldSetResponder() {
    return true;
  }

  onMoveShouldSetResponder() {
    return true;
  }

  onMove() { }

  onGrant() { }

  onRelease() { }

  getETargetInstance(e) {
    return ReactNativeComponentTree.getInstanceFromNode(e.target);
  }

  getETargetElement(e) {
    const inst = this.getETargetInstance(e);
    return inst._currentElement;
  }

  getETargetId() {
    return this.eTargetId;
  }

  getInitialMoveDirection() {
    return this._initialMoveDirection;
  }

  getTouchDirection(x, y) {
    const rect = this.getLayout();

    if (!rect) return;

    /* ???????????????????????????????????? */
    // ?????????????????????????????????????????????

    // ?????????????????? ??????y?????????????????????????????????????????????????????????(0,0)???????????????????????????????????????
    // ????????????????????????????????????
    const _y = -y;
    const x1 = rect.x;
    const y1 = -rect.y;

    const x4 = rect.x + rect.width;
    const y4 = -(rect.y + rect.height);

    const x0 = rect.x + rect.width / 2;
    const y0 = -(rect.y + rect.height / 2);

    // ???????????????????????????
    if (Math.abs(x1 - x4) < 0.0001) return 4;

    // ?????????????????????????????????????????????
    // ?????????????????????
    const k = (y1 - y4) / (x1 - x4);

    const range = [k, -k];

    // ???????????????????????????????????????????????????????????????
    const kk = (_y - y0) / (x - x0);

    // ???????????????range??????????????????????????????????????????????????????
    if (Math.isFinite(kk) && range[0] < kk && kk < range[1]) {
      // ??????x???x0????????????
      return x > x0 ? 1 : 3;
    }

    // ??????y???y0????????????
    return _y > y0 ? 0 : 2;
  }

  getLayout() {
    return this._layout;
  }

  checkETargetIsExpected(e) {
    const element = this.getETargetElement(e);
    return this.eTargetId === element.props.eTargetId;
  }

  render() {
    const { children, ...props } = this.props;
    const responder = this.getResponder();
    delete props.pointerEvents;

    return (
      <View {...props} {...responder}>
        {children}
      </View>
    );
  }
}
