import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { makeStyles, Snackbar } from '@material-ui/core';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useEthers } from "@usedapp/core";
import { Main } from "./Main"
import { useState, useEffect, useContext, createContext } from "react"
import Alert from "@material-ui/lab/Alert"
import { constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"

// export type ContextObj = {
//     chainId: number
//     address: string
// }

export const MyContext = createContext({ chainIdentity: 0, tokenFarmContractAddress: '0x7db58Fa9330c68e1cFA28753E013c2098557Bf9c', dappTokenAddress: '0x7db58Fa9330c68e1cFA28753E013c2098557Bf9c' })


// const pages = ['Projects', 'Stake', 'Unstake', Withdraw];
const useStyles = makeStyles((theme) => ({
    container: {
        // paddingLeft: theme.spacing(4),
        // paddingRight: theme.spacing(4),
        // paddingTop: theme.spacing(1),
        // display: "flex",
        // justifyContent: "flex-end",
        // gap: theme.spacing(1)
    },
    navmenu: {
        width: "50%",
        height: "100%",
        maxHeight: 'unset',
        maxWidth: 'unset',

    },
    menu: {
        opacity: "1",
        marginLeft: "-1em",
        marginTop: "1.5em",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
}))


const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#151313',
        },
        secondary: {
            main: '#f44336',
        },
    },
});


