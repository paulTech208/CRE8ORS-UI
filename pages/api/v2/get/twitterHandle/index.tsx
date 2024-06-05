import { Query, createHandler, Get } from "next-api-decorators"
import { getTwitterHandle } from "../../../../../helpers/userProfile.db"

class GetTwitterHandle {
  @Get()
  async get(@Query("walletAddress") walletAddress: string) {
    const doc = await getTwitterHandle(walletAddress)
    return doc?.twitterHandle
  }
}

export default createHandler(GetTwitterHandle)
