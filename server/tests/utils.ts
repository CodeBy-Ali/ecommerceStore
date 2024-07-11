import request from "supertest";
import app from "../src/app/app";


export const assertHtmlResponse = async (route: string,expectedPage: string): Promise<void> => {
  const response = await request(app).get(route);

  expect(response.statusCode).toBe(200);
  expect(response.type).toBe('text/html');

  // test whether the response page matches the expectedPage
  const regex:RegExp = /(?:data-page)=\"([a-zA-Z]+)\"/
  const match = regex.exec(response?.text);
  if (!match) throw new Error('Failed to identify the page due missing data-page property');
  const [_, responsePage] = match;
  expect(responsePage).toBe(expectedPage);
}
