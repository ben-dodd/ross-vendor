import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  console.log(req.body);
  const { transaction_id } = req.body;
  try {
    const results = await query(
      // `
      // DELETE FROM sale_item WHERE sale_id = ? AND transaction_id = ?
      // `,
      `
      UPDATE sale_transaction SET is_deleted = 1 WHERE id = ?
      `,
      [transaction_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;