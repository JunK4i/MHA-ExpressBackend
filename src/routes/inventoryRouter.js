import express from "express";
import fs, { write } from "fs";
import path from "path";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import JSONStorageService from "../services/JsonStorageService";
import CSVStorageService from "../services/CsvStorageService";

const router = express.Router();

// Easily switch between JSON and CSV storage services
const storageService =
  process.env.STORAGE_TYPE === "csv"
    ? new CSVStorageService("src/inventory.csv")
    : new JSONStorageService("src/inventory.json");

router.get("/inventory", (req, res) => {
  const inventory = storageService.read();
  res.send(inventory);
});

router.get("/inventory/:id", (req, res) => {
  const inventory = storageService.read();
  const id = req.params.id;
  console.info(id);
  const item = inventory.find((obj) => obj.id === id);
  if (!item)
    return res.status(404).send("The item with the given ID was not found.");
  res.send(item);
});

router.post("/inventory", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newInventoryItem = {
    id: uuidv4(), // Generate a new UUID for the item ID
    ...req.body,
  };
  const inventory = storageService.read();
  inventory.push(newInventoryItem);
  storageService.write(inventory);
  res.status(201).send(newInventoryItem);
});

router.delete("/inventory/:id", (req, res) => {
  try {
    const inventory = storageService.read();
    const id = req.params.id;
    const item = inventory.find((obj) => obj.id === id);
    if (!item)
      return res.status(404).send("The item with the given ID was not found.");
    if (item.quantity > 0) {
      return res
        .status(400)
        .send("The item with the given ID has quantity greater than 0.");
    }
    const newInventory = inventory.filter((item) => item.id !== id);
    storageService.write(newInventory);
    res.status(204).send({ message: "Item deleted successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
