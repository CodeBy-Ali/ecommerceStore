import mongoose from "mongoose";
import configManager from "../src/config/config.ts";


import { assertHtmlPageResponse } from "./utils.ts";

describe("Get /", (): void => {
  test("it should return home page", async (): Promise<void> => {
    await assertHtmlPageResponse("/","home");
  });
});

describe("Get /collections", () => {
  // connecting to database before all test
  beforeAll(async () => {
    const { TEST_URI } = configManager.getDatabaseConfig();
    await mongoose.connect(TEST_URI);
  });

  // close the database connection after all test 
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("it should return collections page", async (): Promise<void> => {
    await assertHtmlPageResponse("/collections","collections");
  });
});

 
describe('Get /register', () => {
  test('It should return register page', async (): Promise<void> => {
    await assertHtmlPageResponse("/account/register","register")
  })
})


describe('Get /login', () => {
  test('It should return login page', async (): Promise<void> => {
    await assertHtmlPageResponse("/account/login","login")
  })
})
 