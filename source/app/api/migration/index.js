const Methods = require('./methods');
const Validations = require('./validations');

exports.routes = [
  {
    method: 'POST',
    path: '/migrate/up',
    options: {
      // validate : Validations.createAudit,
      tags: [
        'api', 'Migration'
      ],
      // auth: {
      // 	strategies: ['keycloak-jwt'],
      // 	access: {
      // 	  scope: ['realm:admin', 'editor', 'other-resource:creator', 'scope:foo.READ']
      // 		scope: ['realm:greeter']
      // 	}
      // },
      handler: (request, h) => Methods.migrate(request, h)
    }
  }
]
