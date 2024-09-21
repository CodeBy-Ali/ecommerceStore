import mongoose from "mongoose";
import configManager from "../src/config/config.ts";
import { mockProduct } from "./utils.ts";
import Product, { IProduct } from "../src/model/productModel.ts";
import config from "../src/config/config.ts";
import { assertHtmlPageResponse } from "./utils.ts";

describe("Get /", (): void => {
  test("it should return home page", async (): Promise<void> => {
    await assertHtmlPageResponse("/","home");
  });
});

describe("Get /collections", () => {
  // connecting to database before all test
  beforeAll(async () => {
    const { URI } = configManager.getDatabaseConfig();
    await mongoose.connect(URI);
  });

  // close the database connection after all test 
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return All Collections page", async (): Promise<void> => {
    await assertHtmlPageResponse("/collections","collection");
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
 
describe('Get /products', () => {
  beforeAll(async () => {
    const { URI } = config.getDatabaseConfig();
    await mongoose.connect(URI);
    const product = new Product(mockProduct);
    await product.save();
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  })
  test('It should return product page', async (): Promise<void> => {
    await assertHtmlPageResponse(`/products/${mockProduct.slug}`, "product");
  })
})