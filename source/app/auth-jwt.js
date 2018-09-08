'use strict';

const Boom = require('boom');
const Hoek = require('hoek');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Declare Internals

const internals = {};

internals.defaults = {
    accessTokenName: 'access_token',
    allowQueryToken: false,
    allowCookieToken: false,
    allowMultipleHeaders: false,
    allowChaining: false,
    tokenType: 'Bearer',
    unauthorized: Boom.unauthorized
};

internals.schema = Joi.object().keys({
    validate: Joi.func().required(),
    accessTokenName: Joi.string().required(),
    allowQueryToken: Joi.boolean(),
    allowCookieToken: Joi.boolean(),
    allowMultipleHeaders: Joi.boolean(),
    allowChaining: Joi.boolean(),
    tokenType: Joi.string().required(),
    unauthorized: Joi.func(),
    verifyOptions : Joi.object().keys({
        algorithms : Joi.array(),
    }).required(),
    key : Joi.string().required()
});

internals.implementation = (server, options) => {

    Hoek.assert(options, 'Missing bearer auth strategy options');

    const settings = Hoek.applyToDefaults(internals.defaults, options);
    Joi.assert(settings, internals.schema);

    const headerRegExp = new RegExp(settings.tokenType + '\\s+([^;$]+)','i');

    const scheme = {
        authenticate: async (request, h) => {

            let authorization = request.raw.req.headers.authorization;

            if (settings.allowCookieToken
                && !authorization
                && request.state[settings.accessTokenName] ) {

                authorization = `${settings.tokenType} ${request.state[settings.accessTokenName]}`;
            }

            if (settings.allowQueryToken
                && !authorization
                && request.query[settings.accessTokenName] ) {

                authorization = `${settings.tokenType} ${request.query[settings.accessTokenName]}`;
                delete request.query[settings.accessTokenName];
            }

            if (!authorization) {
                return settings.unauthorized(null, settings.tokenType);
            }

            if (settings.allowMultipleHeaders) {
                const headers = authorization.match(headerRegExp);
                if (headers !== null) {
                    authorization = headers[0];
                }
            }

            const [tokenType, token] = authorization.split(/\s+/);

            if (!token
                || tokenType.toLowerCase() !== settings.tokenType.toLowerCase()) {
                throw settings.unauthorized(null, settings.tokenType);
            }
            let decoded;
            try {
                 decoded = jwt.verify(token, settings.key);
            } catch(e) {
                return Boom.unauthorized();
            }

            const { isValid, credentials } = await settings.validate(request, decoded, h);

            if (!isValid) {
                const message = (settings.allowChaining && request.route.settings.auth.strategies.length > 1) ? null : 'Bad token';
                return h.unauthenticated(settings.unauthorized(message, settings.tokenType), { credentials });
            }

            if (!credentials

                || typeof credentials !== 'object') {
                throw h.unauthenticated(Boom.badImplementation('Bad token string received for Bearer auth validation'), { credentials: {} });
            }

            return h.authenticated({ credentials });
        }
    };

    return scheme;
};

module.exports = {
    name : 'auth-jwt',
    version: '1.0.0',
    register: (server, options) => server.auth.scheme('jwt', internals.implementation)
};