#!/usr/bin/env node

var fs = require('fs')
	, util = require('util')
	, path = require('path')
	, program = require('commander')
  , colors = require('colors')
  , inquirer = require('inquirer')
  , ProgressBar = require('progress')
  , BottomBar = require('inquirer/lib/ui/bottom-bar')
  , cmdify = require('cmdify')
  , spawn = require('child_process').spawn
  , StyleStats = require('stylestats');

var cssStats = module.exports;

var parsing = [
  '  Parsing'.cyan,
  '| Parsing'.cyan,
  '\\ Parsing'.cyan,
  '- Parsing'.cyan
];

cssStats.stylestats = function(css, path) {

  if (path === undefined) {
    console.log();
    console.log("  error: option '-o, --output [path]' argument missing".red);
    console.log();
  } else {

    var stats = new StyleStats(css, './lib/default.json');

    var ui = new inquirer.ui.BottomBar();

    var dist = path.replace(/\\/g, '/');

    var output =  dist + '/stylestats.json';

    stats.parse(function (error, result) {
      var data = JSON.stringify(result, null, 2);

      fs.readdir(path, function (err, files) {

        if (files === undefined) {
          console.log("  error: verify directory exists".red);
          process.exit();
        } else {

          var cmd = spawn(cmdify('stylestats'), [ css, '-c', './lib/default.json' ], { stdio: 'pipe' });

          cmd.stdout.pipe(ui.log);

          cmd.on('close', function() {
            ui.updateBottomBar('');
            process.exit();
          });

          fs.writeFile(output, data, function(err) {
            if (err) {
              console.log("  error: output json was not saved".red);
            }
          });
        }
      });

    });

  }
};

cssStats.csscss = function(css, path) {

  if (path === undefined) {
    console.log();
    console.log("  error: option '-o, --output [path]' argument missing".red);
    console.log();
  } else {

    var confirm = [{
      type: 'confirm',
      name: 'confirm',
      message: 'This may take a while depending on your CSS file size, would you like to continue?'.yellow,
      default: false
    }];

    inquirer.prompt( confirm, function(answer) {
      if (answer.confirm === true) {
        var i = 4;

        var ui = new inquirer.ui.BottomBar({ bottomBar: parsing[i % 4] });

        var timer = setInterval(function() {
          ui.updateBottomBar(parsing[i++ % 4]);
        }, 300 );

        var source = '--css=' + css;
        var output = '--path=' + path;

        var cmd = spawn(cmdify('grunt'), [ 'duplicate', source,  output], { stdio: 'pipe' });

        cmd.stdout.pipe(ui.log);

        cmd.on('close', function() {
          clearInterval(timer);
          ui.updateBottomBar('');
          process.exit();
        });
      }
    });

  }
};

cssStats.setup = function() {
  console.log('Installing css-stats parser...'.cyan + '\nenter your computer password if prompted'.underline);

  var ui = new inquirer.ui.BottomBar();

  var cmd = spawn(cmdify('sudo'), ['gem', 'install', 'csscss' ], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('Installed successfully!'.green);
    process.exit();
  });
};

cssStats.start = function() {
  var src = __dirname + '/Gruntfile.js',
      dist = process.cwd() + '/Gruntfile.js';

  fs.createReadStream(src).pipe(fs.createWriteStream(dist));

  console.log('Generating css-stats scaffolding...'.cyan);

  cssStats.globalNpm();
};

cssStats.globalNpm = function() {
  var ui = new inquirer.ui.BottomBar();

  var cmd = spawn(cmdify('npm'), ['install', '-g', 'stylestats', 'grunt-cli' ], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('');
    cssStats.localNpm();
  });
};

cssStats.localNpm = function() {
  var ui = new inquirer.ui.BottomBar();

  var cmd = spawn(cmdify('npm'), ['install', 'grunt', 'grunt-csscss', 'grunt-contrib-copy', 'grunt-contrib-clean'], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('');
    ui.updateBottomBar('Ready to start!'.green);
    process.exit();
  });
};

program
  .version('0.0.1')
  .usage('[--stylestats|--csscss] [css]')
  .option('-s, --stylestats [css]', 'parse css for overall stats')
  .option('-c, --csscss [css]', 'parse css for rulesets that have duplicated declarations')
  .option('-o, --output [path]', 'output path for parse css stats')

program
  .command('setup')
  .description('install the necessary css parser engines')
  .action(function() {
    cssStats.setup();
  });

program
  .command('start')
  .description('generate css-stats scaffolding to parse css')
  .action(function() {
    cssStats.start();
  });

program.parse(process.argv);

var style = program.stylestats || null,
    css = program.csscss || null;

if (style !== null) {
  cssStats.stylestats(program.stylestats, program.output)
} 

if (css !== null) {
  cssStats.csscss(program.csscss, program.output)
} 