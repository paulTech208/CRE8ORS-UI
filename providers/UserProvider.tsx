import {
  useContext,
  createContext,
  ReactNode,
  FC,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { getSimilarProfiles, getUserInfo } from "../lib/userInfo"
import getMetadata from "../lib/getMetadata"
import isSmartWalletRegistered from "../lib/isSmartWalletRegistered"
import getSmartWallet from "../lib/getSmartWallet"
import { ethers, getDefaultProvider } from "ethers"

interface attribute {
  value?: string
  trait_type?: string
}

interface metadata {
  attributes?: attribute[]
  description?: string
  image?: string
  name?: string
}

interface userProps {
  getSmartWalletAddress: () => Promise<void>
  getSmartWalletBalance: () => Promise<void>
  getUserData: (address?: string) => Promise<void>
  getUserSimilarProfiles: (address?: string) => Promise<void>
  userInfo: any
  similarProfiles: any
  metaData: metadata
  cre8orNumber: any
  smartWalletAddress: any
  smartWalletBalance: any
}

interface Props {
  children: ReactNode
}

const UserContext = createContext<Partial<userProps> | null>(null)

export const UserProvider: FC<Props> = ({ children }) => {
  const router = useRouter()
  const routerAddress = router.query.address as string

  const isProfilePage = router.pathname.includes("/profile")

  const { address } = useAccount()
  const [smartWalletBalance, setSmartWalletBalance] = useState(0)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [metaData, setMetaData] = useState<any>(null)
  const [similarProfiles, setSimilarProfiles] = useState<any>([])
  const [cre8orNumber, setCre8orNumber] = useState(null)
  const [smartWalletAddress, setSmartWalletAddress] = useState(null)
  const chainProvider = useMemo(
    () => getDefaultProvider(process.env.NEXT_PUBLIC_TESTNET ? 5 : 1),
    [],
  )

  const getSmartWalletAddress = useCallback(async () => {
    if (!chainProvider || !cre8orNumber) return
    const walletAddress = await getSmartWallet(cre8orNumber)
    const code = await chainProvider.getCode(walletAddress)
    setSmartWalletAddress(code !== "0x" ? walletAddress : "")
    if (code !== "0x") {
      const balance = await chainProvider.getBalance(walletAddress)
      setSmartWalletBalance(parseFloat(ethers.utils.formatEther(balance)))
    }
  }, [cre8orNumber, chainProvider])

  const getSmartWalletBalance = useCallback(async () => {
    if (!chainProvider || !smartWalletAddress) return
    const balance = await chainProvider.getBalance(smartWalletAddress)
    setSmartWalletBalance(parseFloat(ethers.utils.formatEther(balance)))
  }, [smartWalletAddress])

  const getUserSimilarProfiles = useCallback(
    async (walletAddress?: string) => {
      if (walletAddress || address) {
        const data: any = await getSimilarProfiles(walletAddress || address)

        if (!data?.similarProfiles.length) return setSimilarProfiles([])

        return setSimilarProfiles(data?.similarProfiles)
      }

      return setUserInfo(null)
    },
    [address],
  )

  const getUserData = useCallback(
    async (walletAddress?: string) => {
      if (walletAddress || address) {
        const info: any = await getUserInfo(walletAddress || address)

        if (!info?.doc) {
          setUserInfo(null)
          setCre8orNumber("")
          setSmartWalletAddress("")
          if (isProfilePage) router.push("/save-profile")
          return null
        }

        if (info?.doc.cre8orNumber) {
          setCre8orNumber(info?.doc.cre8orNumber)
          setUserInfo(info.doc)
        } else {
          setCre8orNumber("")
          setSmartWalletAddress("")
          setUserInfo(null)
        }

        return
      }

      return setUserInfo(null)
    },
    [address],
  )

  const getUserMetaData = useCallback(async () => {
    if (cre8orNumber) {
      const tokenId = parseInt(cre8orNumber, 10)
      const useIframe = isSmartWalletRegistered(tokenId)
      const newMetadata: any = await getMetadata(tokenId, useIframe)

      setMetaData(newMetadata)
    }
  }, [cre8orNumber])

  useEffect(() => {
    getUserMetaData()
  }, [getUserMetaData])

  useEffect(() => {
    if (!routerAddress) {
      getUserData()
    }
  }, [getUserData, routerAddress])

  useEffect(() => {
    getSmartWalletAddress()
  }, [getSmartWalletAddress])

  const provider = useMemo(
    () => ({
      smartWalletBalance,
      smartWalletAddress,
      similarProfiles,
      userInfo,
      getUserData,
      getUserSimilarProfiles,
      getSmartWalletAddress,
      getSmartWalletBalance,
      metaData,
      cre8orNumber,
    }),
    [
      smartWalletBalance,
      smartWalletAddress,
      similarProfiles,
      userInfo,
      metaData,
      getUserData,
      getUserSimilarProfiles,
      getSmartWalletAddress,
      getSmartWalletBalance,
    ],
  )

  return <UserContext.Provider value={provider}>{children}</UserContext.Provider>
}

export const useUserProvider = () => useContext(UserContext)
