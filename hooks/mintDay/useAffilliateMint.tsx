import { BigNumber, Contract } from "ethers"
import affiliateAbi from "../../lib/abi-affiliate-minter.json"
import { useEthersSigner } from "../useEthersSigner"
import handleTxError from "../../lib/handleTxError"
import useCheckNetwork from "../useCheckNetwork"
import useSaleStatus from "./useSaleStatus"

const useAffiliateMint = () => {
  const signer = useEthersSigner({ chainId: process.env.NEXT_PUBLIC_TESTNET ? 5 : 1 })
  const { publicSalePrice } = useSaleStatus()
  const { checkNetwork } = useCheckNetwork()

  const mintAffiliate = async (to, referralCre8orNumber, quantity) => {
    try {
      if (!checkNetwork()) {
        throw new Error("switch your network")
      }

      const contract = new Contract(process.env.NEXT_PUBLIC_AFFILIATE_MINTER, affiliateAbi, signer)

      const tx = await contract.mint(to, referralCre8orNumber, quantity, {
        value: BigNumber.from(publicSalePrice).mul(quantity).toString(),
        gasLimit: 300293 * quantity,
      })
      const receipt = await tx.wait()
      return receipt
    } catch (err) {
      handleTxError(err)
      return { err }
    }
  }

  return {
    mintAffiliate,
  }
}
export default useAffiliateMint
