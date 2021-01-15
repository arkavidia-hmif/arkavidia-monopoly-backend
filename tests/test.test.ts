import { describe, it } from "mocha";
import { expect } from "chai";

describe("Test function", () => {
  it("should be true as 4 == 4", (done) => {
    expect(4).to.equal(4);
    done();
  });
});
