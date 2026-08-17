import { Terraria, Modules } from './../ModImports.js';
import { ModLoader } from './../Core/ModLoader.js';
import { ModLocalization } from './../ModLocalization.js';
import { ModRecipe } from './../ModRecipe.js';

import { CameraShake, FadeController } from './../Modules/Camera.js';

import { NPCLoader } from './../Loaders/NPCLoader.js';
import { TileLoader } from './../Loaders/TileLoader.js';
import { BiomeLoader } from './../Loaders/BiomeLoader.js';
import { SystemLoader } from './../Loaders/SystemLoader.js';
import { PlayerLoader } from './../Loaders/PlayerLoader.js';
import { CombinedLoader } from './../Loaders/CombinedLoader.js';
import { ProjectileLoader } from './../Loaders/ProjectileLoader.js';
import { SurfaceBackgroundLoader, UndergroundBackgroundLoader } from './../Loaders/BackgroundLoaders.js';
import { SceneEffectLoader } from './../Loaders/SceneEffectLoader.js';
import { MenuLoader } from './../Loaders/MenuLoader.js';
import { SubworldLoader } from './../Loaders/SubworldLoader.js';

let isFirstJoin = true;

export class MainHooks {
    static initialized = false;
    
    static HookList = {
        All: (info) => true,
        AnglerQuestSwap: (info) => info.hasItems,
        DrawProj: (info) => info.hasProjectiles || info.hasGlobalProjectiles,
        DrawNPCHeadFriendly: (info) => info.hasNPCs,
        UpdateTime: (info) => true,
        UpdateTime_SpawnTownNPCs: (info) => info.hasNPCs,
        UpdateAudio_DecideOnNewMusic: (info) => info.hasNPCs || info.hasBiomes || info.hasMenus,
        UpdateMenu: (info) => info.hasMenus || info.hasSubworlds,
        DrawSunAndMoon: (info) => info.hasBiomes && info.is64Bits,
        GetProjectileDesiredShader: (info) => info.hasProjectiles,
        DatabaseHooks: (info) => true,
        DoUpdate: (info) => info.is64Bits,
        DoDraw_UpdateCameraPosition: (info) => info.is64Bits,
        DrawInterface_29_SettingsButton: (info) => info.is64Bits,
        DrawInterface_12_IngameFancyUI: (info) => info.is64Bits,
       
        ApplyColorOfTheSkiesToTiles: (info) => info.hasBiomes && info.is64Bits,
        DrawBackground: (info) => info.hasBackgrounds && info.is64Bits,
        LoadWorlds: (info) => info.hasSubworlds
    };
    
