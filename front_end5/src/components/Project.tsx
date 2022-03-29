// import React from 'react'
import { Token } from "./Main"
import { useParams } from "react-router-dom"
import { CheckpointsEachPreSale } from "./CheckpointsEachPreSale"
import { GridEachPreSalePurchasedBalance } from "./GridBoxes/GridEachPreSalePurchasedBalance"
import { Box } from "@mui/material"
import { Tab, Typography } from "@material-ui/core"
import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import React, { useState, createContext, useContext } from "react"
import { ParticipateButton } from "./project/ParticipateButton"
import { ParticipateTab } from "./project/ParticipateTab"
import { useGetValues } from '../hooks/useGetValues'
import { AllocatedAmountToParticipate } from "./project/AllocatedAmountToParticipate"
import { MyContext } from "./Header2"
import { useGetStakingLevel } from "../hooks/useGetStakingLevel";

interface YourWalletProps {
    supportedTokens: Array<Token>
}


export const Project = ({ supportedTokens }: YourWalletProps) => {
    // const { formattedDappTokenBalance } = useContext(MyContext)
    let params = useParams()
    const { account } = useEthers()
    const connectedToMetaMask = account !== undefined


    const preSaleNumber = params.id ? params.id : ''

    const busdTokenAddress = '0x4Fabb145d64652a948d72533023f6E7A623C7C53'

    const busdTokenBalance = useTokenBalance(busdTokenAddress, account)
    const formattedBusdTokenBalance: number = busdTokenBalance ? parseFloat(formatUnits(busdTokenBalance, 18)) : 0

    const ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0

    const dappTokenAddress = supportedTokens[0].address
    console.log("This is in Project: " + account + " " + formattedEthBalance)
    const { participateInPreSaleAllocationStatus, preSaleAllocationStatus, preSaleFundEachPreSaleNumberStatus, preSaleFundFCFSEachPreSaleNumberStatus, preSaleFundEachPreSaleNumberWithoutStakingStatus, claimTokensEachPreSaleStatus } = useGetValues(dappTokenAddress, preSaleNumber)

    console.log("this is participateInPreSaleAllocationStatus, preSaleAllocationStatus, preSaleFundEachPreSaleNumberStatus, preSaleFundFCFSEachPreSaleNumberStatus, preSaleFundEachPreSaleNumberWithoutStakingStatus, claimTokensEachPreSaleStatus: " + participateInPreSaleAllocationStatus + preSaleAllocationStatus + preSaleFundEachPreSaleNumberStatus + preSaleFundFCFSEachPreSaleNumberStatus + preSaleFundEachPreSaleNumberWithoutStakingStatus + claimTokensEachPreSaleStatus)

    const { getStakingLevel } = useGetStakingLevel()
    const fStakingLevel: number = getStakingLevel ? parseFloat(getStakingLevel) : 0

    return (
        <>
            {/* <div>
                <h1 className="section-heading">Pre-Sale! is Now Open</h1>
            </div> */}
            <div>
                <GridEachPreSalePurchasedBalance preSaleNumber={preSaleNumber} />
                {/* <CheckpointsPreSale /> */}
                {/* <h1 className="section-heading"> Participate...</h1> */}
            </div>
            <div>
                {claimTokensEachPreSaleStatus ?
                    (
                        <>
                            <h1 className="section-heading">Pre-Sale! Has Now Been Finished!</h1>

                            {/* <GridEachPreSalePurchasedBalance preSaleNumber={preSaleNumber} /> */}
                        </>) : (
                        <>
                            <div>
                                <h1 className="section-heading">Pre-Sale! is Now Open</h1>
                            </div>
                            <CheckpointsEachPreSale />
                            <h1 className="section-heading"> Participate...</h1>
                            <div>
                                {(connectedToMetaMask && (formattedEthBalance > 0)
                                    && (formattedBusdTokenBalance == 0) && (getStakingLevel > 0)) ? (
                                    <>
                                        {participateInPreSaleAllocationStatus ? <ParticipateButton preSaleNumber={preSaleNumber} /> : <></>}

                                        {preSaleAllocationStatus ? <AllocatedAmountToParticipate supportedTokens={supportedTokens} preSaleNumber={preSaleNumber} /> : <></>}

                                        {(preSaleFundEachPreSaleNumberStatus ||
                                            preSaleFundFCFSEachPreSaleNumberStatus ||
                                            preSaleFundEachPreSaleNumberWithoutStakingStatus) ?
                                            (
                                                <>
                                                    {preSaleFundEachPreSaleNumberStatus ? (<>
                                                        <div className="info-note">
                                                            <h1>Phase: 2</h1>
                                                            <h3>You can purchase Pre-Sale Tokens according to the $BUSD Limit Allocated to You.</h3>
                                                        </div>

                                                    </>) : (<></>)}
                                                    {preSaleFundFCFSEachPreSaleNumberStatus ? (<>
                                                        <div className="info-note">
                                                            <h1>Phase: 3</h1>
                                                            <h2>First Come First Serve</h2>
                                                            <h4>There is no $BUSD Limit.</h4>
                                                            <h4>If tokens have been left in the phase-2. </h4>
                                                            <h4>In this round, You can buy as many tokens as you want up until the total pre-sale target met.</h4>
                                                        </div>

                                                    </>) : (<></>)}
                                                    <ParticipateTab supportedTokens={supportedTokens} preSaleNumber={preSaleNumber} />
                                                </>
                                            ) : <></>}

                                        {claimTokensEachPreSaleStatus ? <><h1>Tokens are now Available to claim</h1></> : <></>}
                                    </>

                                ) : (
                                    <Box className="participationDirection" alignItems="center"
                                        justifyContent="center"
                                        display="flex" >
                                        <div>
                                            <h3>Once met the checkpoints pre-sale will display here...</h3>
                                        </div>

                                    </Box>)
                                }
                            </div>
                        </>)}

            </div>


        </>
    )
}
