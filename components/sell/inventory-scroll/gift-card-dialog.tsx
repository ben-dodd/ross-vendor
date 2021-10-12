import { useState } from "react";

// Actions
import { setAlert, updateLocal, closeDialog } from "../../store/actions";
import { addLog } from "../../helpers/data";
import get from "lodash/get";
import uuid from "uuid/v4";

// Store
import { useDispatch, useSelector } from "react-redux";

// Material UI Components
import Modal from "@/components/modal"
import TextField from "@/components/inputs/text-field";
import CloseButton from "@/components/button/close-button";

// Material UI Icons
import SyncIcon from "@mui/icons-material/Sync";

export default function GiftCardDialog() {
  const giftCardDialog = useSelector((state) =>
    get(state, "local.dialogs.giftCard", {})
  );
  const currentStaff = useSelector((state) => state.local.currentStaff);
  const cart = useSelector((state) => state.local.cart);
  const giftCards = useSelector((state) => state.local.giftCards);
  const [giftCard, setGiftCard] = useState({ amount: 20 });
  const [giftCardCode, setGiftCardCode] = useState(
    makeGiftCardCode(giftCards ? Object.keys(giftCards) : [])
  );

  const dispatch = useDispatch();
  return (
    <Dialog
      open={Boolean(giftCardDialog)}
      fullWidth
      maxWidth="xs"
      onClose={() => dispatch(closeDialog("giftCard"))}
    >
      <CloseDialogButton dialog="giftCard" />
      <div className="dialog-action__title">New Gift Card</div>
      <div className="dialog-action__body">
        <div className="flex justify-between items-center">
          <div className="text-8xl text-red-800 font-mono">{giftCardCode}</div>
          <button
            className="icon-button-small-mid"
            onClick={() =>
              setGiftCardCode(
                makeGiftCardCode(giftCards ? Object.keys(giftCards) : [])
              )
            }
          >
            <SyncIcon />
          </button>
        </div>
        <TextField
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={get(giftCard, "amount", 0)}
          error={
            get(giftCard, "amount") &&
            isNaN(parseFloat(get(giftCard, "amount")))
          }
          onChange={(e) => setGiftCard({ ...giftCard, amount: e.target.value })}
        />
        <TextField
          inputLabel="Notes"
          value={get(giftCard, "notes", "")}
          onChange={(e) => setGiftCard({ ...giftCard, notes: e.target.value })}
          multiline
          rows={3}
        />
        <button
          className="dialog-action__ok-button mb-8"
          disabled={isNaN(parseFloat(get(giftCard, "amount")))}
          onClick={() => {
            const uid = get(cart, "uid", null) ? cart.uid : uuid();
            addLog(
              `New gift card [${giftCardCode}] made.`,
              "sales",
              uid,
              currentStaff
            );
            dispatch(
              updateLocal("cart", {
                dateSaleOpened: get(cart, "dateSaleOpened")
                  ? cart.dateSaleOpened
                  : new Date(),
                uid,
                saleOpenedBy: get(
                  get(cart, "saleOpenedBy", currentStaff),
                  "id",
                  null
                ),
                items: {
                  ...cart.items,
                  [giftCardCode]: {
                    giftCard: true,
                    initial: parseFloat(get(giftCard, "amount", 0)),
                    code: giftCardCode,
                  },
                },
              })
            );
            dispatch(
              setAlert({
                type: "success",
                message: "GIFT CARD CREATED",
              })
            );
            setGiftCard(null);
            dispatch(closeDialog("giftCard"));
          }}
        >
          Create Gift Card
        </button>
      </div>
    </Dialog>
  );
}

function makeGiftCardCode(usedIds) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  let result = "";
  while (result === "" || usedIds.includes(result)) {
    result = "";
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }

  return result;
}
