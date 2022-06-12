let fs = require('fs');
let path = require('path');
let cmd = require('node-cmd');

// Helpers
let log = require('./helpers/envlog');
let makefile = require('./helpers/makefile');
let string_ = require('./helpers/string');

module.exports.g = function(res, next, options) {
    if(!res){
        res = process.env.npm_config_res;
    };

    if(!options){
        options = {
            api:true
        }
    };
    
    let createTask = {
    model: true,
    controller: true,
    view: false,
    route: false,
    service: false,
    validator: true
  }

  // set literal path
  let literals = {
    router_file: './literals/routes-file',
    controller: './literals/controller',
    model: './literals/model',
    model_interface: './literals/modelinterface',
    router: './literals/routes.js',
    service: './literals/service',
    validator: './literals/validator',
  }
  
  if (options.api) {
    // literals.controller = './base/literals/api/controller';
    // literals.router = './base/literals/api/routes';
    createTask.view = false;
  }

  // validate resource
  if (!res) {
    throw console.error("resource not defined. ("+res+")");
  }

  /// STEP 1. Start: Load libraries and paths ///

  log("\n");
  log("# Start: Load libraries and paths");
  log('1. Check helpers load ~>', typeof log === 'function', typeof makefile === 'function');

  const rootpath = process.env.PWD; // TODO: Need to change stable path wherever running command.
  const pkgpath = __dirname;
  const routerpath = path.join(rootpath, 'src', 'routes.js');
  const model_interface_path = path.join(rootpath, 'src', "interfaces",'model.interface.ts');
  const view_dirpath = path.join(rootpath, 'src','views');

  let resource = string_.normalizer(res);
  let resourceDenormalized = string_.denormalizer(res);
  let resourceSingularized = string_.singularizer(res);

  log('2. Check app project rootpath ~>', rootpath);
  log('3. Check pkg project rootpath ~>', pkgpath);
  log('4. Check argumented resource name ~>', resource);

  let invoke_callback = function(err, inputs) {
    console.log('invoke', inputs.path.replace(rootpath, '').replace(/\//, "\t\t"));
  }


  /// STEP 2. Generate Necessary files ///
  if (Object.values(createTask).includes(true)) {
    
    log("\n");
    log("# Generate Necessary files");

    // [Dir] core/
    // fs.stat(`${rootpath}/core`, function(err, stats) {
    //   if (err && (err.errno === 34 || err.errno === -2)) {
    //     log("<~(async) Making directory ...", `${rootpath}/core`);
    //     cmd.run(`cp -r ${pkgpath}/base/core ${rootpath}/core`);
    //   }
    // });

    // [File] routes.js
    // fs.access(routerpath, (err) => {
    //   if(err && (err.errno === -2 || err.errno === 34)) {
    //     makefile(routerpath, require(literals.router_file), invoke_callback);
    //   };
    // });

    // [Dir] views/
    // if (createTask.view) {
    //   fs.mkdir(view_dirpath, (err) => {
    //     log(err);
    //   });
    // }
  }
  

  /// STEP 3. Generate Controller file ///
  if (createTask.controller) {
    
    log("\n");
    log("# Generate Controller file");

    // Generate Controller file

    const controller_filename = `${resourceSingularized}.controller.ts`;
    const controller_filepath = path.join(rootpath,'src','controllers', controller_filename);
    const controller_literal = require(literals.controller)(resource);
    makefile(controller_filepath, controller_literal, invoke_callback);
    log('1. Check "controller_filename" ~>', controller_filename);
    log('2. Check "controller_filepath" ~>', controller_filepath);
    log('3. Check "controller_literal" ~>', typeof controller_literal === 'string');
  }
  


  /// STEP 4. Generate Model file ///
  if (createTask.model) {
  
    log("\n");
    log("# Generate Model file");

    // Generate Model file

    const model_filename = `${resourceSingularized}.model.ts`;
    const model_filepath = path.join(rootpath,'src', 'models', model_filename);
    const model_literal = require(literals.model)(resource);
    makefile(model_filepath, model_literal, invoke_callback);
    log('1. Check "model_filename" ~>', model_filename);
    log('2. Check "model_filepath" ~>', model_filepath);
    log('3. Check "model_literal" ~>', typeof model_literal === 'string');

    function insertModelInterface(modelInterfacepath) {

      console.log(modelInterfacepath)
      fs.readFile(modelInterfacepath, 'utf8', function(err, data) {
        const model_interface_literal = require(literals.model_interface)(resource);
        data = data.replace(model_interface_literal, '');
        fs.appendFileSync(modelInterfacepath, model_interface_literal);
      });
    }
    insertModelInterface(model_interface_path);

  }

  /// STEP 4. Generate Service file ///
  if (createTask.service) {
  
    log("\n");
    log("# Generate Service file");

    // Generate Service file

    const service_filename = `${resourceSingularized}.service.ts`;
    const service_filepath = path.join(rootpath,'src', 'services', service_filename);
    const service_literal = require(literals.service)(resource);
    makefile(service_filepath, service_literal, invoke_callback);
    log('1. Check "service_filename" ~>', service_filename);
    log('2. Check "service_filepath" ~>', service_filepath);
    log('3. Check "service_literal" ~>', typeof service_literal === 'string');
  }

/// STEP 4. Generate Validators file ///
if (createTask.validator) {
  
  log("\n");
  log("# Generate Validator file");

  // Generate Validator file

  const validator_filename = `${resourceSingularized}.validations.ts`;
  const validator_filepath = path.join(rootpath,'src', 'validations', validator_filename);
  const validator_literal = require(literals.validator)(resource);
  makefile(validator_filepath, validator_literal, invoke_callback);
  log('1. Check "validator_filename" ~>', validator_filename);
  log('2. Check "validator_filepath" ~>', validator_filepath);
  log('3. Check "validator_literal" ~>', typeof validator_literal === 'string');
}


  /// STEP 5. Generate View file ///
//   if (createTask.view) {

//     log("\n");
//     log("# Generate View file");

//     // Generate View files

//     let viewfiles = [
//       'index',
//       'show',
//       'new',
//       'edit',
//       '_form',
//       'components/item'
//     ];

//     function makeViewFile(file) {
//       const view_filename = `${file}.ejs`;
//       const view_filepath = path.join(rootpath, 'views', resource, view_filename);
//       const view_literal = `<h2>${resource}/${view_filename}</h2>`;
//       log(`>. Check "view_filepath" ~>`, `(${view_filename})`, view_filepath);
//       makefile(view_filepath, view_literal, invoke_callback);
//     }
//     // for (let i in viewfiles) {
//     //   console.log(viewfiles)
//     //   makeViewFile(viewfiles[i])
//     // }
//     viewfiles.forEach(viewfile => {
//       makeViewFile(viewfile);
//     })
//   }


  /// STEP 6. Generate Routes ///
  if (createTask.route) {
    log("\n");
    log("# Generate Routes");

    // Generate entity route file
    
    const route_filename = `${resourceSingularized}Routes.js`;
    const route_filepath = path.join(rootpath,'src', 'routes', route_filename);
    const route_literal = require(literals.router)(resource);
    makefile(route_filepath, route_literal, invoke_callback);
    log('1. Check "route_filename" ~>', route_filename);
    log('2. Check "route_filepath" ~>', route_filepath);
    log('3. Check "route_literal" ~>', typeof route_literal === 'string');

    // Generate Routes

    function insertRouter(routerpath) {
      fs.readFile(routerpath, 'utf8', function(err, data) {
        
        let import_entity_route_file_literal = `import ${resourceSingularized}Routes from './routes/${resourceSingularized}Routes.js';`
        let route_literal = `router.use('/${resource}', ${resourceSingularized}Routes);`

        data = data.replace("\n\n"+route_literal, '');
        data = data.replace(import_entity_route_file_literal, '');

        let splitByLine = data.split(/\n/);
        let import_index = splitByLine.indexOf('// import routes');
        let index = splitByLine.indexOf('export default router;');
        
        if (import_index === -1) { import_index = -1 }
        if (index === -1) { index = splitByLine.length - 2 }

        splitByLine.splice(index, 0, '{{route_literal}}');
        splitByLine.splice(import_index + 1, 0, '{{import_entity_route_file_literal}}');

        let newdata = splitByLine.join("\n");
        newdata = newdata.replace('{{import_entity_route_file_literal}}', import_entity_route_file_literal);
        newdata = newdata.replace('{{route_literal}}', route_literal);
        log(">. literals\n", route_literal);

        makefile(routerpath, newdata, (err, inputs) => {
          invoke_callback(err, inputs);
          console.log("");
        //   next();
        });
      });
    }

    if (fs.existsSync(routerpath)) {
      insertRouter(routerpath);
    } else {
      fs.writeFile(routerpath, '', 'utf8', err => {
        insertRouter(routerpath);
      })
    }
  }
  else {
    //   if(next){
    //     next();
    //   }else{
    //       console.log("completed scaffolding.");
    //   }
  }

  log("scaffolding completed.");
  
}