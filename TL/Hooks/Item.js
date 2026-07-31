import { Terraria, Microsoft, Modules } from './../ModImports.js';
import { ModLocalization } from './../ModLocalization.js';
import { ItemLoader } from './../Loaders/ItemLoader.js';
import { PrefixUtils } from './../Modules/Utils/Prefix.js';

const { Color, Rectangle } = Modules;
const PlaySound = (type, x = -1, y = -1, pitch = 0, volume = 1) => Terraria.Audio.SoundEngine['SoundEffectInstance PlaySound(LegacySoundStyle type, int x, int y, float pitchOffset, float volumeScale)'](type, x, y, pitch, volume);

export class ItemHooks {
    static initialized = false;
    
    // Here you can disable the hooks that won't be used in your mod to avoid unnecessary processing
    static HookList = {
        All: (info) => info.hasItems || info.hasGlobalItems,
        SetDefaults: (info) => info.hasItems || info.hasGlobalItems,
        RebuildTooltip: (info) => info.hasItems,
        Prefix: (info) => info.hasItems || info.hasGlobalItems,
        GetAlpha: (info) => info.hasItems || info.hasGlobalItems
    }
    
    static Initialize(info) {
        if (!this.HookList.All(info) || this.initialized) return;
        
        if (this.HookList.SetDefaults(info)) {
            Terraria.Item['void SetDefaults(int Type, ItemVariant variant)'
            ].hook((original, self, type, variant) => {
                const flag = ItemLoader.isModType(type);
                if (!flag) original(self, type, variant);
                if (flag) {
                    self.ResetStats(type);
                    self.type = type;
                    self.material = Terraria.ID.ItemID.Sets.IsAMaterial[self.type];
                    
                    const item = ItemLoader.getModItem(type);
                    item?.SetDefaults(self);
                    self.RebuildTooltip();
                    item?.PostSetDefaults(self);
                    try {
                        Object.assign(self, item.Item);
                    } catch (error) {
                        throw new Error(`SetDefaults failed for item <${item.constructor.name}>, error: ${error}`);
                    }
                }
                ItemLoader.SetDefaults(self);
            });
        }
        
        if (this.HookList.RebuildTooltip(info)) {
            Terraria.Item['void RebuildTooltip()'
            ].hook((original, self) => {
                original(self);
                if (ItemLoader.isModType(self.type)) {
                    self.ToolTip = ModLocalization.getTranslationItemTooltip(self.type);
                }
            });
        }
        
        if (this.HookList.Prefix(info)) {
            Terraria.Item['int[] GetRollablePrefixes()'
            ].hook((original, self) => {
                let prefixes = original(self);
                
                if (!ItemLoader.isModType(self.type)) {
                    if (prefixes !== null && prefixes.length > 0) {
                        let allowed = [];
                        for (let i = 0; i < prefixes.length; i++) {
                            const pre = prefixes[i];
                            if (ItemLoader.AllowPrefix(self, pre)) {
                                allowed.push(pre);
                            }
                        }
                        if (allowed.length > 0) return allowed.makeGeneric('int');
                        return null;
                    }
                    return prefixes;
                }
                
                if (self.IsAPrefixableAccessory()) return Terraria.GameContent.Prefixes.PrefixLegacy.Prefixes.PrefixesForAccessories;
                
                prefixes = [];
                
                if (ItemLoader.MeleePrefix(self)) prefixes.push(...PrefixUtils.MeleePrefixes);
                if (ItemLoader.RangedPrefix(self)) prefixes.push(...PrefixUtils.RangedPrefixes);
                if (ItemLoader.WeaponPrefix(self)) prefixes.push(...PrefixUtils.WeaponPrefixes);
                if (ItemLoader.MagicPrefix(self)) prefixes.push(...PrefixUtils.MagicPrefixes);
                if (ItemLoader.SummonPrefix(self)) prefixes.push(...PrefixUtils.SummonPrefixes);
                if (Terraria.GameContent.Prefixes.PrefixLegacy.ItemSets.ItemsThatCanHaveLegendary2[self.type]) prefixes.push(84);
                if (prefixes.length === 0) return null;
                
                let allowed = [];
                for (let i = 0; i < prefixes.length; i++) {
                    const pre = prefixes[i];
                    if (ItemLoader.AllowPrefix(self, pre)) {
                        allowed.push(pre);
                    }
                }
                
                if (allowed.length === 0) return null;
                
                return allowed.makeGeneric('int');
            });
        }
        
        if (this.HookList.GetAlpha(info)) {
            Terraria.WorldItem['Color GetAlpha(Color newColor)'
            ].hook((original, self, color) => {
                return original(self, ItemLoader.GetAlpha(self, color));
            });
        }
        
        this.initialized = true;
    }
}