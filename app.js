#!/usr/bin/env node

var fs = require('fs')
  , util = require('util')
  , http = require('http')
  , path = require('path')
  , program = require('commander')
  , colors = require('colors')
  , inquirer = require('inquirer')
  , ProgressBar = require('progress')
  , BottomBar = require('inquirer/lib/ui/bottom-bar')
  , cmdify = require('cmdify')
  , spawn = require('child_process').spawn
  , childProcess = require('child_process').exec
  , StyleStats = require('stylestats')
  , open = require('open')
  , web = require('./server');

var server  = http.createServer(web);

var cssStats = module.exports;

var parsing = [
  '  parsing'.cyan,
  '| parsing'.cyan,
  '\\ parsing'.cyan,
  '- parsing'.cyan
];

cssStats.stylestats = function(css, path) {

  if (path === undefined) {
    console.log();
    console.log("  error: option '-o, --output [path]' argument missing".red);
    console.log();
  } else {

    var option = __dirname + '/option.json';

    var stats = new StyleStats(css, option);

    var ui = new inquirer.ui.BottomBar();

    var dist = path.replace(/\\/g, '/');

    var output =  dist + '/stylestats.json';

    stats.parse(function (error, result) {
      var data = JSON.stringify(result, null, 2);

      fs.readdir(path, function (err, files) {

        if (files === undefined) {
          console.log("  error: verify directory exists".red);
          console.log();
          process.exit();
        } else {

          var i = 4;

          var ui = new inquirer.ui.BottomBar({ bottomBar: 'Parsing '.cyan });

          var commands = 'stylestats ' + css + ' -c ' + option;

          var cmd = childProcess(cmdify(commands), function (err, stdout, stderr) {
            if (err) {
             console.log(  err.stack.red);
             console.log();
            }
            fs.writeFile(output, data, function(err) {
              if (err) {
                console.log("  error: output json was not saved".red);
                console.log();
              } else {
                process.exit();
              }
            });
          });

          cmd.on('exit', function (code) {
            var msg = '  stylestats finished parsing ' + css;
            ui.updateBottomBar(msg.green);
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
      message: 'this may take a while depending on your CSS file size, would you like to continue?'.yellow,
      default: false
    }];

    inquirer.prompt( confirm, function(answer) {
      if (answer.confirm === true) {

        fs.readdir(path, function (err, files) {

          if (files === undefined) {
            console.log('  error: verify directory exists'.red);
            console.log();
            process.exit();
          } else {

            var i = 4;

            var ui = new inquirer.ui.BottomBar({ bottomBar: parsing[i % 4] });

            var timer = setInterval(function() {
              ui.updateBottomBar(parsing[i++ % 4]);
            }, 300 );

            var source = css.replace(/\\/g, '/');

            var dist = path.replace(/\\/g, '/');

            var output =  dist + '/csscss.json';

            if (process.platform === 'win32') {
              var csscss = spawn('csscss.bat', [source, '--json', '-v', '-n', '5'], { stdio: 'pipe' });

              csscss.stdout.pipe(ui.log);

              var stdout = '';

              csscss.stdout.on('data', function (data) {
                var cssData = stdout += data;

                fs.writeFile(output, cssData, function(err) {
                  if (err) {
                    console.log("  error: output json was not saved".red);
                    console.log();
                  } else {
                    process.exit();
                  }
                });
              });

              csscss.on('close', function (code) {
                var msg = '  csscss finished parsing ' + css;
                ui.updateBottomBar(msg.green);
              });

            } else {

              var commands = 'csscss ' + css + ' -j -v -n 5';

              var cmd = childProcess(cmdify(commands), function (err, stdout, stderr) {
                if (err) {
                 console.log(  err.stack.red);
                 console.log();
                }

                fs.writeFile(output, stdout, function(err) {
                  if (err) {
                    console.log("  error: output json was not saved".red);
                    console.log();
                  } else {
                    process.exit();
                  }
                });

              });

              cmd.on('exit', function (code) {
                var msg = '  csscss finished parsing ' + css;
                ui.updateBottomBar(msg.green);
              });

            }

          }
        });
      }
    });
  }
};

cssStats.setup = function() {
  console.log('  installing css-stats parser...'.cyan + '\nenter your computer password if prompted'.underline);
  console.log();

  var ui = new inquirer.ui.BottomBar();

  var cmd = spawn(cmdify('sudo'), ['gem', 'install', 'csscss' ], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('');
    cssStats.globalNpm();
  });
};

cssStats.globalNpm = function() {
  var ui = new inquirer.ui.BottomBar();

  var cmd = spawn(cmdify('npm'), ['install', '-g', 'stylestats'], { stdio: 'pipe' });

  cmd.stdout.pipe(ui.log);

  cmd.on('close', function() {
    ui.updateBottomBar('  installed successfully!'.green);
    process.exit();
  });
};

cssStats.view = function(file, port) {
  if ((file === true) || (file === undefined)) {
    console.log();
    console.log("  error: option '-j, --json [json]' argument missing".red);
    console.log();
  } else if ((port === true) || (port === undefined)) {
    console.log();
    console.log("  error: option '-p, --port [number]' argument missing".red);
    console.log();
  } else {

    fs.readFile(file, 'utf8', function (err, results) {

      if (results === undefined) {
        console.log('  error: verify file exists'.red);
        console.log();
      } else {

        var result = {};

        result.data = result ? JSON.parse(results) : [];

        var data = result.data;

        var type = file.split(/^(.*[\\\/])/);
            name = type[type.length-1];

        if (name === 'stylestats.json') {
          cssStats.viewStylestats(file, port, data);
        } else if (name === 'csscss.json') {
          cssStats.viewCsscss(file, port, data);
        } else {
          console.log();
          console.log("  error: option '-j, --json [json]' argument incorrect. expect stylestats.json or csscss.json".red);
          console.log();
        }

      }

    });
  }
};

cssStats.viewStylestats = function(file, port, data) {
  var url = '  view stylestats url: http://localhost:' + port,
      webpage = 'http://localhost:' + port;

  web.get('/', function(req, res){
    res.render('stylestats', {
      stats: data
    });
  });

  server.listen(port);

  console.log(url.cyan);
  console.log("  'ctrl c' to quit view".yellow);
  console.log();

  open(webpage);
};

cssStats.viewCsscss = function(file, port, data) {
  var url = '  view csscss url: http://localhost:' + port,
      webpage = 'http://localhost:' + port;

  web.get('/', function(req, res){
    res.render('csscss', {
      stats: data
    });
  });

  server.listen(port);

  console.log(url.cyan);
  console.log("  'ctrl c' to quit view".yellow);
  console.log();

  open(webpage);
};

program
  .version('0.0.1')
  .usage('[--stylestats|--csscss] [css]')
  .option('-s, --stylestats [css]', 'parse css for overall stats')
  .option('-c, --csscss [css]', 'parse css for rulesets that have duplicated declarations')
  .option('-o, --output [path]', 'output path for parse css stats')
  .option('-j, --json [json]', 'stylestats or csscss json')
  .option('-p, --port [number]', 'port number for webpage')

program
  .command('setup')
  .description('install the necessary css parser engines')
  .action(function() {
    cssStats.setup();
  });

program
  .command('view [--json] [--port]')
  .description('visual view for css stats')
  .action(function() {
    cssStats.view(program.json, program.port);
  });

program.parse(process.argv);

var style = program.stylestats || null,
    css = program.csscss || null,
    webview = program.webpage || null;

if (style !== null) {
  cssStats.stylestats(program.stylestats, program.output)
} 

if (css !== null) {
  cssStats.csscss(program.csscss, program.output)
}