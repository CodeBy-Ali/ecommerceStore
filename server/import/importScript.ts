import productList from './productList';
import Product, { IProduct } from '../src/model/productModel';
import { HydratedDocument, Model, Document } from 'mongoose';
import mongoose from 'mongoose';
import config from '../src/config/config';







const addProduct = async (product: IProduct, model: Model<IProduct>): Promise<void> => {
  if (!product) throw new Error('Document is invalid');
  const duplicate: IProduct | null = await model.findOne({ title: product.title }).lean();
  if (duplicate) throw new Error(`Product with title "${duplicate.title}" already present in dataBase`);
  const newProduct: HydratedDocument<IProduct> = await model.create(product);
  await newProduct.save();
}






(async () => {
  try {
    await mongoose.connect(config.databaseURI);
    for (const product of productList) {
      await addProduct(product, Product);
      console.log(`${product.title} successfully added to database`);
    }
    console.log('All products added to database.')
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
})()