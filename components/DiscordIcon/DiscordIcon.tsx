import Image from "next/image"
import { useRouter } from "next/router"
import { useTheme } from "../../providers/ThemeProvider"

const DiscordIcon = () => {
  const { themeMode } = useTheme()
  const router = useRouter()

  const isMintPage = router.pathname.includes("/mint")

  return (
    <a href="https://discord.gg/ZpZBHCrqHQ" target="_blank" rel="noreferrer">
      <div>
        <div className="pt-2 cursor-pointer md:hidden block">
          <Image
            src={`${
              themeMode === "dark" && !isMintPage
                ? "/assets/Header/discord.png"
                : "/assets/Header/white_discord.png"
            }`}
            width={24}
            height={19}
            alt="discord"
          />
        </div>
        <div className="cursor-pointer md:block hidden">
          <Image
            src={`${
              themeMode === "dark" && !isMintPage
                ? "/assets/Header/white_discord.png"
                : "/assets/Header/discord.png"
            }`}
            width={24}
            height={19}
            alt="discord"
          />
        </div>
      </div>
    </a>
  )
}

export default DiscordIcon
