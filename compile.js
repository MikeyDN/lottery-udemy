const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contract', 'lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
	language: 'Solidity',
	sources: { 'lottery.sol': { content: source } },
	settings: {
		outputSelection: { '*': { '*': ['*'] } }
	}
};
retval = JSON.parse(
	solc.compile(JSON.stringify(input))
).contracts['lottery.sol'].Lottery;
console.log(retval.abi);
module.exports = retval;
