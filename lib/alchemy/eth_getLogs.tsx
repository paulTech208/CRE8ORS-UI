import axios from "axios"
import getAlchemyBaseUrl from "./getAlchemyBaseUrl"

export const ethGetLogs = async (chainId, contractAddress, topics) => {
  const endpoint = `${getAlchemyBaseUrl(chainId)}v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

  const payload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: "0x1",
        toBlock: "latest",
        address: contractAddress,
        topics,
      },
    ],
  }

  try {
    const response = await axios.post(endpoint, payload)
    const logs = response.data.result

    return logs
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching logs:", err)
    return []
  }
}
