const dotenv = require("dotenv");
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const PORT = process.env.PORT;
dotenv.config();
const url = process.env.URL;

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const products = [];

    $(".package").each((index, element) => {
      const title = $(element).find("h3").text();
      const description = $(element).find(".package-description").text();
      const price = $(element).find(".price-big").text();
      const priceSort = parseInt(
        $(element)
          .find(".price-big")
          .text()
          .replace(/\u00A3/g, "")
          .trim(),
        10
      );
      const discount = $(element).find(".package-price p").text();

      products.push({
        title,
        description,
        price,
        priceSort,
        discount,
      });
    });
    products.sort((a, b) => b.priceSort - a.priceSort);
    products.forEach((element) => delete element.priceSort);
    console.log(products);
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
