var diff = require("../dist/index").default;
var expect = require("chai").expect;

describe("diff", function() {
  describe("A target that has no properties", function() {
    it("shows no differences when compared to another empty object", function() {
      expect(diff({}, {})).to.be.an("array").that.is.empty;
    });

    it("when compared with an object having other properties", function() {
      var comparand = {
        id: "1",
        name: "test"
      };

      var diffData = diff({}, comparand);

      expect(diffData.length).to.eql(2);

      expect(diffData[0]).to.have.property("type");
      expect(diffData[1].type).to.be.a("string");
      expect(diffData[0].type).to.eql("A");
      expect(diffData[0]).to.have.property("path");
      expect(diffData[0].path).to.be.a("string");
      expect(diffData[0].path).to.eql("id");
      expect(diffData[0]).to.have.property("rhs");
      expect(diffData[0].rhs).to.eql("1");

      expect(diffData[1]).to.have.property("type");
      expect(diffData[1].type).to.be.a("string");
      expect(diffData[1].type).to.eql("A");
      expect(diffData[1]).to.have.property("path");
      expect(diffData[1].path).to.be.a("string");
      expect(diffData[1].path).to.eql("name");
      expect(diffData[1]).to.have.property("rhs");
      expect(diffData[1].rhs).to.eql("test");
    });
  });

  describe("A target that has one property", function() {
    var lhs = {
      one: "property"
    };

    it("shows no differences when compared to itself", function() {
      expect(diff(lhs, lhs)).to.be.an("array").that.is.empty;
    });

    it("shows the property as removed when compared to an empty object", function() {
      var diffData = diff(lhs, {});

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property("type");
      expect(diffData[0].type).to.be.a("string");
      expect(diffData[0].type).to.eql("D");
    });

    it("shows the property as edited when compared to an object with null", function() {
      var diffData = diff(lhs, {
        one: null
      });

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property("type");
      expect(diffData[0].type).to.be.a("string");
      expect(diffData[0].type).to.eql("E");
      expect(diffData[0]).to.have.property("path");
      expect(diffData[0].path).to.be.a("string");
      expect(diffData[0].path).to.eql("one");
      expect(diffData[0]).to.have.property("lhs");
      expect(diffData[0].lhs).to.eql("property");
      expect(diffData[0]).to.have.property("rhs");
      expect(diffData[0].rhs).to.eql(null);
    });

    it("shows the property as edited when compared to an array", function() {
      var diffData = diff(lhs, ["one"]);

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property("type");
      expect(diffData[0].type).to.be.a("string");
      expect(diffData[0].type).to.eql("E");
      expect(diffData[0]).to.have.property("path");
      expect(diffData[0].path).to.be.an("undefined");
    });
  });
});
