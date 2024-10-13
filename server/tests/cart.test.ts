import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app/app.ts";
import config from "../src/config/config.ts";
import { mockProduct, } from "./utils.ts";
import User from "../src/model/userModel.ts";
import Product from "../src/model/productModel.ts";
import {jest} from '@jest/globals'
import logger from "../src/config/logger.ts";
import { IPopulatedCartItem } from "../src/utils/userUtils.ts";



describe("Get /cart/items", () => {
  let mockCartReqPayload: {
    productId: mongoose.Types.ObjectId,
    quantity: number,
  } ;
  const agent = request.agent(app);

  beforeAll(async () => {
    const { URI } = config.getDatabaseConfig();
    await mongoose.connect(URI);
    const product = new Product(mockProduct);
    await product.save();
    mockCartReqPayload = {
      productId: product.id,
      quantity: 1,
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteOne({title: mockProduct.title});
    await mongoose.connection.close();
  })

  // beforeEach(() => {
  //   jest.clearAllMocks();
    
  // })

  test('should create user session add item to user cart',async () => {
    const response = await agent.post('/cart/items').send(mockCartReqPayload);
    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(new RegExp(mockCartReqPayload.productId.toString()));
    expect(response.headers['set-cookie'][0]).toMatch(new RegExp(config.getSessionConfig().name))
  })

  test('should update the quantity of cart item', async () => {
    const url = `/cart/items/${mockCartReqPayload.productId}`
    const updatedQuantity = 3; 
    const response = await agent.patch(url).send({
      quantity: updatedQuantity
    })
    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    const targetCartItem: IPopulatedCartItem = JSON.parse(response.text).data.cart.items.find(
      (carItem: IPopulatedCartItem) => carItem.product?._id === mockCartReqPayload.productId
    );
    expect(targetCartItem.quantity).toBe(updatedQuantity);
  })

  test('should return 422 when requested quantity exceeds the available stock', async () => {
    const url = `/cart/items/${mockCartReqPayload.productId}`
    const updatedQuantity = mockProduct.stock + 1; 
    const response = await agent.patch(url).send({
      quantity: updatedQuantity
    })
    expect(response.statusCode).toBe(422);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(/Requested quantity exceeds the available stock/i);
  })

  test('should return 422 for invalid data type of  request body field', async () => {
    const url = `/cart/items/${mockCartReqPayload.productId}`
    const updatedQuantity = 'two'; 
    const response = await agent.patch(url).send({
      quantity: updatedQuantity
    })
    expect(response.statusCode).toBe(422);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(/Item quantity must be positive integer/i);
  })

  test('should return 400 when one or more required filed are missing in request', async () => {
    const url = `/cart/items/${mockCartReqPayload.productId}` 
    const response = await agent.patch(url).send({
      color: 'red'
    })
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(/Missing required filed: quantity/i);
  })

  test('should return 404 when updating quantity of non existent cart item', async () => {
    const updatedQuantity = 3;
    const url = `/cart/items/${new mongoose.Types.ObjectId().toString()}`
    const response = await agent.patch(url).send({
      quantity: updatedQuantity,
    })
    expect(response.statusCode).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(/Product not found/i);
  })

  test('should return 400 when request parameter is invalid', async () => {
    const updatedQuantity = 3;
    const response = await agent.patch('/cart/items/invalidParameter').send({
      quantity: updatedQuantity,
    })
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.text.length).toBeGreaterThan(1);
    expect(response.text).toMatch(/Invalid parameter/i);
  })

});

