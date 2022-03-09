// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PreSale is Ownable {
    using SafeMath for uint256;

    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public funders;

    address[] public stakers;
    address[] public allowedTokens;
    IERC20 public dappToken;

    // --------------------------------
    // pre-sale amount Balance
    // address public owner;
    mapping(address => mapping(address => uint256)) public purchasedBalance;
    mapping(address => uint256) public preSaleTokens;
    uint256 private TIMES;
    // mapping(address => mapping(address => uint256))
    //     public preSaleTokensAvailableToWithdraw;

    mapping(address => mapping(address => uint256))
        public totalWithdrawnPreSaleTokens;

    uint256 public percentageWithdrawAllowed;

    // mapping(address => mapping(address => uint256))
    //     public preSaleTokensLeftToWithdraw;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public preSaleFunders;
    address[] public preSaleAllowedTokens;
    AggregatorV3Interface public priceFeedA;
    mapping(address => uint256) public uniquePreSaleTokensStaked;
    uint256 public singleTokenAllPreSaleBalance;

    // -------------------------------
    //    address[] public receivingAllowedTokens;

    // stakeTokens - DONE!
    // unStakeTokens - DONE
    // issueTokens - DONE!
    // addAllowedTokens - DONE!
    // getEthValue - DONE!

    // 100 ETH 1:1 for every 1 ETH, we give 1 DappToken
    // 50 ETH and 50 DAI staked, and we want to give a reward of 1 DAPP / 1 DAI
    constructor(address _dappTokenAddress, address _priceFeed) public {
        dappToken = IERC20(_dappTokenAddress);
        // owner = msg.sender;
        priceFeedA = AggregatorV3Interface(_priceFeed);
    }

    function getVersion() public view returns (uint256) {
        return priceFeedA.version();
    }

    function addPreSaleAllowedTokens(address _token) public onlyOwner {
        preSaleAllowedTokens.push(_token);
    }

    function updateTimes(uint256 _times) public onlyOwner {
        TIMES = _times;
    }

    function preSaleFund(uint256 _amount, address _token) public {
        // uint256 minimumUSD = 1 * (10**18);
        // require(
        //     getConversionRate(_amount) >= minimumUSD,
        //     "You need to spend more Eth!"
        // );
        require(_amount > 0, "Amount must be more than 0");
        require(
            preSaleTokenIsAllowed(_token),
            "Token is currently not allowed"
        );
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        singleTokenAllPreSaleBalance =
            (IERC20(_token).balanceOf(address(this))) /
            1000000000000000000;

        updateUniquePreSaleTokensStaked(msg.sender, _token);
        purchasedBalance[_token][msg.sender] =
            purchasedBalance[_token][msg.sender] +
            _amount;
        preSaleTokens[msg.sender] = (purchasedBalance[_token][msg.sender] *
            TIMES);
        if (uniquePreSaleTokensStaked[msg.sender] == 1) {
            preSaleFunders.push(msg.sender);
        }

        // addressToAmountFunded[msg.sender] += msg.value;
        // preSaleFunders.push(msg.sender);
    }

    function getSingleTokenAllPreSaleBalance(address _token)
        public
        onlyOwner
        returns (uint256)
    {
        singleTokenAllPreSaleBalance = IERC20(_token).balanceOf(address(this));
        return singleTokenAllPreSaleBalance;
    }

    function claimAllPreSaletokens(address _token) public {
        uint256 totalPurchased = purchasedBalance[_token][msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[_token][
            msg.sender
        ];
        uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowed *
            totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        require(totalPurchased > 0);
        require(availableToWithdraw > 0);
        require(totalWithdrawn < totalPurchased);

        IERC20(_token).transfer(msg.sender, availableToWithdraw);
        totalWithdrawnPreSaleTokens[_token][msg.sender] =
            totalWithdrawnPreSaleTokens[_token][msg.sender] +
            availableToWithdraw;
    }

    function claimPreSaleTokens(uint256 _amount, address _token) public {
        uint256 totalPurchased = purchasedBalance[_token][msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[_token][
            msg.sender
        ];
        uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowed *
            totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        require(availableToWithdraw > 0);
        require(_amount <= availableToWithdraw);
        require(totalWithdrawn < totalPurchased);
        require(_amount > 0, "Amount must be more than 0");
        require(
            balance >= _amount,
            "You don't have enough purchased tokens left!"
        );
        require((totalWithdrawn + _amount) < totalPurchased);

        IERC20(_token).transfer(msg.sender, _amount);
        totalWithdrawnPreSaleTokens[_token][msg.sender] =
            totalWithdrawnPreSaleTokens[_token][msg.sender] +
            _amount;

        // Removing: preSaleTokensAvailableToWithdraw is a changing value when
        // we update the percentageWithdrawAllowed it will change

        // preSaleTokensAvailableToWithdraw[_token][msg.sender] =
        //     availableToWithdraw -
        //     _amount;
    }

    function issuePreSaleTokensToWithdrawPercentage(uint256 _percentageAmount)
        public
        onlyOwner
    {
        require(percentageWithdrawAllowed <= 101);
        require((percentageWithdrawAllowed + _percentageAmount) <= 101);
        percentageWithdrawAllowed =
            percentageWithdrawAllowed +
            _percentageAmount;
    }

    function getAvailablePreSaleTokensToWithdraw(
        address _token,
        address _sender
    ) public view returns (uint256) {
        uint256 totalPurchased = purchasedBalance[_token][_sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[_token][_sender];
        // uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowed *
            totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        // preSaleTokensLeftToWithdraw[_token][msg.sender] = availableToWithdraw;
        return availableToWithdraw;
    }

    function withdrawPreSaleFund(address _token) public onlyOwner {
        // uint256 balance = purchasedBalance[_token][msg.sender];
        uint256 balance = (IERC20(_token).balanceOf(address(this)));

        require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        singleTokenAllPreSaleBalance =
            (IERC20(_token).balanceOf(address(this))) /
            1000000000000000000;

        purchasedBalance[_token][msg.sender] = 0;
        uniquePreSaleTokensStaked[msg.sender] =
            uniquePreSaleTokensStaked[msg.sender] -
            1;
    }

    // function stakeTokens(uint256 _amount, address _token) public {
    //     // what tokens can they stake?
    //     // how much can they stake?
    //     require(_amount > 0, "Amount must be more than 0");
    //     require(tokenIsAllowed(_token), "Token is currently not allowed");
    //     // transferFrom
    //     IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    //     updateUniqueTokensStaked(msg.sender, _token);
    //     stakingBalance[_token][msg.sender] =
    //         stakingBalance[_token][msg.sender] +
    //         _amount;
    //     if (uniqueTokensStaked[msg.sender] == 1) {
    //         stakers.push(msg.sender);
    //     }
    // }

    function preSaleTokenIsAllowed(address _token) public returns (bool) {
        for (
            uint256 preSaleAllowedTokensIndex = 0;
            preSaleAllowedTokensIndex < preSaleAllowedTokens.length;
            preSaleAllowedTokensIndex++
        ) {
            if (preSaleAllowedTokens[preSaleAllowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }

    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        // use function "getTokenValue()" instead of "getPrice()"

        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        return ethAmountInUsd;
    }

    function getPrice() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeedA.latestRoundData();
        return uint256(answer * 10000000000);
    }

    function getEntranceFee() public view returns (uint256) {
        //minimumUSD
        uint256 minimumUSD = 50 * 10**18;
        uint256 price = getPrice();
        uint256 precision = 1 * 10**18;
        return (minimumUSD * precision) / price;
    }

    function updateUniquePreSaleTokensStaked(address _user, address _token)
        internal
    {
        if (purchasedBalance[_token][_user] <= 0) {
            uniquePreSaleTokensStaked[_user] =
                uniquePreSaleTokensStaked[_user] +
                1;
        }
    }

    // --------------------------------------------

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        // Issue tokens to all stakers
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            // send them a token reward
            // based on their total value locked
            // dappToken.transfer(recipient, )
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!");
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // if staked 1 ETH -> $2000
        // 2000 dapp token
        // if staked 200 DAI -> $200
        // 200 dapp token
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        // price of the  token * stakingBalance[_token][_user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return // 10 ETH
        // ETH/USD
        ((stakingBalance[_token][_user] * price) / (10**decimals));
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can they stake?
        // how much can they stake?
        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token is currently not allowed");
        // transferFrom
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens(uint256 _amount, address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(_amount > 0, "Amount must be more than 0");
        require(balance >= _amount, "You don't have enough staked tokens");
        IERC20(_token).transfer(msg.sender, _amount);
        stakingBalance[_token][msg.sender] = balance - _amount;
        if (stakingBalance[_token][msg.sender] <= 0) {
            uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
        }
        // if (uniqueTokensStaked[msg.sender] == 0) {
        //     for (
        //         uint256 stakersIndex = 0;
        //         stakersIndex < stakers.length;
        //         stakersIndex++
        //     ) {
        //         address recipient = stakers[stakersIndex];
        //         if (msg.sender == recipient) {
        //             // stakers.splice(stakersIndex, 1); this part is not working
        //         }
        //     }
        // }
    }

    function unstakeAllTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
