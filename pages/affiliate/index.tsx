import { GetServerSideProps } from "next"
import AffiliatePage from "../../components/AffiliatePage"

interface LinkProps {
  origin: string
}

export const getServerSideProps: GetServerSideProps<LinkProps> = async ({ req }) => {
  const protocol = req.headers["x-forwarded-proto"] || "http"
  const host = req.headers["x-forwarded-host"] || req.headers.host
  const domain = `${protocol}://${host}`

  return {
    props: {
      origin: domain,
    },
  }
}

const Affiliate = ({ origin }) => <AffiliatePage origin={origin} />

export default Affiliate
