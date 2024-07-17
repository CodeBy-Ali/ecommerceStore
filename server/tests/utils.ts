import request from "supertest";
import app from "../src/app/app";

export const assertHtmlPageResponse = async (route: string, expectedPage: string): Promise<void> => {
  const response = await request(app).get(route);

  expect(response.statusCode).toBe(200);
  expect(response.type).toBe("text/html");
  // test whether the response page matches the expectedPage
  const regex: RegExp = new RegExp(`data-page="${expectedPage}"`, "g");
  expect(response.text).toMatch(regex);
};

export interface IMockRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IMockLoginBody{
  email: string,
  password: string,
}

export const mockRegisterReqBody: IMockRegisterBody = {
  firstName: "ali",
  lastName: "hassan",
  email: "example@gmail.com",
  password: "Password2$",
};

export const mockLoginReqBody: IMockLoginBody = {
  email: mockRegisterReqBody.email,
  password: mockRegisterReqBody.password
}