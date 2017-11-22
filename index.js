const _ = require('lodash')
const debug = require('debug')('polymatch')
const nm = require('nanomatch')

/*
 * 
 */

module.exports = class Polymatch {
    constructor () {
        this.targets = {}
    }
    on (target) {
        if(_.isFunction(target)){
            this.selectedTarget = target()        
        }else{
            this.selectedTarget = target
        }
        debug('target %o', this.selectedTarget)
        return this
    }
    use (name, filter) {
        if(arguments.length == 0) {
            throw new Error('name undefined')
        }
        if(arguments.length == 1) {
            const filters = arguments[0]
            if(filters instanceof PlayautoFilter){
                this.selectedTarget = filters.selectedTarget
                _.merge(this.targets, filters.targets)
                return this
            }
            if(!_.isObject(filters)){
                throw new Error('filters type invalid')
            }
            for(let [key, value] of Object.entries(filters)){
                this.use(key, value)
            }
            return this
        }
        if(!_.isFunction(filter)){
            throw new Error('filter not function')
        }
        if(!this.targets[this.selectedTarget]){
            this.targets[this.selectedTarget] = {}
        }
        debug('use %o', name)
        this.targets[this.selectedTarget][name] = filter
        return this
    }
    input (input) {
        this.input = input
        return this
    }
    type (type) {
        if(_.isString(type)){
            if(type.includes(',')){
                type = type.split(',')[0]
            }
            if(type.includes('/')){
                type = type.split('/')
                type = type.length > 1 ? type[1] : type[0]
            }
            this.types = type.split('+').slice(1)
        }else if(_.isArray(type)){
            this.types = type
        }else{
            throw new Error('filter.type invalid')
        }
        return this
    }
    value () {
        if (this.types.length === 0) {
            debug('skip')
            return this.input
        }
        debug('before %O', this.input)
        const untouched_filter = new Set(this.types)

        for(let [key, target] of Object.entries(this.targets)){
            // debug('match? %o %o', this.selectedTarget, key)
            if(nm.isMatch(this.selectedTarget, key)){
                debug('match! %o %o', this.selectedTarget, key)
                for(let type of this.types){
                    // debug('target.type? %o %O', type, target)
                    if(target[type]){
                        // debug('target.type %o', type)
                        this.input = target[type](this.input)
                        untouched_filter.delete(type)
                        continue
                    }
                }
            }
        }
        untouched_filter.forEach( e => {
            logger.warn(`filters(${e}) not found`)
        })
        
        if(untouched_filter.size === 0){
            debug(' after %O', this.input)
        }
        return this.input
    }
    
}