import { useAtom } from "jotai";
import {
  showCartAtom,
  showSaleScreenAtom,
  showHoldAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { useSwipeable } from "react-swipeable";

import SearchBar from "./sell-search-bar";
import InventoryScroll from "./inventory-scroll";
import ShoppingCart from "./shopping-cart";
import HoldScreen from "./hold-screen";
import CreateContactScreen from "./create-contact-screen";
import SaleScreen from "./sale-screen";

export default function SellScreen() {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [showSaleScreen, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const [showHold, setShowHold] = useAtom(showHoldAtom);
  const [showCreateContact, setShowCreateContact] = useAtom(
    showCreateContactAtom
  );
  const handlers = useSwipeable({
    onSwipedRight: () =>
      showSaleScreen
        ? setShowSaleScreen(false)
        : showCreateContact?.id
        ? setShowCreateContact({ id: 0 })
        : showHold
        ? setShowHold(false)
        : showCart
        ? setShowCart(false)
        : null,
    onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="flex relative overflow-x-hidden" {...handlers}>
      <div className={`bg-blue-200 w-full sm:w-2/3`}>
        <SearchBar />
        <InventoryScroll />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showCart ? "left-0" : "left-full"
        } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
      >
        <ShoppingCart />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showHold ? "left-0 sm:left-2/3" : "left-full"
        } h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
      >
        <HoldScreen />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showCreateContact?.id ? "left-0 sm:left-2/3" : "left-full"
        } h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
      >
        <CreateContactScreen />
      </div>
      <div
        className={`absolute top-0 transition-offset duration-300 ${
          showSaleScreen ? "left-0" : "left-full"
        } h-full w-full bg-yellow-200 sm:h-menu`}
      >
        <SaleScreen />
      </div>
    </div>
  );
}
