import { ethers } from "ethers"
import Media from "../../shared/Media"

const LeaderboardRow = ({
  address,
  cre8orNumber,
  rank,
  twitterHandle,
  totalReferralFeeEarned,
  pfpImage,
}) => (
  <tr key={address} className="text-center bg-white hover:bg-blue-300">
    <td
      className="text-[8px] xs:text-[11px] md:text-[16px]
        p-[5px] md:px-4 md:py-2 border-r-2 border-black"
    >
      #{rank}
    </td>
    <td
      className="text-[8px] text-[11px] md:text-[16px]
        p-[5px] md:px-4 md:py-2 border-r-2 border-black"
    >
      <div className="flex items-center gap-x-[5px] justify-center">
        <Media
          type="image"
          link={pfpImage}
          blurLink={pfpImage}
          containerClasses="w-[20px] h-[20px] rounded-[4px] overflow-hidden"
        />
        {cre8orNumber}
      </div>
    </td>
    <td
      className="text-[8px] text-[11px] md:text-[16px]
        p-[5px] md:px-4 md:py-2 border-r-2 border-black"
    >
      {ethers.utils.formatEther(totalReferralFeeEarned)} ETH
    </td>
    <td
      className="text-[8px] text-[11px] md:text-[16px]
        p-[5px] md:px-4 md:py-2"
    >
      {twitterHandle ? (
        <a href={`https://twitter.com/${twitterHandle}`} target="_blank" rel="noreferrer">
          {twitterHandle}
        </a>
      ) : (
        "Not Connected"
      )}
    </td>
  </tr>
)

export default LeaderboardRow
