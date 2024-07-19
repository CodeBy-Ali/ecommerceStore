import productList from './productList.ts';
import Product, { IProduct } from '../src/model/productModel.ts';
import { HydratedDocument, Model, Document } from 'mongoose';
import mongoose from 'mongoose';
import configManager from '../src/config/config.ts';
import { nanoid } from 'nanoid';





// add product to database
const addProduct = async (product: IProduct, model: Model<IProduct>): Promise<void> => {
  if (!product) throw new Error('Document is invalid');
  const duplicate: IProduct | null = await model.findOne({ title: product.title }).lean();
  if (duplicate) throw new Error(`Product with title "${duplicate.title}" already present in dataBase`);
  const newProduct: HydratedDocument<IProduct> = await model.create(product);
  await newProduct.save();
}

// updates the document in database
const updateProduct = async(filter: object, update: object, options: object): Promise<IProduct | null> => {
  const updatedDocument: IProduct | null = await Product.findOneAndUpdate(filter, update, options).lean();
  return updatedDocument;
}




(async () => {
  try {
    await mongoose.connect(configManager.getDatabaseConfig().URI);
    // for (const product of productList) {
    //   await addProduct(product, Product);
    //   console.log(`${product.title} successfully added to database`);
    // }
    // console.log('All products added to database.')
    const filter:object = { title: "Shaving Cream" };
    const update: object = { pubId: nanoid(10) };
    const options: object = { returnOriginal: false };
    const updatedProduct  = await updateProduct(filter, update, options);
    console.log(updatedProduct);
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
})()