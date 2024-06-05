import { useCallback, useState } from "react"
import { useAccount } from "wagmi"
import { useDrop } from "react-dnd"
import { useProfileProvider } from "../../providers/ProfileContext"
import { CRE8OR } from "./types"
import { useWalletCollectionProvider } from "../../providers/WalletCollectionProvider"
import ProfileToken from "./ProfileToken"
import useCheckNetwork from "../../hooks/useCheckNetwork"
import useERC721Transfer from "../../hooks/useERC721Transfer"
import { useUserProvider } from "../../providers/UserProvider"
import { ItemTypes } from "./ItemTypes"
import TransferLoadingModal from "./TransferLoadingModal"

const OwnerWalletContents = () => {
  const { isHiddenEditable } = useProfileProvider()
  const { ownedNfts, getDNABySmartWallet } = useWalletCollectionProvider()
  const { smartWalletAddress } = useUserProvider()
  const { checkNetwork } = useCheckNetwork()
  const [isTransferring, setIsTransferring] = useState(false)
  const { transferERC721FromERC6551Account } = useERC721Transfer()
  const { address } = useAccount()
  const { refetchProfileFormattedCollection } = useWalletCollectionProvider()
  const [txStatus, setTxStatus] = useState()

  const afterTransfer = async () => {
    await refetchProfileFormattedCollection()
    await getDNABySmartWallet()
  }

  const dropToSmartWallet = useCallback(
    async (item) => {
      if (item?.inOwnedWallet || isHiddenEditable) return
      if (!checkNetwork()) return

      setIsTransferring(true)

      await transferERC721FromERC6551Account(
        smartWalletAddress,
        item?.contractAddress,
        address,
        item?.tokenId,
        afterTransfer,
        setTxStatus,
      )

      setIsTransferring(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transferERC721FromERC6551Account, checkNetwork],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ERC721,
      drop: async (item: any) => {
        dropToSmartWallet(item)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [dropToSmartWallet],
  )

  return (
    <>
      <div
        className="mt-[15px] grid grid-cols-3 xs:grid-cols-4 lg:grid-cols-6 
        gap-x-[5px] lg:gap-x-[15px] gap-y-[5px] 
        h-[120px] lg:h-[290px] 
        overflow-y-auto overflow-x-hidden
        pr-2"
        ref={drop}
      >
        {ownedNfts.map((data, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex flex-col items-center gap-y-[5px]">
            <ProfileToken token={data} inOwnedWallet />
            <div
              className="text-[6px] samsungS8:text-[7px] xs:text-[8px] lg:text-[12px] font-quicksand font-bold text-white
                                w-[30px] samsungS8:w-[40px] lg:!w-[90px] text-center
                                flex flex-col items-center gap-y-[2px]"
            >
              <div className="w-full break-words uppercase">
                {data.type === CRE8OR ? "CRE8ORS" : data.label}
                {data.type === CRE8OR ? ` #${data.tokenId}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isTransferring && <TransferLoadingModal status={txStatus} removing />}
    </>
  )
}

export default OwnerWalletContents
