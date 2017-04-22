import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import { BasicModel } from './basic.model';

describe("basic.model", () => {

    describe("constructor: property assignment", () => {

        it("should assign all properties in provided data arg", () => {

            class TestModel extends BasicModel {}

            let _data = {
                a_string: 'AAA',
                an_int: 123,
                a_bool: true,
                a_float: 0.02
            };

            deepFreeze(_data);

            let _test = new TestModel(_data);

            expect(_test.hasOwnProperty('a_string')).to.equal(true, "model instance should have 'a_string' property");
            expect(_test.hasOwnProperty('an_int')).to.equal(true, "model instance should have 'an_int' property");
            expect(_test.hasOwnProperty('a_bool')).to.equal(true, "model instance should have 'a_bool' property");
            expect(_test.hasOwnProperty('a_bool')).to.equal(true, "model instance should have 'a_bool' property");
            expect(_test.hasOwnProperty('a_float')).to.equal(true, "model instance should have 'a_float' property");

            expect(typeof _test.a_string).to.equal('string');
            expect(typeof _test.an_int).to.equal('number');
            expect(typeof _test.a_bool).to.equal('boolean');
            expect(typeof _test.a_float).to.equal('number');

            expect(_test.a_string).to.equal('AAA');
            expect(_test.an_int).to.equal(123);
            expect(_test.a_bool).to.equal(true);
            expect(_test.a_float).to.equal(0.02);
        });
    });

    describe("defaults", () => {

        it("should assign properties using defaults (if available) for all properties that are not provided in data arg", () => {

            class TestModel extends BasicModel {
                get defaults () {
                    return {
                        an_int: 321,
                        a_string: 'BBB'
                    };
                }
            }

            let _data = {
                a_string: 'AAA',
                a_bool: true,
                a_float: 0.02
            };

            deepFreeze(_data);

            let _test = new TestModel(_data);

            expect(_test.hasOwnProperty('a_string')).to.equal(true, "model instance should have 'a_string' property");
            expect(_test.hasOwnProperty('an_int')).to.equal(true, "model instance should have 'an_int' property");
            expect(_test.hasOwnProperty('a_bool')).to.equal(true, "model instance should have 'a_bool' property");
            expect(_test.hasOwnProperty('a_float')).to.equal(true, "model instance should have 'a_float' property");

            expect(typeof _test.a_string).to.equal('string');
            expect(typeof _test.an_int).to.equal('number');
            expect(typeof _test.a_bool).to.equal('boolean');
            expect(typeof _test.a_float).to.equal('number');

            expect(_test.a_string).to.equal('AAA');
            expect(_test.an_int).to.equal(321);
            expect(_test.a_bool).to.equal(true);
            expect(_test.a_float).to.equal(0.02);
        });
    });
});