    static Initialize(info) {
        if (!this.HookList.All(info) || this.initialized) return;
        
        Terraria.Main['void Initialize_AlmostEverything()'
        ].hook((original, self) => {
            original(self);
            SystemLoader.SetupContent();
           // Main.offScreenRange = 0
        });
        
        Terraria.Main['void PostContentLoadInitialize()'
        ].hook((original, self) => {
            original(self);
            SystemLoader.PostSetupContent();
            SystemLoader.AddRecipeGroups();
            SystemLoader.AddRecipes();
            
            new ModRecipe().SetResult(5013).AddIngredient(5013).SetProperty('needMechdusa', true).AddTile(668).Register();
            Terraria.ID.ContentSamples.FixItemsAfterRecipesAreAdded();
            Terraria.Recipe.CreateRequiredItemQuickLookups();
            Terraria.Recipe.UpdateMaterialFieldForAllRecipes();
            Terraria.Recipe.UpdateWhichItemsAreMaterials();
            Terraria.Recipe.UpdateWhichItemsAreCrafted();
            Terraria.GameContent.ShimmerTransforms.UpdateRecipeSets
            ();
        });
        
        if (this.HookList.AnglerQuestSwap(info)) {
            Terraria.Main['void AnglerQuestSwap()'
            ].hook((original, self) => {
                if (Terraria.Main.netMode == 1) return;
                
                Terraria.Main.anglerWhoFinishedToday.Clear();
                Terraria.Main.anglerQuestFinished = false;
                
                let flag1 = Terraria.NPC.downedBoss1 || Terraria.NPC.downedBoss2 || Terraria.NPC.downedBoss3 || Terraria.Main.hardMode || Terraria.NPC.downedSlimeKing || Terraria.NPC.downedQueenBee;
                let flag2 = true;
                
                const checkedQuests = [];
                
                while (flag2) {
                    flag2 = false;
                    
                    // Prevents infinite loop
                    if (checkedQuests.length === Terraria.Main.anglerQuestItemNetIDs.length) {
                        Terraria.Main.anglerQuestFinished = true;
                        break;
                    }
                    
                    Terraria.Main.anglerQuest = Math.floor(Math.random() * Terraria.Main.anglerQuestItemNetIDs.length);
                    let anglerQuestItemNetId = Terraria.Main.anglerQuestItemNetIDs[Terraria.Main.anglerQuest];
                    
                    if (anglerQuestItemNetId == 2454 && (!Terraria.Main.hardMode || Terraria.WorldGen.crimson))
                        flag2 = true;
                    if (anglerQuestItemNetId == 2457 && Terraria.WorldGen.crimson)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2462 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2463 && (!Terraria.Main.hardMode || !Terraria.WorldGen.crimson))
                        flag2 = true;
                    if (anglerQuestItemNetId == 2465 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2468 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2471 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2473 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2477 && !Terraria.WorldGen.crimson)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2480 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2483 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2484 && !Terraria.Main.hardMode)
                        flag2 = true;
                    if (anglerQuestItemNetId == 2485 && Terraria.WorldGen.crimson)
                        flag2 = true;
                    if ((anglerQuestItemNetId == 2476 || anglerQuestItemNetId == 2453 || anglerQuestItemNetId == 2473) && !flag1)
                        flag2 = true;
                    
                    if (CombinedLoader.IsAnglerQuestAvailable(anglerQuestItemNetId) === false)
                        flag2 = true;
                    
                    if (!checkedQuests.includes(anglerQuestItemNetId))
                        checkedQuests.push(anglerQuestItemNetId);
                }
                Terraria.NetMessage.SendAnglerQuest(-1);
            });
        }
        
        if (this.HookList.DrawProj(info)) {
            Terraria.Main['void DrawProjDirect(Projectile proj, Player overridePlayer)'
            ].hook((original, self, proj, player) => {
                const lightColor = Terraria.Lighting['Color GetColor(int x, int y)'](Math.floor(proj.Center.X / 16), Math.floor(proj.Center.Y / 16));
                if (ProjectileLoader.PreDraw(proj, lightColor)) {
                    original(self, proj, player);
                    ProjectileLoader.PostDraw(proj, lightColor);
                }
            });
        }
        
        if (this.HookList.DrawNPCHeadFriendly(info)) {
            Terraria.Main['void DrawNPCHeadFriendly(Entity theNPC, byte alpha, float headScale, SpriteEffects dir, int npcID, float x, float y)'
            ].hook((original, npc, alpha, scale, dir, id, x, y) => {
                if (NPCLoader.isModType(npc?.type)) {
                    if (npc.IsShimmerVariant) {
                        id = NPCLoader.ShimmerHeads[npc.type] ?? id;
                    }
                }
                original(npc, alpha, scale, dir, id, x, y);
            });
        }
        
        if (this.HookList.UpdateTime(info)) {
            Terraria.Main['void UpdateTime()'
            ].hook((original, self) => {
                let flag1 = false;
                let flag2 = false;
                let time = Terraria.Main.time + Terraria.Main.dayRate;
                
                if (!Terraria.Main.dayTime) {
                    if (time > 32400.0)
                        flag1 = true;
                } else {
                    if (time > 54000.0)
                        flag2 = true;
                }
                
                SystemLoader.PreUpdateTime();
                original(self);
                SystemLoader.PostUpdateTime();
                
                if (flag1) {
                    SystemLoader.OnStartDay();
                } else if (flag2) {
                    SystemLoader.OnStartNight();
                }
            });
        }
        
        if (this.HookList.UpdateTime_SpawnTownNPCs(info)) {
            Terraria.Main['void UpdateTime_SpawnTownNPCs(bool forceUpdate)'
            ].hook((original, self, forceUpdate) => {
                let flag1 = true;
                let worldUpdateRate = Terraria.WorldGen.GetWorldUpdateRate();
                if (Terraria.Main.netMode == 1 || worldUpdateRate <= 0) {
                    flag1 = false;
                }
                if (Terraria.Main.checkForSpawns + 1 < 7200 / worldUpdateRate) {
                    flag1 = false;
                }
                
                if (flag1) {
                    for (let index = NPCLoader.MAX_VANILLA_ID; index < NPCLoader.NPCCount; index++) {
                        Terraria.Main.townNPCCanSpawn[index] = false;
                    }
                }
                
                original(self, forceUpdate);
                
                const townNPCCanSpawn = Terraria.Main.townNPCCanSpawn;
                for (const npc of NPCLoader.TownNPCs) {
                    if (Terraria.NPC.AnyNPCs(npc.Type)) continue;
                    
                    if (npc.CanTownNPCSpawn()) {
                        townNPCCanSpawn[npc.Type] = true;
                        Terraria.WorldGen.prioritizedTownNPCType = npc.Type;
                    }
                }
            });
        }
        
        if (this.HookList.UpdateAudio_DecideOnNewMusic(info)) {
            Terraria.Main['void UpdateAudio_DecideOnNewMusic()'
            ].hook((original, self) => {
                original(self);
                
                if (!Terraria.Main.showSplash && !Terraria.Main.gameMenu) {
                    if (NPCLoader.AnyBossActive) {
                        if (NPCLoader.ActiveBoss !== -1) {
                            const musicType = NPCLoader.getModNPC(NPCLoader.ActiveBoss)?.Music ?? -1;
                            if (musicType !== -1) {
                                Terraria.Main.newMusic = musicType;
                            }
                        }
                    } else if (SceneEffectLoader.AnySceneActive) {
                        if (SceneEffectLoader.CurrentScene.Music !== -1) {
                            Terraria.Main.newMusic = SceneEffectLoader.CurrentScene.Music;
                        }
                    }
                } else if (Terraria.Main.gameMenu) {
                    if (MenuLoader.CurrentMenu) {
                        const musicType = MenuLoader.CurrentMenu.Music ?? -1;
                        if (musicType !== -1) {
                            Terraria.Main.newMusic = musicType;
                        }
                    }
                }
                
                if (Terraria.Main.gamePaused && !Terraria.Main.gameMenu) return;
                
                NPCLoader.AnyBossActive = false;
                NPCLoader.ActiveBoss = -1;
            });
        }
        
        if (this.HookList.UpdateMenu(info)) {
            Terraria.Main['void UpdateMenu()'
            ].hook((original, self) => {
                if (typeof SubworldLoader.RunLater === 'function' && Terraria.Main.menuMode === 0) {
                    SubworldLoader.RunLater();
                    SubworldLoader.RunLater = null;
                }
                original(self);
                if (Terraria.Main.gameMenu) {
                    MenuLoader.Update();
                }
            });
        }
        
        if (this.HookList.GetProjectileDesiredShader(info)) {
            Terraria.Main['int GetProjectileDesiredShader(Projectile proj)'
            ].hook((original, proj) => {
                return ProjectileLoader.ApplyShader(proj) ?? original(proj);
            });
        }
        
        if (this.HookList.DatabaseHooks(info)) {
            Terraria.Main['void ErasePlayer(int i)'
            ].hook((original, index) => {
                ModLoader.DeleteDatabase(Terraria.Main.PlayerList.get_Item(index)?.Path);
                original(index);
            });
            
            Terraria.Main['void EraseWorld(int i)'
            ].hook((original, index) => {
                ModLoader.DeleteDatabase(Terraria.Main.WorldList.get_Item(index)?.Path);
                SubworldLoader.DeleteSubworlds(Terraria.Main.WorldList['WorldFileData get_Item(int index)'](index));
                original(index);
            });
        }
        
        if (this.HookList.DoUpdate(info)) {
            Terraria.Main['void DoUpdate(GameTime gameTime)'
            ].hook((original, self, gameTime) => {
                original(self, gameTime);
                SystemLoader.Update((Terraria.Main.gameMenu || !Terraria.Main.gamePaused) && !Terraria.Main.gameInactive);
            });
        }
        
        if (this.HookList.DoDraw_UpdateCameraPosition(info)) {
            Terraria.Main['void DoDraw_UpdateCameraPosition()'
            ].hook((original, self) => {
                original(self);
                PlayerLoader.UpdateCamera();
                
                NPCLoader.UpdateCamera(ModNPC._CachedForAI)
                
                // Post NPC changes.
                CameraShake.Update();
            });
        }
        
        if (this.HookList.DrawInterface_29_SettingsButton(info)) {
            Terraria.Main['void DrawInterface_29_SettingsButton()'
            ].hook((original, self) => {
                FadeController.Update();
                original(self);
            });
        }
         
        if (this.HookList.DrawInterface_12_IngameFancyUI) {
            Terraria.Main['void DrawInterface_14_EntityHealthBars()']
            .hook((original, self) => {
            
                            
                           
                            
              original(self)
                      
        	

            });
        }
        
        Main.DrawInfernoRings.hook((orig, self) => {
        	SystemLoader.PostDrawInterface()
        	orig(self)
        })

        	
        if (this.HookList.ApplyColorOfTheSkiesToTiles(info)) {
            Terraria.Main['void ApplyColorOfTheSkiesToTiles()'
            ].hook((original, self) => {
                SceneEffectLoader.SpecialVisuals(Terraria.Main.player[Terraria.Main.myPlayer], Terraria.Main.ColorOfTheSkies);
                original(self);
            });
        }
        
        
        if (this.HookList.DrawSunAndMoon(info)) {
            Terraria.Main['void DrawSunAndMoon(SceneArea sceneArea, Color moonColor, Color sunColor, float tempMushroomInfluence)'
            ].hook((original, self, area, moonColor, sunColor, tempMushroomInfluence) => {
                if (MenuLoader.CurrentMenu) {
                    MenuLoader.CurrentMenu.ModifySunAndMoonColor(sunColor, moonColor);
                }
                original(self, area, moonColor, sunColor, tempMushroomInfluence);
            });
        }
        
        if (this.HookList.DrawBackground(info)) {
            Terraria.Main['int GetPreferredBGStyleForPlayer()'
            ].hook((original, self) => {
                return SurfaceBackgroundLoader.ChooseStyle() ?? original(self);
            });
            
            Terraria.Main['float DrawSurfaceBG_GetFogPower()'
            ].hook((original, self) => {
                const flag = Terraria.Main.BackgroundEnabled && (!Terraria.Main.remixWorld || (Terraria.Main.gameMenu && !Terraria.WorldGen.remixWorldGen)) &&
                (!Terraria.WorldGen.remixWorldGen || !Terraria.WorldGen.drunkWorldGen) && !Terraria.Main.mapFullscreen;
                
                const style = Terraria.Main.bgStyle;
                if (flag && SurfaceBackgroundLoader.isModType(style)) {
                    SurfaceBackgroundLoader.DrawCloseTexture(style);
                }
                
                return original(self);
            });
            
            Terraria.Main['void UpdateBGVisibility_FrontLayer(Nullable`1 targetBiomeOverride, Nullable`1 transitionAmountOverride)'
            ].hook((original, self, biomeOverride, transitionOverride) => {
                if (MenuLoader.CurrentMenu?.Background) {
                    if (Terraria.Main.bgStyle < SurfaceBackgroundLoader.MAX_VANILLA_ID || SurfaceBackgroundLoader.isModType(Terraria.Main.bgStyle))
                        Terraria.Main.bgStyle = MenuLoader.CurrentMenu.Background.Slot;
                }
                original(self, biomeOverride, transitionOverride);
                SurfaceBackgroundLoader.ModifyFarFades();
            });
            
            Terraria.Main['void DrawSurfaceBG_BackMountainsStep1(float backgroundTopMagicNumber, float bgGlobalScaleMultiplier, int pushBGTopHack)'
            ].hook((original, self, backgroundTopMagicNumber, bgGlobalScaleMultiplier, pushBGTopHack) => {
                original(self, backgroundTopMagicNumber, bgGlobalScaleMultiplier, pushBGTopHack);
                SurfaceBackgroundLoader.DrawFarTexture();
            });
            
            Terraria.Main['void DrawSurfaceBG_BackMountainsStep2(int pushBGTopHack)'
            ].hook((original, self, pushBGTopHack) => {
                original(self, pushBGTopHack);
                SurfaceBackgroundLoader.DrawMiddleTexture();
            });
            
            Terraria.WaterfallManager['void DrawWaterfall(SpriteBatch spriteBatch, int Style, float Alpha)'
            ].hook((original, self, sb, style, alpha) => {
                if (style != 1 && style != 14) {
                    if (SceneEffectLoader.AnySceneActive) {
                        if (SceneEffectLoader.CurrentScene.Waterfall) {
                            style = SceneEffectLoader.CurrentScene.Waterfall;
                        }
                    }
                }
                original(self, sb, style, alpha);
            });
            
            Terraria.Main['int CalculateWaterStyle(bool ignoreFountains)'
            ].hook((original, self, ignoreFountains) => {
                if (SceneEffectLoader.AnySceneActive) {
                    if (SceneEffectLoader.CurrentScene.WaterStyle) {
                        return 0;
                    }
                }
                return original(self, ignoreFountains);
            });
            
            Terraria.Dust['int dustWater()'
            ].hook((original, self) => {
                let result = original(self);
                if (SceneEffectLoader.AnySceneActive) {
                    return SceneEffectLoader.CurrentScene.GetSplashDust(result);
                }
                return result;
            });
            
            Terraria.Main['void DrawBackground()'
            ].hook((original, self) => {
                SceneEffectLoader.UpdateUndergroundScene();
                original(self);
            });
        }
        
        if (this.HookList.LoadWorlds(info)) {
            Terraria.Main['void LoadWorlds(bool canFullRefresh)'
            ].hook((original, self, canFullRefresh) => {
                original(self, canFullRefresh);
                if (isFirstJoin && Terraria.Main.menuMode === 1) {
                    isFirstJoin = false;
                    SubworldLoader.RecoverSubworlds();
                    original(self);
                }
            });
        }
        
       
        
        const CanPauseGame = Main["bool CanPauseGame()"]
    CanPauseGame.hook((original, self) => {
    
    	if (SystemLoader.Pause()) return true
    	return original(self)
    });
        
        
        Main.DrawRain.hook((original, self) => {
    original(Main.instance);
    
    if (NPCLoader._CachedForDraw) NPCLoader.DrawDirect(NPCLoader._CachedForDraw)
    
        });
     
        this.initialized = true;
    }
}