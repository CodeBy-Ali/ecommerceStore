import { Schema,model } from 'mongoose';

export interface IStoreSettings{
  _id: string,
  freeShippingThreshold: number,
  currency: string,
  shippingRate: number,
}

const storeSettingsSchema = new Schema<IStoreSettings>({
  _id: {
    type: String,
  },
  freeShippingThreshold: {
    type: Number,
    required: true,    
  },
  shippingRate: {
    type: Number,
    required: true, 
  }
}, {
  timestamps: true,
});

const StoreSetting = model<IStoreSettings>('StoreSettings', storeSettingsSchema);


export default StoreSetting;