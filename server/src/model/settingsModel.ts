import { Schema,model } from 'mongoose';

export interface IStoreSettings{
  _id: string,
  freeShippingThreshold: number,
  currency: string,
}

const storeSettingsSchema = new Schema<IStoreSettings>({
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

const StoreSetting = model<IStoreSettings>('StoreSettings', storeSettingsSchema);


export default StoreSetting;