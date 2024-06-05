import { Contract, utils } from "ethers"
import { useEthersSigner } from "./useEthersSigner"
import handleTxError from "../lib/handleTxError"
import erc6551AccountAbi from "../lib/abi-ERC6551-account.json"
import getImplementationAddress from "../lib/getImplementationAddress"

export enum TxSTATUS {
  INITIALIZING = "INITIALIZING",
  SENDING = "SENDING",
}

const useEthTransfer = () => {
  const signer = useEthersSigner()

  const transferEthFromERC6551Account = async (
    tokenBoundAccount: string,
    to: string,
    value: number,
    updateTxStatus,
  ) => {
    if (!signer) return { err: "missing signer" }
    try {
      updateTxStatus(TxSTATUS.INITIALIZING)
      const contract = new Contract(tokenBoundAccount, erc6551AccountAbi, signer)

      const implementation = await getImplementationAddress(tokenBoundAccount)
      let tx
      if (!implementation) {
        tx = await contract.initialize()
        await tx.wait()
      }

      updateTxStatus(TxSTATUS.SENDING)
      tx = await contract.executeCall(to, utils.parseEther(value.toString()), "0x")
      const receipt = await tx.wait()

      return receipt
    } catch (err) {
      handleTxError(err)
      return { err }
    }
  }

  return {
    transferEthFromERC6551Account,
  }
}

export default useEthTransfer
