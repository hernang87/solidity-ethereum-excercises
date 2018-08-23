const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

require('events').EventEmitter.defaultMaxListeners = 0;

describe('Lottery', () => {
  let lottery;
  let accounts;

  beforeEach(async() => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of the accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: '1000000' })
  });

  it('deploys a lottery', () => {
    assert.ok(lottery.options.address);
  });

  it('sets deployer as manager', async() => {
    let manager = await lottery.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('has no players', async() => {
    let players = await lottery.methods.getPlayers().call();
    assert.equal(players.length, 0);
  });

  it('adds one player', async() => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether')
    });

    let players = await lottery.methods.getPlayers().call();

    assert.equal(1, players.length);
    assert.equal(accounts[1], players[0]);
  });

  it('adds multiple players', async() => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('1', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('1', 'ether')
    });

    let players = await lottery.methods.getPlayers().call();

    assert.equal(3, players.length);
    assert.equal(accounts[1], players[0]);
    assert.equal(accounts[2], players[1]);
    assert.equal(accounts[3], players[2]);
  });

  it('requires minimum ether to enter', async() => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: 200
      });
      assert(false);
    } catch(err) {
      assert(err);
    }
  });

  it('only manager can pick winner', async() => {
    try {
      await lottery.methods.pickWinner().call({
        from: accounts[1]
      });

      assert(false)
    } catch(err) {
      assert(err);
    }
  });

  it('sends money to winner', async() => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('5', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().call({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);

    const difference = finalBalance - initialBalance;

    assert(difference < web3.utils.toWei('0.2', 'ether'));
  });
});
