import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.setNewOption = this.setNewOption.bind(this);
    this.chart = null;
  }

  componentWillReceiveProps(nextProps) {
    const thisProps = this.props || {};
    nextProps = nextProps || {};
    const { option: thisOption = {} } = thisProps;
    const { option: prevOption = {} } = nextProps;
    const { series: thisSeries = [] } = thisOption;
    const { series: prevSeries = [] } = prevOption;
    const thisData =
      thisSeries[0] && thisSeries[0].data ? thisSeries[0].data : [];
    const prevData =
      prevSeries[0] && prevSeries[0].data ? prevSeries[0].data : [];
    if (JSON.stringify(thisData) !== JSON.stringify(prevData)) {
      this.chart.injectJavaScript(renderChart(nextProps, true));
    }
  }

  // 预防过渡渲染

  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    nextProps = nextProps || {};
    const { option: thisOption = {} } = thisProps;
    const { option: prevOption = {} } = nextProps;
    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true;
    }
    if (Object.keys(thisOption).length !== Object.keys(prevOption).length) {
      return true;
    }
    const { series: thisSeries = [] } = thisOption;
    const { series: prevSeries = [] } = prevOption;
    if (thisSeries.length !== prevSeries.length) {
      return true;
    }
    const thisData =
      thisSeries[0] && thisSeries[0].data ? thisSeries[0].data : [];
    const prevData =
      prevSeries[0] && prevSeries[0].data ? prevSeries[0].data : [];
    if (JSON.stringify(thisData) !== JSON.stringify(prevData)) {
      return true;
    }
    return false;
  }

  setNewOption(option) {
    this.chart.postMessage(JSON.stringify(option));
  }

  render() {
    return (
      <View style={{ flex: 1, height: this.props.height || 400 }}>
        <WebView
          ref={ref => (this.chart = ref)}
          scrollEnabled={false}
          injectedJavaScript={renderChart(this.props, true)}
          style={{
            height: this.props.height || 400,
            backgroundColor: this.props.backgroundColor || 'transparent',
          }}
          scalesPageToFit={Platform.OS !== 'ios'}
          originWhitelist={['*']}
          source={require('./tpl.html')}
          onMessage={event =>
            this.props.onPress
              ? this.props.onPress(JSON.parse(event.nativeEvent.data))
              : null
          }
        />
      </View>
    );
  }
}
