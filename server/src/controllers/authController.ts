import configManager from "../config/config.ts";
import { Request, Response,NextFunction } from "express";
import { join, resolve } from "path";
import User from "../model/userModel.ts";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// config constants
const staticDirPath = configManager.getDirConfig()?.static;



// send register html page
export const sendRegisterPage = (req: Request, res: Response,): void => {
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
    res.redirect("/account/login");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authenticateUser = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    // check if user with current email already exist in db
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "We couldn't find an account with that email address" });
      return;
    }
    // compare the password 
    const isPasswordCorrect:boolean = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    // create new user session
    req.session.regenerate((err) => {
      if (err) next(err);

      req.session.user = user?._id;

      req.session.save((err) => {
        if (err) next(err);
        res.redirect('/');
      })
    })    

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};
