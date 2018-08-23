const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const nmeumonic = 'present member reward artwork soup snake memory gift relief wolf now erode';
const network = 'https://rinkeby.infura.io/v3/0a0695ac86d447c699ed16487adb7369';

const provider = new HDWalletProvider(
  nmeumonic,
  network
);

const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode,
      arguments: ['Hi there!']
    })
    .send({
      gas: '5000000',
      from: accounts[0]
    });

  console.log('Deployed to', result.options.address);
};

deploy();