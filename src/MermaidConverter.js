module.exports.bundleToMarkdown = function (bundle) {
  if (!bundle) {
    return `classDiagram`
  }
  return "classDiagram\n"+createComponents(bundle)+"\n"+createReferences([bundle], bundle.getComponents());
};

module.exports.bundlesToMarkdown = function (bundles) {
  if (!bundles) {
    return `classDiagram`
  }
  let bundlesString = `classDiagram\n`;
  let referencesString = "";
  for (let bundle of bundles) {
    const name = bundle.getName();
    const components = createComponents(bundle);
    if (!name || components.length === 0 || name.includes("-config")) {
      continue
    }
    bundlesString += `${components}`;
    referencesString += `${createReferences(bundles, bundle.getComponents())}`
  }
  bundlesString = bundlesString + referencesString;
  return bundlesString;
};

function createComponents(bundle) {
  let result = "";
  const components = bundle.getComponents();
  for (let component of components) {
    let interfaces = component.getInterfaces();
    let impl = component.getImplements();
    let implString = impl&&impl.length ? "~"+impl+"~" : "";
    let interfacesString = interfaces.length ? `\t<<${interfaces.join(",")}>>` : "";
    result += ("class " +component.getName()+implString);
    if(interfaces.length){
        result += " {\n"+interfacesString+"\n}\n";
    } else{
      result += "\n"
    }
    
  }
  return result;
}

function createReferences(bundles, components) {
  let result = "";
  for (let component of components) {
    const references = component.getReferences();
    for (let interfaceName of references) {
      const refComponents = getComponentsByInterface(bundles, interfaceName);
      for (let refComponent of refComponents) {
        result += `${component.getName()} --> ${refComponent.getName()}\n`;
      }
    }
  }
  return result;
}

function getComponentsByInterface(bundles, interfaceName) {
  let components = [];
  for (let bundle of bundles) {
    for (let referencedComponent of bundle.getComponentsByInterface(interfaceName)) {
      components.push(referencedComponent)
    }
  }
  return components;
}
