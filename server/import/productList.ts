import mongoose from 'mongoose';
import { IProduct } from '../src/model/productModel.ts';

const productList: Array<IProduct> = [
  {
    title: "Exfoliating Facial Cleanser",
    price: 14.99,
    description: "Dead skin got you feeling flaky? Make way for the cell stimulating, exfoliating action of rice bran and up cycled olive seed.  French green clay and sodium PCA help clarify for healthier skin that's ready for anything.  Humidity?  Sure.  Arid conditions?  Fine.  Bear attack?  Ehhh...fine so maybe not 'anything'. ",
    ingredients: "Water/Aqua, Microcrystalline Cellulose, Montmorillonite, Kaolin, Glycerin, Olea Europea (Olive) Seed Powder, Bentonite, Xanthan Gum, Oryza Sativa (Rice Bran) Wax, Gardenia Florida Fruit Extract, Aloe Barbadensis Leaf Juice, Hydrolyzed Gardenia Florida Extract, Laminaria Digitata (Oarweed) Extract, Sodium PCA, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Olea Europea (Olive) Fruit Oil, Carrageenan, Eucalyptus Globulus Leaf Oil, Rosmarinus Officinalis (Rosemary) Leaf Oil, Mentha Arvensis (Wild Mint) Lead Oil, Mentha Spicata (Spearmint) Leaf/Stem Oil, Lavandula Hybrida (Lavandin) Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Sodium Levulinate, Maltodextrin, Coconut Acid, Cellulose Gum, Sodium Methyl Cocoyl Taurate, Glyceryl Laurate, Sodium Lauroyl Lactylate, Sodium Cocoyl Isethionate, Sodium Lauroamphoacetate, Sodium Methyl Taurate, Sodium Isethionate, Quartz, Sodium Chloride, Gluconolactone, Sodium Benzoate, Potassium Sorbate",
    categories: ["face"],
    weight: "3.4 oz/100mL tube",
    salesCount: 3,
    stock: 23,
    usage: "Apply small amount to wet skin and gently massage in circles.  Rinse thoroughly.  Pat dry.  Pretty nice, huh?",
    images: ["/assets/exfoliating-facial-cleanser1.webp","/assets/exfoliating-facial-cleanser2.webp","/assets/exfoliating-facial-cleanser3.webp"],
    slug: "ultimate-exfoliator",
  },
];

export default productList;
