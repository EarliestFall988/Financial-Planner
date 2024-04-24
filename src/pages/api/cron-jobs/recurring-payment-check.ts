import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  response
    .status(200)
    .json({ message: "Recurring pay check cron job is running" });
}
