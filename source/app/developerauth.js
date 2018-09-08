const users = {
  developer: {
    username: 'developer',
    password: 'Selenite@123',
    name: 'Noob',
    id: '1'
  }
};

module.exports = {
    name: 'developerauth',
    version: '1.0.0',
    register : function (server, options) {

        const validate = async (request, username, password, h) => {
            
            const user = users[username];
            if (!user) {
                return { credentials: null, isValid: false };
            }

            const isValid = password === user.password;
            const credentials = { id: user.id, name: user.name, username: user.username };

            return { isValid, credentials };
        };

        server.auth.strategy('developer', 'basic', { validate });
    }
}