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
import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { MyContext } from "./Header2"

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

const pathList = ["/", "/staking", "/unstaking-rewards", "/pre-sale"]

export const Main = ({ elementNumber }: elementNumber) => {

    const { dappTokenAddress: dapp_token_address } = useContext(MyContext)
    const classes = useStyles()
    const eNumber = elementNumber
    console.log('You are in main eNumber: ' + eNumber)

    const { chainId } = useEthers()

    const [chainNumber, setChainNumber] = useState<number | undefined>(42)

    useEffect(() => {
        setChainNumber(chainId)
    }, [chainId])

    console.log('this is chainNUmber: ' + chainNumber)
    const networkName = (chainId ? ((String(chainId) == '42') ? helperConfig[chainId] : "dev") : "dev")

    const dappTokenAddress = dapp_token_address

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
        },
        // {
        //     image: eth,
        //     address: wethTokenAddress,
        //     name: "WETH"
        // }, 
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    console.log("You are in main: " + window.location.href)

    return (<>
        {/* <h2 className={classes.title}>DApp Token App</h2> */}
        {/* <BrowserRouter>
            <Container maxWidth="md" sx={{ mt: 0 }}>
                <Balance tokenAddress={dappTokenAddress} />
                <ul>
                    <h2>this</h2>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/stake">Stake</Link></li>
                    <li><Link to="/unstake-rewards">Unstake</Link></li>
                    <li><Link to="/presale">PreSale</Link></li>
                </ul>
                <Routes>
                    <Route path="/" element={<Projects />} />
                    <Route path="/stake" element={<YourWallet supportedTokens={supportedTokens} />} />
                    <Route path="/unstake-rewards" element={<UnStakeYourWallet supportedTokens={supportedTokens} />} />
                    <Route path="/presale" element={<PreSale supportedTokens={supportedPreSaleTokens} />} />

                </Routes>
            </Container>
        </BrowserRouter> */}

        <Container maxWidth="md" sx={{ mt: 0 }}>
            <GridWethBusdBalance tokenAddress={dappTokenAddress} />
            <Routes>
                {/* <Route path="/" element={<h1 className="section-heading"> Projects!</h1>} /> */}
                {/* <Route path="/stake" element={<h1 className="section-heading"> Stake! Tokens</h1>} /> */}
                {/* <Route path="/unstake-rewards" element={<h1 className="section-heading">UnStake! Tokens</h1>} /> */}
                {/* <Route path="/presale" element={<h1 className="section-heading">Pre Sale is Now Open...</h1>} /> */}
            </Routes>
            {/* {(eNumber == 0) ? (<h1 className="section-heading"> Projects!</h1>)
                : (eNumber == 1) ? (<h1 className="section-heading"> Stake! Tokens</h1>)
                    : (eNumber == 2) ? (<h1 className="section-heading">UnStake! Tokens</h1>)
                        : (eNumber == 3) ? (<h1 className="section-heading">Pre Sale is Now Open...</h1>)
                            : (<h1 className="section-heading"> Projects!</h1>)
            } */}

            {(eNumber == 3) ? (<></>) :
                (<>
                    {/* <GridTotalStaking tokenAddress={dappTokenAddress} /> */}
                    {/* <GridStakingUnstaking tokenAddress={dappTokenAddress} eNumber={eNumber} /> */}
                </>
                )}
            {/* <Balance tokenAddress={dappTokenAddress} /> */}
            {/* <GridPurchasedPreSaleBalance tokenAddress={dappTokenAddress} /> */}

            {/* {(eNumber == 0) ? (<Projects />)
                : (eNumber == 1) ? (<YourWallet supportedTokens={supportedTokens} />)
                    : (eNumber == 2) ? (<UnStakeYourWallet supportedTokens={supportedTokens} />)
                        : (eNumber == 3) ? (<PreSale supportedTokens={supportedPreSaleTokens} />)
                            : (eNumber == 4) ? (<PreSale supportedTokens={supportedPreSaleTokens} />)
                                : (<Projects />)
            } */}
            <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="/stake" element={<YourWallet supportedTokens={supportedTokens} />} />
                <Route path="/unstake-rewards" element={<UnStakeYourWallet supportedTokens={supportedTokens} />} />
                <Route path="/presale" element={<PreSale supportedTokens={supportedPreSaleTokens} />} />
            </Routes>
        </Container>

    </>
    )
}