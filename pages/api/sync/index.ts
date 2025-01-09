import type { NextApiRequest, NextApiResponse } from "next";
import { getLimitAndOffset } from "lib/requests";
import { airtableBase } from "lib/airtable";
import { client } from "lib/algolia";

export default function (req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getLimitAndOffset(req, 100, 10000);
  airtableBase("Furniture")
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            id: r.id,
            ...r.fields,
          };
        });
        await client.saveObjects({
          indexName: "products",
          objects,
        });
        console.log("siguiente pagina");
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        res.send("termino");
      }
    );
}
