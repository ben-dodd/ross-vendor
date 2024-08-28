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
        CONCAT(LPAD(s.vendor_id, 3, '0'), '/', LPAD(s.id, 5, '0')) AS sku, -- Add SKU
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
        s.date_created,
        p.vendor_cut,
        p.total_sell,
        p.total_sell - p.vendor_cut AS store_cut, -- Calculate store_cut
        (p.vendor_cut / p.total_sell) * 100 AS margin, -- Calculate margin
        q.quantity,
        hol.quantity_hold * -1 AS quantity_hold, -- Adjust quantity_hold
        lay.quantity_layby * -1 AS quantity_layby, -- Adjust quantity_layby
        sol.quantity_sold * -1 AS quantity_sold -- Adjust quantity_sold
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
         p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = s.id
         )
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
