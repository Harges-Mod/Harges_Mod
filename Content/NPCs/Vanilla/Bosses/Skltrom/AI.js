GlobalImports.AllModules();

export default class Skeletrom extends GlobalNPC {

    InitProperties() {
        if (this.initialized) return;
            this.initialized = true    
    }
    
    AI(npc) {
        if (npc.type == 36) {
            if (Rand.NextBool(2)) {
            
            }
        }
    }
}