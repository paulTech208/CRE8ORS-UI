import { CopyToClipboard } from "react-copy-to-clipboard"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAccount } from "wagmi"
import _ from "lodash"
import { useUserProvider } from "../../providers/UserProvider"
import { Button } from "../../shared/Button"
import Checkbox from "../../shared/Checkbox"
import balanceOfAddress from "../../lib/balanceOfAddress"
import useCre8orNumber from "../../hooks/mintDay/useCre8orNumber"
import { updateUserCre8orNumber } from "../../lib/userInfo"
import Media from "../../shared/Media"

const CopyLinkButton = ({ origin }) => {
  const { address } = useAccount()

  const { cre8orNumber, getUserData, smartWalletAddress } = useUserProvider()
  const { getCre8orNumber } = useCre8orNumber({ address })
  const [isCopiedLink, setIsCopiedLink] = useState(false)
  const [hasCre8or, setHasCre8or] = useState(false)

  const getBalanceOf = useCallback(async () => {
    if (address) {
      const response = await balanceOfAddress(address)
      if (parseInt(response.toString(), 10) > 0) {
        setHasCre8or(true)
        return
      }

      setHasCre8or(false)
    }
  }, [address])

  const setCre8orNumber = useCallback(async () => {
    if (hasCre8or && !cre8orNumber) {
      const newCre8orNumber = await getCre8orNumber()
      await updateUserCre8orNumber({
        walletAddress: address,
        cre8orNumber: newCre8orNumber,
      })
      getUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cre8orNumber, hasCre8or])

  useEffect(() => {
    getBalanceOf()
  }, [getBalanceOf])

  useEffect(() => {
    setCre8orNumber()
  }, [setCre8orNumber])

  return (
    <div className="flex gap-x-[15px] w-[280px] items-center">
      <CopyToClipboard text={cre8orNumber ? `${origin}/mint?referral=${cre8orNumber}` : ""}>
        <Button
          id="copy_link"
          className={`!p-0
          w-[240px] h-[46px]
           ${cre8orNumber && smartWalletAddress ? "cursor-copy" : "!bg-[gray] cursor-not-allowed"}`}
          onClick={() => {
            if (cre8orNumber) {
              toast.success("Copied to clipboard")
              setIsCopiedLink(true)
            }
          }}
          disabled={!smartWalletAddress || !cre8orNumber}
        >
          copy affiliate link
        </Button>
      </CopyToClipboard>
      {_.isNull(cre8orNumber) ? (
        <Media
          type="image"
          link="/assets/Common/loading.svg"
          blurLink="/assets/Common/loading.svg"
          containerClasses="w-[25px] h-[25px]"
        />
      ) : (
        <Checkbox id="copied_link" checked={isCopiedLink} readOnly />
      )}
    </div>
  )
}

export default CopyLinkButton
