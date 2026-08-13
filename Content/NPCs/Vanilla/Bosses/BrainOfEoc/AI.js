const DustID = Terraria.ID;

using('Terraria');
GlobalImports.AllModules();

export default class BrainOfEoc extends GlobalNPC {
    constructor() {
        super();
        

        this.initialized = false;
    }
        
    AI(npc) {
        if (npc.type === 266) {
        
        
            
        }
    }
    
    OnTeleport() {}
}
