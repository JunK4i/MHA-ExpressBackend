import express from "express";
import fs, { write } from "fs";
import path from "path";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

const readInventory = () => {
  const data = fs.readFileSync(path.resolve("src/inventory.json"));
  return JSON.parse(data);
};

const writeInventory = (inventory) => {
  fs.writeFileSync(
    path.resolve("src/inventory.json"),
    JSON.stringify(inventory, null, 2),
    "utf8"
  );
};

router.get("/inventory", (req, res) => {
  const inventory = readInventory();
  res.send(inventory);
});

router.get("/inventory/:id", (req, res) => {
  const inventory = readInventory();
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
  const inventory = readInventory();
  inventory.push(newInventoryItem);
  writeInventory(inventory);
  res.status(201).send(newInventoryItem);
});

router.delete("/inventory/:id", (req, res) => {
  try {
    const inventory = readInventory();
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
    writeInventory(newInventory);
    res.status(204).send({ message: "Item deleted successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
