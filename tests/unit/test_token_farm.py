from lib2to3.pgen2 import token
from time import sleep
from brownie import network, exceptions
from web3 import Web3
from scripts.deploy import deploy_token_farm_and_dapp_token
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_VALUE,
)
import pytest


def test_preSaleFundEachPreSaleNumberWithoutStaking(amount_staked):
    # Arrange
    amount_to_collect_for_this_pre_sale = Web3.toWei((100), "ether")
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    amount_to_purchase = Web3.toWei(10, "ether")
    amount_to_claim = Web3.toWei(4, "ether")
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)

    token_farm.updateTimesEachPreSale(0, 1, {"from": account})

    token_farm.setTotalAmountToCollectForThisPreSale(
        0, amount_to_collect_for_this_pre_sale, {"from": account}
    )

    token_farm.setPreSaleFundEachPreSaleNumberWithoutStakingStatus(
        0, True, {"from": account}
    )
    dapp_token.approve(token_farm.address, amount_to_purchase, {"from": account})

    # Act
    tx_preSaleFundEachPreSaleNumberWithoutStakingStatus = (
        token_farm.preSaleFundEachPreSaleNumberWithoutStaking(
            amount_to_purchase, dapp_token, dapp_token, 0, {"from": account}
        )
    )
    tx_preSaleFundEachPreSaleNumberWithoutStakingStatus.wait(1)
    totalPurchasedPreSaleTokensEachPreSale = (
        token_farm.totalPurchasedPreSaleTokensEachPreSale(0, account)
    )
    setTotalAmountToCollectForThisPreSale = (
        token_farm.totalAmountToCollectForThisPreSale(0)
    )

    # Assert
    setTotalAmountToCollectForThisPreSale == amount_to_collect_for_this_pre_sale
    totalPurchasedPreSaleTokensEachPreSale == amount_to_purchase


def test_claimAllTokensEachPreSale(amount_staked):
    # Arrange
    amount_to_collect_for_this_pre_sale = Web3.toWei((100), "ether")
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    amount_to_purchase = Web3.toWei(10, "ether")
    amount_to_claim = Web3.toWei(4, "ether")
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)

    token_farm.updateTimesEachPreSale(0, 1, {"from": account})

    token_farm.setTotalAmountToCollectForThisPreSale(
        0, amount_to_collect_for_this_pre_sale, {"from": account}
    )

    dapp_token.approve(token_farm.address, amount_to_stake, {"from": account})
    token_farm.stakeTokens(amount_to_stake, dapp_token.address, {"from": account})

    tx_setParticipateInPreSaleAllocationStatus = (
        token_farm.setParticipateInPreSaleAllocationStatus(0, True, {"from": account})
    )
    tx_participateInPreSaleAllocation = token_farm.participateInPreSaleAllocation(
        0, dapp_token.address, {"from": account}
    )

    token_farm.setPreSaleAllocationStatus(0, True, {"from": account})

    token_farm.setClaimTokensEachPreSaleStatus(0, True, {"from": account})
    # token_farm.setPercentageWithdrawAllowedEachPreSale(0, 10, {"from": account})
    token_farm.manuallySetPercentageWithdrawAllowedEachPreSale(0, 50, {"from": account})

    token_farm.updatePreSaleTokenAddressEachPreSale(0, dapp_token, {"from": account})
    token_farm.setPreSaleFundEachPreSaleNumberStatus(0, True, {"from": account})

    dapp_token.approve(token_farm.address, amount_to_purchase, {"from": account})

    token_farm.preSaleFundEachPreSaleNumber(
        amount_to_purchase, dapp_token, dapp_token, 0, {"from": account}
    )
    # Act
    # tx_claimAllTokensEachPreSale = token_farm.claimAllTokensEachPreSale(
    #     0, {"from": account}
    # )

    tx_claimTokensEachPreSale = token_farm.claimTokensEachPreSale(
        0, amount_to_claim, {"from": account}
    )
    totalWithdrawnPreSaleTokensEachPreSale = (
        token_farm.totalWithdrawnPreSaleTokensEachPreSale(0, account)
    )
    getAvailablePreSaleTokensToWithdrawEachPreSale = (
        token_farm.getAvailablePreSaleTokensToWithdrawEachPreSale(
            dapp_token.address, account, 0, {"from": account}
        )
    )
    tx_withdrawCollectedFundEachPreSale = token_farm.withdrawCollectedFundEachPreSale(
        0, dapp_token.address, {"from": account}
    )
    collectedPreSaleFundsEachPreSale = token_farm.collectedPreSaleFundsEachPreSale(
        0, dapp_token.address
    )
    # Assert
    assert totalWithdrawnPreSaleTokensEachPreSale == (4 * (10 ** 18))
    assert getAvailablePreSaleTokensToWithdrawEachPreSale == (1 * (10 ** 18))
    assert collectedPreSaleFundsEachPreSale == 0


