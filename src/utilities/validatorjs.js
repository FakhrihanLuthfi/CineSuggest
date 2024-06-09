'use strict'

const validatorjs = require('validatorjs')

module.exports = function (data, rules) {
    return new Promise(function (resolve, reject) {
        const validation = new validatorjs(data, rules)

        validatorjs.useLang('id')

        if (validation.fails()) {
            let errorMessages = {}

            Object.entries(validation.errors.all()).forEach(([key, error]) => {
                errorMessages[key] = error[0]
            })

            return reject(errorMessages)
        }

        return resolve(data)
    })
}