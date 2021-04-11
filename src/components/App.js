import React, {Component}  from 'react';
import Game from './Game';
class App extends Component {
  state = {
    gameId: 1,
  }
  playAgain = () => {
    this.setState(prevState => ({
      gameId: prevState.gameId + 1,
    }));
  }
  render() {
    return (
      <Game
        key={this.state.gameId}
        onPlayAgain={this.playAgain} 
        randomNumberCount={6} 
        initialSeconds={10}/> 
    )
  };
}

export default App;
