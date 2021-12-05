import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    vendor_id,
    artist,
    title,
    display_as,
    media,
    format,
    genre,
    is_new,
    cond,
    country,
    release_year,
    barcode,
    publisher,
    colour,
    size,
    tags,
    description,
    note,
    image_id,
    image_url,
    thumb_url,
    google_books_item_id,
    googleBooksItem,
    discogs_item_id,
    discogsItem,
    do_list_on_website,
    has_no_quantity,
    is_gift_card,
    gift_card_code,
    gift_card_amount,
    gift_card_remaining,
    gift_card_is_valid,
    is_misc_item,
    misc_item_description,
    misc_item_amount,
    created_by_id,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO stock (
        vendor_id,
        artist,
        title,
        display_as,
        media,
        format,
        genre,
        is_new,
        cond,
        country,
        release_year,
        barcode,
        publisher,
        colour,
        size,
        tags,
        description,
        note,
        image_id,
        image_url,
        thumb_url,
        google_books_item_id,
        googleBooksItem,
        discogs_item_id,
        discogsItem,
        do_list_on_website,
        has_no_quantity,
        is_gift_card,
        gift_card_code,
        gift_card_amount,
        gift_card_remaining,
        gift_card_is_valid,
        is_misc_item,
        misc_item_description,
        misc_item_amount,
        created_by_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        vendor_id,
        artist,
        title,
        display_as,
        media,
        format,
        genre,
        is_new || 0,
        cond,
        country,
        release_year,
        barcode,
        publisher,
        colour,
        size,
        tags,
        description,
        note,
        image_id,
        image_url,
        thumb_url,
        google_books_item_id,
        googleBooksItem,
        discogs_item_id,
        discogsItem,
        do_list_on_website || 1,
        has_no_quantity || 0,
        is_gift_card,
        gift_card_code,
        gift_card_amount,
        gift_card_remaining,
        gift_card_is_valid,
        is_misc_item,
        misc_item_description,
        misc_item_amount,
        created_by_id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
