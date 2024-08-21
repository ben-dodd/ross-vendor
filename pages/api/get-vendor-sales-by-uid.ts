import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    const results = await query(
      `
      SELECT
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.is_refunded,
        sale_item.store_discount,
        sale_item.vendor_discount,
        sale.date_sale_closed,
        stock.vendor_id,
        stock_price.vendor_cut,
        stock_price.total_sell,
        (stock_price.total_sell - stock_price.vendor_cut) AS store_cut, -- Added field
        stock.artist,
        stock.title,
        stock.format,
        stock_item_details.quantity AS stock_quantity
      FROM sale_item
      LEFT JOIN stock
        ON sale_item.item_id = stock.id
      LEFT JOIN sale
        ON sale.id = sale_item.sale_id
      LEFT JOIN stock_price
        ON stock_price.stock_id = stock.id
        AND stock_price.date_valid_from = (
          SELECT MAX(sp.date_valid_from)
          FROM stock_price sp
          WHERE sp.stock_id = stock.id
          AND sp.date_valid_from <= sale.date_sale_closed
        )
      LEFT JOIN (
        SELECT
          s.id,
          s.artist,
          s.title,
          s.format,
          q.quantity
        FROM stock s
        LEFT JOIN (
          SELECT stock_id, SUM(quantity) AS quantity
          FROM stock_movement
          WHERE NOT is_deleted
          GROUP BY stock_id
        ) AS q
        ON q.stock_id = s.id
      ) AS stock_item_details
      ON stock_item_details.id = stock.id
      WHERE sale.state = 'completed'
      AND NOT sale.is_deleted
      AND NOT sale_item.is_deleted
      AND stock.vendor_id = (
        SELECT id FROM vendor WHERE uid = ?
      )
      ORDER BY sale.date_sale_closed DESC
      `,
      uid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
