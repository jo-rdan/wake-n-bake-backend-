import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";
chai.should();
chai.use(chaiHttp);

describe("User Tests", () => {
  it("should sign up a user with email", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .send({
        userEmail: "jokayinamura@gmail.com",
        userPassword: "dangerous",
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  // it("should return validation error when existing email", (done) => {
  //   chai
  //     .request(app)
  //     .post("/api/v1/users/signup")
  //     .send({
  //       userEmail: "jokayinamura@gmail.com",
  //       userPassword: "dangerous",
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(409);
  //       done();
  //     });
  // });
  it("should return validation error when empty request", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .send()
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
  it("should return validation error when invalid email", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .send({
        userEmail: "jo.com",
        userPassword: "SURE!",
      })
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
});
