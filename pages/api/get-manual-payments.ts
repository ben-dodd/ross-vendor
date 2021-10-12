import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { register_id } = req.query;
  try {
    const results = await query(
      `
      SELECT date, amount, clerk_id, vendor_id
      FROM vendor_payment
      WHERE register_id = ${register_id} AND type = 'cash'
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
