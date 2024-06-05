import { getAffiliateMintEvents } from "./getAffiliateMintEvents"

const getReferralLeaderboard = async () => {
  const data = await getAffiliateMintEvents()
  // Specify the accumulator type
  const groupedData = data.reduce((acc, curr) => {
    if (!acc[curr.cre8orsNumber]) {
      acc[curr.cre8orsNumber] = BigInt(0)
    }
    acc[curr.cre8orsNumber] += BigInt(curr.referralFeePaid)
    return acc
  }, {})

  const results = Object.entries(groupedData)
    .map(([cre8orsNumber, totalReferralFeeEarned]) => ({
      cre8orsNumber,
      totalReferralFeeEarned: totalReferralFeeEarned.toString(),
    }))
    .sort((a, b) => {
      if (BigInt(a.totalReferralFeeEarned) < BigInt(b.totalReferralFeeEarned)) {
        return 1 // a comes after b
      }
      if (BigInt(a.totalReferralFeeEarned) > BigInt(b.totalReferralFeeEarned)) {
        return -1 // a comes before b
      }
      return 0 // a and b are equal
    })

  return results
}

export default getReferralLeaderboard