def test_preSaleFundEachPreSaleNumber(amount_staked):
    # Arrange
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    amount_to_purchase = Web3.toWei(10, "ether")
    amount_to_claim = Web3.toWei(0.1, "ether")
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)
    tx_setParticipateInPreSaleAllocationStatus = (
        token_farm.setParticipateInPreSaleAllocationStatus(0, True, {"from": account})
    )
    dapp_token.approve(token_farm.address, amount_to_stake, {"from": account})
    token_farm.stakeTokens(amount_to_stake, dapp_token.address, {"from": account})
    token_farm.setPreSaleAllocationStatus(0, True, {"from": account})
    token_farm.setTotalAmountToCollectForThisPreSale(
        0, (100 * (10 ** 18)), {"from": account}
    )
    tx_participateInPreSaleAllocation = token_farm.participateInPreSaleAllocation(
        0, dapp_token.address, {"from": account}
    )

    token_farm.updateTimesEachPreSale(0, 2, {"from": account})
    token_farm.setClaimTokensEachPreSaleStatus(0, True, {"from": account})
    token_farm.setPercentageWithdrawAllowedEachPreSale(0, 10, {"from": account})
    token_farm.updatePreSaleTokenAddressEachPreSale(0, dapp_token, {"from": account})
    # Act
    token_farm.setPreSaleFundEachPreSaleNumberStatus(0, True, {"from": account})

    dapp_token.approve(token_farm.address, amount_to_purchase, {"from": account})

    token_farm.preSaleFundEachPreSaleNumber(
        amount_to_purchase, dapp_token, dapp_token, 0, {"from": account}
    )
    purchasedBalanceEachPreSale = token_farm.purchasedBalanceEachPreSale(0, account)
    totalPurchasedPreSaleTokensEachPreSale = (
        token_farm.totalPurchasedPreSaleTokensEachPreSale(0, account)
    )
    collectedPreSaleFundsEachPreSale = token_farm.collectedPreSaleFundsEachPreSale(
        0, dapp_token.address
    )
    totalCollectionOfPreSaleFundsEachPreSale = (
        token_farm.totalCollectionOfPreSaleFundsEachPreSale(0, dapp_token)
    )
    totalCollectionOfPreSaleFundsAllTokens = (
        token_farm.totalCollectionOfPreSaleFundsAllTokens()
    )
    preSaleFundersEachPreSale = token_farm.preSaleFundersEachPreSale(0, 0)
    # tx_claimAllTokensEachPreSale = token_farm.claimAllTokensEachPreSale(
    #     0, {"from": account}
    # )
    tx_claimTokensEachPreSale = token_farm.claimTokensEachPreSale(
        0, amount_to_claim, {"from": account}
    )
    # Assert
    assert token_farm.preSaleFundEachPreSaleNumberStatus(0) == True
    assert purchasedBalanceEachPreSale == amount_to_purchase
    assert totalPurchasedPreSaleTokensEachPreSale == (2 * amount_to_purchase)
    assert collectedPreSaleFundsEachPreSale == amount_to_purchase
    assert totalCollectionOfPreSaleFundsEachPreSale == amount_to_purchase
    assert totalCollectionOfPreSaleFundsAllTokens == amount_to_purchase + amount_staked


