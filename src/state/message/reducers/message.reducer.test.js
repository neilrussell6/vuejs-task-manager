import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

import { API_WILL_READ, API_READ } from 'state/redux-json-api.settings';

// app
import { MESSAGE_STYLE } from 'data/models/basic/message.model';
import { ACTION_DELETE_TASK } from 'state/tasks/task.settings';

// local
import * as Reducer from './message.reducer';
import * as Config from '../message.settings';

describe('message reducer', () => {

    it('should return before state by default', () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        Reducer.message(_state_before, _action);
    });

    describe('API_WILL_READ', () => {

        it('should return INFO Message with icon, no expire & label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: API_WILL_READ, payload: 'users/1'
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.not.be.null;
            expect(_result.style).to.equal(MESSAGE_STYLE.INFO);
            expect(_result).to.have.ownProperty('icon');
            expect(_result.icon).to.have.ownProperty('class');
            expect(_result.expire).to.equal(0);
        });

        it('should include "fetching " in label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: API_WILL_READ, payload: 'users/1'
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^fetching\s/);
        });
    });

    describe('API_READ', () => {

        it('should return SUCCESS Message with no icon, correct expire & label', () => {

            Config.default_message_expire = 123;

            const _state_before = 'AAA';
            const _action = {
                type: API_READ, payload: {endpoint: 'users/1'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.not.be.null;
            expect(_result.style).to.equal(MESSAGE_STYLE.SUCCESS);
            expect(_result).not.to.have.ownProperty('icon');
            expect(_result.expire).to.equal(123);
        });

        it('should include "successfully fetched " in label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: API_READ, payload: {endpoint: 'users/1'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^successfully\sfetched\s/);
        });
    });

    describe('ACTION_REQUEST_DELETE_CONFIRMATION', () => {

        it('should return WARNING Message with icon, no expire, confirm / cancel buttons & label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: Config.ACTION_REQUEST_DELETE_CONFIRMATION,
                data: {name: 'My First Task'}
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

        it('should include "are you sure you want to delete " in label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: Config.ACTION_REQUEST_DELETE_CONFIRMATION,
                data: {name: 'My First Task'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/^are\syou\ssure\syou\swant\sto\sdelete\s/);
        });

        it('should include task name in label', () => {

            const _state_before = 'AAA';
            const _action = {
                type: Config.ACTION_REQUEST_DELETE_CONFIRMATION,
                data: {name: 'My First Task'}
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result.label).to.match(/My\sFirst\sTask/);
        });
    });

    describe('ACTION_CANCEL_DELETE', () => {

        it('should return null', () => {

            const _state_before = 'AAA';
            const _action = {
                type: Config.ACTION_CANCEL_DELETE
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result).to.be.null;
        });
    });

    describe('ACTION_DELETE_TASK', () => {

        it('should return null', () => {

            const _state_before = 'AAA';
            const _action = {
                type: ACTION_DELETE_TASK
            };

            deepFreeze(_action);

            let _result = Reducer.message(_state_before, _action);

            expect(_result).to.be.null;
        });
    });
});
