import _ from "lodash"
import { Button } from "../../shared/Button"
import Checkbox from "../../shared/Checkbox"
import Media from "../../shared/Media"

const BuyCre8orButton = ({ hasCre8or }) => (
  <div className="flex gap-x-[15px] w-[280px] items-center">
    <Button
      id="buy_cre8or"
      onClick={() => window.open("/mint", "_blank")}
      className={`!p-0
      w-[240px] h-[46px]
      ${_.isNull(hasCre8or) ? "cursor-not-allowed !bg-[gray]" : ""}`}
      disabled={_.isNull(hasCre8or)}
    >
      Buy Cre8or
    </Button>
    {_.isNull(hasCre8or) ? (
      <Media
        type="image"
        link="/assets/Common/loading.svg"
        blurLink="/assets/Common/loading.svg"
        containerClasses="w-[25px] h-[25px]"
      />
    ) : (
      <Checkbox id="owned_cre8or" checked={hasCre8or} readOnly />
    )}
  </div>
)

export default BuyCre8orButton
