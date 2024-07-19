import mongoose from "mongoose";
import configManager from "../src/config/config.ts";
import request from "supertest";
import app from "../src/app/app.ts";
import User,{IUser} from "../src/model/userModel.ts";
import bcrypt from "bcrypt";
import {
  mockRegisterReqBody,
  IMockRegisterBody,
  mockLoginReqBody,
  IMockLoginBody
} from "./utils.ts";

describe("POST /account/register", () => {
  // connecting to database before all test
  beforeAll(async () => {
    const { TEST_URI } = configManager.getDatabaseConfig();
    await mongoose.connect(TEST_URI);
  });

  // close the database connection after each test
  afterAll(async () => {
    await mongoose.connection.close();
  });
  // delete the user after each test
  afterEach(async () => {
    await User.deleteOne({ email: mockRegisterReqBody.email });
  });
  test("should redirect to '/account/login' after successful registration", async () => {
    const response = await request(app).post("/account/register").send(mockRegisterReqBody);
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toBeTruthy();
    expect(response.header["location"]).toBe("/account/login");
  });

  test("should return 400 with error message 'Invalid Password'", async () => {
    const mockInvalidPassword: IMockRegisterBody = { ...mockRegisterReqBody, password: "abc" };
    const response = await request(app).post("/account/register").send(mockInvalidPassword);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid password/);
  });

  test("should return 400 with error message 'Invalid email'", async () => {
    const mockInvalidEmail: IMockRegisterBody = { ...mockRegisterReqBody, email: "exampleGmail.com" };
    const response = await request(app).post("/account/register").send(mockInvalidEmail);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid email/);
  });

  test("should return 400 with error message 'FirstName is invalid')'", async () => {
    const mockInvalidFirstName: IMockRegisterBody = { ...mockRegisterReqBody, firstName: "$$$" };
    const response = await request(app).post("/account/register").send(mockInvalidFirstName);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.text).toMatch(/FirstName is invalid/);
  });

  test("should return 400 and error message when required fields are missing'", async () => {
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
    const sessionNameRegExp = new RegExp(`${configManager.getSessionConfig().name}`, 'g');
    expect(response.header['set-cookie'][0]).toMatch(sessionNameRegExp); 
  });

  test("should return 404 and  error message for non existent email'", async () => {
    const mockIncorrectEmail:IMockLoginBody = {...mockLoginReqBody,email:"notExample@gmail.com"}
    const response = await request(app).post('/account/login').send(mockIncorrectEmail);
    expect(response.statusCode).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.text).toMatch(/We couldn't find an account with that email address/);
  }) 

  test("should return 404 with error message 'Incorrect password'", async () => {
    const mockIncorrectEmail:IMockLoginBody = {...mockLoginReqBody,password:"NotPassword2$"}
    const response = await request(app).post('/account/login').send(mockIncorrectEmail);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.text).toMatch(/Incorrect password/);
  }) 

  test("should return 400 and error message when required fields are missing'", async () => {
    const { email, ...mockMissingField } = mockLoginReqBody;
    const response = await request(app).post("/account/login").send(mockMissingField);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.text).toMatch(/Email and password are required/);
  });

  test("should return 400 with error message 'Invalid email'", async () => {
    const mockInvalidEmail: IMockLoginBody = { ...mockLoginReqBody, email: "exampleGmail.com" };
    const response = await request(app).post("/account/login").send(mockInvalidEmail);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid email/);
  });

  test("should return 400 with error message 'Invalid Password'", async () => {
    const mockInvalidPassword: IMockLoginBody = { ...mockLoginReqBody, password: "abc" };
    const response = await request(app).post("/account/login").send(mockInvalidPassword);
    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/Invalid password/);  
  });
});
 