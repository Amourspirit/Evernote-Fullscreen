
module.exports = function (grunt) {
  var packageData = grunt.file.readJSON('package.json');
  var BUILD_VERSION = packageData.version + '-' + (process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : '0');

  /**
   * includeFile() - embeds a file content within another. Meant to be
   * used from the copy task as a 'processContent' function. The following
   * tokens can be used in files: <br>
   *
   *  -   BUILD_INCLUDE('file')
   *  -   /* BUILD_INCLUDE('file') *\x47
   *  -   &lt;!-- BUILD_INCLUDE("file") --&gt;
   *
   * In addition, options can be added to the token above that further
   * process the file being included:
   *
   *  -   BUILD_INCLUDE('file')[option1,option2,option3]
   *
   * Supported options:
   *
   *  -   asJsString : Escapes all double-quotes and new line characters
   *                   in the file
   *
   * @param {String} fileContent
   * @param {String} filePath
   *
   * @return {String} fileContent
   *
   * @see https://gist.github.com/purtuga/85ee689f0d3d90484ce3
   * @see https://www.regexpal.com/?fam=108264
   *
   * @example
   *
   *  ...
   *  copy: {
   *      options: {
   *          expand: true,
   *          process: includeFile
   *      }
   *  }
   *  ...
   *
   */
  function includeFile(fileContent, filePath) {

    if (fileContent.indexOf("BUILD_INCLUDE") > -1) {

      grunt.log.write("includeFile(): [" + filePath + "] has BUILD_INCLUDE: ");
      // Match:
      //      // BUILD_INCLUDE('file')
      //      /* BUILD_INCLUDE('file') */
      //      <!-- BUILD_INCLUDE("file") -->
      //
      //  Token OPtions:
      //      // BUILD_INCLUDE('file')[options,here,as,array]
      //
      //      asJsString
      //
      var re = /(?:(?:\/\/)|(?:<\!\-\-)|(?:\/\*))\s+BUILD_INCLUDE\(['"](.*)['"]\)(?:\[(.*)\])?(?:(?:\s+\-\->)|(?:\s+\*\/))?/i,
        match, file, fileIncludeOptions;

      while ((match = re.exec(fileContent)) !== null) {
        grunt.log.write(".");
        grunt.verbose.writeln("    Match array: " + match);
        file = grunt.template.process(match[1]);
        grunt.verbose.writeln("    File to embed: " + file);
        file = grunt.file.read(file);
        // If options were set, then parse them
        if (match[2]) {
          fileIncludeOptions = match[2].split(',');
          // If option: asJsString
          if (
            fileIncludeOptions.some(function (option) {
              return String(option).toLowerCase() === "asjsstring";
            })
          ) {
            file = file
              .replace(/"/g, '\\"')
              .replace(/'/g, "\\'")
              .replace(/\r\n|\n/g, "\\n");
          }

          if (
            fileIncludeOptions.some(function (option) {
              return String(option).toLowerCase() === "singletodouble";
            })
          ) { file = file.replace(/'/g, '"'); }
        }
        fileContent = fileContent.replace(match[0], function () { return file; });
      }
      grunt.log.writeln("");
      return fileContent;
    }
    return fileContent;
  } //end: includeFile()

  grunt.initConfig({
    pkg: packageData,

    clean: {
      dirs: ['scratch', 'dist', 'lib'],
      compiled: ['scratch/compiled'],
      readme: ['./Readme.md']
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      plugin: ['src/**/*.ts']
    },

    shell: {
      tsc: 'tsc',
      rollup: 'npx rollup -c'
    },

    remove_comments: {
      js: {
        options: {
          multiline: true, // Whether to remove multi-line block comments
          singleline: true, // Whether to remove the comment of a single line.
          keepSpecialComments: false, // Whether to keep special comments, like: /*! !*/
          linein: true, // Whether to remove a line-in comment that exists in the line of code, it can be interpreted as a single-line comment in the line of code with /* or //.
          isCssLinein: true // Whether the file currently being processed is a CSS file
        },
        cwd: 'scratch/nodebug/',
        src: '**/*.js',
        expand: true,
        dest: 'scratch/compiled/'
      },
      debug_nc: {
        options: {
          multiline: true, // Whether to remove multi-line block comments
          singleline: true, // Whether to remove the comment of a single line.
          keepSpecialComments: false, // Whether to keep special comments, like: /*! !*/
          linein: true, // Whether to remove a line-in comment that exists in the line of code, it can be interpreted as a single-line comment in the line of code with /* or //.
          isCssLinein: true // Whether the file currently being processed is a CSS file
        },
        cwd: 'scratch/NoDebugComment/',
        src: '**/*.js',
        expand: true,
        dest: 'scratch/debug_nc/'
      }
    },

    replace: { // https://www.npmjs.com/package/grunt-text-replace
      debug_comments: {
        src: ['scratch/rolled/<%= pkg._name %>.user.js'],
        dest: 'scratch/nodebug/<%= pkg._name %>.user.js',  // destination directory or file
        replacements: [{
          // .net reges ^\s*//\s@debug\sstart[\s\S]*?//\s@debug\send
          // see also: http://regexstorm.net/tester
          from: /[\s]*\/\/\s@debug\sstart[.\s\S]*?\/\/\s@debug\send[\s]*$/gm, // see https://www.regexpal.com/?fam=108408
          to: ''
        }]
      },
      button_css: {
        src: ['scratch/css/style.min.css'],
        dest: 'scratch/text/buttonstyle.txt',  // destination directory or file
        replacements: [{
          from: /(?:.*\.button{(.*?)}.*)/,
          to: '$1;'
        }]
      },
      header_build: {
        src: ['src/main/text/header.txt'],   // source files array (supports minimatch)
        dest: 'scratch/text/header.txt',  // destination directory or file
        replacements: [{
          from: '@BUILD_NUMBER@',                   // string replacement
          to: packageData.version
        },
        {
          from: '@FULL_NAME@',
          to: packageData._fullName
        },
        {
          from: '@SCRIPT_NAME@',
          to: packageData._name
        },
        {
          from: '@AUTHOR@',
          to: packageData.author
        },
        {
          from: '@DESCRIPTION@',
          to: packageData.description
        },
        {
          from: '@LICENSE@',
          to: packageData.license
        },
        {
          from: '@REPOSITORY_NAME@',
          to: packageData._repositoryName
        }
        ]
      },
      readme_build: {
        src: ['src/main/text/Readme.md'],   // source files array (supports minimatch)
        dest: './Readme.md',  // destination directory or file
        replacements: [{
          from: '@BUILD_NUMBER@',                   // string replacement
          to: packageData.version
        },
        {
          from: '@SCRIPT_NAME@',
          to: packageData._name
        },
        {
          from: '@AUTHOR@',
          to: packageData.author
        },
        {
          from: '@REPOSITORY_NAME@',
          to: packageData._repositoryName
        }
        ]
      }
    },

    copy: {  // https://github.com/gruntjs/grunt-contrib-copy
      // build will replace build includesin the file such as //BUILD_INCLUDE('./scratch/text/buttonstyle.txt')
      build: { // https://paultavares.wordpress.com/2014/12/01/grunt-how-to-embed-the-content-of-files-in-javascript-files/
        options: {
          expand: true,
          process: includeFile
        },
        files: {
          "scratch/compiled/<%= pkg._name %>.user.js": "scratch/compiled/<%= pkg._name %>.user.js"
        }
      },

      no_debug: {
        files: [{
          cwd: 'scratch/rolled/',
          src: '<%= pkg._name %>.user.js',
          dest: 'scratch/compiled/',
          expand: true
        }]
      },
      debug_nc: {
        files: [{
          cwd: 'scratch/compiled/',
          src: '<%= pkg._name %>.user.js',
          dest: 'scratch/NoDebugComment/',
          expand: true
        }]
      },
      debug_nc_clean: {
        files: [{
          cwd: 'scratch/debug_nc/',
          src: '<%= pkg._name %>.user.js',
          dest: 'scratch/compiled/',
          expand: true
        }]
      }
    },

    if: {  // https://github.com/bonesoul/grunt-if-next
      debug: {
        // Target-specific file lists and/or options go here.
        options: {
          // execute test function(s)
          test: function () { return packageData._debuglevel > 0; },
        },
        //array of tasks to execute if all tests pass
        ifTrue: [
          'replace:debug_comments',
          'remove_comments:js'
        ],
        //array of tasks to execute if any test fails
        ifFalse: ['copy:no_debug']
      },
      debug_remove_comments: {
        // Target-specific file lists and/or options go here.
        options: {
          // execute test function(s)
          test: function () { return ((packageData._debuglevel === 0) && (packageData._debugRemoveComment === true)); },
        },
        //array of tasks to execute if all tests pass
        ifTrue: [
          // copy from compiled, remove comments and copy back to compiled
          'copy:debug_nc',
          'clean:compiled',
          'remove_comments:debug_nc',
          'copy:debug_nc_clean',
        ],
        //array of tasks to execute if any test fails
        ifFalse: []
      }
    },

    concat: {
      dist: {
        src: ['scratch/text/header.txt', 'scratch/compiled/<%= pkg._name %>.user.js'],
        dest: 'dist/<%= pkg._name %>.user.js'
      }
    },

    // cssmin minify css code
    cssmin: { // https://github.com/gruntjs/grunt-contrib-cssmin
      target: {
        files: [{
          expand: true,
          cwd: 'src/main/css',
          src: ['style.css'],
          dest: 'scratch/css',
          ext: '.min.css'
        }]
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  // grunt.loadNpmTasks('@ephox/swag');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-remove-comments');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-if-next');

  grunt.registerTask('version', 'Creates a version file', function () {
    grunt.file.write('dist/version.txt', BUILD_VERSION);
  });

  grunt.registerTask('default', [
    'clean:dirs',           // clean the folder out from any previous build
    'clean:readme',         // remoe root Readme.md
    'tslint',               // check the ts files for any lint issues
    'shell:tsc',            // run tsc
    'shell:rollup',         // run rollup to combine all the files into one js file.
    'if:debug',             // run if debug command to remove debug if _debug value of package.json is greater then 0 otherwise copy file to compiled and continue
    'if:debug_remove_comments',
    'replace:header_build', // replace the build number in the header text with current version from package.json
    'cssmin',               // minify css files to be later injected into the js file.
    // 'replace:button_css',   // extract the .button css from minified css and write it into a text file
    'copy:build',           // run special function includeFile that is in this script to replace BUILD_INCLUDE vars in js.
    'concat',               // combine the header file with the javascript file.
    'replace:readme_build'  // generate new Readme.md
  ]);
};
