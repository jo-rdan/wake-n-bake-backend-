import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";
chai.should();
chai.use(chaiHttp);

describe("Tests samples", () => {
  it("should start the app", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
