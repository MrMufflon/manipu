const ManifestReader = require('./ManifestReader');
const PumlConverter = require('./PumlConverter');
const FolderParser = require('./FolderParser');
const MermaidConverter = require('./MermaidConverter');

const fs = require('fs');
const {Command, flags} = require('@oclif/command');

class ManipuCommand extends Command {

  async run() {
    const {flags} = this.parse(ManipuCommand);

    let bundles = [];
    let result;
    if (flags.recursive) {
      let manifestPaths = FolderParser().findManifestFiles(flags.path);
      manifestPaths.forEach(path => {
        let bndl = ManifestReader(path).getBundle();
        bundles.push(bndl);
      });
      if (flags.type === "puml"){
        result = PumlConverter.bundlesToMarkdown(bundles);
      }else{
        result = MermaidConverter.bundlesToMarkdown(bundles);
      }
      

    } else {
      let bundle = ManifestReader(flags.path + "/manifest.json").getBundle();
      if (flags.type === "puml"){
        result = PumlConverter.bundlesToMarkdown(bundle);
      }else{
        result = MermaidConverter.bundlesToMarkdown(bundle);
      }
    }

    fs.writeFile(flags.path + "/bundle."+flags.type, result, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  }
}

ManipuCommand.description = `Describe the command here
...
Extra documentation goes here
`;

ManipuCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  type: flags.string({char: 't', description: 'mmd or puml'}),
  name: flags.string({char: 'n', description: 'name to print'}),
  path: flags.string({char: 'p', description: 'dir of manifest.json'}),
  recursive: flags.boolean({char: 'r', description: 'read dirs recursive', required: false})
};

module.exports = ManipuCommand
