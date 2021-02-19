const Bundle = require('../src/Bundle');
const Component = require('../src/Component');
const MermaidConverter = require('../src/MermaidConverter')
let assert = require('assert');

describe('MermaidConverter', function () {
    describe('bundleToMarkdown', function () {
        it('should return markdown string', function () {
            const result = MermaidConverter.bundleToMarkdown();
            assert(result.includes(`classDiagram`));
        });
        // it('should return markdown for bundle without components', function () {
        //     const bundle = new Bundle("map-init");
        //     const result = MermaidConverter.bundleToMarkdown(bundle);            
        //     assert(result.includes(`"map-init"`));
        // });
        it('should return markdown for bundle with components', function () {
            const bundle = new Bundle("map-init");
            const c1 = new Component("Component1");
            const c2 = new Component("Component2");
            bundle.addComponent(c1);
            bundle.addComponent(c2);
            const result = MermaidConverter.bundleToMarkdown(bundle);            
            assert(result.includes(`class Component1`));
            assert(result.includes(`class Component2`));
            assert(!result.includes(`package`));
        });
        it('should replace - in comp names', function () {
            const bundle = new Bundle("map-init");
            const c1 = new Component("Compo-nent-1");
            bundle.addComponent(c1);
            const result = MermaidConverter.bundleToMarkdown(bundle);            
            assert(result.includes(`class Compo_nent_1`));
            assert(!result.includes(`package`));
        });
        it('should return markdown for bundle with referenced components', function () {
            const bundle = new Bundle("map-init");
            const c1 = new Component("Component1", ["i1"], ["i2"]);
            const c2 = new Component("Component2", ["i2"]);
            bundle.addComponent(c1);
            bundle.addComponent(c2);
            const result = MermaidConverter.bundleToMarkdown(bundle);            
            assert(result.includes(`Component1 --> Component2`));
            assert(result.includes(`Component2 {\n\t<<i2>>`));
        });
        it('should return markdown for bundle with impl components', function () {
            const bundle = new Bundle("map-init");
            const c1 = new Component("Component1", ["i1"], ["i2"], "org.test.Class");
            const c2 = new Component("Component2", ["i2"]);
            bundle.addComponent(c1);
            bundle.addComponent(c2);
            const result = MermaidConverter.bundleToMarkdown(bundle);            
            assert(result.includes(`class Component1~org.test.Class~ {\n\t<<i1>>`));
            assert(result.includes(`Component2 {\n\t<<i2>>`));
        });
    });
    describe('bundlesToMarkdown', function () {
        it('should return markdown with title for empty bundle list', function () {
            const result = MermaidConverter.bundlesToMarkdown();
            assert(result.includes(`classDiagram`));
        });
        it('should return markdown with bundle for single bundle', function () {
          const bundle = new Bundle("map-init");
          const c1 = new Component("Component1", ["i1"], ["i2"]);
          const c2 = new Component("Component2", ["i2"]);
          bundle.addComponent(c1);
          bundle.addComponent(c2);
          const result = MermaidConverter.bundlesToMarkdown([bundle]);
          assert(result.includes(`Component1 --> Component2`));
          assert(result.includes(`Component2 {\n\t<<i2>>`));
        });
        it('should return markdown with bundle for multiple bundles', function () {
          const bundle1 = new Bundle("map-init");
          const c1 = new Component("Component1", ["i1"], ["i2"]);
          const c2 = new Component("Component2", ["i2"]);
          bundle1.addComponent(c1);
          bundle1.addComponent(c2);

          const bundle2 = new Bundle("map-widget");
          const c3 = new Component("Component3", ["i3"], ["i4"]);
          const c4 = new Component("Component4", ["i4"], ["i1", "i2"]);
          bundle1.addComponent(c3);
          bundle1.addComponent(c4);

          const result = MermaidConverter.bundlesToMarkdown([bundle1, bundle2]);
          assert(result.includes(`Component3 --> Component4`));
          assert(result.includes(`Component4 --> Component1`));
          assert(result.includes(`Component4 --> Component2`));
        });
    });
});
