import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { airtableBase } from "lib/airtable";
import { client } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    // clear algolia index
    await client.clearObjects({
      indexName: "products",
    });
    // toma los records de airtable y los pasa a algolia
    airtableBase("Furniture")
      .select({
        pageSize: 10,
      })
      .eachPage(
        async function (records, fetchNextPage) {
          const objects = records.map((r) => {
            return {
              objectID: r.id,
              ...r.fields,
            };
          });
          await client.saveObjects({
            indexName: "products",
            objects,
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          res.send(
            "El index products de algolia fue sincronizado con el product catalog de Airtable"
          );
        }
      );
  },
});
