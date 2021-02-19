module.exports = class Component {
    
    constructor(name, interfaces = [], references = [], impl = null){
        this._name = name.replace(/-/g, '_');
        this._interfaces = interfaces;
        this._references = references;
        this._impl = impl;
    }

    getName(){
        return this._name;
    }

    getInterfaces(){
        return this._interfaces;
    }

    getReferences(){
        return this._references;
    }

    getImplements(){
        return this._impl;
    }

};
