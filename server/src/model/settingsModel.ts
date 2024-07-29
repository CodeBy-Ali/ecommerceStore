import { Schema,model } from 'mongoose';

interface IStoreSetting{
  _id: string,
  freeShippingThreshold: number,
  currency: string,
}

const storeSettingsSchema = new Schema<IStoreSetting>({
  _id: {
    type: String,
  },
  freeShippingThreshold: {
    type: Number,
    required: true,    
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'PKR']
  }

}, {
  timestamps: true,
});

const StoreSetting = model<IStoreSetting>('StoreSettings', storeSettingsSchema);


export default StoreSetting;