def test_participate_in_pre_sale_allocation(amount_staked):
    # Arrange
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)
    tx_setParticipateInPreSaleAllocationStatus = (
        token_farm.setParticipateInPreSaleAllocationStatus(0, True, {"from": account})
    )
    dapp_token.approve(token_farm.address, amount_to_stake, {"from": account})
    token_farm.stakeTokens(amount_to_stake, dapp_token.address, {"from": account})
    token_farm.setPreSaleAllocationStatus(0, True, {"from": account})
    token_farm.setTotalAmountToCollectForThisPreSale(
        0, (100 * (10 ** 18)), {"from": account}
    )
    # Act
    tx_participateInPreSaleAllocation = token_farm.participateInPreSaleAllocation(
        0, dapp_token.address, {"from": account}
    )
    staking_level_user_counter = token_farm.stakingLevelUserCounter(28)
    when_participated_that_level = token_farm.whenParticipatedThatLevel(account)
    get_allocated_pre_sale_amount = token_farm.getAllocatedPreSaleAmount(
        account, dapp_token.address, 0, {"from": account}
    )
    totalAmountToCollectForThisPreSale = token_farm.totalAmountToCollectForThisPreSale(
        0
    )

    # Assert
    assert staking_level_user_counter == 1
    assert when_participated_that_level == 28
    assert get_allocated_pre_sale_amount > (99 * (10 ** 18))
    assert totalAmountToCollectForThisPreSale == (100 * (10 ** 18))


def test_get_staking_level(amount_staked):
    # Arrange
    amount_to_stake = Web3.toWei((1500 * 170), "ether")

    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)
    dapp_token.approve(token_farm.address, amount_to_stake, {"from": account})
    token_farm.stakeTokens(amount_to_stake, dapp_token.address, {"from": account})

    # Act
    staking_level = token_farm.getStakingLevel(
        account.address, dapp_token.address, {"from": account}
    )
    # Assert
    assert staking_level == 28


def test_staking_level_to_weight(amount_staked):
    # Arrange
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)

    # Act
    staking_level_to_weight = token_farm.stakingLevelToWeight(0, {"from": account})
    staking_level_to_weight1 = token_farm.stakingLevelToWeight(1, {"from": account})
    staking_level_to_weight20 = token_farm.stakingLevelToWeight(20, {"from": account})

    # Assert
    assert staking_level_to_weight == 0
    assert staking_level_to_weight1 == 1
    assert staking_level_to_weight20 == 70


def test_pre_sale_number_status(amount_staked):
    # Arrange
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)

    # Act
    status = token_farm.preSaleNumberStatus(0)
    tx_change_bool = token_farm.changePreSaleNumberStatus(0, True, {"from": account})
    status1 = token_farm.preSaleNumberStatus(0)
    tx_change_bool1 = token_farm.changePreSaleNumberStatus(0, False, {"from": account})
    status2 = token_farm.preSaleNumberStatus(0)
    # Assert
    assert status == False
    assert status1 == True
    assert status2 == False


def test_set_APY(amount_staked):
    # Arrange
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)

    # Act
    initial_apy = token_farm.APY()
    token_farm.setAPY(15, {"from": account})
    # Assert
    assert initial_apy == 10
    assert token_farm.APY() == 15


def test_available_staking_rewards(amount_staked):
    # Arrange
    token_farm, dapp_token, account = test_pre_sale_fund(amount_staked)
    # Act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    # token_farm.unstakeTokens(amount_staked, dapp_token.address, {"from": account})

    available_staking_rewards_before = token_farm.getAvailableStakingRewards(
        account, dapp_token.address, {"from": account}
    )
    token_farm.claimStakingRewards(dapp_token.address, {"from": account})
    sleep(120)
    available_staking_rewards_after = token_farm.getAvailableStakingRewards(
        account, dapp_token.address, {"from": account}
    )
    # Assert
    assert available_staking_rewards_before > 0
    assert available_staking_rewards_after == 0


