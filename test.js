require('debugs/init')
const assert = require('chai').assert
const _ = require('lodash')
const debug = require('debug')('ploymatch')
const Polymatch = require('./index.js')

describe('filter', () => {
    // mocha test.js --grep="filter"
    it('payload with single mime-type string', async () => {
        const filters = new Polymatch
        
        filters.on('v1')
            .use('fullname', (input) => {
                input.full = input.first + ' ' + input.last
                return input
            })
        
        const result = filters
            .on('v1')
            .input({first: 'Barack', last: 'Obama'})
            .type('application/json+fullname')
            .value()

        assert.property(result, 'first')
        assert.property(result, 'last')
        assert.property(result, 'full')
    })
    it('payload with multiple mime-type string', async () => {
        const filters = new Polymatch
        
        filters.on('v1')
            .use('fullname', (input) => {
                input.full = input.first + ' ' + input.last
                return input
            })
            .use('uppercase', (input) => {
                input.uppercase = String(input.first + ' ' + input.last).toLocaleUpperCase()
                return input
            })
        
        const result = filters
            .on('v1')
            .input({first: 'Barack', last: 'Obama'})
            .type('application/json+fullname+uppercase')
            .value()

        assert.property(result, 'first')
        assert.property(result, 'last')
        assert.property(result, 'full')
        assert.property(result, 'uppercase')
    })
    it('composition with json', async () => {
        const filters = new Polymatch
        
        filters.on('v1')
            .use({
                fullname: (input) => {
                    input.full = input.first + ' ' + input.last
                    return input
                }
            })
        
        const result = filters
            .on('v1')
            .input({first: 'Barack', last: 'Obama'})
            .type('application/json+fullname')
            .value()

        assert.property(result, 'first')
        assert.property(result, 'last')
        assert.property(result, 'full')
    })
    it('payload with multiple mime-type array', async () => {
        const filters = new Polymatch
        
        filters.on('v1')
            .use('fullname', (input) => {
                input.full = input.first + ' ' + input.last
                return input
            })
            .use('uppercase', (input) => {
                input.uppercase = String(input.first + ' ' + input.last).toLocaleUpperCase()
                return input
            })
        
        const result = filters
            .on('v1')
            .input({first: 'Barack', last: 'Obama'})
            .type(['fullname', 'uppercase'])
            .value()

        assert.property(result, 'first')
        assert.property(result, 'last')
        assert.property(result, 'full')
        assert.property(result, 'uppercase')
    })
    it.skip('payload with undefined filters', async () => {

    })
    it.skip('payload with multiple require filters', async () => {

    })
})