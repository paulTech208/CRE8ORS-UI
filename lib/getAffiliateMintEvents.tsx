import { BigNumber, utils } from "ethers"
import { ethGetLogs } from "./alchemy/eth_getLogs"

export const getAffiliateMintEvents = async () => {
  const eventSignature = utils.id("ReferralSale(uint256,uint256)")
  const topics = [eventSignature]
  const chainId = process.env.NEXT_PUBLIC_TESTNET ? 5 : 1
  const affiliateMinterAddress = process.env.NEXT_PUBLIC_AFFILIATE_MINTER
  const rawLogs = await ethGetLogs(chainId, affiliateMinterAddress, topics)
  const parsedLogs = rawLogs.map((log) => {
    const cre8orsNumber = BigNumber.from(log.topics[1]).toString() // Extracting cre8orsNumber
    const referralFeePaid = BigNumber.from(log.topics[2]).toString() // Extracting referralFeePaid

    return {
      cre8orsNumber,
      referralFeePaid,
    }
  })

  return parsedLogs.reverse()
}
