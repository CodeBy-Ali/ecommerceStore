import request from "supertest";
import app from "../src/app/app.ts";
import { LoginRequestBody, RegisterRequestBody } from "../src/middlewares/validator.ts";
import { IProduct } from "../src/model/productModel.ts";
import mongoose from "mongoose";









export const mockRegisterReqBody: RegisterRequestBody = {
  firstName: "ali",
  lastName: "hassan",
  email: "example@gmail.com",
  password: "Password2$",
};

export const mockLoginReqBody: LoginRequestBody = {
  email: mockRegisterReqBody.email,
  password: mockRegisterReqBody.password
}

export const mockProduct: IProduct = {
  title: 'mockProduct',
  description: "mockDescription",
  images: ["source3.jpg","source2.jpg","source.jpg"],
  price: 0,
  categories: ['body'],
  usage: "mockUsage",
  ingredients: "mockIngredients",
  weight: 'mockWeight',
  salesCount: 0,
  stock: 10,
  slug: 'mock-product'
}


export const assertHtmlPageResponse = async (route: string, expectedPage: string): Promise<void> => {
  const response = await request(app).get(route);

  expect(response.statusCode).toBe(200);
  expect(response.type).toBe("text/html");
  // test whether the response page matches the expectedPage
  const regex: RegExp = new RegExp(`data-page="${expectedPage}"`, "g");
  expect(response.text).toMatch(regex);
};


