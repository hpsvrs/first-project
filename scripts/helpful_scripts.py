from zoneinfo import available_timezones
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

NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS + [
    "mainnet-fork",
    "binance-fork",
    "matic-fork",
]

contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAI,
    "weth_token": MockWETH,
}

DECIMALS = 18
INITIAL_VALUE = Web3.toWei(2000, "ether")


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def get_contract(contract_name):
    """If you want to use this function, go to the brownie config and add a new entry for
    the contract that you want to be able to 'get'. Then add an entry in the variable 'contract_to_mock'.
    You'll see examples like the 'link_token'.
        This script will then either:
            - Get a address from the config
            - Or deploy a mock to use for a network that doesn't have it
        Args:
            contract_name (string): This is the name that is referred to in the
            brownie config and 'contract_to_mock' variable.
        Returns:
            brownie.network.contract.ProjectContract: The most recently deployed
            Contract of the type specificed by the dictionary. This could be either
            a mock or the 'real' contract on a live network.
    """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        try:
            contract_address = config["networks"][network.show_active()][contract_name]
            contract = Contract.from_abi(
                contract_type._name, contract_address, contract_type.abi
            )
        except KeyError:
            print(
                f"{network.show_active()} address not found, perhaps you should add it to the config or deploy mocks?"
            )
            print(
                f"brownie run scripts/deploy_mocks.py --network {network.show_active()}"
            )
    return contract


def participate_in_pre_sale_allocation():
    account = get_account()
    token_farm = TokenFarm[-1]
    dapp_token = DappToken[-1]
    print(token_farm)
    print(account)
    preSaleAllocationStatus = token_farm.preSaleAllocationStatus(0)
    print(f"preSaleAllocation Status: {preSaleAllocationStatus}")

    # tx_preSaleAllocationStatus = token_farm.setPreSaleAllocationStatus(
    #     0, True, {"from": account}
    # )
    # tx_preSaleAllocationStatus.wait(1)

    preSaleAllocationStatus1 = token_farm.preSaleAllocationStatus(0)

    print(f"preSaleAllocation Status After: {preSaleAllocationStatus1}")

    totalAmountToCollectForThisPreSale = token_farm.totalAmountToCollectForThisPreSale()
    formatted_totalAmountToCollectForThisPreSale = Web3.fromWei(
        totalAmountToCollectForThisPreSale, "ether"
    )

    # tx_totalAmountToCollectForThisPreSale = (
    #     token_farm.setTotalAmountToCollectForThisPreSale(
    #         (100 * (10 ** 18)), {"from": account}
    #     )
    # )
    # tx_totalAmountToCollectForThisPreSale.wait(1)

    print(
        f"totalAmountToCollectForThisPreSale: {formatted_totalAmountToCollectForThisPreSale}"
    )

    # tx_changePreSaleNumberStatus = token_farm.changePreSaleNumberStatus(
    #     0, True, {"from": account}
    # )
    # tx_changePreSaleNumberStatus.wait(1)

    preSaleNumberStatus = token_farm.preSaleNumberStatus(0)
    print(f"preSaleNumberStatus: {preSaleNumberStatus}")

    # tx_participateInPreSaleAllocation = token_farm.participateInPreSaleAllocation(
    #     0, dapp_token.address, {"from": account}
    # )
    # tx_participateInPreSaleAllocation.wait(1)

    tx_getStakingLevel = token_farm.getStakingLevel(account, dapp_token)
    print(f"Staking Level: {tx_getStakingLevel}")
    whenParticipatedThatLevel = token_farm.whenParticipatedThatLevel(account)
    print(f"whenParticipatedThatLevel: {whenParticipatedThatLevel}")

    get_allocated_pre_sale_amount = token_farm.getAllocatedPreSaleAmount(
        account, dapp_token.address, 0, {"from": account}
    )

    formatted_get_allocated_pre_sale_amount = Web3.fromWei(
        get_allocated_pre_sale_amount, "ether"
    )
    print(f"get_allocated_pre_sale_amount: {get_allocated_pre_sale_amount}")
    print(
        f"formatted_get_allocated_pre_sale_amount: {formatted_get_allocated_pre_sale_amount}"
    )

    # allPoolsTotalWeight = token_farm.allPoolsTotalWeight()
    # print(f"allPoolsTotalWeight: {allPoolsTotalWeight}")

    # amountAllocatedToEachShare = token_farm.amountAllocatedToEachShare()
    # formatted_amountAllocatedToEachShare = Web3.fromWei(
    #     amountAllocatedToEachShare, "ether"
    # )
    # print(f"amountAllocatedToEachShare: {formatted_amountAllocatedToEachShare}")

    # allocatedAmountToEachUser = token_farm.allocatedAmountToEachUser()

    # formatted_allocatedAmountToEachUser = Web3.fromWei(
    #     allocatedAmountToEachUser, "ether"
    # )
    # print(f"allocatedAmountToEachUser: {formatted_allocatedAmountToEachUser}")

    # staking_level_users_counter = token_farm.staking_level_users_counter()
    # print(f"staking_level_users_counter: {staking_level_users_counter}")
    # i = 0
    # while i < 29:
    #     stakingLevelUserCounter = token_farm.stakingLevelToWeight(i)
    #     print(stakingLevelUserCounter)
    #     i = i + 1


