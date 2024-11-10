pragma solidity ^0.8.0;

contract MovieTicketBooking {
    address payable public cinemaWallet;
    uint256 public ticketPrice;

    event TicketPurchased(address indexed buyer, uint256 amount, uint256 date);

    constructor(address payable _cinemaWallet, uint256 _ticketPrice) {
        cinemaWallet = _cinemaWallet;
        ticketPrice = _ticketPrice;
    }

    function purchaseTicket() public payable {
        require(msg.value >= ticketPrice, "Insufficient funds for ticket");

        // ส่งเงินไปยังที่อยู่กระเป๋าของโรงหนัง
        (bool success, ) = cinemaWallet.call{value: msg.value}("");
        require(success, "Transaction failed");

        // Emit event เมื่อทำการซื้อสำเร็จ
        emit TicketPurchased(msg.sender, msg.value, block.timestamp);
    }

    function updateTicketPrice(uint256 _ticketPrice) public {
        ticketPrice = _ticketPrice;
    }
}
