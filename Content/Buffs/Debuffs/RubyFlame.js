export class RubyFlame extends ModBuff {
    constructor() {
        super();
        this.Texture = 'Buffs/Debuffs/' + this.constructor.name;
    }
    
    SetStaticDefaults() {
        Main.debuff[this.Type] = true;
        Main.pvpBuff[this.Type] = true;
    }
        
    UpdatePlayer(player, buffIndex) {
        ModPlayer.Get('HargesMMode').RubyFlame=true
    }
}