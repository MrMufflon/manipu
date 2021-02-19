const Bundle = require('./Bundle');
const Component = require('./Component');

function toComponent(component) {

  let interfaces = component["provides"] || [];
  if(!Array.isArray(interfaces)){
    interfaces = [ interfaces ];
  }

  const references = [];
  let refs = component["references"] || [];
  refs.forEach( ref => {
    let providing = ref["providing"];
    providing && references.push(providing)
  });

  let impl = component["impl"];
  if(impl&&impl.length){
    impl = impl.split("/");
    impl.shift();
    impl = impl.join(".");
  }

  return new Component(component.name, interfaces, references, impl)
}

function BundleParser(){

  const fromJson = (json) => {
    let bundle = new Bundle(json["name"] || "");

    let components = json["components"];
    if(components && Array.isArray(components)){
      components.forEach((component) => {

        bundle.addComponent(toComponent(component));
      });
    }

    return bundle;
  };

  return{
    fromJson
  }
}

module.exports = BundleParser;
