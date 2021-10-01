import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const { sale_id, contact_id, state, note } = req.body;
  try {
    const results = await query(
      `
      UPDATE sale
      SET
        contact_id = ${contact_id || null},
        state = ${state ? `"${state}"` : null},
        note = ${escape(note)}
      WHERE id = ${sale_id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
