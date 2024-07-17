import { Response, Request, NextFunction } from "express";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const isNameValid = (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]{2,})*$/.test(name);

const isEmailValid = (email: string): boolean => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isPasswordValid = (password: string): boolean => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password);

export const validateAuthBody = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, password } = req.body as LoginRequestBody;
    if (!email || !password) throw new Error("Email and password are required");
    if (!isEmailValid(email)) throw new Error("Invalid email");
    if (!isPasswordValid(password)) throw new Error("Invalid password");
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json(message);
  }
};

export const validateRegisterBody = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { firstName, lastName, email, password } = req.body as RegisterRequestBody;

    if (!firstName || !lastName || !email || !password) {
      throw new Error("FirstName,LastName,Email and Password are required ");
    }

    if (!isNameValid(firstName)) throw new Error("FirstName is invalid");
    if (!isNameValid(lastName)) throw new Error("LastName is invalid");
    if (!isEmailValid(email)) throw new Error("Invalid email");
    if (!isPasswordValid(password)) throw new Error("Invalid password");
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json(message);
  }
};
