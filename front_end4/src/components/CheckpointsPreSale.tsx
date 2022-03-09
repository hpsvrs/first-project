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

    justifyContent: 'center',
    display: 'flex'
    // color: theme.palette.text.secondary,
}));

interface CheckpointProps {
    connectedToMetaMask: boolean
    ethBalance: number
    busdBalance: number
}

export const CheckpointsPreSale = ({ connectedToMetaMask, ethBalance, busdBalance }: CheckpointProps) => {
    console.log("CheckpointsPreSale")
    const classes = useStyles()
    // console.log(connectedToMetaMask)

    const ethAvailable = (ethBalance > 0) ? true : false
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
                <Grid item className="checkpointsGridItem" xs={12} md={4}
                    sx={{ display: { xs: 'block', sm: 'block' }, }}
                >

                    {connectedToMetaMask ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>Wallet Connected</h2>
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
                                <h2>Please connect with MetaMask</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >

                                <h3>
                                    Click the "Connect Wallet" button in the top right corner
                                </h3>
                            </Item>
                        </>)}
                </Grid>
                <Grid item className="checkpointsGridItem" xs={12} md={4}
                    sx={{ display: { xs: 'block', sm: 'block' }, }}
                >
                    {ethBalance ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>BNB Available</h2>
                                <CheckBoxIcon color="success" />

                            </Item>
                            <Item >

                                <h3>Your Bnb Balance: <span>{ethBalance}</span></h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2>Require BNB Tokens</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >
                                <h3>BNB Balance: <span>{ethBalance}</span></h3>
                            </Item>
                        </>)}
                </Grid>
                <Grid item className="checkpointsGridItem" xs={12} md={4}>
                    {busdBalance ? (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>
                                <h2> BUSD Available</h2>
                                <CheckBoxIcon color="success" />

                            </Item>
                            <Item >
                                <h3>Your BUSD Balance: <span>{busdBalance}</span></h3>
                            </Item>
                        </>
                    ) : (
                        <>
                            <Item sx={{ backgroundColor: '#B9B8B8', fontWeight: '900' }}>

                                <h2> Require BUSD Tokens</h2>
                                <CheckBoxOutlineBlankIcon />
                            </Item>
                            <Item >

                                <h3>Your BUSD Balance: <span>{busdBalance}</span></h3>

                            </Item>
                        </>)}
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={1} >
                    </Grid>
                    <Grid item xs={5} md={2}>
                        <Item2>
                            <Avatar sx={{ bgcolor: green[500] }}><MenuIcon fontSize="large" /></Avatar>
                        </Item2>
                        <Item2>
                            <p style={{ color: "#EFF3E9" }}>1. Checkpoints</p>
                        </Item2>
                    </Grid>
                    <Grid item xs={5} md={2}    >
                        <Item2>
                            <Avatar sx={{ bgcolor: green[500] }}><MonetizationOnIcon /></Avatar>
                        </Item2>
                        <Item2>
                            <p style={{ color: "#EFF3E9" }}>2. Enter Amount</p>
                        </Item2>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Item2>
                            <Avatar sx={{ bgcolor: green[500] }}><PriceCheckIcon /></Avatar>
                        </Item2>
                        <Item2>
                            <p style={{ color: "#EFF3E9" }}>3. Pre-authorize</p>
                        </Item2>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Item2>
                            <Avatar sx={{ bgcolor: green[500] }}><LocalPoliceIcon /></Avatar>
                        </Item2>
                        <Item2>
                            <p style={{ color: "#EFF3E9" }}>4. Confirm</p>
                        </Item2>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <Item2>
                            <Avatar sx={{ bgcolor: green[500] }}><CheckIcon /></Avatar>
                        </Item2>
                        <Item2>
                            <p style={{ color: "#EFF3E9" }}>5. Success</p>
                        </Item2>
                    </Grid>
                    <Grid item xs={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    </Grid>

                </Grid>
            </Box>
        </>)
}