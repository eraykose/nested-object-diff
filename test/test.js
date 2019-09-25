var diff = require('../dist/index').diff;
var expect = require('chai').expect;

describe('diff', function() {
  describe('A target that has no properties', function() {
    it('shows no differences when compared to another empty object', function() {
      expect(diff({}, {})).to.be.an('array').that.is.empty;
    });

    it('when compared with an object having other properties', function() {
      var comparand = {
        id: '1',
        name: 'test'
      };

      var diffData = diff({}, comparand);

      expect(diffData.length).to.eql(2);

      expect(diffData[0]).to.have.property('type');
      expect(diffData[1].type).to.be.a('string');
      expect(diffData[0].type).to.eql('A');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.be.a('string');
      expect(diffData[0].path).to.eql('id');
      expect(diffData[0]).to.have.property('rhs');
      expect(diffData[0].rhs).to.eql('1');

      expect(diffData[1]).to.have.property('type');
      expect(diffData[1].type).to.be.a('string');
      expect(diffData[1].type).to.eql('A');
      expect(diffData[1]).to.have.property('path');
      expect(diffData[1].path).to.be.a('string');
      expect(diffData[1].path).to.eql('name');
      expect(diffData[1]).to.have.property('rhs');
      expect(diffData[1].rhs).to.eql('test');
    });
  });

  describe('A target that has one property', function() {
    var lhs = {
      one: 'property'
    };

    it('shows no differences when compared to itself', function() {
      expect(diff(lhs, lhs)).to.be.an('array').that.is.empty;
    });

    it('shows the property as removed when compared to an empty object', function() {
      var diffData = diff(lhs, {});

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.be.a('string');
      expect(diffData[0].type).to.eql('D');
    });

    it('shows the property as edited when compared to an object with null', function() {
      var diffData = diff(lhs, {
        one: null
      });

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.be.a('string');
      expect(diffData[0].type).to.eql('E');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.be.a('string');
      expect(diffData[0].path).to.eql('one');
      expect(diffData[0]).to.have.property('lhs');
      expect(diffData[0].lhs).to.eql('property');
      expect(diffData[0]).to.have.property('rhs');
      expect(diffData[0].rhs).to.eql(null);
    });

    it('shows the property as edited when compared to an array', function() {
      var diffData = diff(lhs, ['one']);

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.be.a('string');
      expect(diffData[0].type).to.eql('E');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('');
    });
  });

  describe('Array comparison', function() {
    it('compare simple arrays', function() {
      var lhs = [1, 2, 3];
      var rhs = [1, 2, 4];

      var diffData = diff(lhs, rhs);

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.eql('E');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('2');
      expect(diffData[0]).to.have.property('lhs');
      expect(diffData[0].lhs).to.eql(3);
      expect(diffData[0]).to.have.property('rhs');
      expect(diffData[0].rhs).to.eql(4);
    });
  });

  describe('Comparison with options', function() {
    var lhs = {
      shop: {
        products: [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
          { id: 3, name: 'c' }
        ]
      },
      name: 'foo'
    };

    var rhs = {
      shop: {
        products: [
          { id: 1, name: 'a' },
          { id: 4, name: 'd' },
          { id: 5, name: 'e' },
          { id: 3, name: 'cc' }
        ]
      },
      name: 'baz'
    };

    it('compare with matchKey', function() {
      var diffData = diff(lhs, rhs, { matchKey: 'id' });

      expect(diffData.length).to.eql(6);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.eql('D');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('shop.products');
      expect(diffData[0]).to.have.property('lhs');
      expect(JSON.stringify(diffData[0].lhs)).to.eql('{"id":2,"name":"b"}');
      expect(diffData[1]).to.have.property('type');
      expect(diffData[1].type).to.eql('M');
      expect(diffData[1]).to.have.property('path');
      expect(diffData[1].path).to.eql('shop.products');
      expect(diffData[1]).to.have.property('item');
      expect(JSON.stringify(diffData[1].item)).to.eql('{"id":3,"name":"c"}');
      expect(diffData[1]).to.have.property('lhsIndex');
      expect(diffData[1].lhsIndex).to.eql(2);
      expect(diffData[1]).to.have.property('rhsIndex');
      expect(diffData[1].rhsIndex).to.eql(3);
      expect(diffData[2]).to.have.property('type');
      expect(diffData[2].type).to.eql('E');
      expect(diffData[2]).to.have.property('path');
      expect(diffData[2].path).to.eql('shop.products.3.name');
      expect(diffData[2]).to.have.property('lhs');
      expect(diffData[2].lhs).to.eql('c');
      expect(diffData[2]).to.have.property('rhs');
      expect(diffData[2].rhs).to.eql('cc');
      expect(diffData[3]).to.have.property('type');
      expect(diffData[3].type).to.eql('A');
      expect(diffData[3]).to.have.property('path');
      expect(diffData[3].path).to.eql('shop.products.1');
      expect(diffData[3]).to.have.property('rhs');
      expect(JSON.stringify(diffData[3].rhs)).to.eql('{"id":4,"name":"d"}');
      expect(diffData[4]).to.have.property('type');
      expect(diffData[4].type).to.eql('A');
      expect(diffData[4]).to.have.property('path');
      expect(diffData[4].path).to.eql('shop.products.2');
      expect(diffData[4]).to.have.property('rhs');
      expect(JSON.stringify(diffData[4].rhs)).to.eql('{"id":5,"name":"e"}');
      expect(diffData[5]).to.have.property('type');
      expect(diffData[5].type).to.eql('E');
      expect(diffData[5]).to.have.property('path');
      expect(diffData[5].path).to.eql('name');
      expect(diffData[5]).to.have.property('lhs');
      expect(diffData[5].lhs).to.eql('foo');
      expect(diffData[5]).to.have.property('rhs');
      expect(diffData[5].rhs).to.eql('baz');
    });

    it('compare only added elements/properties', function() {
      var diffData = diff(lhs, rhs, { matchKey: 'id', types: ['A'] });

      expect(diffData.length).to.eql(2);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.eql('A');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('shop.products.1');
      expect(diffData[0]).to.have.property('rhs');
      expect(JSON.stringify(diffData[0].rhs)).to.eql('{"id":4,"name":"d"}');
      expect(diffData[1]).to.have.property('type');
      expect(diffData[1].type).to.eql('A');
      expect(diffData[1]).to.have.property('path');
      expect(diffData[1].path).to.eql('shop.products.2');
      expect(diffData[1]).to.have.property('rhs');
      expect(JSON.stringify(diffData[1].rhs)).to.eql('{"id":5,"name":"e"}');
    });

    it('compare only deleted elements/properties', function() {
      var diffData = diff(lhs, rhs, { matchKey: 'id', types: ['D'] });

      expect(diffData.length).to.eql(1);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.eql('D');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('shop.products');
      expect(diffData[0]).to.have.property('lhs');
      expect(JSON.stringify(diffData[0].lhs)).to.eql('{"id":2,"name":"b"}');
    });

    it('compare only edited elements/properties', function() {
      var diffData = diff(lhs, rhs, { matchKey: 'id', types: ['E'] });

      expect(diffData.length).to.eql(2);
      expect(diffData[0]).to.have.property('type');
      expect(diffData[0].type).to.eql('E');
      expect(diffData[0]).to.have.property('path');
      expect(diffData[0].path).to.eql('shop.products.3.name');
      expect(diffData[0]).to.have.property('lhs');
      expect(diffData[0].lhs).to.eql('c');
      expect(diffData[0]).to.have.property('rhs');
      expect(diffData[0].rhs).to.eql('cc');
      expect(diffData[1]).to.have.property('type');
      expect(diffData[1].type).to.eql('E');
      expect(diffData[1]).to.have.property('path');
      expect(diffData[1].path).to.eql('name');
      expect(diffData[1]).to.have.property('lhs');
      expect(diffData[1].lhs).to.eql('foo');
      expect(diffData[1]).to.have.property('rhs');
      expect(diffData[1].rhs).to.eql('baz');
    });

    // it('compare only deleted elements/properties', function() {
    //   var diffData = diff(lhs, rhs, { matchKey: 'id', types: ['M'] });

    //   expect(diffData.length).to.eql(1);
    //   expect(diffData[0]).to.have.property('type');
    //   expect(diffData[0].type).to.eql('M');
    //   expect(diffData[0]).to.have.property('path');
    //   expect(diffData[0].path).to.eql('shop.products');
    //   expect(diffData[0]).to.have.property('item');
    //   expect(JSON.stringify(diffData[0].item)).to.eql('{"id":3,"name":"c"}');
    //   expect(diffData[0]).to.have.property('lhsIndex');
    //   expect(diffData[0].lhsIndex).to.eql(2);
    //   expect(diffData[0]).to.have.property('rhsIndex');
    //   expect(diffData[0].rhsIndex).to.eql(3);
    // });
  });
});
