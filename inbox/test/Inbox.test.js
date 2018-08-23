const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

const defaultMessage = 'Hi There!';

describe('Inbox', () => {
  let accounts;
  let inbox;

  beforeEach(async() => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: [defaultMessage]
      })
      .send({ from: accounts[0], gas: '1000000' })
  });

  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, defaultMessage);
  });

  it('can change the message', async () => {
    const newMessage = 'Pepe';
    await inbox.methods.setMessage(newMessage).send({
      from: accounts[0]
    });

    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });
});