const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateResolveInput = (data) => {
    let errors = {};

    let {resolverProof} = data;

    resolverProof = !isEmpty(resolverProof) ? resolverProof : '';

    if(Validator.isEmpty(resolverProof)) {
        errors.resolverProof = 'Resolver Proof is required!'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}