const pages = [
    { name: 'Projects', link: '/' },
    { name: 'Stake', link: '/stake' },
    { name: 'UnStake / Rewards', link: '/unstake-rewards' },
    // { name: 'Withdraw', link: '/' },
    { name: 'PreSale', link: '/presale' }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {

    const classes = useStyles()

    const { account, activateBrowserWallet, deactivate, chainId } = useEthers()
    const tokenFarmContractAddress = (
        chainId ?
            (((String(chainId) == '42') || (String(chainId) == '97')) ?
                networkMapping[String(chainId)]["TokenFarm"][0] :
                constants.AddressZero) :
            constants.AddressZero)

    console.log("This is in Header2 tokenFarmContractAddress: " + tokenFarmContractAddress)

    const dappTokenAddress = (
        chainId ?
            (((String(chainId) == '42') || (String(chainId) == '97')) ?
                networkMapping[String(chainId)]["DappToken"][0] :
                constants.AddressZero) :
            constants.AddressZero)

    const chainIdentity = chainId ? (String(chainId) == '42') ? 42 : (String(chainId) == '97') ? 97 : 0 : 0


    const isConnected = account !== undefined

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let [numberMain, setNumberMain] = useState<number>(0)
    const [openSnack, setOpenSnack] = React.useState(false);
    const [chainNumber, setChainNumber] = useState(0)

    // let numberMain = 2;
    useEffect(() => {
        chainId ?
            ((String(chainId) == '42') || (String(chainId) == '97')) ?
                handleChainPresent(chainId) :
                handleChainNotPresent() :
            setOpenSnack(true)
    }, [chainId])

    const handleChainPresent = (chain: number) => {
        setOpenSnack(false)
        setChainNumber(chain)
    }
    const handleChainNotPresent = () => {
        setOpenSnack(true)
        setChainNumber(0)
    }
    // console.log('You are seeing chainNumber in Header3: ' + chainNumber)

    const handleCloseSnack = () => {
        setOpenSnack(false)
    }

    const handleOpenNavMenu = (event: React.BaseSyntheticEvent) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.BaseSyntheticEvent) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (valuee: number) => {
        setNumberMain(valuee)
        // numberMain = valuee;
        setAnchorElNav(null);
    };
    const handleCloseNavMenuOnly = (valuee: number) => {
        // setNumberMain(valuee)
        // numberMain = valuee;
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (
        <>
            <MyContext.Provider value={{ chainIdentity, tokenFarmContractAddress, dappTokenAddress }}>

                {/* <button >this</button> */}
                <Box >
                    <ThemeProvider theme={darkTheme} >
                        <Box >
                            <AppBar position="sticky" >
                                <Box maxWidth="xl" >
                                    <Toolbar disableGutters>
                                        <Typography
                                            variant="h6"
                                            noWrap
                                            component="div"
                                            sx={{ mr: 2, ml: 2, display: { xs: 'none', md: 'flex' } }}
                                        >
                                            MoonPad
                                        </Typography>

                                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                            <IconButton
                                                size="large"
                                                aria-label="account of current user"
                                                aria-controls="menu-appbar"
                                                aria-haspopup="true"
                                                onClick={handleOpenNavMenu}
                                                color="inherit"
                                            >
                                                <MenuIcon />
                                            </IconButton>
                                            <Menu
                                                id="menu-appbar"
                                                anchorEl={anchorElNav}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                open={Boolean(anchorElNav)}
                                                onClose={handleCloseNavMenuOnly}
                                                sx={{
                                                    display: { xs: 'block', md: 'none' },
                                                }}
                                                className={classes.menu}
                                                PopoverClasses={{ paper: classes.navmenu }}

                                            >
                                                {pages.map((page, index) => (
                                                    <Link style={{ padding: "0" }} to={page.link}>

                                                        <MenuItem className="menu-item" key={page.name} onClick={(() => handleCloseNavMenu(index))}>
                                                            <h4> {page.name}</h4>
                                                        </MenuItem>
                                                    </Link>
                                                ))}
                                            </Menu>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            noWrap
                                            component="div"
                                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                                        >
                                            MoonPad
                                        </Typography>
                                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                            {pages.map((page, index) => (
                                                <Link to={page.link} >
                                                    <Button
                                                        key={index.toString()}
                                                        onClick={(() => handleCloseNavMenu(index))}
                                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                                    >
                                                        {page.name}
                                                    </Button>
                                                </Link>

                                            ))}
                                        </Box>


                                        <Box sx={{ m: 2 }}>
                                            {isConnected ? (
                                                <Chip label="Disconnect!"
                                                    component="a"
                                                    // href="/5"
                                                    onClick={deactivate}
                                                    clickable
                                                    color='success' />
                                            ) : (
                                                <Chip label="Connect Wallet!"
                                                    component="a"
                                                    // href="/5"
                                                    onClick={() => activateBrowserWallet()}
                                                    color='success'
                                                    clickable />
                                            )}
                                        </Box>

                                    </Toolbar>
                                </Box>
                            </AppBar>

                        </Box>
                    </ThemeProvider>
                    <Box sx={{ marginTop: 0 }}>
                        <Box sx={{
                            flexGrow: 1,
                            justifyContent: "flex-end",
                            display: "flex",
                            mr: 2,
                            // mt: 20
                        }}>
                            <h3 className='under-header'>Staking Level: </h3>
                            <Typography variant="subtitle1" gutterBottom component="div">

                                <Box>{isConnected ? (
                                    <Button
                                        onClick={deactivate}>
                                        {/* {account} */}
                                        <Box style={{ width: 200, whiteSpace: 'nowrap' }}>
                                            <Box
                                                component="div"
                                                sx={{
                                                    overflow: 'auto',
                                                    // my: 2,
                                                    // p: 1,
                                                    // bgcolor: (theme) =>
                                                    //     theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                                                    // color: (theme) =>
                                                    //     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                                    // border: '1px solid',
                                                    // borderColor: (theme) =>
                                                    //     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                                                    // borderRadius: 2,
                                                    fontSize: '0.875rem',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                {account}
                                            </Box>
                                        </Box>

                                    </Button>
                                ) : (
                                    <Button color="secondary"
                                        onClick={() => activateBrowserWallet()}>
                                        Accont Not Connected
                                    </Button>

                                )}</Box>

                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <section>
                    <Main elementNumber={numberMain} />
                </section>


                <Snackbar open={openSnack}
                    autoHideDuration={5000}
                >
                    <Alert severity="error" >
                        Wallet Connected?
                        <hr />
                        Switch Network to Binance Smart Chain.
                    </Alert>

                </Snackbar>
            </MyContext.Provider>

        </>
    );
};
export default ResponsiveAppBar;
