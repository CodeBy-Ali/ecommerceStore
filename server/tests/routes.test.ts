import mongoose from 'mongoose';
import config from '../src/config/config';

import { assertHtmlResponse } from './utils';






// connecting to database before each test
beforeEach( async() => {
  await mongoose.connect(config.databaseURI)
})

// close the database connection after each test
afterEach(async () => {
  await mongoose.connection.close();
})


describe('Get /',():void => {
  test('it should return html page', async (): Promise<void> => {
    await assertHtmlResponse('/')
  });
})


describe('Get /collections', () => {
  test('it should return html page', async (): Promise<void> => {
    await assertHtmlResponse("/collections");
  })
})