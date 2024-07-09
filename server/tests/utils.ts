import request from "supertest";
import app from "../src/app/app";


export const assertHtmlResponse = async (route: string): Promise<void> => {
  const response = await request(app).get(route);
  expect(response.statusCode).toBe(200);
  expect(response.type).toBe('text/html');
}
