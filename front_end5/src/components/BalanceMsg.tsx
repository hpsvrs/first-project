import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1),
        alignItems: "center",
        textAlign: "center",
    },
    tokenImg: {
        width: "32px"
    },
    amount: {
        fontWeight: 700,
        overflow: "hidden",

    }
}))

interface BalanceMsgProps {
    label: string
    amount: number
    tokenImgSrc: string
}


export const BalanceMsg = ({ label, amount, tokenImgSrc }: BalanceMsgProps) => {
    const classes = useStyles()
    return (

        <div className={classes.container}>
            <div>{label}</div>
            <img className={classes.tokenImg} src={tokenImgSrc} alt="token logo" />
            <div className={classes.amount}>{amount}</div>
            {/* <p>:</p> */}

        </div>
    )
}