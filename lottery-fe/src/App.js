import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

import EnterForm from './components/EnterForm';
import PickWinner from './components/PickWinner';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    message: ''
  };

  async componentDidMount() {
    await this.setLotteryData();
  }

  setLotteryData = async() => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onEnter = async (value) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction...' });

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value
      });

      await this.setLotteryData();

      this.setState({ message: 'Transaction success' });
    } catch(e) {
      this.setState({ message: 'Transaction failed' });
    }
  }

  onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Picking winner...' });

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      const winner = await lottery.methods.winner().call();

      this.setState({ message: 'Winner is ' + winner });
    } catch(e) {
      console.log(e);
      this.setState({ message: 'Picking winner failed.' });
    }
  }

  render() {
    const { manager, players, balance, message } = this.state;
    const ether = web3.utils.fromWei(balance, 'ether');

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {manager}.</p>
        <p>There are currently {players.length} players competing for {ether} ether.</p>
        <hr />
        <EnterForm onEnter={this.onEnter} />
        <hr />
        <PickWinner onPickWinner={this.onPickWinner} />
        <hr />
        <h1>{message}</h1>
      </div>
    );
  }
}

export default App;
