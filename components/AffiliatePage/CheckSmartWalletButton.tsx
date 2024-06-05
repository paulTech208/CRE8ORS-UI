import { toast } from "react-toastify"
import _ from "lodash"
import { useUserProvider } from "../../providers/UserProvider"
import { Button } from "../../shared/Button"
import Checkbox from "../../shared/Checkbox"
import Media from "../../shared/Media"

const CheckSmartWalletButton = ({ hasCre8or }) => {
  const { smartWalletAddress } = useUserProvider()
  return (
    <div
      className="flex gap-x-[15px] w-[280px]
    items-center"
    >
      <Button
        id="set_smart_wallet"
        onClick={() => {
          if (smartWalletAddress) {
            toast.info("Smart wallet is already setup.")
            return
          }

          window.open("/profile", "_blank")
        }}
        className={`!p-0
                w-[240px] h-[46px]
                ${
                  _.isNull(smartWalletAddress) || !hasCre8or ? "cursor-not-allowed !bg-[gray]" : ""
                }`}
        disabled={_.isNull(smartWalletAddress) || !hasCre8or}
      >
        Setup Smart Wallet
      </Button>
      {_.isNull(smartWalletAddress) ? (
        <Media
          type="image"
          link="/assets/Common/loading.svg"
          blurLink="/assets/Common/loading.svg"
          containerClasses="w-[25px] h-[25px]"
        />
      ) : (
        <Checkbox id="checked_smart_wallet" checked={smartWalletAddress} readOnly />
      )}
    </div>
  )
}

export default CheckSmartWalletButton
