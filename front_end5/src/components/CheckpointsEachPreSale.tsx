import { Box, Grid, Typography, Checkbox } from "@mui/material"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@material-ui/core"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CheckIcon from '@mui/icons-material/Check';
import { deepOrange, green } from '@mui/material/colors';
import { ProgressBar } from "./ProgressBar";
import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { useEffect, useState } from "react";
import { useGetStakingLevel } from "../hooks/useGetStakingLevel";


const useStyles = makeStyles(theme => ({
    container: {
        // display: "inline-grid",
        // gridTemplateColumns: "auto auto auto",
        // gap: theme.spacing(1),
        alignItems: "stretch",
    },
    tokenImg: {
        width: "32px"
    },
    amount: {
        fontWeight: 700
    },
    bold: {
        fontWeight: 900,
    },

}))

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    alignItems: 'stretch',
    margin: 0,
    // borderRadius: 20,
    // justifyContent: 'left',
    // display: "flex",
    color: theme.palette.text.secondary,
    h2: {
        margin: 10,
    },
    h3: {
        margin: 10,
        fontSize: 15,
    },
    span: {
        fontSize: 20
    }
}));

const Item2 = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingTop: theme.spacing(1),
    textAlign: 'center',
    opacity: '.5',
    justifyContent: 'center',
    display: 'flex',
    // color: theme.palette.text.secondary,
}));

interface CheckpointProps {
    connectedToMetaMask: boolean
    ethBalance: number
    busdBalance: number
}

export const CheckpointsEachPreSale = () => {
    console.log("CheckpointsPreSale")
    const classes = useStyles()
    // console.log(connectedToMetaMask)
    const { account } = useEthers()

    const connectedToMetaMask = account !== undefined

    const busdTokenAddress = '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06'

    const busdTokenBalance = useTokenBalance(busdTokenAddress, account)
    const formattedBusdTokenBalance: number = busdTokenBalance ? parseFloat(formatUnits(busdTokenBalance, 18)) : 0
    const busdAvailable = (formattedBusdTokenBalance > 0) ? true : false

    const ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0

    const ethAvailable = (formattedEthBalance > 0) ? true : false
    const [checkpoints, setCheckpoints] = useState(false)

    const { getStakingLevel } = useGetStakingLevel()
    const fStakingLevel: number = getStakingLevel ? parseFloat(getStakingLevel) : 0

    useEffect(() => {
        if (connectedToMetaMask && ethAvailable) {
            setCheckpoints(true)
        }
    }, [connectedToMetaMask, ethAvailable, busdAvailable])

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {/* <Grid
                    container
                    direction="column"
                    // justifyContent="center"
                    alignItems="center"

                > */}

                <div className="checkpointsHead"
                >
                    <div>
                        <h1>Checkpoints...</h1>

                        <h3>The following conditions must be met to proceed:</h3>

                    </div>
                </div>
                {/* </Box></Grid> */}
            </Box>

            <Grid container spacing={2}
                justifyContent="center"
                alignItems='stretch'
            >
                <Grid item className="checkpointsGridItem" xs={12} md={6}
                    sx={{ display: { xs: 'block', sm: 'block' }, }}
                >

                    {connectedToMetaMask ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>Wallet Connected!</h2>
                                <CheckBoxIcon color="success" />
                            </Item>
                            <Item >
                                <h3>
                                    If not connected, click the "Connect Wallet" button in the top right corner
                                </h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>
                                <h2>Please connect with MetaMask!</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >

                                <h3>
                                    Click the "Connect Wallet" button in the top right corner
                                </h3>
                            </Item>
                        </>)}
                </Grid>
                <Grid item className="checkpointsGridItem" xs={12} md={6}
                    sx={{ display: { xs: 'block', sm: 'block' }, }}
                >
                    {formattedEthBalance ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>BNB Available!</h2>
                                <CheckBoxIcon color="success" />

                            </Item>
                            <Item >

                                <h3>Your Bnb Balance: <span>{formattedEthBalance}</span></h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>Require BNB Tokens!</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >
                                <h3>BNB Balance: <span>{formattedEthBalance}</span></h3>
                            </Item>
                        </>)}
                </Grid>
                <Grid item className="checkpointsGridItem" xs={12} md={6}>
                    {formattedBusdTokenBalance ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>
                                <h2> BUSD Available!</h2>
                                <CheckBoxIcon color="success" />

                            </Item>
                            <Item >
                                <h3>Your BUSD Balance: <span>{formattedBusdTokenBalance}</span></h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2> Require BUSD Tokens!</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >

                                <h3>Your BUSD Balance: <span>{formattedBusdTokenBalance}</span></h3>

                            </Item>
                        </>)}
                </Grid>
                <Grid item className="checkpointsGridItem" xs={12} md={6}>
                    {fStakingLevel ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>
                                <h2> Staking Level!</h2>
                                <CheckBoxIcon color="success" />

                            </Item>
                            <Item >
                                <h3>Your Staking Level: <span>{fStakingLevel}</span></h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2> Require Staking Level!</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >

                                <h3>Your Staking Level: <span>{fStakingLevel}</span></h3>

                            </Item>
                        </>)}
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                <ProgressBar checkpoints={checkpoints} />
            </Box>
        </>)
}