def get_available_to_withdraw():
    account = get_account()
    contract = TokenFarm[-1]
    dappToken = DappToken[-1]
    # dai = get_contract("fau_token")
    # print(dai.address)
    print(contract)
    print(account)
    TIMES = 20

    # tx_update_times = contract.updateTimes(TIMES, {"from": account})
    # tx_update_times.wait(1)

    totalPurchasedPreSaleTokens = contract.totalPurchasedPreSaleTokens(account)
    formattedTotalPurchasedPreSaleTokens = Web3.fromWei(
        totalPurchasedPreSaleTokens, "ether"
    )
    print(f"Total Purchased PreSale tokens {formattedTotalPurchasedPreSaleTokens}")

    available_to_withdraw = contract.getAvailablePreSaleTokensToWithdraw(
        dappToken.address, account, {"from": account}
    )
    formatted_available_to_withdraw = Web3.fromWei(available_to_withdraw, "ether")
    print(f"This is available to withdraw {formatted_available_to_withdraw}")

    tx_set_percentageOfTokensDelivered = (
        contract.issuePreSaleTokensToWithdrawPercentage(1, {"from": account})
    )
    tx_set_percentageOfTokensDelivered.wait(1)

    available_to_withdraw2 = contract.getAvailablePreSaleTokensToWithdraw(
        dappToken.address, account, {"from": account}
    )
    formatted_available_to_withdraw2 = Web3.fromWei(available_to_withdraw2, "ether")
    print(f"this is available to withdraw2 {formatted_available_to_withdraw2}")

    percentageWithdrawAllowed = contract.percentageWithdrawAllowed()
    print(f"How much percentage you can withdraw {percentageWithdrawAllowed}")

    totalPurchased = contract.purchasedBalance(dappToken.address, account)
    formatedTotalPurchased = Web3.fromWei(totalPurchased, "ether")
    print(f"This is total purchased preSale {formatedTotalPurchased}")

    # tx_claimPreSaleTokens = contract.claimPreSaleTokens(
    #     (5 * 1000000000000000000), dappToken.address, {"from": account}
    # )
    # tx_claimPreSaleTokens.wait(1)

    totalWithdrawnPreSaleTokens = contract.totalWithdrawnPreSaleTokens(account)
    formattedTotalWithdrawnPreSaleTokens = Web3.fromWei(
        totalWithdrawnPreSaleTokens, "ether"
    )
    print(
        f"this is totalWithdrawnPreSaleTokens: {formattedTotalWithdrawnPreSaleTokens}"
    )

    # available_to_withdraw3 = contract.preSaleTokensAvailableToWithdraw(
    #     dai.address, account
    # )
    # print(f"this is available to withdraw3 {available_to_withdraw3}")


def get_agg_version():
    account = get_account()
    contract = TokenFarm[-1]
    # contract = "0x9e0fdDd6F902DaDfdBB8D7807483c2A3E6A5ac8D"
    entrance_fee = contract.getEntranceFee()
    singleTokenBalance = contract.singleTokenAllPreSaleBalance()
    print(singleTokenBalance)
    # print(
    #     f"this is here {contract.balance("0xA9C280D45C3B575943C30CE31DC908AFB3820905")}"
    # )
    preSaleAllowedTokens = contract.preSaleAllowedTokens(2)
    # addPreSaleToken = contract.addPreSaleAllowedTokens(
    #     "0xA9C280D45C3B575943C30CE31DC908AFB3820905", {"from": account}
    # )
    print(f"this is the allowed tokens {preSaleAllowedTokens}")
    version = contract.getVersion()
    print(version)
    print(Web3.fromWei(entrance_fee, "ether"))


def fund_and_withdraw():
    account = get_account()
    contract = PreSale[-1]
    entrance_fee = contract.getEntranceFee()
    version = contract.getVersion()
    print(contract)
    print(version)
    print(Web3.fromWei(entrance_fee, "ether"))
    contract.preSaleFund({"from": account, "value": entrance_fee})
    contract.withdrawPreSaleFund({"from": account})


def fund_with_link(
    contract_address, account=None, link_token=None, amount=1000000000000000000
):
    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("link_token")
    ### Keep this line to show how it could be done without deploying a mock
    # tx = interface.LinkTokenInterface(link_token.address).transfer(
    #     contract_address, amount, {"from": account}
    # )
    tx = link_token.transfer(contract_address, amount, {"from": account})
    print("Funded {}".format(contract_address))
    return tx


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_VALUE):
    """
    Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Mock Link Token...")
    link_token = LinkToken.deploy({"from": account})
    print("Deploying Mock Price Feed...")
    mock_price_feed = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account}
    )
    print(f"Deployed to {mock_price_feed.address}")
    print("Deploying MockDAI...")
    dai_token = MockDAI.deploy({"from": account})
    print(f"Deployed to {dai_token.address}")
    print("Deploying Mock WETH")
    weth_token = MockWETH.deploy({"from": account})
    print(f"Deployed to {weth_token.address}")
    print("Deploying Mock ERC20")
    merc_token = MockERC20.deploy({"from": account})
    print(f"Deployed to {merc_token}")
    print("All Mocks have been Deployed!!")


def get_price_feed():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        price_feed_address = config["networks"][network.show_active()][
            "eth_usd_price_feed"
        ]
        return price_feed_address
    else:
        deploy_mocks()
        price_feed_address = MockV3Aggregator[-1].address
        return price_feed_address
