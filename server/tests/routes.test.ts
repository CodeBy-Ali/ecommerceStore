import mongoose from "mongoose";
import config from "../src/config/config";

import { assertHtmlResponse } from "./utils";

describe("Get /", (): void => {
  test("it should return home page", async (): Promise<void> => {
    await assertHtmlResponse("/","home");
  });
});

describe("Get /collections", () => {
  // connecting to database before each test
  beforeEach(async () => {
    await mongoose.connect(config.databaseURI);
  });

  // close the database connection after each test 
  afterEach(async () => {
    await mongoose.connection.close();
  });

  test("it should return collections page", async (): Promise<void> => {
    await assertHtmlResponse("/collections","collections");
  });
});

 
describe('Get /register', () => {
  test('It should return register page', async (): Promise<void> => {
    await assertHtmlResponse("/account/register","register")
  })
})


describe('Get /login', () => {
  test('It should return login page', async (): Promise<void> => {
    await assertHtmlResponse("/account/login","login")
  })
})
 