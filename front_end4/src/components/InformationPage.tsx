import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';



const Item = styled('div')(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,

    textAlign: "center",
    // color: theme.palette.text.secondary
}));

export const InformationPage = () => {
    return (
        <>
            <Box sx={{ flexGrow: 1, margin: 10 }}>
                <Grid
                    container
                    direction="column"
                    // justifyContent="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs>

                        <Typography style={{ color: "#EFF3E9", fontSize: "4vw" }} variant="h3" component="div" gutterBottom>
                            Please make sure you have MetaMask installed.
                            and you are on a Kovan network.
                        </Typography>

                    </Grid>

                </Grid>
            </Box>
        </>
    )
}