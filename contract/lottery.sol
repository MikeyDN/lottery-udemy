// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Lottery {
    address public manager;
    address payable[] public participants;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        participants.push(payable(msg.sender));
    }

    modifier onlyOwner() {
        require(msg.sender == manager);
        _;
    }

    function pickWinner() public onlyOwner {
        uint winner = random() % participants.length;
        participants[winner].transfer(address(this).balance);
        participants = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return participants;
    }

    function random() private view returns (uint) { //unit = uint256
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participants)));
    }

}
