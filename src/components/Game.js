import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import shuffle from 'lodash.shuffle';

import { StyleSheet, View, Text, Button } from 'react-native';
import Random from './Random';

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    disabledNumbers: [],
    remainingSeconds: this.props.initialSeconds,
  }

  randomNumbers = Array.from({length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));
  
  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  
  shuffledRandomNumbers = shuffle(this.randomNumbers);

  gameStatus = 'PLAYING';

  isNumberSelected = (numberIndex) => {
    return this.state.disabledNumbers.indexOf(numberIndex) >= 0;
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1};
      }, () => {
        if(this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }
  
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.disabledNumbers !== this.state.disabledNumbers ||
      nextState.remainingSeconds === 0) {
        this.gameStatus = this.calcGameStatus(nextState);
        if (this.gameStatus !== 'PLAYING') {
          clearInterval(this.intervalId);
        }    
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  disableNumber = (numberIndex) => {
    this.setState((prevState) => ({
      disabledNumbers: [...prevState.disabledNumbers, numberIndex],
    }));
  }

  calcGameStatus = (nextState) => {
    const selectedSum = nextState.disabledNumbers.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (selectedSum < this.target) {
      return 'PLAYING';
    }
    if (selectedSum === this.target) {
      return 'WON';
    }
    if (selectedSum > this.target) {
      return 'LOST';
    }
  }

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={styles.remainingCounter}>{this.state.remainingSeconds}</Text>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <View style={styles.randomContainer}>
        {this.shuffledRandomNumbers.map((randomNumber, index) => 
          <Random 
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={this.isNumberSelected(index) || this.gameStatus !== 'PLAYING'}
            onPress={this.disableNumber}
          />
        )}
        </View>
        {this.gameStatus !== 'PLAYING' &&
          <Text style={[styles.gameScore, styles[`GAME_${gameStatus}`]]}>YOU {this.gameStatus}</Text>}
        {this.gameStatus !== 'PLAYING' &&
          <Button title="Play Again" onPress={this.props.onPlayAgain} />}
      </View>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 40, 
    margin: 50,
    backgroundColor: '#bbb',
    textAlign: 'center',
  },
  playAgainBtn: {
    margin: 50,
    fontSize: 40, 
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  remainingCounter: {
    fontSize: 16,
    padding: 2,
    marginLeft: 365,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: 'blue',
  },
  gameScore: {
    fontSize: 60, 
    margin: 50,
    textAlign: 'center',
  },
  GAME_WON: {
    color: 'green',
  },
  GAME_LOST: {
    color: 'red',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
