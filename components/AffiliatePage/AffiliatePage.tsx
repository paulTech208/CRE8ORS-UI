import { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import Layout from "../Layout"
import BuyCre8orButton from "./BuyCre8orButton"
import CheckSmartWalletButton from "./CheckSmartWalletButton"
import CopyLinkButton from "./CopyLinkButton"
import WalletConnectButton from "../WalletConnectButton"
import balanceOfAddress from "../../lib/balanceOfAddress"

const AffiliatePage = ({ origin }) => {
  const { isConnected } = useAccount()
  const [hasCre8or, setHasCre8or] = useState(null)
  const { address } = useAccount()

  const checkIsOwnedCre8ors = useCallback(async () => {
    const response = await balanceOfAddress(address)
    if (parseInt(response.toString(), 10)) setHasCre8or(true)
    else setHasCre8or(false)
  }, [address])

  useEffect(() => {
    checkIsOwnedCre8ors()
  }, [checkIsOwnedCre8ors])

  return (
    <Layout type="contained">
      <div
        className="relative w-[100%] min-h-[100vh]
                      flex flex-col items-center justify-center
                      gap-y-[20px] md:gap-y-[20px]"
      >
        {isConnected ? (
          <>
            <BuyCre8orButton hasCre8or={hasCre8or} />
            <CheckSmartWalletButton hasCre8or={hasCre8or} />
            <CopyLinkButton origin={origin} />
          </>
        ) : (
          <WalletConnectButton>
            <div
              id="connect_wallet"
              className="!p-0
          w-[240px] h-[46px]
          hover:scale-[1.1] scale-[1] transition duration-[300ms] font-bold font-quicksand 
          uppercase text-white dark:text-[black] rounded bg-[black] dark:bg-[white] 
          shadow-[0px_4px_4px_rgb(0,0,0,0.25)] dark:shadow-[0px_4px_4px_rgb(255,255,255,0.25)]
          flex items-center justify-center gap-[10px]"
            >
              Connect Wallet
            </div>
          </WalletConnectButton>
        )}
      </div>
    </Layout>
  )
}

export default AffiliatePage
