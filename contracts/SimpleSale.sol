pragma solidity ^0.4.15;

import "zeppelin/token/MintableToken.sol";
import "zeppelin/crowdsale/Crowdsale.sol";

contract SimpleToken is MintableToken {
}

contract SimpleSale is Crowdsale {
   function SimpleSale (
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet
  )
    Crowdsale(_startTime, _endTime, _rate, _wallet)
  {
  }
}
