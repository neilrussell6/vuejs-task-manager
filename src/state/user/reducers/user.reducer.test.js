import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';

// data
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// utils
import * as LocalStorageUtils from 'utils/local-storage/local-storage.utils';

// local
import * as Reducer from './user.reducer';
import * as user_constants from '../user.constants';

describe("user reducer", () => {

    afterEach(() => {
        if ('restore' in LocalStorageUtils.view) {
            LocalStorageUtils.view.restore(); // Unwraps the spy
        }
        if ('restore' in LocalStorageUtils.view) {
            LocalStorageUtils.store.restore(); // Unwraps the spy
        }
    });

    it("should return before state by default", () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.user(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    describe("API_CREATED", () => {

        it("should return INFO Message with icon, no expire & label", () => {

            const _state_before = [];
            const _action = {
                type: api_constants.API_CREATED,
                payload: {
                    data: {
                        type: 'access_tokens',
                        attributes: { access_token: '1234' }
                    }
                }
            };

            deepFreeze(_state_before);
            deepFreeze(_action);

            let _result = Reducer.user(_state_before, _action);

            expect(_result).to.be.an.instanceof(User, 'result should be instance of User');
            expect(_result.access_token).to.equal('1234');
            expect(_result.is_authenticated).to.be.true;
        });
    });

    describe("ACTION_UPDATE_LOCAL_USER", () => {

        it("should update user with given data", () => {

            const _state_before = new User({ first_name: 'AAA', last_name: 'BBB' });
            const _action = {
                type: user_constants.ACTION_UPDATE_LOCAL_USER,
                data: {
                    last_name: 'BBB222',
                    ccc: 'CCC'
                }
            };

            deepFreeze(_state_before);
            deepFreeze(_action);

            let _result = Reducer.user(_state_before, _action);

            expect(_result).to.be.an.instanceof(User, 'result should be instance of User');
            expect(_result.first_name).to.equal('AAA');
            expect(_result.last_name).to.equal('BBB222');
            expect(_result.ccc).to.equal('CCC');
        });
    });

    describe("ACTION_FETCH_OR_CREATE_LOCAL_USER", () => {

        describe("given an existing user in state", () => {

            it("should return existing user from state", () => {

                sinon.stub(LocalStorageUtils, 'view').returns(null);

                const _state_before = new User({ uuid: '1234', first_name: 'AAA' });
                const _action = {
                    type: user_constants.ACTION_FETCH_OR_CREATE_LOCAL_USER
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.user(_state_before, _action);

                expect(_result).to.be.an.instanceof(User, 'result should be instance of User');
                expect(_result.first_name).to.equal('AAA');
                expect(_result.uuid).to.equal('1234');
            });
        });

        describe("given no existing user in state or in localStorage", () => {

            it("should create new default user with unique local_id", () => {

                sinon.stub(LocalStorageUtils, 'view').returns(null);
                sinon.stub(LocalStorageUtils, 'store');

                const _state_before = user_constants.DEFAULT_STATE;
                const _action = {
                    type: user_constants.ACTION_FETCH_OR_CREATE_LOCAL_USER
                };

                deepFreeze(_action);

                let _result = Reducer.user(_state_before, _action);

                expect(_result).to.be.an.instanceof(User, 'result should be instance of User');
                expect(_result.first_name).to.be.null;
                expect(_result.is_authenticated).to.be.false;
                expect(_result.access_token).to.be.null;
                expect(_result).to.have.property('local_id').that.is.a('string');
            });
        });

        describe("given an existing user in localStorage with no server_id", () => {

            it("should return new user instance based on data from localStorage", () => {

                sinon.stub(LocalStorageUtils, 'view').returns('{"first_name": "AAA", "is_authenticated": false, "local_id": "1234"}');

                const _state_before = user_constants.DEFAULT_STATE;
                const _action = {
                    type: user_constants.ACTION_FETCH_OR_CREATE_LOCAL_USER
                };

                deepFreeze(_action);

                let _result = Reducer.user(_state_before, _action);

                expect(_result).to.be.an.instanceof(User, 'result should be instance of User');
                expect(_result.first_name).to.equal('AAA');
                expect(_result.is_authenticated).to.be.false;
                expect(_result.access_token).to.be.null;
                expect(_result.local_id).to.equal('1234');

                LocalStorageUtils.view.restore(); // Unwraps the spy
            });
        });
    });
});