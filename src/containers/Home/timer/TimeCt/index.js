import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { Utils, Picker } from 'tuya-panel-kit';
const { convertX, viewWidth } = Utils.RatioUtils;
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.HourArr = _.times(24, n => `${n}`);
    this.MinutesArr = _.times(60, n => _.padStart(n, 2, '0'));
  }
  render() {
    const { hour = '00', minute = '00', onChangeHour, onChangeMin, isWhite } = this.props;
    return (
      <View style={styles.pickerContainer}>
        <View
          style={[
            {
              position: 'absolute',
              top: convertX(82),
              borderTopWidth: convertX(1),
              borderBottomWidth: convertX(1),
              borderColor: '#3F4C7A',
              width: viewWidth,
              height: convertX(36),
            },
            isWhite ? { borderColor: '#e6e4ea' } : null,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', height: convertX(30) }}>
            <Text
              style={[
                {
                  color: '#fff',
                  fontSize: convertX(18),
                  marginLeft: '43%',
                  marginTop: convertX(2),
                },
                isWhite ? { color: '#2d385f' } : null,
              ]}
            >
              h
            </Text>
            <Text
              style={[
                {
                  color: '#fff',
                  fontSize: convertX(18),
                  marginLeft: '23%',
                  marginTop: convertX(2),
                },
                isWhite ? { color: '#2d385f' } : null,
              ]}
            >
              m
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', width: viewWidth }}>
          <Picker
            selectedValue={hour}
            onValueChange={value => {
              onChangeHour && onChangeHour(value);
            }}
            style={[styles.picker]}
            itemStyle={styles.pickerItem}
            visibleItemCount={7}
            loop={true}
            textSize={convertX(20)}
            itemTextColor="#aeadb5"
            selectedItemTextColor={isWhite ? '#2d385f' : '#fcfefe'}
            dividerColor="transparent"
          >
            {this.HourArr.map(value => (
              <Picker.Item
                key={value}
                value={value}
                label={value}
                color={isWhite ? '#2d385f' : '#fff'}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={minute}
            onValueChange={value => {
              onChangeMin && onChangeMin(value);
            }}
            style={[styles.picker]}
            itemStyle={styles.pickerItem}
            visibleItemCount={7}
            loop={true}
            textSize={convertX(20)}
            itemTextColor="#aeadb5"
            selectedItemTextColor={isWhite ? '#2d385f' : '#fcfefe'}
            dividerColor="transparent"
          >
            {this.MinutesArr.map(value => (
              <Picker.Item
                key={value}
                value={value}
                label={value}
                color={isWhite ? '#2d385f' : '#fff'}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  pickerContainer: {
    width: viewWidth,
    height: convertX(200),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: viewWidth / 4,
    height: convertX(200),
  },
  pickerItem: {
    width: viewWidth / 4,
    height: convertX(200),
    color: '#fff',
  },
});
