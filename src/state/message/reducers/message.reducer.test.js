import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// data
import { MESSAGE_STYLE } from 'data/models/basic/message.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// local
import * as Reducer from './message.reducer';
import * as constants from '../message.constants';

// TODO: add more tests

describe("message reducer", () => {

    it("should return before state by default", () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.message(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    describe("API_WILL_READ", () => {

        it("should return INFO Message with icon, no expire & label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: api_constants.API_WILL_READ, payload: 'users/1'
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.not.be.null;
            expect(_result.style).to.equal(MESSAGE_STYLE.INFO);
            expect(_result).to.have.ownProperty('icon');
            expect(_result.icon).to.have.ownProperty('class');
            expect(_result.expire).to.equal(0);
        });

        it("should include 'fetching ' in label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: api_constants.API_WILL_READ, payload: 'users/1'
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^fetching\s/);
        });
    });

    describe("API_READ", () => {

        it("should return SUCCESS Message with no icon, correct expire & label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: api_constants.API_READ, payload: {endpoint: 'users/1'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.not.be.null;
            expect(_result.style).to.equal(MESSAGE_STYLE.SUCCESS);
            expect(_result).not.to.have.ownProperty('icon');
        });

        it("should include 'successfully fetched ' in label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: api_constants.API_READ, payload: {endpoint: 'users/1'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^successfully\sfetched\s/);
        });
    });

    describe("ACTION_REQUEST_DELETE_CONFIRMATION", () => {

        it("should return WARNING Message with icon, no expire, confirm / cancel buttons & label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: constants.ACTION_REQUEST_DELETE_CONFIRMATION,
                data: {
                    type: 'tasks',
                    id: 123
                }
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.not.be.null;
            expect(_result.style).to.equal(MESSAGE_STYLE.WARNING);
            expect(_result).to.have.ownProperty('icon');
            expect(_result.icon).to.have.ownProperty('class');
            expect(_result).to.have.ownProperty('buttons');
            expect(_result.buttons.length).to.equal(2);
            expect(_result.expire).to.equal(0);
        });

        it("should include 'are you sure you want to delete ' in label", () => {

            const _state_before = 'AAA';
            const _action = {
                type: constants.ACTION_REQUEST_DELETE_CONFIRMATION,
                data: {
                    type: 'tasks',
                    id: 123
                }
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^are\syou\ssure\syou\swant\sto\sdelete\s/);
        });
    });

    describe("ACTION_CANCEL_DELETE", () => {

        it("should return null", () => {

            const _state_before = 'AAA';
            const _action = {
                type: constants.ACTION_CANCEL_DELETE
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result).to.be.null;
        });
    });
});
