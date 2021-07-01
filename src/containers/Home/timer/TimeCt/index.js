import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Utils, Picker } from 'tuya-panel-kit';

const { convertX } = Utils.RatioUtils;
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.hours = _.times(24, n => _.padStart(n, 2, '0'));
    this.minutes = _.times(60, n => _.padStart(n, 2, '0'));
  }
  render() {
    const { hour = '00', min = '00', onChangeHour, onChangeMin } = this.props;
    return (
      <View style={styles.pickerContainer}>
        <Picker
          style={[styles.picker, styles.pickerMiddle]}
          itemTextColor={'#000000'}
          itemStyle={styles.pickerItem}
          selectedValue={hour}
          onValueChange={value => {
            onChangeHour && onChangeHour(value);
          }}
          visibleItemCount={3}
          textSize={convertX(30)}
        >
          {this.hours.map(value => (
            <Picker.Item key={value} value={value} label={value} />
          ))}
        </Picker>
        <Picker
          style={[styles.picker, styles.pickerRight]}
          itemStyle={styles.pickerItem}
          itemTextColor={'#000000'}
          selectedValue={min}
          onValueChange={value => {
            onChangeMin && onChangeMin(value);
          }}
          visibleItemCount={3}
          textSize={convertX(30)}
        >
          {this.minutes.map(value => (
            <Picker.Item key={value} value={value} label={value} />
          ))}
        </Picker>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    height: convertX(189),
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: convertX(70),
    marginBottom: convertX(20),
  },

  picker: {
    marginVertical: 0,
    height: convertX(189),
  },
  pickerMiddle: {
    flex: 1,
  },

  pickerRight: {
    flex: 1,
  },

  pickerItem: {
    marginTop: 16,
  },
});
