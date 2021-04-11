import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class Random extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  }
  handlePress = () => {
    if (this.props.isDisabled) return;
    this.props.onPress(this.props.id);
  }
  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.random, this.props.isDisabled && styles.selected]}>{this.props.number}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 25,
    marginVertical: 35,
    fontSize: 30,
    textAlign: 'center',
  },
  selected: {
    opacity: 0.3,
  }
})