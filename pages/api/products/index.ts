import type { NextApiRequest, NextApiResponse } from "next";
import { getLimitAndOffset } from "lib/requests";
import { airtableBase } from "lib/airtable";
import { client } from "lib/algolia";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const response = await client.searchSingleIndex({
    indexName: "products",
    searchParams: { query: req.query.search as string },
  });
  res.send(response);
}
