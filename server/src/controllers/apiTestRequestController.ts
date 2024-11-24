import { NextFunction, Request, Response } from "express";
import { getUserConfig } from "../utils/userUtils.ts";
import config from "../config/config.ts";

const handleApiTestRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.session.user;
  const { code } = req.query;
  const { secret } = config.getApiTestConfig();
  try {
    const userConfig = await getUserConfig(user);
    const isCodeValid = code === secret;
    if (!isCodeValid) {
      return res.status(404).render("notFound", userConfig);
    }
    res.status(200).json({
      status: "success",
      message: "Server is live",
    });
  } catch (err: unknown) {
    next(err);
  }
};

export default handleApiTestRequest;
