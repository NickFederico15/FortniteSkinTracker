const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSkins', mid.requiresLogin, controllers.Skin.getSkins);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Skin.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Skin.make);
  app.delete('/deleteSkin', mid.requiresLogin, controllers.Skin.deleteSkin);
  app.get('/skins', mid.requiresLogin, controllers.Skin.skinPage);
  app.get('/info', mid.requiresSecure, controllers.Skin.infoPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresSecure, controllers.Account.notFoundPage);
};

module.exports = router;
