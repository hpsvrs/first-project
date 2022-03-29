// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm2 is Ownable {
    using SafeMath for uint256;

    // mapping token address -> staker address -> amount
    uint256 public APY = 10;

    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) stakingTimeStamp;
    mapping(address => uint256) stakingRewards;
    mapping(address => uint256) public stakingTimeToWithdraw;
    uint256 public amountPeopleLeftInWithdrawFees;

    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public funders;
    uint256 public uniqueTokenStakers;
    uint256 public totalTokensStaked;

    address[] public stakers;
    address[] public allowedTokens;
    IERC20 public dappToken;
    IERC20 public preSaleTokenAddress;

    // --------------------------------
    // pre-sale amount Balance
    // address public owner;
    mapping(address => mapping(address => uint256)) public purchasedBalance;
    mapping(address => uint256) public collectedPreSaleFunds;
    mapping(address => uint256) public totalCollectionOfPreSaleFunds;
    uint256 public totalCollectionOfPreSaleFundsAllTokens;

    mapping(address => uint256) public totalPurchasedPreSaleTokens;
    uint256 private TIMES;
    // mapping(address => mapping(address => uint256))
    //     public preSaleTokensAvailableToWithdraw;

    mapping(address => uint256) public totalWithdrawnPreSaleTokens;

    uint256 public percentageWithdrawAllowed;

    // mapping(address => mapping(address => uint256))
    //     public preSaleTokensLeftToWithdraw;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public preSaleFunders;
    address[] public preSaleAllowedTokens;
    AggregatorV3Interface public priceFeedA;
    mapping(address => uint256) public uniquePreSaleTokensStaked;
    uint256 public singleTokenAllPreSaleBalance;

    // Pre Sale Status and Allocation Round Variables

    mapping(uint256 => uint256) public stakingLevelToWeight; // this assign each staking level accordign to their weight value
    mapping(uint256 => bool) public participateInPreSaleAllocationStatus; // This helps activate or deactive the function "participateInPreSaleAllocation"
    uint256 baseNumberStakingLevel = 1500;
    mapping(uint256 => uint256) public stakingLevelUserCounter; // this counts the number of participated users in each staking level
    mapping(address => bool) public preSaleParticipantsStatus;
    mapping(address => uint256) public whenParticipatedThatLevel; // this is the staking level of user when he/she particpated in pre-sale
    mapping(uint256 => uint256) public totalAmountToCollectForThisPreSale; // determines how much amount you want to collect for this pre-sale
    mapping(uint256 => bool) public preSaleAllocationStatus; // determines if Allocation round has started allowed. start it after turning participation

    constructor(address _dappTokenAddress, address _priceFeed) public {
        dappToken = IERC20(_dappTokenAddress);
        // owner = msg.sender;
        priceFeedA = AggregatorV3Interface(_priceFeed);

        stakingLevelToWeight[0] = 0;
        stakingLevelToWeight[1] = 1;
        stakingLevelToWeight[2] = 2;
        stakingLevelToWeight[3] = 3;
        stakingLevelToWeight[4] = 4;
        stakingLevelToWeight[5] = 5;
        stakingLevelToWeight[6] = 6;
        stakingLevelToWeight[7] = 7;
        stakingLevelToWeight[8] = 8;
        stakingLevelToWeight[9] = 9;
        stakingLevelToWeight[10] = 10;
        stakingLevelToWeight[11] = 15;
        stakingLevelToWeight[12] = 20;
        stakingLevelToWeight[13] = 25;
        stakingLevelToWeight[14] = 30;
        stakingLevelToWeight[15] = 35;
        stakingLevelToWeight[16] = 40;
        stakingLevelToWeight[17] = 45;
        stakingLevelToWeight[18] = 50;
        stakingLevelToWeight[19] = 60;
        stakingLevelToWeight[20] = 70;
        stakingLevelToWeight[21] = 80;
        stakingLevelToWeight[22] = 90;
        stakingLevelToWeight[23] = 100;
        stakingLevelToWeight[24] = 110;
        stakingLevelToWeight[25] = 120;
        stakingLevelToWeight[26] = 130;
        stakingLevelToWeight[27] = 140;
        stakingLevelToWeight[28] = 150;
    }

    //
    // Pre Sale numbers and allocation per user
    // -------------------------------
    // Once the participant enters they wont be able to re-enter

    function setTotalAmountToCollectForThisPreSale(
        uint256 _preSaleNumber,
        uint256 _amount
    ) public onlyOwner {
        totalAmountToCollectForThisPreSale[_preSaleNumber] = _amount;
    }

    function participateInPreSaleAllocation(
        uint256 _preSaleNumber,
        address _token
    ) public {
        require(participateInPreSaleAllocationStatus[_preSaleNumber] == true); // this is help to open the pre-sale participation
        require(stakingBalance[_token][msg.sender] >= (1500 * (10**18)));
        require(getStakingLevel(msg.sender, _token) > 0);
        // require(preSaleParticipantsStatus[msg.sender] == false);

        uint256 stakingLevel = getStakingLevel(msg.sender, _token);
        stakingLevelUserCounter[stakingLevel] =
            stakingLevelUserCounter[stakingLevel] +
            1;
        whenParticipatedThatLevel[msg.sender] = stakingLevel;
    }

    // uint256 public allPoolsTotalWeight;
    // uint256 public amountAllocatedToEachShare;
    // uint256 public allocatedAmountToEachUser;
    // uint256 public users_count_each_staking_level;

    function getAllocatedPreSaleAmount(
        address _sender,
        address _token,
        uint256 _preSaleNumber
    ) public view returns (uint256) {
        require(preSaleAllocationStatus[_preSaleNumber] == true);
        require(totalAmountToCollectForThisPreSale[_preSaleNumber] > 0);

        uint256 allPoolsTotalWeight;
        for (uint256 i = 1; i < 29; i++) {
            uint256 eachPoolTotalWeight;
            eachPoolTotalWeight = (stakingLevelToWeight[i] *
                stakingLevelUserCounter[i]);
            allPoolsTotalWeight = allPoolsTotalWeight + eachPoolTotalWeight;
        }
        uint256 amountAllocatedToEachShare = (totalAmountToCollectForThisPreSale[
                _preSaleNumber
            ] / allPoolsTotalWeight);

        uint256 staking_level_of_sender = getStakingLevel(_sender, _token);
        uint256 users_count_each_staking_level = stakingLevelUserCounter[
            staking_level_of_sender
        ];

        uint256 each_level_staking_weight = stakingLevelToWeight[
            staking_level_of_sender
        ];

        uint256 allocatedAmountToEachUser;
        allocatedAmountToEachUser = ((each_level_staking_weight *
            users_count_each_staking_level *
            amountAllocatedToEachShare) / users_count_each_staking_level);

        return (allocatedAmountToEachUser);
    }

    function changeStakingLevelToWeight(uint256 _level, uint256 _weight)
        public
        onlyOwner
    {
        stakingLevelToWeight[_level] = _weight;
    }

    function changeBaseNumberStakingLevel(uint256 _number) public onlyOwner {
        baseNumberStakingLevel = _number;
    }

    function setPreSaleAllocationStatus(uint256 _number, bool _status)
        public
        onlyOwner
    {
        preSaleAllocationStatus[_number] = _status;
    }

    function setParticipateInPreSaleAllocationStatus(
        uint256 _number,
        bool _status
    ) public onlyOwner {
        participateInPreSaleAllocationStatus[_number] = _status;
    }

    function getStakingLevel(address _sender, address _token)
        public
        view
        returns (uint256)
    {
        uint256 stakingLevel = 0;
        if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 150) * (10**18))
        ) {
            return stakingLevel = 28;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 140) * (10**18))
        ) {
            return stakingLevel = 27;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 130) * (10**18))
        ) {
            return stakingLevel = 26;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 120) * (10**18))
        ) {
            return stakingLevel = 25;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 110) * (10**18))
        ) {
            return stakingLevel = 24;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 100) * (10**18))
        ) {
            return stakingLevel = 23;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 90) * (10**18))
        ) {
            return stakingLevel = 22;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 80) * (10**18))
        ) {
            return stakingLevel = 21;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 70) * (10**18))
        ) {
            return stakingLevel = 20;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 60) * (10**18))
        ) {
            return stakingLevel = 19;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 50) * (10**18))
        ) {
            return stakingLevel = 18;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 45) * (10**18))
        ) {
            return stakingLevel = 17;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 40) * (10**18))
        ) {
            return stakingLevel = 16;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 35) * (10**18))
        ) {
            return stakingLevel = 15;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 30) * (10**18))
        ) {
            return stakingLevel = 14;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 25) * (10**18))
        ) {
            return stakingLevel = 13;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 20) * (10**18))
        ) {
            return stakingLevel = 12;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 15) * (10**18))
        ) {
            return stakingLevel = 11;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 10) * (10**18))
        ) {
            return stakingLevel = 10;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 9) * (10**18))
        ) {
            return stakingLevel = 9;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 8) * (10**18))
        ) {
            return stakingLevel = 8;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 7) * (10**18))
        ) {
            return stakingLevel = 7;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 6) * (10**18))
        ) {
            return stakingLevel = 6;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 5) * (10**18))
        ) {
            return stakingLevel = 5;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 4) * (10**18))
        ) {
            return stakingLevel = 4;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 3) * (10**18))
        ) {
            return stakingLevel = 3;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 2) * (10**18))
        ) {
            return stakingLevel = 2;
        } else if (
            stakingBalance[_token][_sender] >=
            ((baseNumberStakingLevel * 1) * (10**18))
        ) {
            return stakingLevel = 1;
        } else {
            return stakingLevel = 0;
        }
    }

    // pre-sale collection of funds according to each pre-sale number
    mapping(uint256 => bool) public preSaleFundEachPreSaleNumberStatus; // this is to activate or deactive the preSaleFundPerPreSaleNumber Function
    mapping(uint256 => bool) public claimTokensEachPreSaleStatus; // this is to activate or deactive the claimAllTokensEachPreSale Function

    mapping(uint256 => mapping(address => uint256))
        public purchasedBalanceEachPreSale; // Balance of amount spend by user in this single pre-sale
    mapping(address => uint256) public uniquePreSaleTokensPurchased; // Collecting how many times this user has participated in the pre-sales
    mapping(uint256 => uint256) public TIMESeachPreSale; // Determines the price of pre-sale tokens / per BUSD
    mapping(uint256 => mapping(address => uint256))
        public collectedPreSaleFundsEachPreSale; // This is to withdraw pre-sale collected funds, this will get zero when owner withdraw the funds
    mapping(uint256 => mapping(address => uint256))
        public totalCollectionOfPreSaleFundsEachPreSale; // This will not get zero after withdrawing of funds
    mapping(uint256 => address[]) public preSaleFundersEachPreSale; // creates the list of a number of users who purchased tokens in this single pre-sale
    mapping(uint256 => mapping(address => uint256))
        public totalPurchasedPreSaleTokensEachPreSale; // totalPurchasedPreSaleTokensEachPreSale determines how many pre-sale tokens user will get in this pre-sale
    mapping(uint256 => mapping(address => uint256))
        public totalWithdrawnPreSaleTokensEachPreSale; // this is total withdrawn amount by user for this single pre-sale
    mapping(uint256 => uint256) public percentageWithdrawAllowedEachPreSale;
    mapping(uint256 => IERC20) public preSaleTokenAddressEachPreSale; // the is the tokens which we will deliver in return of pre-sale collected funds

    function setPreSaleFundEachPreSaleNumberStatus(
        uint256 _preSaleNumber,
        bool _status
    ) public onlyOwner {
        preSaleFundEachPreSaleNumberStatus[_preSaleNumber] = _status;
    }

    // this represents the token being staked on our platform
    // this represents the curreny being used to pay for this pre-sale
    function preSaleFundEachPreSaleNumber(
        uint256 _amount,
        address _token,
        address _busdToken,
        uint256 _preSaleNumber
    ) public {
        require(preSaleFundEachPreSaleNumberStatus[_preSaleNumber] == true);
        require(stakingBalance[_token][msg.sender] >= (1500 * (10**18)));
        require(getStakingLevel(msg.sender, _token) > 0);
        require(totalAmountToCollectForThisPreSale[_preSaleNumber] > 0);
        require(_amount > 0, "Amount must be more than 0");
        require(
            preSaleTokenIsAllowed(_busdToken),
            "Token is currently not allowed"
        );
        require(
            totalCollectionOfPreSaleFundsEachPreSale[_preSaleNumber][
                _busdToken
            ] < totalAmountToCollectForThisPreSale[_preSaleNumber]
        );
        uint256 allocatedPreSaleAmount = getAllocatedPreSaleAmount(
            msg.sender,
            _token,
            _preSaleNumber
        );
        uint256 balance = (allocatedPreSaleAmount -
            purchasedBalanceEachPreSale[_preSaleNumber][msg.sender]);
        require(balance > 0);
        require(_amount <= balance);
        IERC20(_busdToken).transferFrom(msg.sender, address(this), _amount);
        updateUniquePreSaleTokensPurchased(msg.sender, _preSaleNumber);
        // how much worth user has purchased in this single pre-sale (amount is in busd)
        purchasedBalanceEachPreSale[_preSaleNumber][msg.sender] =
            purchasedBalanceEachPreSale[_preSaleNumber][msg.sender] +
            _amount;
        // totalPurchasedPreSaleTokensEachPreSale determines how many pre-sale tokens user will get in this pre-sale
        totalPurchasedPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] =
            totalPurchasedPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] +
            (_amount * TIMESeachPreSale[_preSaleNumber]);
        // how much Funds has been collected so far
        collectedPreSaleFundsEachPreSale[_preSaleNumber][_busdToken] =
            collectedPreSaleFundsEachPreSale[_preSaleNumber][_busdToken] +
            _amount;
        totalCollectionOfPreSaleFundsEachPreSale[_preSaleNumber][_busdToken] =
            totalCollectionOfPreSaleFundsEachPreSale[_preSaleNumber][
                _busdToken
            ] +
            _amount;
        totalCollectionOfPreSaleFundsAllTokens =
            totalCollectionOfPreSaleFundsAllTokens +
            _amount;
    }

    function getHowMuchMoreUserCanPurchaseEachPreSale(
        address _sender,
        address _token,
        uint256 _preSaleNumber
    ) public view returns (uint256) {
        uint256 allocatedPreSaleAmount = getAllocatedPreSaleAmount(
            _sender,
            _token,
            _preSaleNumber
        );
        uint256 balance = (allocatedPreSaleAmount -
            purchasedBalanceEachPreSale[_preSaleNumber][_sender]);
        return (balance);
    }

    function updateUniquePreSaleTokensPurchased(
        address _user,
        uint256 _preSaleNumber
    ) internal {
        if (purchasedBalanceEachPreSale[_preSaleNumber][_user] <= 0) {
            uniquePreSaleTokensPurchased[_user] =
                uniquePreSaleTokensPurchased[_user] +
                1;
            preSaleFundersEachPreSale[_preSaleNumber].push(_user);
        }
    }

    function setClaimTokensEachPreSaleStatus(
        uint256 _preSaleNumber,
        bool _status
    ) public onlyOwner {
        claimTokensEachPreSaleStatus[_preSaleNumber] = _status;
    }

    function claimAllTokensEachPreSale(uint256 _preSaleNumber) public {
        require(claimTokensEachPreSaleStatus[_preSaleNumber] == true);

        uint256 totalPurchased = totalPurchasedPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowedEachPreSale[
            _preSaleNumber
        ] * totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        require(totalPurchased > 0);
        require(availableToWithdraw > 0);
        require(totalWithdrawn < totalPurchased);

        IERC20(preSaleTokenAddressEachPreSale[_preSaleNumber]).transfer(
            msg.sender,
            availableToWithdraw
        );
        totalWithdrawnPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] =
            totalWithdrawnPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] +
            availableToWithdraw;
    }

    function claimTokensEachPreSale(uint256 _preSaleNumber, uint256 _amount)
        public
    {
        require(claimTokensEachPreSaleStatus[_preSaleNumber] == true);

        uint256 totalPurchased = totalPurchasedPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowedEachPreSale[
            _preSaleNumber
        ] * totalPurchased) / 100;
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

        IERC20(preSaleTokenAddressEachPreSale[_preSaleNumber]).transfer(
            msg.sender,
            _amount
        );
        totalWithdrawnPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] =
            totalWithdrawnPreSaleTokensEachPreSale[_preSaleNumber][msg.sender] +
            _amount;
    }

    // this function increase the of percentage amount allowed to withdraw

    function setPercentageWithdrawAllowedEachPreSale(
        uint256 _preSaleNumber,
        uint256 _percentageAmount
    ) public onlyOwner {
        // require(percentageWithdrawAllowedEachPreSale[_preSaleNumber] <= 101);
        // require((percentageWithdrawAllowedEachPreSale[_preSaleNumber] + _percentageAmount) <= 101);
        percentageWithdrawAllowedEachPreSale[_preSaleNumber] =
            percentageWithdrawAllowedEachPreSale[_preSaleNumber] +
            _percentageAmount;
    }

    // similar to "setPercentageWithdrawAllowedEachPreSale" but you can also decrease the value

    function manuallySetPercentageWithdrawAllowedEachPreSale(
        uint256 _preSaleNumber,
        uint256 _percentageAmount
    ) public onlyOwner {
        // require(percentageWithdrawAllowedEachPreSale[_preSaleNumber] <= 101);
        // require((percentageWithdrawAllowedEachPreSale[_preSaleNumber] + _percentageAmount) <= 101);
        percentageWithdrawAllowedEachPreSale[
            _preSaleNumber
        ] = _percentageAmount;
    }

    function getAvailablePreSaleTokensToWithdrawEachPreSale(
        address _token,
        address _sender,
        uint256 _preSaleNumber
    ) public view returns (uint256) {
        uint256 totalPurchased = totalPurchasedPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokensEachPreSale[
            _preSaleNumber
        ][msg.sender];
        uint256 allowedToWithdraw = (percentageWithdrawAllowedEachPreSale[
            _preSaleNumber
        ] * totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        // preSaleTokensLeftToWithdraw[_token][msg.sender] = availableToWithdraw;
        return availableToWithdraw;
    }

    // this is to withdraw the collected funds from each pre-sale

    function withdrawCollectedFundEachPreSale(
        uint256 _preSaleNumber,
        address _busdToken
    ) public onlyOwner {
        // uint256 balance = purchasedBalance[_token][msg.sender];
        // uint256 balance = (IERC20(_token).balanceOf(address(this)));
        uint256 collectedFunds = collectedPreSaleFundsEachPreSale[
            _preSaleNumber
        ][_busdToken];
        // require(balance > 0, "Staking balance cannot be 0");
        IERC20(_busdToken).transfer(msg.sender, collectedFunds);

        collectedPreSaleFundsEachPreSale[_preSaleNumber][_busdToken] = 0;
    }

    function updatePreSaleTokenAddressEachPreSale(
        uint256 _preSaleNumber,
        address _preSaleTokenAddress
    ) public onlyOwner {
        preSaleTokenAddressEachPreSale[_preSaleNumber] = IERC20(
            _preSaleTokenAddress
        );
    }

    function updateTimesEachPreSale(uint256 _preSaleNumber, uint256 _times)
        public
        onlyOwner
    {
        TIMESeachPreSale[_preSaleNumber] = _times;
    }

    // *************************************************

    // ---------------------------------------

    // -------------------------------
    //    address[] public receivingAllowedTokens;

    // stakeTokens - DONE!
    // unStakeTokens - DONE
    // issueTokens - DONE!
    // addAllowedTokens - DONE!
    // getEthValue - DONE!

    // 100 ETH 1:1 for every 1 ETH, we give 1 DappToken
    // 50 ETH and 50 DAI staked, and we want to give a reward of 1 DAPP / 1 DAI

    function getVersion() public view returns (uint256) {
        return priceFeedA.version();
    }

    function addPreSaleAllowedTokens(address _token) public onlyOwner {
        preSaleAllowedTokens.push(_token);
    }

    function updateTimes(uint256 _times) public onlyOwner {
        TIMES = _times;
    }

    function updatePreSaleTokenAddress(address _preSaleTokenAddress)
        public
        onlyOwner
    {
        preSaleTokenAddress = IERC20(_preSaleTokenAddress);
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

        // how much worth user has purchased in busd
        purchasedBalance[_token][msg.sender] =
            purchasedBalance[_token][msg.sender] +
            _amount;

        // totalPurchasedPreSaleTokens determines how many pre-sale tokens user will get
        totalPurchasedPreSaleTokens[msg.sender] =
            totalPurchasedPreSaleTokens[msg.sender] +
            (_amount * TIMES);

        // how much amount has been calculated so far
        collectedPreSaleFunds[_token] = collectedPreSaleFunds[_token] + _amount;
        totalCollectionOfPreSaleFunds[_token] =
            totalCollectionOfPreSaleFunds[_token] +
            _amount;
        totalCollectionOfPreSaleFundsAllTokens =
            totalCollectionOfPreSaleFundsAllTokens +
            _amount;

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

    function claimAllPreSaletokens() public {
        uint256 totalPurchased = totalPurchasedPreSaleTokens[msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[msg.sender];
        uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowed *
            totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        require(totalPurchased > 0);
        require(availableToWithdraw > 0);
        require(totalWithdrawn < totalPurchased);

        IERC20(preSaleTokenAddress).transfer(msg.sender, availableToWithdraw);
        totalWithdrawnPreSaleTokens[msg.sender] =
            totalWithdrawnPreSaleTokens[msg.sender] +
            availableToWithdraw;
    }

    function claimPreSaleTokens(uint256 _amount) public {
        uint256 totalPurchased = totalPurchasedPreSaleTokens[msg.sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[msg.sender];
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

        IERC20(preSaleTokenAddress).transfer(msg.sender, _amount);
        totalWithdrawnPreSaleTokens[msg.sender] =
            totalWithdrawnPreSaleTokens[msg.sender] +
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
        uint256 totalPurchased = totalPurchasedPreSaleTokens[_sender];
        uint256 totalWithdrawn = totalWithdrawnPreSaleTokens[_sender];
        // uint256 balance = (totalPurchased - totalWithdrawn);
        uint256 allowedToWithdraw = (percentageWithdrawAllowed *
            totalPurchased) / 100;
        uint256 availableToWithdraw = (allowedToWithdraw - totalWithdrawn);

        // preSaleTokensLeftToWithdraw[_token][msg.sender] = availableToWithdraw;
        return availableToWithdraw;
    }

    function withdrawPreSaleCollectedFund(address _token) public onlyOwner {
        // uint256 balance = purchasedBalance[_token][msg.sender];
        // uint256 balance = (IERC20(_token).balanceOf(address(this)));
        uint256 collectedFunds = collectedPreSaleFunds[_token];
        // require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, collectedFunds);
        singleTokenAllPreSaleBalance =
            (IERC20(_token).balanceOf(address(this))) /
            1000000000000000000;

        collectedPreSaleFunds[_token] = 0;
    }

    function manageWithdrawOwnerFunds(address _token, uint256 _amount)
        public
        onlyOwner
    {
        IERC20(_token).transfer(msg.sender, _amount);
    }

    function manageDepositOwnerFunds(address _token, uint256 _amount)
        public
        onlyOwner
    {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
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

    function setAPY(uint256 _APY) public onlyOwner {
        APY = _APY;
    }

    function calculateStakingRewards(address _user, address _token)
        public
        view
        returns (uint256)
    {
        uint256 userTimeStamp = stakingTimeStamp[_user];
        uint256 currentTime = block.timestamp;
        uint256 userStakingBalance = stakingBalance[_token][_user];

        uint256 totalRewardsPerYear = (APY * userStakingBalance) / 100;
        uint256 totalRewardsPerMinute = totalRewardsPerYear / 525600;

        uint256 stakedTimeInMinutes = ((currentTime - userTimeStamp) / 60);
        uint256 rewards = stakedTimeInMinutes * totalRewardsPerMinute;

        return rewards;
    }

    function getAvailableStakingRewards(address _sender, address _token)
        public
        view
        returns (uint256)
    {
        uint256 totalRewards = (stakingRewards[_sender] +
            calculateStakingRewards(_sender, _token));

        return totalRewards;
    }

    function claimStakingRewards(address _token) public {
        uint256 userTotalRewards = getAvailableStakingRewards(
            msg.sender,
            _token
        );
        require(userTotalRewards > 0);
        IERC20(_token).transfer(msg.sender, userTotalRewards);
        stakingRewards[msg.sender] = 0;
        stakingTimeStamp[msg.sender] = block.timestamp;
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can they stake?
        // how much can they stake?
        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token is currently not allowed");
        // transferFrom
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        updateUniqueTokenStakers(msg.sender, _token);
        totalTokensStaked = totalTokensStaked + _amount;

        stakingRewards[msg.sender] = getAvailableStakingRewards(
            msg.sender,
            _token
        );

        stakingTimeStamp[msg.sender] = block.timestamp;
        stakingTimeToWithdraw[msg.sender] = block.timestamp;

        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;

        // stakingRewards[msg.sender] = (stakingRewards[msg.sender] +
        //     calculateStakingRewards(msg.sender, _token));

        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function withdrawAmountPeopleLeftInWithdrawFees(address _token)
        public
        onlyOwner
    {
        IERC20(_token).transfer(msg.sender, amountPeopleLeftInWithdrawFees);
        amountPeopleLeftInWithdrawFees = 0;
    }

    function unstakeTokens(uint256 _amount, address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(_amount > 0, "Amount must be more than 0");
        require(balance >= _amount, "You don't have enough staked tokens");
        require(tokenIsAllowed(_token), "Token is currently not allowed");

        uint256 timeNow = block.timestamp;
        if (timeNow < (stakingTimeToWithdraw[msg.sender] + 4838400)) {
            if (timeNow < (stakingTimeToWithdraw[msg.sender] + 3628800)) {
                if (timeNow < (stakingTimeToWithdraw[msg.sender] + 2419200)) {
                    if (
                        timeNow < (stakingTimeToWithdraw[msg.sender] + 1209600)
                    ) {
                        uint256 withdrawAmount = ((75 * _amount) / 100);
                        IERC20(_token).transfer(msg.sender, withdrawAmount);

                        amountPeopleLeftInWithdrawFees =
                            amountPeopleLeftInWithdrawFees +
                            (_amount - withdrawAmount);
                    } else {
                        uint256 withdrawAmount = ((85 * _amount) / 100);
                        IERC20(_token).transfer(msg.sender, withdrawAmount);

                        amountPeopleLeftInWithdrawFees =
                            amountPeopleLeftInWithdrawFees +
                            (_amount - withdrawAmount);
                    }
                } else {
                    uint256 withdrawAmount = ((90 * _amount) / 100);
                    IERC20(_token).transfer(msg.sender, withdrawAmount);

                    amountPeopleLeftInWithdrawFees =
                        amountPeopleLeftInWithdrawFees +
                        (_amount - withdrawAmount);
                }
            } else {
                uint256 withdrawAmount = ((95 * _amount) / 100);
                IERC20(_token).transfer(msg.sender, withdrawAmount);

                amountPeopleLeftInWithdrawFees =
                    amountPeopleLeftInWithdrawFees +
                    (_amount - withdrawAmount);
            }
        } else {
            IERC20(_token).transfer(msg.sender, _amount);
        }

        stakingRewards[msg.sender] = getAvailableStakingRewards(
            msg.sender,
            _token
        );

        stakingTimeStamp[msg.sender] = block.timestamp;

        stakingBalance[_token][msg.sender] = balance - _amount;

        totalTokensStaked = totalTokensStaked - _amount;
        if (stakingBalance[_token][msg.sender] <= 0) {
            uniqueTokenStakers = uniqueTokenStakers - 1;
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
        require(tokenIsAllowed(_token), "Token is currently not allowed");

        // IERC20(_token).transfer(msg.sender, balance);

        uint256 timeNow = block.timestamp;
        if (timeNow < (stakingTimeToWithdraw[msg.sender] + 4838400)) {
            if (timeNow < (stakingTimeToWithdraw[msg.sender] + 3628800)) {
                if (timeNow < (stakingTimeToWithdraw[msg.sender] + 2419200)) {
                    if (
                        timeNow < (stakingTimeToWithdraw[msg.sender] + 1209600)
                    ) {
                        uint256 withdrawAmount = ((75 * balance) / 100);
                        IERC20(_token).transfer(msg.sender, withdrawAmount);

                        amountPeopleLeftInWithdrawFees =
                            amountPeopleLeftInWithdrawFees +
                            (balance - withdrawAmount);
                    } else {
                        uint256 withdrawAmount = ((85 * balance) / 100);
                        IERC20(_token).transfer(msg.sender, withdrawAmount);

                        amountPeopleLeftInWithdrawFees =
                            amountPeopleLeftInWithdrawFees +
                            (balance - withdrawAmount);
                    }
                } else {
                    uint256 withdrawAmount = ((90 * balance) / 100);
                    IERC20(_token).transfer(msg.sender, withdrawAmount);

                    amountPeopleLeftInWithdrawFees =
                        amountPeopleLeftInWithdrawFees +
                        (balance - withdrawAmount);
                }
            } else {
                uint256 withdrawAmount = ((95 * balance) / 100);
                IERC20(_token).transfer(msg.sender, withdrawAmount);

                amountPeopleLeftInWithdrawFees =
                    amountPeopleLeftInWithdrawFees +
                    (balance - withdrawAmount);
            }
        } else {
            IERC20(_token).transfer(msg.sender, balance);
        }
        stakingRewards[msg.sender] = getAvailableStakingRewards(
            msg.sender,
            _token
        );

        stakingTimeStamp[msg.sender] = block.timestamp;

        totalTokensStaked = totalTokensStaked - balance;
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
        uniqueTokenStakers = uniqueTokenStakers - 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function updateUniqueTokenStakers(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokenStakers = uniqueTokenStakers + 1;
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
