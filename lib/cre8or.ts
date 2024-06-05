/* eslint-disable no-plusplus */
import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall"
import getNFTs from "./alchemy/getNFTs"
import getDefaultProvider from "./getDefaultProvider"
import { getIsLocked } from "./lockup"
import cre8orAbi from "./abi-cre8ors.json"

export const getCre8ors = async (address: string) => {
  const res = await getNFTs(
    address,
    process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS,
    process.env.NEXT_PUBLIC_TESTNET ? 5 : 1,
  )
  return res?.ownedNfts
}

export const getLockedCount = async (address: string) => {
  const response = await getCre8ors(address)
  let count: number = 0
  for (let i = 0; i < response.length; i++) {
    if (response[i]?.id?.tokenId) {
      // eslint-disable-next-line no-await-in-loop
      const isLocked = await getIsLocked(response[i]?.id?.tokenId)
      if (isLocked) count++
    }
  }

  return count
}

export const aggregateReads = async (cre8orNumbers: Array<number | string>) => {
  const calls = cre8orNumbers.map((tokenId) => ({
    reference: "ownerOf",
    methodName: "ownerOf",
    methodParameters: [tokenId],
  }))

  const multicall = new Multicall({
    ethersProvider: getDefaultProvider(process.env.NEXT_PUBLIC_TESTNET ? 5 : 1),
    tryAggregate: true,
  })

  const contractCallContext: ContractCallContext[] = []

  if (calls.length > 0) {
    contractCallContext.push({
      reference: "ownerOf",
      contractAddress: process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS,
      abi: cre8orAbi,
      calls,
    })
  }
  const results: ContractCallResults = await multicall.call(contractCallContext)
  return results
}

export const getOwnersofCre8ors = async (cre8orNumbers: Array<number | string>) => {
  const results = await aggregateReads(cre8orNumbers)

  const owners = results?.results?.ownerOf?.callsReturnContext.map((call) => call.returnValues[0])

  return owners
}
