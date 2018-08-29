pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public winner;

    constructor() public payable {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Not enough ether");

        players.push(msg.sender);
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        // Saves the winner
        winner = players[index];
        // Reset players after playing
        players = new address[](0);
    }

    function random() private view returns (uint) {
        return uint(
            keccak256(
                abi.encodePacked(block.difficulty, now, players)
            )
        );
    }

    modifier restricted() {
        require(msg.sender == manager, "Not Allowed");
        _;
    }
}