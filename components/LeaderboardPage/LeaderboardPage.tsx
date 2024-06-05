import React, { useState, useEffect } from "react"
import LeaderboardRow from "./LeaderboardRow"
import SkeletonTableBody from "./SkeletonTableBody"
import Layout from "../Layout"
import getReferralLeaderboard from "../../lib/getReferralLeaderboard"
import { getOwnersofCre8ors } from "../../lib/cre8or"
import getTwitterHandleByAddress from "../../lib/getTwitterHandleByAddress"
import getMetadata from "../../lib/getMetadata"
import getIpfsLink from "../../lib/getIpfsLink"

const LeaderboardPage = () => {
  const [collectors, setCollectors] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let referralData = await getReferralLeaderboard()
      const referralCre8ors = referralData.map((data) => parseInt(data.cre8orsNumber, 10))
      const walletAddresses = await getOwnersofCre8ors(referralCre8ors)

      referralData = await Promise.all(
        referralData.map(async (data, i) => {
          const twitterHandle = await getTwitterHandleByAddress(walletAddresses[i])
          const metaData = getMetadata(parseInt(data.cre8orsNumber, 10), true)

          return {
            ...data,
            walletAddress: walletAddresses[i],
            twitterHandle,
            pfpImage: getIpfsLink(metaData?.image),
          }
        }),
      )

      setCollectors(referralData)
    }
    fetchLeaderboard()
  }, [])

  return (
    <Layout type="contained">
      <div className="w-full pt-24 mx-auto min-h-screen">
        <div
          className="
          font-[eigerdals] 
          dark:text-white text-center 
          text-[40px] md:text-[75px] 
          font-bold pt-6
        "
        >
          Leaderboard
        </div>
        <div className="w-full flex justify-center pb-4">
          <div
            className="font-quicksand 
            dark:text-white text-center 
            w-[300px] xs:w-[350px] md:w-[430px] 
            text-[13px] xs:text-[15px] md:text-[18px] 
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] 
            font-[500]"
          >
            Currently Tracking: Referral Program Rewards
            <br /> Mint with your referral link to join the leaderboard
          </div>
        </div>
        <div className="md:px-4 w-full flex justify-center">
          <div
            className="w-[310px] xs:w-[370px] md:w-full 
            border-[2px] border-[black] border-solid
            max-h-[470px] rounded-lg 
            overflow-auto 
            shadow-[4px_4px_4px_rgb(0,0,0,0.25)] dark:shadow-[4px_4px_4px_rgb(255,255,255,0.25)]
            scrollbar scrollbar-thumb-[black] 
            scrollbar-track-white 
            scrollbar-thumb-rounded-full"
          >
            <table className="w-full font-quicksand bg-white">
              <thead className="border-b-[2px] border-black border-solid">
                <tr>
                  <th
                    className="p-[5px] md:p-4 
                    text-left border-r-[2px] 
                    border-black text-center
                    uppercase 
                    text-[8px] xs:text-[11px] md:text-[18px]
                    md:min-w-[100px]"
                  >
                    Rank
                  </th>
                  <th
                    className="p-[5px] md:p-4 
                    text-left border-r-[2px] 
                    border-black text-center 
                    uppercase 
                    text-[8px] xs:text-[11px] md:text-[18px]
                    w-[100px] xs:!w-[130px] md:!w-[200px]"
                  >
                    Cre8or
                  </th>
                  <th
                    className="p-[5px] md:p-4 
                    text-left border-r-[2px] 
                    border-black text-center 
                    uppercase 
                    text-[8px] xs:text-[11px] md:text-[18px]"
                  >
                    Earned
                  </th>
                  <th
                    className="p-[5px] md:p-4 
                    text-left text-center 
                    uppercase 
                    text-[8px] xs:text-[11px] md:text-[18px]"
                  >
                    Twitter
                  </th>
                </tr>
              </thead>
              {collectors.length > 0 ? (
                <tbody>
                  {collectors.map((collector, index) => (
                    <LeaderboardRow
                      key={collector.walletAddress}
                      address={collector.walletAddress}
                      cre8orNumber={collector.cre8orsNumber}
                      twitterHandle={collector.twitterHandle}
                      totalReferralFeeEarned={collector.totalReferralFeeEarned}
                      pfpImage={collector.pfpImage}
                      rank={index + 1}
                    />
                  ))}
                </tbody>
              ) : (
                <SkeletonTableBody />
              )}
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LeaderboardPage
