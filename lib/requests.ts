import type { NextApiRequest, NextApiResponse } from "next";

export function getLimitAndOffset(req: NextApiRequest, MaxLimit, MaxOffset) {
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);

  const limit = queryLimit <= MaxLimit && queryLimit > 0 ? queryLimit : 100;
  const offset = queryOffset <= MaxOffset ? queryOffset : 0;
  return {
    limit,
    offset,
  };
}
