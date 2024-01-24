const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const dotenv = require("dotenv");
chai.use(chaiHttp);

// import chai from "chai";
// import chaiHttp from "chai-http";
// import dotenv from "dotenv";
// const expect = chai.expect;
// chai.use(chaiHttp);

dotenv.config();
const domain = process.env.DOMAIN || "http://localhost:3003/";

describe("Inventory API", () => {
  // Test for GET /inventory
  describe("GET /api/inventory", () => {
    it("should get all inventory items", (done) => {
      chai
        .request(domain)
        .get("api/inventory")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  // Retrieve the ID of the first item in the inventory
  let itemId = 0;
  before((done) => {
    chai
      .request(domain)
      .get("api/inventory")
      .end((err, res) => {
        expect(res).to.have.status(200);
        itemId = res.body[0].id; // Assuming the first item's ID can be used
        done();
      });
  });

  // Test for GET /inventory/:id
  describe("GET /api/inventory/:id", () => {
    it("should get a single inventory item", (done) => {
      chai
        .request(domain)
        .get(`api/inventory/${itemId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("id", itemId);
          done();
        });
    });

    it("should return 404 for non-existent item ID", (done) => {
      const itemId = 9999; // Use an ID that doesn't exist
      chai
        .request(domain)
        .get(`api/inventory/${itemId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // Test for POST /inventory
  describe("POST api/inventory", () => {
    it("should add a new inventory item", (done) => {
      let item = {
        name: "New Item",
        description: "Description of new item",
        price: 100,
        quantity: 10,
      };
      chai
        .request(domain)
        .post("api/inventory/")
        .send(item)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("id");
          done();
        });
    });
  });

  // Test for DELETE /inventory/:id
  describe("DELETE /api/inventory/:id", () => {
    it("should delete an inventory item", (done) => {
      // First, add an item that we'll delete
      let item = {
        name: "Item to Delete",
        description: "This item will be deleted",
        price: 50,
        quantity: 5,
      };

      chai
        .request(domain)
        .post("api/inventory")
        .send(item)
        .end((err, postResponse) => {
          expect(postResponse).to.have.status(201);
          const itemId = postResponse.body.id;
          console.info("Item ID to delete: ", itemId);

          // Now, delete the item
          chai
            .request(domain)
            .delete(`api/inventory/${itemId}`)
            .end((deleteErr, deleteResponse) => {
              expect(deleteResponse).to.have.status(204);

              // Optionally, verify that the item is no longer in the inventory
              chai
                .request(domain)
                .get(`api/inventory/${itemId}`)
                .end((getErr, getResponse) => {
                  expect(getResponse).to.have.status(404);
                  done();
                });
            });
        });
    });

    it("should return 404 for non-existent item ID", (done) => {
      const nonExistentItemId = "9999"; // Use an ID that doesn't exist
      chai
        .request(domain)
        .delete(`api/inventory/${nonExistentItemId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});