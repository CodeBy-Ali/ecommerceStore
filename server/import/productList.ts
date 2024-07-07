import { IProduct } from "../src/model/productModel";

const productList: Array<IProduct> = [
  {
    title: "Old School Castile Soap - Orange and Tangerine",
    price: 12.99,
    description: "Get an update on your Grandpa's old timey soap with this concentrated castile soap.  Millions of uses in this bottle.  Well, not millions.  But many!  Well, not THAT many.  But at least a few, which is more than can be said for most products!",
    usage: "Add 3oz (6 tablespoons) of Phil's Castile Soap Concentrate to your Phil's Foamer bottle, then fill half-way with water (best with purified water).  Swirl to mix.  Fill the rest of the way with water.  Screw the top back on tightly and shake it up.  Keep shaking.  OK, people are looking.  You can stop now.  Congrats, you now have a new bottle of foaming body wash to keep your philthy self clean.  Use within four weeks once diluted.",
    ingredients: "Water, Helianthus Annuus (sunflower) Seed Oil*, Cocos Nucifera (coconut) Oil*, Potassium Hydroxide**, Glycerin*, Citrus Sinensis (orange) Peel Oil, Lavandula Hybrid (lavandin) Oil, Citrus Tangerine (tangerine) Oil, Rosmarinus Officinalis (rosemary) Extract.",
    category: "body",
    weight: "11 FL. 0Z. (325ml)",
    salesCount: 3,
    stockQuantity: 10,
    image: "/assets/castileSoap.webp"
  },
];

export default productList;
