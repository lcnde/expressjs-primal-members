// configure dotenv to use database secrets
require('dotenv').config({path: '../../.env'});

// connect to database
const mongoose = require('mongoose');
const mongoDb = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.omje9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

// we will use async later to create multiple records asynchronously
const async = require('async')

// require models
const Product = require('../../models/product');
const Flavor = require('../../models/flavor');

// arrays that will store the records
const productsArray = [];
const flavorsArray = [];

// function to create the individual product
const productCreate = (
  name, 
  option,
  description, 
  photo_url, 
  flavor, 
  callback) => {

    const productDetails = {
      name: name,
      option: option,
      // price: price,
      // members_price: members_price,
      description: description,
      photo_url: photo_url,
      flavor: flavor,
    };

    const product = new Product(productDetails);

    product.save(function(err) {
      if (err) {
        return callback(err, null);
      };

      productsArray.push(product);
      callback(null, product);
    });
};

const flavorCreate = (name, photo_url, callback) => {

  const flavorDetails = {
    name: name,
    photo_url: photo_url
  };

  const flavor = new Flavor(flavorDetails);

  flavor.save(function(err) {
    if (err) {
      return callback(null, flavor);
    };

    flavorsArray.push(flavor);
    callback(null, flavor);
  });
};

// function that will create multiple flavors
// this function needs to be before the function to create products because you need to add flavors to products so they need to be created before them.
const createFlavors = (cb) => {
  async.parallel([
    function(done) {
      flavorCreate(
        'Neutral',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/neutral_j9l6uh.jpg',
        done
      );
    },
    function(done) {
      flavorCreate(
        'Soda',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/soda_q8umuj.jpg',
        done
      );
    },
    function(done) {
      flavorCreate(
        'Orange',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/orange_a1knvu.jpg',
        done
      );
    },
    function(done) {
      flavorCreate(
        'Lime',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/lime_tscdby.jpg',
        done
      );
    },
    function(done) {
      flavorCreate(
        'Watermelon',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/watermelon_bjgeh2.jpg',
        done
      );
    },
    function(done) {
      flavorCreate(
        'Peach',
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662468572/express-members-only/flavors/peach_lrpmqp.jpg',
        done
      );
    },

  ], cb);
};

// function that will create multiple products
const createProducts = (cb) => {
  async.parallel([
    function(done) {
      productCreate(
        'Isolate Protein MEC',
        [
          {
            quantity: '1kg',
            cost: {
              price: 19.99,
              members_price: 13.99
            }
          },
          {
            quantity: '5kg',
            cost: {
              price: 79.99,
              members_price: 60.99
            }
          },
        ],
        `Iso Intense MEC is an instantized whey protein isolate extracted from sweet dairy whey. Proprietary membrane techniques are used to yield a highly pure, nutritionally superior and undenatured isolate protein. It goes through an instantizing process that allows it to disperse easily in Milk and other beverages.
        Infusion of the Multi-enzyme complex (MEC) makes it easier to digest, thus it gets absorbed faster in our body. Its delicious flavor profile, high protein content, and low lactose and fat levels makes it the protein of choice for many beverage applications.`,
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662472356/express-members-only/products/iso_abqvly.png',
        flavorsArray,
        done
      );
    },
    function(done) {
      productCreate(
        'L-Glutamine',
        [
          {
            quantity: '100g',
            cost: {
              price: 19.99,
              members_price: 13.99
            }
          },
          {
            quantity: '300g',
            cost: {
              price: 29.99,
              members_price: 23.99
            }
          },
        ],
        `L-glutamine is the most abundant amino acid in the blood and in muscle cells. It is classified as a conditionally essential amino acid, which means that the body is normally capable of manufacturing enough to meet its metabolic needs. Glutamine has several functions including the support of immunity, gastrointestinal integrity, insulin secretion, neurological activity, and muscle protein synthesis. Glutamine actually supplies 35% of nitrogen to muscles to synthesise proteins. This, in turn, will promote protein synthesis. Why is this important? Well, the benefits of maintaining a high nitrogen balance in the muscle prevents muscle breakdown, therefore retaining more muscle. This equates to a leaner you! A leaner you means you have less body fat, so, in essence, glutamine may help with the reduction of overall body fat.`,
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662472352/express-members-only/products/glutamine_szx2nk.png',
        flavorsArray,
        done
      );
    },
    function(done) {
      productCreate(
        'Intense Gainer',
        [
          {
            quantity: '100g',
            cost: {
              price: 19.99,
              members_price: 13.99
            }
          },
          {
            quantity: '300g',
            cost: {
              price: 32.00,
              members_price: 25.99
            }
          },
          {
            quantity: '500g',
            cost: {
              price: 56.00,
              members_price: 40.27
            }
          }
        ],
        `BCAA offers a unique ratio - 2 Leucine, 1 Isoleucine, 1 Valine - that is specifically tuned to deliver the ideal amounts of these three amino acids during all phases of muscle development and maintenance. Through this formulation, amino acids are released both before and after a workout. Muscle Monk BCAA minimizes muscle damage, while supporting increased lean body mass.
        Product Benefits:
        - Supports Lean Mass Growth
        - Reduces Muscle Breakdown
        - Increases Protein Synthesis`,
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662472347/express-members-only/products/gainer_ol2nbo.png',
        flavorsArray,
        ['100g', '150g','200g'],
        done
      );
    },
    function(done) {
      productCreate(
        'Isolate Protein MEC',
        [
          {
            quantity: '1kg',
            cost: {
              price: 45.50,
              members_price: 31.99
            }
          },
          {
            quantity: '3kg',
            cost: {
              price: 78.80,
              members_price: 60.99
            }
          },
        ],
        `BCAA offers a unique ratio - 2 Leucine, 1 Isoleucine, 1 Valine - that is specifically tuned to deliver the ideal amounts of these three amino acids during all phases of muscle development and maintenance. Through this formulation, amino acids are released both before and after a workout. Muscle Monk BCAA minimizes muscle damage, while supporting increased lean body mass.
        Product Benefits:
        - Supports Lean Mass Growth
        - Reduces Muscle Breakdown
        - Increases Protein Synthesis`,
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662472339/express-members-only/products/bcaa_chj6nl.png',
        flavorsArray,
        done
      );
    },
    function(done) {
      productCreate(
        'Creatine Monohydrate',
        [
          {
            quantity: '100g',
            cost: {
              price: 19.99,
              members_price: 11.99
            }
          },
          {
            quantity: '300g',
            cost: {
              price: 29.99,
              members_price: 23.99
            }
          },
        ],
        `Creatine designed for the Indian Genotype, is a 100% pure Creatine Monohydrate powder. It contains 3g of fast-absorbing micronized creatine per serving and helps to give a continuous supply of energy to your muscles. and provides high energy for high intensity training. It also helps to support muscle strength, protein synthesis and lean muscle mass. Muscle Monk creatine Monohydrate is 100% sugar free, gluten free, and soy free and has no additive preservatives.
        - Increase Size & Strength
        - Increase Power & Performance
        - Increased Energy During Training
        - Promotes Muscular Effort`,
        'https://res.cloudinary.com/djg52dvw1/image/upload/v1662472342/express-members-only/products/creatine_qi8r5t.png',
        flavorsArray,
        done
      );
    },

  ], cb);
};

// execute, in order, the functions that will create and save to database flavors and products
async.series([
  createFlavors,
  createProducts
], function(err, results) {
  if (err) {
    return console.log('Final Err:', err);
  };

  console.log(results);

  // all done, disconnect from database
  mongoose.connection.close();
});
