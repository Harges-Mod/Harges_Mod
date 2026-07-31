import { Terraria } from './../ModImports.js';
import { GlobalTile } from './../GlobalTile.js';
import { TileData } from './../Modules/TileData.js';

export class TileLoader {
    static MAX_VANILLA_ID = Terraria.ID.TileID.Count;
    static TileCount = this.MAX_VANILLA_ID;
    
    static SetupContent() {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.SetStaticDefaults();
        }
    }
    
    static PostSetupContent() {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.PostSetupContent();
        }
    }
    
    static CanPlace(i, j, type, mute, forced, plr, style) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.CanPlace(i, j, type, mute, forced, plr, style) === false)) {
            return false;
        }
        return true;
    }
    
    static OnPlace(i, j, type, plr, style) {
        const player = (plr >= 0 && plr < 255) ? Terraria.Main.player[plr] : null;
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.OnPlace(player, i, j, type, style);
        }
    }
    
    static IsReplaceable(type, x, y) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.IsReplaceable(type, x, y) === false)) {
            return false;
        }
        return true;
    }
    
    static OnReplace(x, y, targetType, targetStyle) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.OnReplace(x, y, targetType, targetStyle);
        }
    }
    
    static CanKillTile(i, j) {
        const type = new TileData(i, j).type;
        
        if (GlobalTile.RegisteredTiles.some(gT => gT.CanKillTile(i, j, type) === false)) {
            return false;
        }
        
        return true;
    }
    
    static KillTile(i, j, fail, effectOnly, noItem) {
        const type = new TileData(i, j).type;
        
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.KillTile(i, j, type, fail, effectOnly, noItem);
        }
    }
    
    static KillSound(i, j, type, fail) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.KillSound(i, j, type, fail) === false)) {
            return false;
        }
        return true;
    }
    
    static GetTileDustAmount(fail, tile, amount) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            amount = gTile?.GetTileDustAmount(tile, fail, amount) ?? amount;
        }
        return amount;
    }
    
    static MakeTileDust(i, j, tile) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.MakeTileDust(i, j, tile) === false)) {
            return false;
        }
        return true;
    }
    
    static CanDropItems(i, j, tile) {
        let flag = true;
        
        for (const gTile of GlobalTile.RegisteredTiles) {
            if (gTile.CanDropItems(i, j, tile) === false) {
                flag = false;
                break;
            }
        }
        
        return flag;
    }
    
    static DropItems(i, j, tile) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.DropItems(i, j, tile);
        }
    }
    
    static PickPowerCheck(player, pickPower, x, y, tile, damage) {
        let mineResist = 1;
        for (const gTile of GlobalTile.RegisteredTiles) {
            if (pickPower < gTile.GetMinPick(player, x, y, tile)) {
                damage = 0;
                break;
            }
            const _mineResist = gTile.GetMineResist(player, x, y, tile);
            if (mineResist < _mineResist) mineResist = _mineResist;
        }
        return damage / mineResist;
    }
    
    static RightClick(player, i, j, type) {
        let flag1 = null;
        
        for (const gTile of GlobalTile.RegisteredTiles) {
            const result = gTile.RightClick(player, i, j, type);
            if (result === true) {
                flag1 = true;
            } else if (result === false) {
                flag1 = false;
                break;
            }
        }
        
        return flag1;
    }
    
    static MouseOver(player, i, j, type) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.MouseOver(player, i, j, type);
        }
    }
    
    static MouseOverFar(player, i, j, type) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.MouseOverFar(player, i, j, type);
        }
    }
    
    static PreHitWire(i, j, type) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.PreHitWire(i, j, type) === false)) {
            return false;
        }
        return true;
    }
    
    static HitWire(i, j, type) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.HitWire(i, j, type);
        }
    }
    
    static Slope(i, j, type, slope) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.Slope(i, j, type, slope) === false)) {
            return false;
        }
        return true;
    }
    
    static PreShakeTree(i, j, treeType) {
        if (GlobalTile.RegisteredTiles.some(gT => gT.PreShakeTree(i, j, treeType) === false)) {
            return false;
        }
        return true;
    }
    
    static ShakeTree(i, j, treeType) {
        for (const gTile of GlobalTile.RegisteredTiles) {
            gTile.ShakeTree(i, j, treeType);
        }
    }
}