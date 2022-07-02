const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const cities = require("./cities");
//connect with mongoose
mongoose //promise support exists ---> hence error handling
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err) => {
    console.log("Mongoose connection error: ", err);
  });
const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const randomno = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 50;
    const campground = new Campground({
      author: "62bdaee9f723cc7ffd37c97b",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[randomno].city}, ${cities[randomno].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/ddl45tvg2/image/upload/v1656638237/YelpCamp/hpwjp9kgbsicxq8yz4y5.jpg",
          filename: "YelpCamp/hpwjp9kgbsicxq8yz4y5",
        },
        {
          url: "https://res.cloudinary.com/ddl45tvg2/image/upload/v1656638237/YelpCamp/hpwjp9kgbsicxq8yz4y5.jpg",
          filename: "YelpCamp/hpwjp9kgbsicxq8yz4y5",
        },
      ],
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro vero eaque ab in. Error illo harum minus quibusdam architecto omnis consectetur ea beatae deserunt quis, ipsam libero repellendus ex explicabo.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [cities[randomno].longitude, cities[randomno].latitude],
      },
    });
    await campground.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
