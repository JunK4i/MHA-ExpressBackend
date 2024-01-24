// const { expect } = require("chai");
// const JSONStorageService = require("../src/services/JsonStorageService");
// const CsvStorageService = require("../src/services/CsvStorageService");

import * as chai from "chai";
let expect = chai.expect;
import JSONStorageService from "../src/services/JsonStorageService.js";
import CsvStorageService from "../src/services/CsvStorageService.js";
import Joi from "joi";

const itemSchema = Joi.object({
  id: Joi.string()
    .pattern(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    )
    .required(), // UUID v4
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
});

const testData = [
  {
    id: "0d145456-d25d-4719-bd62-7f7f139fd13a",
    name: "Wireless Headphones",
    description: "Noise-cancelling, over-ear headphones",
    price: 200,
    quantity: 20,
  },
  {
    id: "06ff6d97-bb6c-4223-9183-8bf5fd165ef4",
    name: "Smartphone",
    description: "Latest model with advanced features",
    price: 800,
    quantity: 15,
  },
];

describe("JSONStorageService", () => {
  const storageService = new JSONStorageService("./src/inventory.json");

  it("should write and read data correctly", () => {
    storageService.write(testData);

    const readData = storageService.read();
    expect(readData).to.deep.equal(testData);

    // Validate the shape of the data
    readData.forEach((item) => {
      const { error } = itemSchema.validate(item);
      expect(error).to.be.undefined;
    });
  });
});

describe("CSVStorageService", () => {
  const storageService = new CsvStorageService("./src/inventory.csv");

  it("should write and read data correctly", () => {
    storageService.write(testData);

    const readData = storageService.read();
    expect(readData).to.deep.equal(testData);

    // Validate the shape of the data
    readData.forEach((item) => {
      const { error } = itemSchema.validate(item);
      expect(error).to.be.undefined;
    });
  });
});
