from lib2to3.pgen2 import token
from time import sleep
from brownie import network, exceptions
from scripts.deploy import deploy_token_farm_and_dapp_token
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_VALUE,
)
import pytest


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
