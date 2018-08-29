import React, { Component } from 'react';

class PickWinner extends Component {

  render() {
    return (
      <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.props.onPickWinner}>Pick a Winner</button>
      </div>
    );
  }
}

export default PickWinner;