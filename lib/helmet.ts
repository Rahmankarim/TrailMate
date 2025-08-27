import helmet from "helmet";
import type { NextApiRequest, NextApiResponse } from "next";

export default function helmetMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  helmet()(req, res, next);
}
