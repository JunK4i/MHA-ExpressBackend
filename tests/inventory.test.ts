import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import server from 'app';

console.log("test");
describe("Inventory API", () => {
  // Test for GET /inventory
  describe("GET /inventory", () => {
    it("should get all inventory items", (done) => {
      chai
        .request(server)
        .get("/inventory")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  // Test for GET /inventory/:id
  describe("GET /inventory/:id", () => {
    it("should get a single inventory item", (done) => {
      const itemId = 1; // Adjust based on your data
      chai
        .request(server)
        .get(`/inventory/${itemId}`)
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
        .request(server)
        .get(`/inventory/${itemId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // Test for POST /inventory
  describe("POST /inventory", () => {
    it("should add a new inventory item", (done) => {
      let item = {
        name: "New Item",
        description: "Description of new item",
        price: 100,
        quantity: 10,
      };
      chai
        .request(server)
        .post("/inventory")
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
  describe("DELETE /inventory/:id", () => {
    it("should delete an inventory item", (done) => {
      // First, add an item that we'll delete
      let item = {
        name: "Item to Delete",
        description: "This item will be deleted",
        price: 50,
        quantity: 5,
      };

      chai
        .request(server)
        .post("/inventory")
        .send(item)
        .end((err, postResponse) => {
          expect(postResponse).to.have.status(201);
          const itemId = postResponse.body.id;

          // Now, delete the item
          chai
            .request(server)
            .delete(`/inventory/${itemId}`)
            .end((deleteErr, deleteResponse) => {
              expect(deleteResponse).to.have.status(204);

              // Optionally, verify that the item is no longer in the inventory
              chai
                .request(server)
                .get(`/inventory/${itemId}`)
                .end((getErr, getResponse) => {
                  expect(getResponse).to.have.status(404);
                  done();
                });
            });
        });
    });

    it("should return 404 for non-existent item ID", (done) => {
      const nonExistentItemId = 9999; // Use an ID that doesn't exist
      chai
        .request(server)
        .delete(`/inventory/${nonExistentItemId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
// });
