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

export default function MiscItemDialog() {
  const MiscItemDialog = useSelector((state) =>
    get(state, "local.dialogs.miscItem", {})
  );
  const currentStaff = useSelector((state) => state.local.currentStaff);
  const cart = useSelector((state) => state.local.cart);
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState(null);

  const dispatch = useDispatch();
  return (
    <Dialog
      open={Boolean(MiscItemDialog)}
      fullWidth
      maxWidth="xs"
      onClose={() => dispatch(closeDialog("miscItem"))}
    >
      <CloseDialogButton dialog="miscItem" />
      <div className="dialog-action__title">New Misc. Item</div>
      <div className="dialog-action__body">
        <TextField
          inputLabel="Amount"
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          error={amount && isNaN(parseFloat(amount))}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <button
          className="dialog-action__ok-button mb-8"
          disabled={isNaN(parseFloat(amount))}
          onClick={() => {
            const uid = get(cart, "uid", null) ? cart.uid : uuid();
            addLog(
              `New misc. amount added to sale.`,
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
                  [uuid()]: {
                    miscItem: true,
                    amount: parseFloat(amount),
                    description,
                  },
                },
              })
            );
            dispatch(
              setAlert({
                type: "success",
                message: "MISC. ITEM ADDED",
              })
            );
            dispatch(closeDialog("miscItem"));
          }}
        >
          Add Misc. Item to Sale
        </button>
      </div>
    </Dialog>
  );
}
