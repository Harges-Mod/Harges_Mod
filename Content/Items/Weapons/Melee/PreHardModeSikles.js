GlobalImports.AllModules();

export class CarminSikle extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Melee/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.maxStack = ModItem.CommonMaxStack
         this.Item.shoot = ModProjectile.getTypeByName('CarminSikleProj')
        this.Item.useTime = 30
        this.Item.useAnimation = 30
        this.Item.useStyle = 1
    }
}

export class CorruptionSikle extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Melee/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.maxStack = ModItem.CommonMaxStack
        // this.Item.shoot = ModProjectile.getTypeByName('CorruptionSikleProj')
        this.Item.useTime = 30
        this.Item.useAnimation = 30
        this.Item.useSytle = 1
    }
}


