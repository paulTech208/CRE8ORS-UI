import { UpdateCre8orNumberDTO } from "../DTO/updateCre8orNumber.dto"
import UserProfile from "../Models/UserProfile"
import { getEnsImageURL } from "../lib/getEnsImageURL"
import getIpfsLink from "../lib/getIpfsLink"
import getMetadata from "../lib/getMetadata"
import dbConnect from "../utils/db"
import ownerOf from "../lib/ownerOf"
import { isMatchAddress } from "../lib/isMatchAddress"
import getNFTs from "../lib/alchemy/getNFTs"

export interface UserProfile {
  walletAddress: string
  username?: string
  bio?: string
  twitterHandle?: string
  location?: string
  iNeedHelpWith?: string
  askMeAbout?: string
}

const getFilterObject = (value) => ({
  $regex: value,
  $options: "i"
})

const updateAvailableCre8orNumber = async (walletAddress: string, _id: string, avatarUrl: string) => {
  let availableCre8orNumber: any = "";
  let newAvatarUrl = avatarUrl;

  const cre8ors = await getNFTs(
    walletAddress,
    process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS,
    process.env.NEXT_PUBLIC_TESTNET ? 5 : 1,
  )
  if (cre8ors.ownedNfts.length) {
    availableCre8orNumber = parseInt(cre8ors.ownedNfts[cre8ors.ownedNfts.length - 1].id.tokenId, 16)
    const metadata = getMetadata(availableCre8orNumber, false)
    newAvatarUrl = getIpfsLink(metadata.image)
  }

  const doc = await UserProfile.findOneAndUpdate({_id}, { cre8orNumber: availableCre8orNumber, avatarUrl: newAvatarUrl }) 

  return doc
}

const getUserAvatar = async (walletAddress: string, cre8orNumber: string) => {
  const ensImageURL = await getEnsImageURL(walletAddress)
  const metadata = getMetadata(parseInt(cre8orNumber, 10), false)
  const avatarUrl = getIpfsLink(metadata.image)

  return avatarUrl || ensImageURL || ""
}

export const userNameExists = async (username: string) => {
  try {
    await dbConnect()
    const doc = await UserProfile.countDocuments({ username })
    if (doc > 0) {
      return true
    }
    return false
  } catch (e) {
    throw new Error(e)
  }
}

export const userProfileExists = async (walletAddress: string) => {
  try {
    await dbConnect()
    const doc = await UserProfile.countDocuments({ walletAddress: getFilterObject(walletAddress) })
    if (doc > 0) {
      return true
    }
    return false
  } catch (e) {
    throw new Error(e)
  }
}

export const addUserProfile = async (body: UserProfile) => {
  try {
    await dbConnect()

    const isExists = await userProfileExists(body.walletAddress)

    if(isExists) {
      throw new Error("User profile already existed!")
    }

    const avatarUrl = await getUserAvatar(body.walletAddress, body.twitterHandle)

    const result = await UserProfile.create({
      ...body,
      walletAddress: body.walletAddress?.toLowerCase(),
      avatarUrl
    })

    return { success: true, result }
  } catch (e) {
    throw new Error(e)
  }
}

export const updateUserProfile = async (body: UserProfile) => {
  try {
    await dbConnect()

    const doc = await UserProfile.findOne({ walletAddress: getFilterObject(body.walletAddress) }).lean()
    if (!doc) {
      throw new Error("No user found")
    }
    
    const newProfile = {
      ...body,
      avatarUrl: doc.avatarUrl
    }

    if((doc.twitterHandle !== body.twitterHandle) || (doc.twitterHandle && !newProfile.avatarUrl)) {
      const avatarUrl = await getUserAvatar(body.walletAddress, body.twitterHandle)

      newProfile.avatarUrl = avatarUrl
    }
    
    const results = await UserProfile.findOneAndUpdate({ walletAddress: getFilterObject(body.walletAddress) }, newProfile)

    return { success: true, results }
  } catch (e) {
    throw new Error(e)
  }
}

export const updateUserCre8orNumber = async (body: UpdateCre8orNumberDTO) => {
  try {
    const { cre8orNumber, walletAddress } = body
    
    await dbConnect()

    const doc = await UserProfile.findOne({ walletAddress: getFilterObject(walletAddress) }).lean()
    
    if (!doc) {
      throw new Error("No user found")
    }
    
    const metadata = getMetadata(parseInt(cre8orNumber, 10), false)
    const avatarUrl = getIpfsLink(metadata.image)

    const newProfile = {
      cre8orNumber,
      avatarUrl
    }

    const results = await UserProfile.findOneAndUpdate({ walletAddress: getFilterObject(walletAddress) }, newProfile)

    return { success: true, results }
  } catch (e) {
    throw new Error(e)
  }
}
export const getUserProfile = async (walletAddress: string) => {
  try {
    await dbConnect()

    let doc = await UserProfile.findOne({ walletAddress: getFilterObject(walletAddress) }).lean()

    if (doc) {
      if (doc?.cre8orNumber) {
        const owner = await ownerOf(doc.cre8orNumber)
        if (!isMatchAddress(owner, walletAddress)) doc = await updateAvailableCre8orNumber(walletAddress, doc._id, doc.avatarUrl)
      } else doc = await updateAvailableCre8orNumber(walletAddress, doc._id, doc.avatarUrl)
    }

    return { success: true, doc }
  } catch (e) {
    throw new Error(e)
  }
}

export const getSimilarProfiles = async (walletAddress: string) => {
  try {
    await dbConnect()
    const userProfile = await UserProfile.findOne({walletAddress: getFilterObject(walletAddress)}).lean()
   
    if (!userProfile?.location) return { success:true, similarProfiles: [] } 

    const pipline = [
      {
        $project: {
          location: 1,
          twitterHandle: 1,
          avatarUrl: 1,
          username: 1,
          iNeedHelpWith: 1,
          askMeAbout: 1,
          walletAddress: { $toLower: '$walletAddress' },
        },
      },
      {
        $match: {
          walletAddress: { $ne: walletAddress?.toLowerCase() },
          location: userProfile.location,
        }
      },
    ]

    const doc = await UserProfile.aggregate(pipline)

    return { success: true, similarProfiles: doc }
  } catch(e) {
    throw new Error(e)  
  }
}

export const getTwitterHandle = async (walletAddress: string) => {
  try {
    await dbConnect()

    let doc = await UserProfile.findOne({ walletAddress: getFilterObject(walletAddress) }).lean() 

    return doc
  } catch (e) {
    throw new Error(e)
  }
}
