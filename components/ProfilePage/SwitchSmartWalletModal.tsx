/* eslint-disable no-nested-ternary */
import { FC, useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Modal from "../../shared/Modal"
import { Button } from "../../shared/Button"
import { useWalletCollectionProvider } from "../../providers/WalletCollectionProvider"
import Media from "../../shared/Media"
import { useUserProvider } from "../../providers/UserProvider"
import getIpfsLink from "../../lib/getIpfsLink"
import Icon from "../../shared/Icon"
import useCheckNetwork from "../../hooks/useCheckNetwork"
import useCreateTBA from "../../hooks/useCreateTBA"
import SettingSmartWalletModal from "./SettingSmartWalletModal"

interface SwitchSmartWalletModalProps {
  isModalVisible: boolean
  toggleIsVisible: () => void
}
const SwitchSmartWalletModal: FC<SwitchSmartWalletModalProps> = ({
  isModalVisible,
  toggleIsVisible,
}) => {
  const { setIsViewAll, setShouldSelectNewPFP } = useWalletCollectionProvider()
  const { metaData, smartWalletAddress, smartWalletBalance } = useUserProvider()
  const [isCopied, setIsCopied] = useState(false)

  const { cre8orNumber, getSmartWalletAddress } = useUserProvider()
  const { checkNetwork } = useCheckNetwork()
  const { createTbaAndMintDna } = useCreateTBA()
  const [openLoadingModal, setOpenLoadingModal] = useState(false)

  const onClick = async () => {
    if (!checkNetwork()) return

    toggleIsVisible()
    setOpenLoadingModal(true)
    await createTbaAndMintDna(cre8orNumber)
    await getSmartWalletAddress()
    setOpenLoadingModal(false)
  }

  useEffect(() => {
    if (isCopied)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
  }, [isCopied])

  return (
    <>
      <Modal
        id="switch_smart_wallet"
        isVisible={isModalVisible}
        onClose={toggleIsVisible}
        containerClassName="!rounded-[15px] overflow-hidden 
          !bg-[transparent]
          drop-shadow-[2px_3px_2px_rgba(0,0,0,0.25)]"
        modalClassName="!z-[110]"
        showCloseButton
      >
        <div
          className="p-[15px] xs:p-[16px]
              flex-col flex justify-center items-center
              gap-y-[5px] xs:gap-y-[20px]
              w-[300px]
              xs:w-[360px]
              bg-[#ffffffe0]"
        >
          <div
            className="flex flex-col items-center
          xs:gap-y-[5px]"
          >
            <Media
              type="image"
              link={getIpfsLink(metaData?.image)}
              blurLink={getIpfsLink(metaData?.image)}
              containerClasses="w-[74px] h-[74px] rounded-full overflow-hidden"
            />
            <p
              className="uppercase text-[#232323] text-[18px]
            font-quicksand font-bold"
            >
              Smart Wallet
            </p>
            <p className="font-quicksand font-bold text-[18px]">
              {smartWalletAddress
                ? `${smartWalletAddress.slice(0, 4)}...${smartWalletAddress.slice(
                    smartWalletAddress.length - 4,
                    smartWalletAddress.length,
                  )}`
                : ""}
            </p>
            {smartWalletBalance > 0 && (
              <p className="text-[gray] font-quicksand text-[14px]">{smartWalletBalance} ETH</p>
            )}
          </div>
          <div className="flex items-center gap-x-[10px]">
            {smartWalletAddress ? (
              <CopyToClipboard text={smartWalletAddress}>
                <Button
                  id="copy_address_btn"
                  className="w-[130px] !h-[45px]
                    xs:!w-[158px] xs:!h-[53px]
                    !p-0 !rounded-[10px]
                    flex !flex-col !gap-y-[2px]
                    !bg-[#ffffff94] !capitalize
                    !text-black !text-[12px]
                    !shadow-none"
                  onClick={() => setIsCopied(true)}
                >
                  <Icon name={isCopied ? "check" : "copy"} size={20} color="black" raw />
                  {isCopied ? "Copied!" : "Copy Address"}
                </Button>
              </CopyToClipboard>
            ) : (
              <Button
                id="deploy-wallet-modal"
                className="w-[130px] !h-[45px]
                    xs:!w-[158px] xs:!h-[53px]
                    !p-0 !rounded-[10px]
                    flex !flex-col !gap-y-[2px]
                    !bg-[#ffffff94] !capitalize
                    !text-black !text-[12px]
                    !shadow-none"
                onClick={onClick}
              >
                <Icon name="setting" size={20} color="black" raw />
                Setup Smart Wallet
              </Button>
            )}
            <Button
              id="swith_smart_wallet_btn"
              className="w-[130px] !h-[45px]
                  xs:!w-[158px] xs:!h-[53px]
                  !p-0 !rounded-[10px]
                  flex !flex-col !gap-y-[2px]
                  !bg-[#ffffff94] !capitalize
                  !text-black !text-[12px]
                  !shadow-none"
              onClick={() => {
                setIsViewAll(false)
                setShouldSelectNewPFP(true)
                toggleIsVisible()
              }}
            >
              <Icon name="switch" size={20} color="black" raw />
              Switch Smart Wallet
            </Button>
          </div>
        </div>
      </Modal>
      <SettingSmartWalletModal
        isModalVisible={openLoadingModal}
        toggleIsVisible={() => setOpenLoadingModal(!openLoadingModal)}
      />
    </>
  )
}

export default SwitchSmartWalletModal
