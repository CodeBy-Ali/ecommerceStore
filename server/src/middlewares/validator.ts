import { Response, Request, NextFunction } from "express";
import { IShippingAddress } from "../model/shippingAddressModel.ts";
import logger from "../config/logger.ts";

export interface ILoginRequestBody {
  email: string;
  password: string;
  returnTo?: string;
}

export interface IRegisterRequestBody extends ILoginRequestBody {
  firstName: string;
  lastName: string;
}

export interface ICheckoutRequestBody extends IShippingAddress {
  cartId: string;
  shippingAddressId?: string;
  saveCheckout: boolean;
  password?: string;
  subscribeNews: boolean;
  paymentMethod: string;
}

export type IShippingAddressReqBody = Omit<
  IShippingAddress,
  "userId" | "isDefault"
>;

type ValidationFields =
  | "firstName"
  | "lastName"
  | "email"
  | "paymentMethod"
  | "password"
  | "phone"
  | "address"
  | "city"
  | "province"
  | "country"
  | "address";

type IRegisterRequiredFields = keyof Omit<IRegisterRequestBody, "returnTo">;

type ILoginRequiredFields = keyof Omit<ILoginRequestBody, "returnTo">;

type IShippingAddressRequiredFields = keyof Omit<IShippingAddressReqBody,"apartment"|"postalCode">;

type ICheckoutRequiredFields = keyof IShippingAddressRequiredFields &
  "paymentMethod";

interface IValidatorRules
  extends Record<ValidationFields, (arg: string) => boolean> {}

const validatorRules: IValidatorRules = {
  firstName: (name: string) => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  lastName: (name: string) => /^[a-zA-Z]+(?:[ \-'][a-zA-Z]+)*$/.test(name),
  address: (address: string) => /[\w\-,\/',\s\\^]/.test(address),
  city: (city: string) => /^[A-Za-zÀ-ÿ']+\s?\-?([A-Za-zÀ-ÿ']+\s?)+$/.test(city),
  country: (country: string) =>
    /^[A-Za-zÀ-ÿ']+\s?\-?([A-Za-zÀ-ÿ']+\s?)+$/.test(country),
  province: (state: string) =>
    /^[A-Za-zÀ-ÿ']+\s?\-?([A-Za-zÀ-ÿ']+\s?)+$/.test(state),
  paymentMethod: (method: string) => /cod|bank|jazz-cash/i.test(method),
  password: (password: string) =>
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password),
  email: (email: string) =>
    /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    ),
  phone: (phone: string) =>
    /^(\+?\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,5}$/.test(
      phone
    ),
};

const invalidFiledMassages: Record<ValidationFields, string> = {
  firstName: "Name must only contain letters, hyphens and numbers",
  lastName: "Name must only contain letters, hyphens and numbers",
  email:
    "Email is Invalid. Only letters (A-z), numbers (0-9), periods(.) and (@) are allowed",
  city: "City name must only contain letters(A-z) and hyphens",
  country: "Country name must only contain letters(A-z) and hyphens",
  province: "Province/state name must only contain letters(A-z) and hyphens",
  phone:
    "Invalid phone number. Make sure it includes the country code and is in the correct format",
  address:
    "Invalid Address.  Make sure it contains enough detail to identify your location.",
  paymentMethod: "Payment method must be string",
  password: "Password is weak. Try a mix of letters, numbers, and symbols",
};

export const validateAuthBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const loginReqBody = req.body as ILoginRequestBody;
  const loginRequiredFields: Record<ILoginRequiredFields, string> = {
    email: loginReqBody.email,
    password: loginReqBody.password,
  };

  try {
    checkForMissingFields<ILoginRequiredFields>(loginRequiredFields);
    validateReqFields<ILoginRequiredFields>(loginRequiredFields);
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ message: message });
  }
};

export const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const registerReqBody = req.body as IRegisterRequestBody;

  const registerRequiredFields: Record<IRegisterRequiredFields, string> = {
    firstName: registerReqBody.firstName,
    lastName: registerReqBody.lastName,
    email: registerReqBody.email,
    password: registerReqBody.password,
  };
  try {
    checkForMissingFields<IRegisterRequiredFields>(registerRequiredFields);
    validateReqFields<IRegisterRequiredFields>(registerRequiredFields);
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json(message);
  }
};

export const validateCheckoutReqBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const checkoutBody = req.body as ICheckoutRequestBody;
  if (checkoutBody.shippingAddressId) return next();

  try {
    // as checkout body extends shipping address req body
    validateShippingAddress(checkoutBody);
    validateReqFields({
      paymentMethod: checkoutBody["paymentMethod"]
    });
    next();
  } catch (error: unknown) {
    logger.error(error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({
      status: "fail",
      message,
    });
  }
};


export function validateShippingAddressReqBody(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const body = req.body as IShippingAddressReqBody;
  try {
    validateShippingAddress(body);
    next();
  } catch (error:unknown) {
    logger.error(error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({
      status: "fail",
      message,
    });
  }

}


export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required parameter: productId",
    });
  }
  next();
};

export const validateNameParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required parameter: name",
    });
  }
  next();
};

function checkForMissingFields<T extends ValidationFields>(
  registerRequiredFields: Record<T, string | undefined>
) {
  const missingFields: string[] = [];
  for (const [field, value] of Object.entries(registerRequiredFields)) {
    if (!value || (typeof value == "string" && value.length === 0))
      missingFields.push(field);
  }
  if (missingFields.length > 0)
    throw new Error(
      `Following fields are required: ${missingFields.join(", ")}`
    );
}

function validateReqFields<T extends ValidationFields>(
  validationFields: Record<T, string | undefined>
) {
  for (const field of Object.keys(validationFields) as Array<T>) {
    const validationRule = validatorRules[field];
    if (!validationRule) continue;
    const value = validationFields[field];
    if (!value) continue;
    const isFieldValid = validationRule(value.trim());
    if (!isFieldValid) {
      throw new Error(invalidFiledMassages[field]);
    }
  }
}

function validateShippingAddress(body: IShippingAddressReqBody) {
  const shippingAddressRequiredFields: Record<
    IShippingAddressRequiredFields,
    string | undefined
  > = {
    firstName: body["firstName"],
    lastName: body["lastName"],
    city: body["city"],
    email: body["email"],
    address: body["address"],
    phone: body["phone"],
    province: body["province"],
    country: body["country"],
  };
  checkForMissingFields<IShippingAddressRequiredFields>(
    shippingAddressRequiredFields
  );
  validateReqFields<IShippingAddressRequiredFields>(
    shippingAddressRequiredFields
  );
};
