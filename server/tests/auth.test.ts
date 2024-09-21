import mongoose from "mongoose";
import configManager from "../src/config/config.ts";
import request from "supertest";
import app from "../src/app/app.ts";
import User,{IUser} from "../src/model/userModel.ts";
import bcrypt from "bcrypt";
import {
  mockRegisterReqBody,
  mockLoginReqBody,
} from "./utils.ts";
import { LoginRequestBody, RegisterRequestBody } from "../src/middlewares/validator.ts";

describe("POST /account/register", () => {
  // connecting to database before all test
  beforeAll(async () => {
    const { URI } = configManager.getDatabaseConfig();
    await mongoose.connect(URI);
  });

  // close the database connection after each test
  afterAll(async () => {
    await mongoose.connection.close();
  });
  // delete the user after each test
  afterEach(async () => {
    await User.deleteOne({ email: mockRegisterReqBody.email });
  });
  test("should redirect to '/' after successful registration", async () => {
    const response = await request(app).post("/account/register").send(mockRegisterReqBody);
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toBeTruthy();
    expect(response.header["location"]).toBe("/");
  });

  test("should return 400 for Invalid Password", async () => {
    const mockInvalidPassword: RegisterRequestBody = { ...mockRegisterReqBody, password: "abc" };
    const response = await request(app).post("/account/register").send(mockInvalidPassword);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid password/);
  });

  test("should return 400 for Invalid email", async () => {
    const mockInvalidEmail  = { ...mockRegisterReqBody, email: "exampleGmail.com" };
    const response = await request(app).post("/account/register").send(mockInvalidEmail);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid email/);
  });

  test("should return 400 when FirstName is invalid)'", async () => {
    const mockInvalidFirstName = { ...mockRegisterReqBody, firstName: "$$$" };
    const response = await request(app).post("/account/register").send(mockInvalidFirstName);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.text).toMatch(/FirstName is invalid/);
  });

  test("should return 400 when required fields are missing'", async () => {
    const { firstName, ...mockMissingField } = mockRegisterReqBody;
    const response = await request(app).post("/account/register").send(mockMissingField);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.text).toMatch(/FirstName,LastName,Email and Password are required/);
  });
});

describe("POST /account/login", () => {
  // connecting to database before all test
  beforeAll(async () => {
    const { URI } = configManager.getDatabaseConfig();
    await mongoose.connect(URI);
    const password = mockRegisterReqBody.password;
    const { saltRounds } = configManager.getBcryptConfig();
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newMockUser: IUser = { ...mockRegisterReqBody, passwordHash: passwordHash };
    const user = new User(newMockUser);
    await user.save();
  });

  // close the database connection after each test
  afterAll(async () => {
    await User.deleteOne({ email: mockRegisterReqBody.email });
    await mongoose.connection.close();
  });

  test("should create new user session and redirect to '/'", async () => {
    const response = await request(app).post("/account/login").send(mockLoginReqBody); 
    expect(response.statusCode).toBe(302);
    expect(response.header['location']).toBe('/'); 
    expect(response.header['set-cookie'].length).toBeGreaterThan(0) 
    const sessionNameRegExp = new RegExp(`${configManager.getSessionConfig().name}`);
    expect(response.header['set-cookie'][0]).toMatch(sessionNameRegExp); 
  });

  test("should return 404  for non existent email'", async () => {
    const mockIncorrectEmail: LoginRequestBody = {...mockLoginReqBody,email:"notExample@gmail.com"}
    const response = await request(app).post('/account/login').send(mockIncorrectEmail);
    expect(response.statusCode).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.text).toMatch(/We couldn't find an account with that email address/);
  }) 

  test("should return 401 for incorrect Password'", async () => {
    const mockIncorrectEmail: LoginRequestBody = {...mockLoginReqBody,password:"NotPassword2$"}
    const response = await request(app).post('/account/login').send(mockIncorrectEmail);
    expect(response.statusCode).toBe(401);
    expect(response.type).toBe('application/json');
    expect(response.text).toMatch(/Incorrect password/);
  }) 

  test("should return 400  for missing required fields", async () => {
    const { email, ...mockMissingField } = mockLoginReqBody;
    const response = await request(app).post("/account/login").send(mockMissingField);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.text).toMatch(/Email and password are required/);
  });

  test("should return 400 when email is invalid", async () => {
    const mockInvalidEmail: LoginRequestBody = { ...mockLoginReqBody, email: "exampleGmail.com" };
    const response = await request(app).post("/account/login").send(mockInvalidEmail);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid email/);
  });

  test("should return 400 when password in Invalid", async () => {
    const mockInvalidPassword: LoginRequestBody = { ...mockLoginReqBody, password: "abc" };
    const response = await request(app).post("/account/login").send(mockInvalidPassword);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid password/);  
  });
});
 