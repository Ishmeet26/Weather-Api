import request from "supertest";
import { expect } from "chai";
import app from "../server.js";

describe("Custom Weather API Tests", function () {
  // Test Case 1: Valid City - Mumbai
  it("should return weather data for a valid city", async () => {
    const response = await request(app).get("/weather?city=Mumbai");

    expect(response.status).to.equal(200);
    expect(response.body).to.include.keys("city", "temperature", "condition", "humidity");
  });

  // Test Case 2: Missing City Parameter
  it("should return 400 for missing city parameter", async () => {
    const response = await request(app).get("/weather");

    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal("City parameter is required");
  });

  // Test Case 3: Invalid City Name
  it("should return 404 for an invalid city", async () => {
    const response = await request(app).get("/weather?city=UnknownCity");

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("City not found");
  });

  // Test Case 4: Case-Insensitive City Name
  it("should return weather data for a valid city with different casing", async () => {
    const response = await request(app).get("/weather?city=mumbai"); // Lowercase

    expect(response.status).to.equal(200);
    expect(response.body.city).to.equal("Mumbai");
  });

  // Test Case 5: Check Response Structure for Valid City
  it("should return the correct response structure", async () => {
    const response = await request(app).get("/weather?city=Delhi");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys("city", "temperature", "condition", "humidity");
    expect(response.body.temperature).to.be.a("number");
    expect(response.body.condition).to.be.a("string");
    expect(response.body.humidity).to.be.a("number");
  });

  // Test Case 6: Edge Case - Numeric City Name
  it("should return 404 for numeric city name", async () => {
    const response = await request(app).get("/weather?city=12345");

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("City not found");
  });

  // Test Case 7: Special Characters in City Name
  it("should return 404 for city name with special characters", async () => {
    const response = await request(app).get("/weather?city=Del#hi");

    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("City not found");
  });

  // Test Case 8: Extra Query Parameters (Should Ignore Extra Parameters)
  it("should return weather data even with extra query parameters", async () => {
    const response = await request(app).get("/weather?city=Bangalore&unit=celsius");

    expect(response.status).to.equal(200);
    expect(response.body.city).to.equal("Bangalore");
  });

  // Test Case 9: Ensure Response Headers are Correct
  it("should return application/json content type", async () => {
    const response = await request(app).get("/weather?city=Chennai");

    expect(response.headers["content-type"]).to.include("application/json");
  });

  // Test Case 10: Check Response Time (Performance)
  it("should respond within 200ms", async function () {
    this.timeout(500); // Extend timeout for this test
    const response = await request(app).get("/weather?city=Pune");

    expect(response.status).to.equal(200);
    expect(response.body.city).to.equal("Pune");
  });
});
