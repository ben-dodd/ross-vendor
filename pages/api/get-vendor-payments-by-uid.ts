import { NextApiHandler } from 'next'
import { query } from '../../lib/db'
import { VendorPaymentTypes } from '@/lib/types'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    if (!uid || typeof uid !== 'string') {
      throw new Error('Invalid UID')
    }

    const results = await query(
      `
      SELECT
        vp.id AS payment_id,
        vp.amount,
        vp.type,
        vp.bank_reference,
        vp.note,
        vp.date,
        COALESCE(
          CASE
            WHEN vp.type IN (?, ?) THEN vp.bank_reference
            WHEN vp.type = ? THEN IFNULL(s.item_list, vp.note)
            ELSE vp.note
          END, 
          ''
        ) AS reference
      FROM vendor_payment vp
      LEFT JOIN sale_transaction st ON vp.id = st.vendor_payment_id
      LEFT JOIN sale s ON st.sale_id = s.id
      WHERE vp.is_deleted = 0
      AND vp.vendor_id = (
        SELECT id FROM vendor WHERE uid = ?
      )
      ORDER BY vp.date DESC
      `,
      [
        VendorPaymentTypes.DC,
        VendorPaymentTypes.Batch,
        VendorPaymentTypes.Sale,
        uid,
        uid,
      ]
    )

    return res.json(results)
  } catch (e) {
    console.error('Error fetching payments:', e.message)
    res.status(500).json({ message: e.message })
  }
}

export default handler
