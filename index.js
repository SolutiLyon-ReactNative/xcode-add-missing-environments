#!/usr/bin/env node

var fs = require('fs');
var randomBytes = require('crypto').randomBytes;
var argv = require('optimist').argv;

if (argv._.length != 1) {
  console.error("Usage: " + argv["$0"] + " <input_file_path>");
}

var xcode = require(process.cwd() + "/" + argv._[0]);

// GLOBAL
var references = Object.keys(xcode.objects);
var rootObjectRef = xcode.rootObject;

function pbx_uid() {
  var uid = null;

  do {
    uid = randomBytes(12).toString('hex').toUpperCase();
  } while (references.indexOf(uid) != -1);
  
  return uid;
}

function createConfiguration(configurations, name, from) {
  for (var i in configurations) {
    var configuration = xcode.objects[configurations[i]];

    if (configuration.name == from) {
      var newIdx = pbx_uid();

      xcode.objects[newIdx] = Object.assign({}, xcode.objects[configurations[i]]);
      xcode.objects[newIdx].name = name;

      return newIdx;
    }
  }
}

function createTargetConfiguration(name, from) {
  // Add configuration for each target
  for (var i in xcode.objects[rootObjectRef].targets) {
    var target = xcode.objects[xcode.objects[rootObjectRef].targets[i]];

    var configurations = xcode.objects[target.buildConfigurationList].buildConfigurations;

    var configIdx = createConfiguration(configurations, name, from);
    if (configIdx) {
      configurations.push(configIdx);
    }
  }
}

function createProjectConfiguration(name, from) {
  // Add configuration for main project
  var configurationList = xcode.objects[rootObjectRef].buildConfigurationList;
  var projectConfigurations = xcode.objects[configurationList].buildConfigurations;

  var projectConfigIdx = createConfiguration(projectConfigurations, name, from);
  if (projectConfigIdx) {
    xcode.objects[configurationList].buildConfigurations.push(projectConfigIdx);
  }
}

createProjectConfiguration("Staging", "Release");
createTargetConfiguration("Staging", "Release");

createProjectConfiguration("PreProduction", "Release");
createTargetConfiguration("PreProduction", "Release");

console.log(JSON.stringify(xcode));
