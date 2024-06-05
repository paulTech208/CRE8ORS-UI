import { CRE8OR } from "../components/ProfilePage/types"
import getNFTs from "./alchemy/getNFTs"
import { isMatchAddress } from "./isMatchAddress"

export const SPECIALNFTS = "special"
export const ALLNFTS = "all"

const getProfileFormattedCollection = async (address, type) => {
  const collection = []

  if (type === SPECIALNFTS) {
    const [cre8ors, passport, dnas] = await Promise.all([
      getNFTs(
        address,
        process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS,
        process.env.NEXT_PUBLIC_TESTNET ? 5 : 1,
      ),
      getNFTs(
        address,
        process.env.NEXT_PUBLIC_CLAIM_PASSPORT_ADDRESS,
        process.env.NEXT_PUBLIC_TESTNET ? 5 : 1,
      ),
      getNFTs(
        address,
        process.env.NEXT_PUBLIC_DNA_ADDRESS,
        process.env.NEXT_PUBLIC_TESTNET ? 5 : 1,
      ),
    ])
    collection.push(...cre8ors.ownedNfts, ...passport.ownedNfts, ...dnas.ownedNfts)
  }
  if (type === ALLNFTS) {
    const response = await getNFTs(address, null, process.env.NEXT_PUBLIC_TESTNET ? 5 : 1)
    collection.push(...response.ownedNfts)
  }

  const formattedData = collection.map((nft) => ({
    label: nft.metadata.name,
    type: isMatchAddress(nft.contract.address, process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS)
      ? CRE8OR
      : undefined,
    image: nft.media[0].gateway,
    tokenId: parseInt(nft.id.tokenId, 16),
    contractAddress: nft.contract.address,
  }))

  return formattedData
}

export default getProfileFormattedCollection
