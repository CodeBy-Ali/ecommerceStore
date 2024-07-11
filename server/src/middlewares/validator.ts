import {Response,Request,NextFunction} from 'express'


interface IRules {
  firstName: (value: string) => boolean;
  lastName: (value: string) => boolean;
  email: (value: string) => boolean;
  password: (value: string) => boolean;
}

const validatorRules: IRules = {
  firstName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  lastName: (name: string): boolean => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  email: (email: string): boolean => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
  password: (password: string): boolean => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password),
};





export const validateAuthInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    for (const [name, value] of Object.entries(req.body) as [keyof IRules,string][]) {
      const validate = validatorRules[name]
      const isValid = validate(value);
      if (!isValid) throw new Error(`${name} is invalid`);
    }
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json(message);
  }
} 