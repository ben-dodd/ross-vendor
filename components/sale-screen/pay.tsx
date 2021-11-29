// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useClerks,
  useCustomers,
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useInventory,
} from "@/lib/swr-hooks";
import {
  saleObjectAtom,
  viewAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import { CustomerObject, OpenWeatherObject, SaleStateTypes } from "@/lib/types";

// Functions
import {
  convertMPStoKPH,
  convertDegToCardinal,
  getSaleVars,
  fDateTime,
} from "@/lib/data-functions";

// Components
import CreateableSelect from "@/components/_components/inputs/createable-select";
import TextField from "@/components/_components/inputs/text-field";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

import DeleteIcon from "@mui/icons-material/Delete";
import RefundIcon from "@mui/icons-material/Payment";
import ReturnIcon from "@mui/icons-material/KeyboardReturn";
import SplitIcon from "@mui/icons-material/CallSplit";

export default function Pay() {
  // Atoms
  const [sale, setSale] = useAtom(saleObjectAtom);
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom);
  const [view, setView] = useAtom(viewAtom);

  // SWR
  const { clerks } = useClerks();
  const { customers } = useCustomers();
  const { items } = useSaleItemsForSale(sale?.id);
  const { transactions } = useSaleTransactionsForSale(sale?.id);
  const { inventory } = useInventory();

  // State
  const [note, setNote] = useState("");
  const { totalRemaining, totalPaid } = getSaleVars(
    items,
    transactions,
    inventory
  );
  const [isRefund, setIsRefund] = useState(false);

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0
              ? "text-primary"
              : totalRemaining < 0
              ? "text-secondary"
              : "text-tertiary"
          }`}
        >
          {sale?.state === SaleStateTypes.Completed
            ? "SALE COMPLETED"
            : totalRemaining === 0
            ? "ALL PAID"
            : totalRemaining < 0
            ? "CUSTOMER OWED"
            : "LEFT TO PAY"}
        </div>
        <div className="text-2xl text-red-500 font-bold text-xl">
          {totalRemaining === 0
            ? ""
            : totalRemaining < 0
            ? `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`
            : `$${(totalRemaining || 0)?.toFixed(2)}`}
        </div>
      </div>
      {totalRemaining === 0 && (
        <div className="font-sm">Click complete sale to finish.</div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          className="square-button"
          onClick={() => setView({ ...view, cashPaymentDialog: true })}
        >
          CASH
        </button>
        <button
          className="square-button"
          onClick={() => setView({ ...view, cardPaymentDialog: true })}
        >
          CARD
        </button>
        <button
          className="square-button"
          onClick={() => setView({ ...view, acctPaymentDialog: true })}
        >
          ACCT
        </button>
        <button
          className="square-button"
          onClick={() => setView({ ...view, giftPaymentDialog: true })}
        >
          GIFT
        </button>
      </div>
      {sale?.state === SaleStateTypes.Layby ? (
        <div className="mt-2">
          {sale?.customer_id ? (
            <div>
              <div className="font-bold">Customer</div>
              <div>
                {customers?.filter(
                  (c: CustomerObject) => c?.id === sale?.customer_id
                )[0]?.name || ""}
              </div>
            </div>
          ) : (
            <div>No customer set.</div>
          )}
        </div>
      ) : (
        <>
          <div className="font-bold mt-2">
            Select customer to enable laybys.
          </div>
          <CreateableSelect
            inputLabel="Select customer"
            value={sale?.customer_id}
            label={
              customers?.filter(
                (c: CustomerObject) => c?.id === sale?.customer_id
              )[0]?.name || ""
            }
            onChange={(customerObject: any) => {
              setSale((s) => ({
                ...s,
                customer_id: parseInt(customerObject?.value),
              }));
            }}
            onCreateOption={(inputValue: string) => {
              setCustomer({ name: inputValue });
              setView({ ...view, createCustomer: true });
            }}
            options={customers?.map((val: CustomerObject) => ({
              value: val?.id,
              label: val?.name || "",
            }))}
          />
        </>
      )}
      <TextField
        inputLabel="Note"
        multiline
        value={note}
        onChange={(e: any) => setNote(e.target.value)}
      />
      <div className="grid grid-cols-2">
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, returnItemDialog: true })}
        >
          <ReturnIcon className="mr-1" /> Refund Items
        </button>
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, refundPaymentDialog: true })}
          disabled={totalPaid <= 0}
        >
          <RefundIcon className="mr-1" /> Refund Payment
        </button>
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, splitSaleDialog: true })}
        >
          <SplitIcon className="mr-1" /> Split Sale
        </button>
        <button className="icon-text-button">
          <DeleteIcon className="mr-1" /> Delete Sale
        </button>
      </div>
    </div>
  );
}

// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
