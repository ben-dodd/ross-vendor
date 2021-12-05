import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    id,
    close_amount,
    closed_by_id,
    close_petty_balance,
    close_cash_given,
    close_manual_payments,
    close_expected_amount,
    close_discrepancy,
    close_note,
    close_till_id,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
        UPDATE register
        SET
          close_amount=${close_amount || null},
          closed_by_id=${closed_by_id || null},
          close_petty_balance=${close_petty_balance || null},
          close_cash_given=${close_cash_given || null},
          close_manual_payments=${close_manual_payments || null},
          close_expected_amount=${close_expected_amount || null},
          close_discrepancy=${close_discrepancy || null},
          close_note=${escape(close_note)},
          close_till_id=${close_till_id || null}
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
