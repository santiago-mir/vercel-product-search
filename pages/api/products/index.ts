import type { NextApiRequest, NextApiResponse } from "next";
import { getLimitAndOffset } from "lib/requests";
import methods from "micro-method-router";
import { client } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { limit, offset } = getLimitAndOffset(req, 100, 19);
    const query = req.query.q as string;
    const algoliaOffset = Math.floor(offset / limit);
    const response = await client.searchSingleIndex({
      indexName: "products",
      searchParams: {
        query,
        hitsPerPage: limit,
        page: algoliaOffset,
      },
    });
    res.send({
      results: response.hits,
      pagination: {
        offset,
        limit,
        page: response.page,
        total: response.nbHits,
      },
    });
  },
});
