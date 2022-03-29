import React, { useEffect, useState } from 'react'
import { useParticipationButton } from '../../hooks/useParticipateButton'
import { useNotifications } from "@usedapp/core"
import { Button, makeStyles, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

interface Props {
    preSaleNumber: string
}

export const ParticipateButton = ({ preSaleNumber }: Props) => {
    const { participateInPreSaleAllocationSendFunction, participateInPreSaleAllocationState: participateState } = useParticipationButton()

    const handleParticipationButton = () => {
        return participateInPreSaleAllocationSendFunction(preSaleNumber)
    }


    const isParticipating = participateState.status === "Mining"
    const [showParticipationSuccess, setParticipationSuccess] = useState(false)
    const { notifications } = useNotifications()

    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Participating in PreSale Allocation"
        ).length > 0) {
            setParticipationSuccess(true)
        }
    }, [notifications, participateState])

    const handleCloseSnack = () => {
        setParticipationSuccess(false)
    }

    return (
        <>
            <div className='participate'>
                <h1>Phase: 1</h1>
                <h3>Click the Following Button To Participate in this Pre-Sale.</h3>
                <h3>And the system will take your entery and You won't be able to unstake your tokens for the next 2 Weeks.</h3>
                <button onClick={handleParticipationButton} className='btn btn-shadow'>
                    {(isParticipating) ? <CircularProgress size={26} /> : "Commit to Participate!"}
                </button>
            </div>
            <Snackbar open={showParticipationSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    Thanks for Commiting to Participate, Now please wait for the Allocation and Pre-Sale Purchase to Open!
                </Alert>
            </Snackbar>
        </>
    )
}