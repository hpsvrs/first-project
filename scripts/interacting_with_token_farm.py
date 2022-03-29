from brownie import (
    network,
    accounts,
    config,
    LinkToken,
    MockV3Aggregator,
    MockDAI,
    MockWETH,
    MockERC20,
    Contract,
    TokenFarm,
    PreSale,
    DappToken,
)
from pytest import console_main
from web3 import Web3
from scripts.helpful_scripts import get_account, get_contract


def preSaleFundEachPreSaleNumberWithoutStaking():
    amount_to_collect_for_this_pre_sale = Web3.toWei((1000), "ether")
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    amount_to_purchase = Web3.toWei(10, "ether")
    amount_to_claim = Web3.toWei(1, "ether")

    account = get_account()
    token_farm = TokenFarm[-1]
    dapp_token = DappToken[-1]
    print(token_farm)
    print(account)

    token_farm.updateTimesEachPreSale(0, 2, {"from": account})
    # token_farm.updateTimes(2, {"from": account})

    token_farm.setTotalAmountToCollectForThisPreSale(
        0, amount_to_collect_for_this_pre_sale, {"from": account}
    )

    # token_farm.setPreSaleFundEachPreSaleNumberWithoutStakingStatus(
    #     0, True, {"from": account}
    # )


def each_pre_sale_participate():
    amount_to_collect_for_this_pre_sale = Web3.toWei((100), "ether")
    amount_to_stake = Web3.toWei((1500 * 170), "ether")
    amount_to_purchase = Web3.toWei(10, "ether")
    amount_to_claim = Web3.toWei(1, "ether")

    account = get_account()
    token_farm = TokenFarm[-1]
    dapp_token = DappToken[-1]
    print(token_farm)
    print(account)

    participateInPreSaleAllocationStatus = (
        token_farm.participateInPreSaleAllocationStatus(0)
    )
    print(
        f"participateInPreSaleAllocationStatus: {participateInPreSaleAllocationStatus}"
    )

    # setParticipateInPreSaleAllocationStatus = (
    #     token_farm.setParticipateInPreSaleAllocationStatus(0, True, {"from": account})
    # )
    # setParticipateInPreSaleAllocationStatus.wait(1)

    stakingLevelUserCounter = token_farm.stakingLevelUserCounter(0, 28)
    print(f"stakingLevelUserCounter: {stakingLevelUserCounter}")

    participateInPreSaleAllocationStatus = (
        token_farm.participateInPreSaleAllocationStatus(0)
    )
    print(
        f"participateInPreSaleAllocationStatus: {participateInPreSaleAllocationStatus}"
    )

    getStakingLevel = token_farm.getStakingLevel(account, dapp_token)
    print(f"getStakingLevel: {getStakingLevel}")

    # tx_participate_status = token_farm.setPreSaleAllocationStatus(
    #     0, True, {"from": account}
    # )
    # tx_participate_status.wait(1)

    preSaleAllocationStatus = token_farm.preSaleAllocationStatus(0)
    print(f"ParticipateInPreSaleAllocationStatus: {preSaleAllocationStatus}")

    # token_farm.setTotalAmountToCollectForThisPreSale(
    #     0, amount_to_collect_for_this_pre_sale, {"from": account}
    # )
    totalAmountToCollectForThisPreSale = token_farm.totalAmountToCollectForThisPreSale(
        0
    )
    formated_totalAmountToCollectForThisPreSale = Web3.fromWei(
        totalAmountToCollectForThisPreSale, "ether"
    )
    print(
        f"totalAmountToCollectForThisPreSale: {formated_totalAmountToCollectForThisPreSale}"
    )
    # tx_participateInPreSaleAllocation = token_farm.participateInPreSaleAllocation(
    #     0, dapp_token.address, {"from": account}
    # )
    # tx_participateInPreSaleAllocation.wait(1)
    whenParticipatedThatLevel = token_farm.whenParticipatedThatLevel(account)
    print(f"whenParticipatedThatLevel: {whenParticipatedThatLevel}")

    # get_allocated_pre_sale_amount = token_farm.getAllocatedPreSaleAmount(
    #     account, dapp_token.address, 0
    # )
    # formatted_get_allocated_pre_sale_amount = Web3.fromWei(
    #     get_allocated_pre_sale_amount, "ether"
    # )
    # print(f"get_allocated_pre_sale_amount: {formatted_get_allocated_pre_sale_amount}")

    percentageWithdrawAllowedEachPreSale = (
        token_farm.percentageWithdrawAllowedEachPreSale(0)
    )
    print(
        f"percentageWithdrawAllowedEachPreSale: {percentageWithdrawAllowedEachPreSale}"
    )

    preSaleFundEachPreSaleNumberStatus = token_farm.preSaleFundEachPreSaleNumberStatus(
        0
    )

    # setPreSaleFundEachPreSaleNumberStatus = (
    #     token_farm.setPreSaleFundEachPreSaleNumberStatus(0, True, {"from": account})
    # )
    # setPreSaleFundEachPreSaleNumberStatus.wait(1)
    # print(f"preSaleFundEachPreSaleNumberStatus: {preSaleFundEachPreSaleNumberStatus}")

    # dapp_token.approve(token_farm.address, amount_to_purchase, {"from": account})
    # token_farm.preSaleFundEachPreSaleNumber(
    #     amount_to_purchase, dapp_token, dapp_token, 0, {"from": account}
    # )

    # setPreSaleFundFCFSEachPreSaleNumberStatus = (
    #     token_farm.setPreSaleFundFCFSEachPreSaleNumberStatus(0, True, {"from": account})
    # )
    # setPreSaleFundFCFSEachPreSaleNumberStatus.wait(1)

    # preSaleFundEachPreSaleNumberStatus = token_farm.preSaleFundEachPreSaleNumberStatus(
    #     1
    # )
    # print(
    #     f"PreSaleFundFCFSEachPreSaleNumberStatus: {preSaleFundEachPreSaleNumberStatus}"
    # )

    # setPreSaleFundEachPreSaleNumberWithoutStakingStatus = (
    #     token_farm.setPreSaleFundEachPreSaleNumberWithoutStakingStatus(
    #         1, False, {"from": account}
    #     )
    # )
    # setPreSaleFundEachPreSaleNumberWithoutStakingStatus.wait(1)

    # preSaleFundEachPreSaleNumberWithoutStakingStatus = (
    #     token_farm.preSaleFundEachPreSaleNumberWithoutStakingStatus(1)
    # )
    # print(
    #     f"PreSaleFundFCFSEachPreSaleNumberStatus: {preSaleFundEachPreSaleNumberWithoutStakingStatus}"
    # )

    purchasedBalanceEachPreSale = token_farm.purchasedBalanceEachPreSale(0, account)
    formatted_purchasedBalanceEachPreSale = Web3.fromWei(
        purchasedBalanceEachPreSale, "ether"
    )
    print(f"purchasedBalanceEachPreSale: {formatted_purchasedBalanceEachPreSale}")

    collectedPreSaleFundsEachPreSale = token_farm.collectedPreSaleFundsEachPreSale(
        0, dapp_token.address
    )
    formatted_collectedPreSaleFundsEachPreSale = Web3.fromWei(
        collectedPreSaleFundsEachPreSale, "ether"
    )
    print(
        f"collectedPreSaleFundsEachPreSale: {formatted_collectedPreSaleFundsEachPreSale}"
    )
    totalCollectionOfPreSaleFundsEachPreSale = (
        token_farm.totalCollectionOfPreSaleFundsEachPreSale(0, dapp_token)
    )
    formatted_totalCollectionOfPreSaleFundsEachPreSale = Web3.fromWei(
        totalCollectionOfPreSaleFundsEachPreSale, "ether"
    )
    print(
        f"totalCollectionOfPreSaleFundsEachPreSale: {formatted_totalCollectionOfPreSaleFundsEachPreSale}"
    )
    totalCollectionOfPreSaleFundsAllTokens = (
        token_farm.totalCollectionOfPreSaleFundsAllTokens()
    )
    formatted_totalCollectionOfPreSaleFundsAllTokens = Web3.fromWei(
        totalCollectionOfPreSaleFundsAllTokens, "ether"
    )
    print(
        f"totalCollectionOfPreSaleFundsAllTokens: {formatted_totalCollectionOfPreSaleFundsAllTokens}"
    )

    # preSaleFundersEachPreSale = token_farm.preSaleFundersEachPreSale(0, 0)
    # print(f"preSaleFundersEachPreSale: {preSaleFundersEachPreSale}")

    # token_farm.setClaimTokensEachPreSaleStatus(0, False, {"from": account})
    # setPercentageWithdrawAllowedEachPreSale = (
    #     token_farm.setPercentageWithdrawAllowedEachPreSale(0, 1, {"from": account})
    # )
    # setPercentageWithdrawAllowedEachPreSale.wait(1)

    # manuallySetPercentageWithdrawAllowedEachPreSale = (
    #     token_farm.manuallySetPercentageWithdrawAllowedEachPreSale(
    #         0, 20, {"from": account}
    #     )
    # )
    # manuallySetPercentageWithdrawAllowedEachPreSale.wait(1)

    percentageWithdrawAllowedEachPreSale = (
        token_farm.percentageWithdrawAllowedEachPreSale(0)
    )
    print(
        f"percentageWithdrawAllowedEachPreSale: {percentageWithdrawAllowedEachPreSale}"
    )

    getAvailablePreSaleTokensToWithdrawEachPreSale = (
        token_farm.getAvailablePreSaleTokensToWithdrawEachPreSale(
            dapp_token, account, 0
        )
    )
    print(
        f"getAvailablePreSaleTokensToWithdrawEachPreSale: {getAvailablePreSaleTokensToWithdrawEachPreSale}"
    )
    totalWithdrawnPreSaleTokensEachPreSale = (
        token_farm.totalWithdrawnPreSaleTokensEachPreSale(0, account)
    )
    formatted_totalWithdrawnPreSaleTokensEachPreSale = Web3.fromWei(
        totalWithdrawnPreSaleTokensEachPreSale, "ether"
    )
    print(
        f"totalWithdrawnPreSaleTokensEachPreSale: {totalWithdrawnPreSaleTokensEachPreSale}"
    )

    claimTokensEachPreSaleStatus = token_farm.claimTokensEachPreSaleStatus(0)
    print(f"claimTokensEachPreSaleStatus: {claimTokensEachPreSaleStatus}")

    # updatePreSaleTokenAddressEachPreSale = (
    #     token_farm.updatePreSaleTokenAddressEachPreSale(
    #         0, dapp_token, {"from": account}
    #     )
    # )
    # updatePreSaleTokenAddressEachPreSale.wait(1)

    # tx_claimTokensEachPreSale = token_farm.claimTokensEachPreSale(
    #     0, amount_to_claim, {"from": account}
    # )
    # tx_claimTokensEachPreSale.wait(1)

    # tx_claimTokensEachPreSale = token_farm.claimAllTokensEachPreSale(
    #     0, {"from": account}
    # )
    # tx_claimTokensEachPreSale.wait(1)

    totalPurchasedPreSaleTokensEachPreSale = (
        token_farm.totalPurchasedPreSaleTokensEachPreSale(0, account)
    )

    formatted_totalPurchasedPreSaleTokensEachPreSale = Web3.fromWei(
        totalPurchasedPreSaleTokensEachPreSale, "ether"
    )
    print(
        f"totalPurchasedPreSaleTokensEachPreSale: {formatted_totalPurchasedPreSaleTokensEachPreSale}"
    )

    totalWithdrawnPreSaleTokensEachPreSale2 = (
        token_farm.totalWithdrawnPreSaleTokensEachPreSale(0, account)
    )
    formatted_totalWithdrawnPreSaleTokensEachPreSale2 = Web3.fromWei(
        totalWithdrawnPreSaleTokensEachPreSale2, "ether"
    )
    print(
        f"totalWithdrawnPreSaleTokensEachPreSale2: {formatted_totalWithdrawnPreSaleTokensEachPreSale2}"
    )


# def main():
#     each_pre_sale_participate()
