import React, { Component } from 'react';
import web3 from '../web3';

class EnterForm extends Component {
  state = {
    value: ''
  };

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  onEnter = (event) => {
    event.preventDefault();

    this.props.onEnter(web3.utils.toWei(this.state.value, 'ether'));
  }

  render() {
    return (
      <form onSubmit={this.onEnter}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
        <button>Enter</button>
      </form>
    );
  }
}

export default EnterForm;