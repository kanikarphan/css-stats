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
  var stats = new StyleStats(css, './lib/default.json');

  var ui = new inquirer.ui.BottomBar();

  var target = '--target=' + css;

  var cmd = spawn(cmdify('stylestats'), [ css, '-c', './lib/default.json' ], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('');
    process.exit();
  });

  stats.parse(function (error, result) {
    var data = JSON.stringify(result, null, 2);
    fs.writeFile('./output/stylestats.json', data, function(err) {
      if(err) {
        console.log(err.red);
      }
    }); 
  });
};

cssStats.csscss = function(css, path) {
  var confirm = [{
    type: 'confirm',
    name: 'confirm',
    message: 'This may take a while depending on your CSS size, would you like to continue?'.yellow,
    default: false
  }];

  inquirer.prompt( confirm, function(answer) {
    if (answer.confirm === true) {
      var i = 4;

      var ui = new inquirer.ui.BottomBar({ bottomBar: parsing[i % 4] });

      var timer = setInterval(function() {
        ui.updateBottomBar(parsing[i++ % 4]);
      }, 300 );

      var target = '--target=' + css;

      var test = '--test=' + path;

      var cmd = spawn(cmdify('grunt'), [ 'duplicate', target, test ], { stdio: 'pipe' });

      cmd.stdout.pipe(ui.log);

      cmd.on('close', function() {
        clearInterval(timer);
        ui.updateBottomBar('');
        process.exit();
      });
    }
  });
};

cssStats.setup = function(type) {
  if (type === undefined) {
    console.log();
    console.log("  error: option '-t, --type [parser]' argument missing".red);
    console.log();
  } else {
    switch (program.type) {
      case 'stylestats':
        console.log('Installing...'.cyan);
        var ui = new inquirer.ui.BottomBar();

        var cmd = spawn(cmdify('npm'), [ '-g', 'install', 'stylestats' ], { stdio: 'pipe' });

        cmd.stdout.pipe(ui.log);

        cmd.on('close', function() {
          ui.updateBottomBar('Successfully installed stylestats'.green);
          process.exit();
        });
      break;
      case 'csscss':
        console.log('Installing... (enter your computer password if prompted)'.cyan);
        var ui = new inquirer.ui.BottomBar();

        var cmd = spawn(cmdify('sudo'), [ 'gem', 'install', 'csscss' ], { stdio: 'pipe' });

        cmd.stdout.pipe(ui.log);


        cmd.on('close', function() {
          // clearInterval(timer);
          ui.updateBottomBar('Successfully installed stylestats'.green);
          process.exit();
        });
      break;
      default:
        console.log();
        console.log("  error: option '-t, --type [parser]' incorrect argument".red);
        console.log();
    }
  }
};

cssStats.cmd
program
  .version('0.0.1')
  .usage('[--stylestats|--csscss] [css]')
  .option('-s, --stylestats [css]', 'parse css for overall stats')
  .option('-c, --csscss [css]', 'parse css for rulesets that have duplicated declarations')
  .option('-t, --type [parser]', 'parser to install [stylestats|csscss]')

program
  .command('setup [type]')
  .description('run setup command to install parser')
  .action(function() {
    cssStats.setup(program.type);
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