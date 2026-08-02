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
        this.Item.noUseGraphic = true;
		this.Item.material = false;
		this.Item.melee = true;
		this.Item.noMelee = true;
        this.Item.useAnimation = 30
        this.Item.useStyle = 1
        this.Item.knockBack = 3
        this.Item.damage = 30
    }
}

// Full copy by CarminSikle

export class CorruptionSikle extends ModItem {
    constructor() {
        super();
        this.Texture = 'Items/Weapons/Melee/' + this.constructor.name;
    }
    
    SetDefaults() {
        this.Item.maxStack = ModItem.CommonMaxStack
        this.Item.shoot = ModProjectile.getTypeByName('CorruptionSikleProj')
        this.Item.useTime = 30
        this.Item.noUseGraphic = true;
		this.Item.material = false;
		this.Item.melee = true;
		this.Item.noMelee = true;
        this.Item.useAnimation = 30
        this.Item.useStyle = 1
        this.Item.damage = 30
    }
}


