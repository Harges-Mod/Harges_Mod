export class ModType {
    constructor() {
        this.mod = null;
        this.fullName = this.constructor.name;
    }
    
    validateType() {}
    register() {}
}

export class GlobalType extends ModType {
    constructor() {
        super();
        this.staticIndex = 0;
        this.perEntityIndex = -1;
    }

    get slotPerEntity() {
        return this.instancePerEntity;
    }

    get instancePerEntity() {
        return false;
    }

    get conditionallyAppliesToEntities() {
        throw new Error("conditionallyAppliesToEntities deve ser implementado.");
    }

    validateType() {
        super.validateType();

        if (!this.instancePerEntity) {
            // Defina exatamente quais chaves são permitidas pela estrutura base
            const baseKeys = new Set(["mod", "fullName", "staticIndex", "perEntityIndex"]);
            
            // Pega todas as propriedades da instância atual
            const currentKeys = Object.keys(this);
            
            // Se houver qualquer chave que NÃO esteja no Set base, significa que criaram variáveis de instância
            const hasCustomFields = currentKeys.some(key => !baseKeys.has(key));

            if (hasCustomFields) {
                throw new Error(`${this.constructor.name} possui campos de instância mas instancePerEntity retorna false. Use campos estáticos ou mude instancePerEntity para retornar true.`);
            }
        }
    }

    register() {}

    static getGlobal(entityType, entityGlobals, baseInstance) {
        const result = this.tryGetGlobal(entityType, entityGlobals, baseInstance);
        if (!result) {
            throw new Error(`Chave não encontrada: ${baseInstance?.fullName || "Instância Base inválida"}`);
        }
        return result;
    }

    static tryGetGlobal(entityType, entityGlobals, baseInstance) {
        const slot = baseInstance ? baseInstance.perEntityIndex : -1;
        if (entityType > 0 && slot >= 0) {
            const result = entityGlobals[slot];
            return result !== undefined ? result : null;
        }
        
        return baseInstance || null;
    }
}

export class GlobalTypeWithEntity extends GlobalType {
    // Usando propriedades protegidas por convenção (_), já que campos privados nativos (#) 
    // não podem ser lidos/atribuídos dinamicamente de fora da classe exata que os declarou (quebraria no NewInstance)
    _isCloneable = null;
    _conditionallyAppliesToEntities = null;

    get isCloneable() {
        if (this._isCloneable === null) {
            this._isCloneable = this.clone !== GlobalTypeWithEntity.prototype.clone;
        }
        return this._isCloneable;
    }

    get cloneNewInstances() {
        return false;
    }

    get conditionallyAppliesToEntities() {
        if (this._conditionallyAppliesToEntities === null) {
            this._conditionallyAppliesToEntities = this.appliesToEntity !== GlobalTypeWithEntity.prototype.appliesToEntity;
        }
        return this._conditionallyAppliesToEntities;
    }

    appliesToEntity(entity, lateInstantiation) {
        return true;
    }

    setDefaults(entity) {}

    clone(from, to) {
        if (!this.isCloneable) {
            console.warn(`Tipo ${this.constructor.name} não é clonável com segurança.`);
        }
        
        const cloneObj = Object.create(Object.getPrototypeOf(this));
        return Object.assign(cloneObj, this);
    }

    newInstance(target) {
        if (this.cloneNewInstances) {
            return this.clone(null, target);
        }

        const inst = new this.constructor();
        
        inst.mod = this.mod;
        inst.staticIndex = this.staticIndex;
        inst.perEntityIndex = this.perEntityIndex;
        inst._isCloneable = this._isCloneable;
        inst._conditionallyAppliesToEntities = this._conditionallyAppliesToEntities;
        
        return inst;
    }

    instance(entity) {
        return GlobalType.tryGetGlobal(entity.type, entity.entityGlobals, this);
    }
}
