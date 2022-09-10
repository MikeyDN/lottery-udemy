const HDWalletProvider = require('@truffle/hdwallet-provider');
const { abi, evm } = require('./compile');
const Web3 = require('web3');

mnemonic = 'cousin meadow fix topple rigid news physical occur hockey job stamp step';
infuraLink = "https://rinkeby.infura.io/v3/3be66a7d4d014a45a47fdc22233b7b6f"

const provider = new HDWalletProvider(
	mnemonic,
	infuraLink
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await new web3.eth.getAccounts();

	console.log('Attempting to deploy from accout: ' + accounts[0]);

	const result = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object })
		.send({ gas: '1000000', from: accounts[0] });

		console.log(JSON.stringify(abi));
		console.log("Contract deployed to: " + result.options.address);

		provider.engine.stop();

};

deploy();
