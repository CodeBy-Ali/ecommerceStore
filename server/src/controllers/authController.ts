import configManager from "../config/config";
import { Request, Response } from "express";
import { join, resolve } from "path";
import User from "../model/userModel";
import bcrypt from "bcrypt";
// path to directory which contains static files.
const staticDirPath = configManager.getDirConfig()?.static;

// send register html page
export const sendRegisterPage = (req: Request, res: Response): void => {
  res.sendFile(join(staticDirPath, "src/pages/register.html"));
};

// send login html page
export const sendLoginPage = (req: Request, res: Response): void => {
  res.sendFile(join(staticDirPath, "src/pages/login.html"));
};

// add new user to database
export const registerNewUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser) {
      res.status(400).json({ message: "Email already Registered" });
      return;
    }

    const { saltRounds } = configManager.getBcryptConfig();
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: passwordHash,
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    // check if user with current email already exist in db
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "We couldn't find an account with that email address" });
      return;
    }

    // compare the password 
    const isPasswordCorrect:boolean = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Incorrect password" });
      return;
    }

    // create new user session

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
