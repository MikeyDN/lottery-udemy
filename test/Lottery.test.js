const mocha = require('mocha');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {abi, evm} = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {

	accounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(abi)
		.deploy({
			data: evm.bytecode.object
		})
		.send({ from: accounts[0], gas:'1000000' });
});

describe('Lottery', async () => {
	it('deploys contract', () => {
		assert.ok(lottery.options.address);
	});

	it('records first entry', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei("0.02", "ether")
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	it('records multiple entries', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei("0.02", "ether")
		});

		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei("0.03", "ether")
		});

		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei("0.04", "ether")
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3, players.length);
	});

	it('limits minimum entry value', async () => {
		try {
			await lottery.methods.enter().send({
				from: accounts[0],
				value: 200
			});

		} catch (err) {
			assert(err);
		}
	});

	it('Only owner can call pickWinner', async () => {
		try {
			await lottery.methods.pickWinner().send({ from: accounts[1] });
			assert(false);

		} catch (err) {
			assert(err);
		}
	});

	it('sends money to winner and resets players', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});

		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({ from: accounts[0] });
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		const players = await lottery.methods.getPlayers().call();
		const contractFinalBalance = await web3.eth.getBalance(lottery.options.address);

		assert(difference > web3.utils.toWei('1.9', 'ether'));
		assert.equal(players.length, 0);
		assert.equal(contractFinalBalance, 0);

	});
});
