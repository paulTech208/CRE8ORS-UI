import axios from "axios"

const getTwitterHandleByAddress = async (address: string) => {
  const response = await axios.get(`/api/v2/get/twitterHandle?walletAddress=${address}`)
  return response.data
}

export default getTwitterHandleByAddress
