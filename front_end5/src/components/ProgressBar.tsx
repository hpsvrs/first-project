import { useState, useEffect } from "react"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"


interface CheckpointProps {
    checkpoints: boolean
    // ethBalance: number
    // busdBalance: number
}

export const ProgressBar = ({ checkpoints }: CheckpointProps) => {

    const { notifications } = useNotifications();

    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState('svg-logo')
    const [showStakeTokensSuccess, setShowStakeTokensSuccess] = useState('svg-logo')
    console.log("you are in progress Bar: " + checkpoints)

    const [walletStatus, setWalletStatus] = useState('svg-logo')

    useEffect(() => {
        if (checkpoints == true) {
            setWalletStatus('svg-success')
            console.log('You are in useEffect Wallet Connected')
            console.log(walletStatus)
        } else {
            setWalletStatus('svg-logo')
            console.log(walletStatus)
        }
    }, [checkpoints])

    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 Transfer"
        ).length > 0) {
            console.log("Approved!")
            setShowErc20ApprovalSuccess('svg-success')
            // setShowStakeTokensSuccess(false)
        }
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Stake Tokens"
        ).length > 0) {
            console.log("Tokens Staked!")
            // setShowErc20ApprovalSuccess('svg-success')
            setShowStakeTokensSuccess('svg-success')
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokensSuccess])

    return (
        <>
            {/* <h1 className="section-heading"> Progress...</h1> */}
            <div className="progress-bar">

                <div className="progress-bar-item">
                    {/* <div className="svg-container"> */}
                    <svg className={walletStatus} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 384.97 384.97" xmlSpace="preserve">
                        <g>
                            <g id="Menu">
                                <path d="M12.03,84.212h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                        C5.39,60.152,0,65.541,0,72.182C0,78.823,5.39,84.212,12.03,84.212z"/>
                                <path d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                            S379.58,180.455,372.939,180.455z"/>
                                <path d="M372.939,300.758H12.03c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h360.909
                            c6.641,0,12.03-5.39,12.03-12.03C384.97,306.147,379.58,300.758,372.939,300.758z"/>
                            </g>
                        </g>
                    </svg>
                    {/* </div> */}
                    <div>
                        <h4 >1. Checkpoints</h4>
                    </div>
                    {/* <div> */}


                    {/* </div> */}
                </div>
                <svg className="svg-arrow" >
                    {/* <line x1="10" y1="0" x2="10000" y2="4000" /> */}
                    <line x1="0" y1="20" x2="10000" y2="00" />
                    {/* <line x1="0" y1="40" x2="10000" y2="0" /> */}
                </svg>
                <div className="progress-bar-item">
                    {/* <div className="svg-container"> */}
                    <svg className={showErc20ApprovalSuccess} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 199.027 199.027" xmlSpace="preserve">
                        <g>
                            <g>
                                <g>
                                    <path d="M99.514,0.009C44.657,0.009,0,44.648,0,99.522c0,54.853,44.657,99.496,99.514,99.496
                                        c54.871,0,99.514-44.643,99.514-99.496C199.027,44.648,154.384,0.009,99.514,0.009z M99.514,189.43
                                        c-49.581,0-89.926-40.33-89.926-89.911S49.932,9.593,99.514,9.593s89.926,40.344,89.926,89.926S149.095,189.43,99.514,189.43z"/>
                                </g>
                                <g>
                                    <path d="M104.288,92.54c-13.199-5.604-17.823-9.538-17.823-17.264c0-6.202,3.418-13.184,15.092-13.184
                                            c9.699,0,15.901,3.5,19.086,5.307l3.783-9.999c-4.549-2.57-10.747-5.007-19.684-5.29V37.383H95.19v15.156
                                            c-13.796,2.29-22.719,11.825-22.719,24.393c0,13.184,9.552,20.296,24.988,26.365c11.227,4.545,16.169,9.702,16.151,18.027
                                            c0.018,8.654-6.302,14.856-17.046,14.856c-8.493,0-16.384-3.021-21.674-6.499l-3.633,10.132
                                            c5.29,3.783,14.244,6.517,23.016,6.682v15.139h9.552v-15.751c15.6-2.423,23.943-13.646,23.943-25.753
                                            C127.772,106.652,119.892,98.921,104.288,92.54z"/>
                                </g>
                            </g>
                        </g>
                    </svg>

                    {/* </div> */}
                    <div>
                        <h4 style={{ color: "" }}>2. Enter Amount</h4>
                    </div>
                </div>
                <svg className="svg-arrow" >
                    {/* <line x1="10" y1="0" x2="10000" y2="4000" /> */}
                    <line x1="0" y1="20" x2="10000" y2="00" />
                    {/* <line x1="0" y1="40" x2="10000" y2="0" /> */}
                </svg>
                <div className="progress-bar-item">
                    {/* <div className="svg-container"> */}
                    <svg className={showErc20ApprovalSuccess} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 490 490" xmlSpace="preserve">
                        <g>
                            <g>
                                <path d="M244.95,386c77.8,0,141-63.1,141-141c0-77.8-63.1-141-141-141c-40.6,0-77.2,17.2-102.9,44.6
                                        c-23.6,25.2-38.1,59.1-38.1,96.3C103.95,322.9,167.15,386,244.95,386z M195.75,300.8c1.3-4.6,2.5-9.3,4-13.8c1.7-5.3,3.1-6,8-3.4
                                        c8.4,4.4,17.2,6.8,26.5,8c6,0.7,11.9,0.1,17.4-2.3c10.4-4.5,12-16.5,3.2-23.8c-3-2.5-6.4-4.3-9.9-5.8c-9.1-4-18.6-7-27.1-12.2
                                        c-13.9-8.3-22.8-19.8-21.7-36.7c1.2-19.2,12-31.1,29.6-37.5c7.2-2.6,7.3-2.5,7.3-10.1c0-2.6,0-5.1,0-7.7c0.1-5.7,1.1-6.7,6.8-6.9
                                        c1.8-0.1,3.5,0,5.3,0c12.1,0,12.1,0,12.2,12.1c0,8.6,0,8.6,8.6,9.9c6.5,1,12.8,2.9,18.8,5.6c3.3,1.5,4.6,3.8,3.6,7.3
                                        c-1.5,5.2-2.9,10.5-4.6,15.7c-1.6,4.9-3.1,5.6-7.8,3.3c-9.5-4.6-19.4-6.5-29.8-5.9c-2.7,0.1-5.4,0.5-8,1.6
                                        c-9,3.9-10.5,13.9-2.8,20.1c3.9,3.1,8.3,5.4,12.9,7.3c8,3.3,16,6.5,23.6,10.7c24.2,13.4,30.7,43.7,13.7,64.4
                                        c-6.2,7.5-14.2,12.5-23.5,15.1c-4.1,1.1-5.9,3.3-5.7,7.5c0.2,4.2,0,8.3,0,12.5c0,3.7-1.9,5.7-5.6,5.8c-4.5,0.1-9,0.1-13.4,0
                                        c-3.9-0.1-5.8-2.3-5.8-6.1c0-3-0.1-6.1-0.1-9.1c-0.1-6.7-0.3-7-6.7-8c-8.3-1.3-16.4-3.2-23.9-6.9
                                        C194.65,308.5,194.05,307,195.75,300.8z"/>
                                <path d="M397.65,397.8c-81.4,81.4-212.1,84.1-296.8,8.3h27.2v-29h-57.2h-0.7h-19.3v19.6v0.4v57.2h29v-28.1
                                        c46.6,42.5,105.8,63.8,165,63.8c62.8,0,125.5-23.9,173.3-71.7l10.3-10.3l-20.5-20.5L397.65,397.8z"/>
                                <path d="M410.05,35.7v28.1C363.45,21.3,304.25,0,245.05,0c-62.8,0-125.5,23.9-173.3,71.7l-10.2,10.2l20.5,20.5l10.3-10.3
                                        c81.4-81.4,212.1-84.1,296.8-8.3h-27.2v29h57.2h0.7h19.3V93.2v-0.4V35.7H410.05z"/>
                            </g>
                        </g>

                    </svg>
                    {/* </div> */}
                    <div>
                        <h4 style={{ color: "" }}>3. Pre-Authorize</h4>
                    </div>
                </div>
                <svg className="svg-arrow" >
                    {/* <line x1="10" y1="0" x2="10000" y2="4000" /> */}
                    <line x1="0" y1="20" x2="10000" y2="00" />
                    {/* <line x1="0" y1="40" x2="10000" y2="0" /> */}
                </svg>


                <div className="progress-bar-item">
                    {/* <div className="svg-container"> */}
                    <svg className={showStakeTokensSuccess} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 214.27 214.27" xmlSpace="preserve">
                        <g>
                            <path d="M196.926,55.171c-0.11-5.785-0.215-11.25-0.215-16.537c0-4.142-3.357-7.5-7.5-7.5c-32.075,0-56.496-9.218-76.852-29.01
                    c-2.912-2.832-7.546-2.831-10.457,0c-20.354,19.792-44.771,29.01-76.844,29.01c-4.142,0-7.5,3.358-7.5,7.5
                    c0,5.288-0.104,10.755-0.215,16.541c-1.028,53.836-2.436,127.567,87.331,158.682c0.796,0.276,1.626,0.414,2.456,0.414
                    c0.83,0,1.661-0.138,2.456-0.414C199.36,182.741,197.954,109.008,196.926,55.171z M107.131,198.812
                    c-76.987-27.967-75.823-89.232-74.79-143.351c0.062-3.248,0.122-6.396,0.164-9.482c30.04-1.268,54.062-10.371,74.626-28.285
                    c20.566,17.914,44.592,27.018,74.634,28.285c0.042,3.085,0.102,6.231,0.164,9.477C182.961,109.577,184.124,170.844,107.131,198.812
                    z"/>
                            <path d="M132.958,81.082l-36.199,36.197l-15.447-15.447c-2.929-2.928-7.678-2.928-10.606,0c-2.929,2.93-2.929,7.678,0,10.607
                    l20.75,20.75c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l41.501-41.5
                    c2.93-2.929,2.93-7.678,0.001-10.606C140.636,78.154,135.887,78.153,132.958,81.082z"/>
                        </g>
                    </svg>
                    {/* </div> */}
                    <div>
                        <h4 style={{ color: "" }}>4. Confirm...</h4>
                    </div>
                </div>

                <svg className="svg-arrow" >
                    {/* <line x1="10" y1="0" x2="10000" y2="4000" /> */}
                    <line x1="0" y1="20" x2="10000" y2="00" />
                    {/* <line x1="0" y1="40" x2="10000" y2="0" /> */}
                </svg>
                <div className="progress-bar-item">
                    {/* <div className="svg-container"> */}
                    <svg className={showStakeTokensSuccess} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        width="405.272px" height="405.272px" viewBox="0 0 405.272 405.272"
                        xmlSpace="preserve">
                        <g>
                            <path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836
                c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064
                c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z"/>
                        </g>
                    </svg>
                    {/* </div> */}
                    <div>
                        <h4 style={{ color: "" }}>5. Success!!! </h4>
                    </div>
                </div>

            </div>
        </>
    )
}
