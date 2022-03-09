/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import dai from "../dai.png"
import eth from "../eth.png"
import { YourWallet } from "./yourWallet"
import { UnStakeYourWallet } from "./yourWallet/UnStakeYourWallet"
import { makeStyles } from "@material-ui/core"
import { textAlign } from "@mui/system"
import { PreSale } from "./PreSale"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Container } from "@mui/material"
import { Balance } from "./Balance"
import { Projects } from "./Projects"
import { GridPurchasedPreSaleBalance } from "./yourWallet/GridPurchasedPreSaleBalance"
import { GridWethBusdBalance } from "./yourWallet/GridWethBusdBalance"
import { GridTotalStaking } from "./yourWallet/GridTotalStaking"
import { GridStakingUnstaking } from "./yourWallet/GridStakingUnstaking"
import { useEffect, useState } from "react"

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

interface elementNumber {
    elementNumber: number
}
export const Main = ({ elementNumber }: elementNumber) => {

    const classes = useStyles()
    const eNumber = elementNumber
    console.log(eNumber)
    console.log("this isfsf")

    const { chainId } = useEthers()

    const [chainNumber, setChainNumber] = useState<number | undefined>(42)

    useEffect(() => {
        setChainNumber(chainId)
    }, [chainId])

    console.log('this is chainNUmber: ' + chainNumber)
    const networkName = (chainId ? ((String(chainId) == '42') ? helperConfig[chainId] : "dev") : "dev")

    const dappTokenAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero) : constants.AddressZero)
    // const dappTokenAddress = '0x759b7741065cAa8dd699e45892F452228faBe58B'
    const wethTokenAddress = (chainId ? ((String(chainId) == '42') ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero) : constants.AddressZero)
    //    const wethTokenAddress = '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
    const fauTokenAddress = (chainId ? ((String(chainId) == '42') ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero) : constants.AddressZero)
    // const fauTokenAddress = '0xFab46E002BbF0b4509813474841E0716E6730136'
    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        }, {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        }, {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }

    ]

    const supportedPreSaleTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        }, {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        }, {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }

    ]


    const handleClick = () => {

    }

    return (<>
        {/* <h2 className={classes.title}>DApp Token App</h2> */}
        {/* <BrowserRouter>
            <Container maxWidth="md" sx={{ mt: 0 }}>
                <Balance tokenAddress={dappTokenAddress} />
                <Routes>

                    <Route path="/" element={<YourWallet supportedTokens={supportedTokens} />} />
                    <Route path="/unstake" element={<UnStakeYourWallet supportedTokens={supportedTokens} />} />
                    <Route path="/presale" element={<PreSale supportedTokens={supportedTokens} />} />

                </Routes>
            </Container>
        </BrowserRouter> */}
        <Container maxWidth="md" sx={{ mt: 0 }}>
            <GridWethBusdBalance tokenAddress={dappTokenAddress} />

            {(eNumber == 0) ? (<h1 className="section-heading"> Projects!</h1>)
                : (eNumber == 1) ? (<h1 className="section-heading"> Stake! Tokens</h1>)
                    : (eNumber == 2) ? (<h1 className="section-heading">UnStake! Tokens</h1>)
                        : (eNumber == 3) ? (<h1 className="section-heading">Pre Sale is Now Open...</h1>)
                            : (<h1 className="section-heading"> Projects!</h1>)
            }
            {(eNumber == 3) ? (<></>) :
                (<>
                    <GridTotalStaking tokenAddress={dappTokenAddress} />
                    <GridStakingUnstaking tokenAddress={dappTokenAddress} />
                </>
                )}
            {/* <Balance tokenAddress={dappTokenAddress} /> */}
            {/* <GridPurchasedPreSaleBalance tokenAddress={dappTokenAddress} /> */}

            {(eNumber == 0) ? (<Projects />)
                : (eNumber == 1) ? (<YourWallet supportedTokens={supportedTokens} />)
                    : (eNumber == 2) ? (<UnStakeYourWallet supportedTokens={supportedTokens} />)
                        : (eNumber == 3) ? (<PreSale supportedTokens={supportedPreSaleTokens} />)
                            : (eNumber == 4) ? (<PreSale supportedTokens={supportedPreSaleTokens} />)
                                : (<Projects />)
            }
        </Container>

    </>
    )
}