import { StockMovementTypes } from '@/lib/types'
import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    const results = await query(
      `
      SELECT
        s.id,
        s.vendor_id,
        s.artist,
        s.title,
        s.display_as,
        s.media,
        s.format,
        s.section,
        s.country,
        s.is_new,
        s.cond,
        s.image_url,
        s.is_gift_card,
        s.gift_card_code,
        s.gift_card_amount,
        s.gift_card_remaining,
        s.gift_card_is_valid,
        s.is_misc_item,
        s.misc_item_description,
        s.misc_item_amount,
        s.needs_restock,
        p.vendor_cut,
        p.total_sell,
        q.quantity,
        hol.quantity_hold,
        lay.quantity_layby,
        sol.quantity_sold
      FROM stock AS s
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement WHERE NOT is_deleted GROUP BY stock_id) AS q
        ON q.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Hold}' OR act = '${StockMovementTypes.Unhold}') GROUP BY stock_id) AS hol
        ON hol.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Layby}' OR act='${StockMovementTypes.Unlayby}') GROUP BY stock_id) AS lay
        ON lay.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Sold}' OR act = '${StockMovementTypes.Unsold}') GROUP BY stock_id) AS sol
        ON sol.stock_id = s.id
      LEFT JOIN stock_price AS p ON p.stock_id = s.id
      WHERE
         (p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = s.id
         ) OR s.is_gift_card OR s.is_misc_item)
      AND s.is_deleted = 0
      AND vendor_id = (
        SELECT id FROM vendor WHERE uid = ?
        )
      `,
      uid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