def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing...")
    account = get_account()
    non_owner = get_account(index=1)

    print(account)
    print(non_owner)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()

    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )

    # Assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    # with pytest.raises(exceptions.VirtualMachineError):
    #     token_farm.setPriceFeedContract(
    #         dapp_token.address, price_feed_address, {"from": non_owner}
    #     )


def test_stake_unstake_tokens(amount_staked):
    # Arrange
    unstakedAmount = 100

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    dapp_token_starting_balance = dapp_token.balanceOf(account.address)
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    dapp_token_after_staking_balance = dapp_token.balanceOf(account.address)

    token_farm.unstakeTokens(unstakedAmount, dapp_token.address, {"from": account})
    dapp_token_after_unstaking_balance = dapp_token.balanceOf(account.address)
    amountPeopleLeftInWithdrawFees = token_farm.amountPeopleLeftInWithdrawFees()
    # Assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address)
        == amount_staked - 100
    )

    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    assert dapp_token_after_unstaking_balance == (dapp_token_after_staking_balance + 75)
    assert amountPeopleLeftInWithdrawFees == 25
    return token_farm, dapp_token


def test_manage_withdraw_deposit(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    starting_balance = dapp_token.balanceOf(account.address)
    starting_balance = dapp_token.balanceOf(token_farm.address)
    # Act

    dapp_token.approve(token_farm.address, amount_staked, {"from": account})

    token_farm.manageDepositOwnerFunds(
        dapp_token.address, amount_staked, {"from": account}
    )
    token_farm.manageWithdrawOwnerFunds(
        dapp_token.address, amount_staked, {"from": account}
    )
    # Assert
    assert dapp_token.balanceOf(token_farm.address) == (starting_balance)


def test_claim_pre_sale(amount_staked):
    # Arrange
    TIMES = 20
    percentageWithdrawAllowed = 10

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    token_farm.updateTimes(TIMES, {"from": account})

    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.preSaleFund(amount_staked, dapp_token.address, {"from": account})
    # token_farm.updatePreSaleTokenAddress(dapp_token.address, {"from": account})
    # token_farm.getSingleTokenAllPreSaleBalance(dapp_token.address)

    token_farm.issuePreSaleTokensToWithdrawPercentage(
        percentageWithdrawAllowed, {"from": account}
    )
    token_farm.claimPreSaleTokens((1 * 1000000000000000000), {"from": account})

    availableToWithdraw = token_farm.getAvailablePreSaleTokensToWithdraw(
        dapp_token.address, account, {"from": account}
    )
    # Assert
    assert token_farm.totalPurchasedPreSaleTokens(account) == (amount_staked * TIMES)
    assert token_farm.percentageWithdrawAllowed() == percentageWithdrawAllowed
    assert token_farm.totalWithdrawnPreSaleTokens(account.address) == (
        1 * 1000000000000000000
    )

    assert availableToWithdraw == (
        ((10 * 1000000000000000000) * TIMES) - (1 * 1000000000000000000)
    )
    assert token_farm.preSaleTokenAddress() == dapp_token.address


def test_pre_sale_fund(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.preSaleFund(amount_staked, dapp_token.address, {"from": account})
    token_farm.getSingleTokenAllPreSaleBalance(dapp_token.address)
    # Assert
    assert (
        token_farm.purchasedBalance(dapp_token.address, account.address)
        == amount_staked
    )
    assert token_farm.uniquePreSaleTokensStaked(account.address) == 1
    assert token_farm.preSaleFunders(0) == account.address
    assert token_farm.singleTokenAllPreSaleBalance() >= 1 * 1000000000000000000
    return token_farm, dapp_token, account


def test_issue_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = test_stake_unstake_tokens(amount_staked)
    print("you are here")
    starting_balance = dapp_token.balanceOf(account.address)
    print(starting_balance)
    # Act
    token_farm.issueTokens({"from": account})
    # Assert
    assert dapp_token.balanceOf(account.address) == starting_balance + INITIAL_VALUE
