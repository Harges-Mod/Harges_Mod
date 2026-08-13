import { SupremeRuby } from '../Content/Items/Accessories/MMode/SupremeRuby.js';
import { GoldShuriken } from '../Content/Items/Weapons/Ranged/GoldShuriken.js';
import { PlatinumShuriken } from '../Content/Items/Weapons/Ranged/PlatinumShuriken.js';
import { CarminSikle, CorruptionSikle } from '../Content/Items/Weapons/Melee/PreHardModeSikles.js';
import { AriesCry } from '../Content/Items/AriesCry.js';
import { BloodyCover } from '../Content/Items/Accessories/MMode/BloodyCover.js';

// Tarot Cards
import { FoolCard } from '../Content/Items/Accessories/Tarot/FoolCard.js';
import { MageCard } from '../Content/Items/Accessories/Tarot/MageCard.js';
import { TheHighPriestessCard } from '../Content/Items/Accessories/Tarot/TheHighPriestessCard.js';
import { EmpressCard } from '../Content/Items/Accessories/Tarot/EmpressCard.js';
import { EmperorCard } from '../Content/Items/Accessories/Tarot/EmperorCard.js';
import { HierophantCard } from '../Content/Items/Accessories/Tarot/HierophantCard.js';
import { LoversCard } from '../Content/Items/Accessories/Tarot/LoversCard.js';
import { ChariotCard } from '../Content/Items/Accessories/Tarot/ChariotCard.js';
import { StrengthCard } from '../Content/Items/Accessories/Tarot/StrengthCard.js';
import { HermitCard } from '../Content/Items/Accessories/Tarot/HermitCard.js';
import { WheelOfFortuneCard } from '../Content/Items/Accessories/Tarot/WheelOfFortuneCard.js';
import { JusticeCard } from '../Content/Items/Accessories/Tarot/JusticeCard.js';
import { HangedManCard } from '../Content/Items/Accessories/Tarot/HangedManCard.js';
import { DeathCard } from '../Content/Items/Accessories/Tarot/DeathCard.js';
import { TemperanceCard } from '../Content/Items/Accessories/Tarot/TemperanceCard.js';
import { DevilCard } from '../Content/Items/Accessories/Tarot/DevilCard.js';
import { TowerCard } from '../Content/Items/Accessories/Tarot/TowerCard.js';
import { StarCard } from '../Content/Items/Accessories/Tarot/StarCard.js';
import { MoonCard } from '../Content/Items/Accessories/Tarot/MoonCard.js';
import { SunCard } from '../Content/Items/Accessories/Tarot/SunCard.js';
import { JudgmentCard } from '../Content/Items/Accessories/Tarot/JudgmentCard.js';
import { WorldCard } from '../Content/Items/Accessories/Tarot/WorldCard.js';


export function RegisterItems() {
    // --- General Items ---
    ModItem.register(SupremeRuby);
    ModItem.register(GoldShuriken);
    ModItem.register(PlatinumShuriken);
    ModItem.register(AriesCry);
    ModItem.register(BloodyCover);
    
    ModItem.register(CarminSikle);
    ModItem.register(CorruptionSikle);

    // Tarot Cards 
    ModItem.register(FoolCard);
    ModItem.register(MageCard);
    ModItem.register(TheHighPriestessCard);
    ModItem.register(EmpressCard);
    ModItem.register(EmperorCard);
    ModItem.register(HierophantCard);
    ModItem.register(LoversCard);
    ModItem.register(ChariotCard);
    ModItem.register(StrengthCard);
    ModItem.register(HermitCard);
    ModItem.register(WheelOfFortuneCard);
    ModItem.register(JusticeCard);
    ModItem.register(HangedManCard);
    ModItem.register(DeathCard);
    ModItem.register(TemperanceCard);
    ModItem.register(DevilCard);
    ModItem.register(TowerCard);
    ModItem.register(StarCard);
    ModItem.register(MoonCard);
    ModItem.register(SunCard);
    ModItem.register(JudgmentCard);
    ModItem.register(WorldCard);
}
