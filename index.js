var fs = require('fs');
var path = require('path');
var hbs = require('handlebars');

module.exports = function(directory) {
  var config = require(path.resolve(directory, 'config.json'));
  config.directory = directory;
  getContext(config, function(context) {
    var src = template(config)(context);
    fs.writeFileSync(path.resolve(directory, 'index.html'), src);
  });
};

function getContext(config, cb) {
  var context = {};
  for (var key in config) context[key] = config[key];
  context.repositories = config.repositories.sort().map(function(repository) {
    var nameParts = repository.split('/');
    var account = nameParts[0];
    var project = nameParts[1];
    return {
      name: repository,
      repositoryUrl: 'https://github.com/'+repository,
      docUrl: 'https://'+account+'.github.io/'+project
    };
  });
  cb(context);
}

function template(config) {
  var templatePath = path.resolve(config.directory, config.template || 'template.hbs');
  var src = fs.readFileSync(templatePath).toString();
  return hbs.compile(src);
}

