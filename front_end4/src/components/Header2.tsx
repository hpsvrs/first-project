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
import { Link } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useEthers } from "@usedapp/core";
import { Main } from "./Main"
import { useState, useEffect } from "react"
import Alert from "@material-ui/lab/Alert"



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
        width: "35%",
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
    }
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
    { name: 'Stake', link: '/' },
    { name: 'UnStake', link: '/unstake' },
    // { name: 'Withdraw', link: '/' },
    { name: 'PreSale', link: '/presale' }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {

    const classes = useStyles()

    const { account, activateBrowserWallet, deactivate, chainId } = useEthers()

    const isConnected = account !== undefined

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let [numberMain, setNumberMain] = useState<number>(0)
    const [openSnack, setOpenSnack] = React.useState(false);
    // let numberMain = 2;
    useEffect(() => {
        chainId ? ((String(chainId) != '42') ? setOpenSnack(true) : setOpenSnack(false)) : setOpenSnack(false)
    }, [chainId])

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
                                                <MenuItem className="menu-item" key={page.name} onClick={(() => handleCloseNavMenu(index))}>
                                                    <h4> {page.name}</h4>
                                                </MenuItem>
                                            ))}
                                        </Menu>

                                        {/* <nav className="navMenu" >
                                            <svg className="close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V2ZM14.71 13.29C14.8037 13.383 14.8781 13.4936 14.9289 13.6154C14.9797 13.7373 15.0058 13.868 15.0058 14C15.0058 14.132 14.9797 14.2627 14.9289 14.3846C14.8781 14.5064 14.8037 14.617 14.71 14.71C14.617 14.8037 14.5064 14.8781 14.3846 14.9289C14.2627 14.9797 14.132 15.0058 14 15.0058C13.868 15.0058 13.7373 14.9797 13.6154 14.9289C13.4936 14.8781 13.383 14.8037 13.29 14.71L12 13.41L10.71 14.71C10.617 14.8037 10.5064 14.8781 10.3846 14.9289C10.2627 14.9797 10.132 15.0058 10 15.0058C9.86799 15.0058 9.73729 14.9797 9.61543 14.9289C9.49357 14.8781 9.38297 14.8037 9.29 14.71C9.19628 14.617 9.12188 14.5064 9.07111 14.3846C9.02034 14.2627 8.99421 14.132 8.99421 14C8.99421 13.868 9.02034 13.7373 9.07111 13.6154C9.12188 13.4936 9.19628 13.383 9.29 13.29L10.59 12L9.29 10.71C9.1017 10.5217 8.99591 10.2663 8.99591 10C8.99591 9.7337 9.1017 9.4783 9.29 9.29C9.47831 9.1017 9.7337 8.99591 10 8.99591C10.2663 8.99591 10.5217 9.1017 10.71 9.29L12 10.59L13.29 9.29C13.4783 9.1017 13.7337 8.99591 14 8.99591C14.2663 8.99591 14.5217 9.1017 14.71 9.29C14.8983 9.4783 15.0041 9.7337 15.0041 10C15.0041 10.2663 14.8983 10.5217 14.71 10.71L13.41 12L14.71 13.29Z" fill="black" />
                                            </svg>
                                            <ul>
                                                <li><a href="#">Home</a></li>
                                                <li><a href="#">Sneakers</a></li>
                                                <li><a href="#">Players</a></li>
                                            </ul>
                                        </nav> */}
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
                                            // <Link href={page.link} >
                                            <Button
                                                key={index.toString()}
                                                onClick={(() => handleCloseNavMenu(index))}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                {page.name}
                                            </Button>
                                            // </Link>

                                        ))}
                                    </Box>

                                    {/* <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"
                                        variant="rounded">H</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box> */}

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
                    Switch Network to Binance Smart Chain
                </Alert>

            </Snackbar>

        </>
    );
};
export default ResponsiveAppBar;
