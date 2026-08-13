using("Terraria");
using("Terraria.ID");
using("Microsoft.Xna.Framework");

GlobalImports.AllModules();

class ParticleEngine {
    constructor(poolSize = 1000) {
        this.poolSize = poolSize;
        this.pool = new Array(poolSize);
        
        // Get Last FreeList
        this.freeList = new Array(poolSize);
        
        // Not Create particle on Unnecessary  slot
        this.activeList = [];
        this.activeSlot = new Array(poolSize).fill(-1);

        for (let i = 0; i < poolSize; i++) {
            const p = this._createParticle();
            p._idx = i;
            this.pool[i] = p;
            this.freeList[i] = poolSize - 1 - i;
        }
        this.freeTop = poolSize;
    }

    _createParticle() {
        return {
            active: false,
            texture: null,
            
            
            originX: -1,
            originY: -1,
            
            posX: 0, posY: 0,
            velX: 0, velY: 0,
            
            gravity: 0,
            drag: 0,
            rotation: 0,
            rotationVelocity: 0,

            scaleFromX: 1, scaleFromY: 1,
            scaleToX: 1, scaleToY: 1,
            curScaleX: 1, curScaleY: 1,

            colorFromR: 255, colorFromG: 255, colorFromB: 255,
            colorToR: 255, colorToG: 255, colorToB: 255,
            colorR: 255, colorG: 255, colorB: 255,
            alpha: 1,

            age: 0,
            lifeTime: 60,
            invLifeTime: 1 / 60,
            fadeOut: 0,
            additive: false,
            layer: 0,
            manual: false,

            target: null,
            targetOffX: 0,
            targetOffY: 0,

            _idx: -1
        };
    }

    Spawn(tex, pos, vel, opts = {}) {
        if (this.freeTop <= 0) return null; // Full Pool
    
        if (!tex) {
            throw new TypeError("UParticle.Spawn: 'tex' is required (got null/undefined).");
        }
        if (!pos || typeof pos.X !== "number" || typeof pos.Y !== "number") {
            throw new TypeError("UParticle.Spawn: 'pos' must be a Vector2-like object with numeric X/Y.");
        }
        if (!vel || typeof vel.X !== "number" || typeof vel.Y !== "number") {
            throw new TypeError("UParticle.Spawn: 'vel' must be a Vector2-like object with numeric X/Y.");
        }
        if (opts.target != null && typeof opts.target !== "function" && opts.target.Center == null) {
            throw new TypeError("UParticle.Spawn: 'target' must be a function or an object exposing 'Center'.");
        }
        
        
        
        
        const idx = this.freeList[--this.freeTop];
        const p = this.pool[idx];
        
        const origin = opts.origin;
        
        if (origin) {
            p.originX = origin.X;
            p.originY = origin.Y;
        } else {
            p.originX = -1;
            p.originY = -1;
        }

        p.active = true;
        p.texture = tex;
        p.posX = pos.X; p.posY = pos.Y;
        p.velX = vel.X; p.velY = vel.Y;
        p.gravity = opts.gravity || 0;
        p.drag = opts.drag || 0;
        p.rotation = opts.rot || 0;
        p.rotationVelocity = opts.rotVel || 0;
        
        
        // Maybe fix GC
        const scaleFrom = opts.scaleFrom || Vector2.One;
        const scaleTo = opts.scaleTo || scaleFrom;
        
        p.scaleFromX = scaleFrom.X;
        p.scaleFromY = scaleFrom.Y;
        p.scaleToX = scaleTo.X;
        p.scaleToY = scaleTo.Y;
        
        p.curScaleX = p.scaleFromX;
        p.curScaleY = p.scaleFromY;
        const cFrom = opts.colorFrom || opts.color || Color.White;
        const cTo = opts.colorTo || cFrom;
        p.colorFromR = cFrom.R; p.colorFromG = cFrom.G; p.colorFromB = cFrom.B;
        p.colorToR = cTo.R; p.colorToG = cTo.G; p.colorToB = cTo.B;
        p.colorR = p.colorFromR; p.colorG = p.colorFromG; p.colorB = p.colorFromB;

        p.age = 0;
        
        p.lifeTime = opts.life || 30;
        p.invLifeTime = 1 / Math.max(1, p.lifeTime);
        
        p.fadeOut = opts.fadeOut != null
            ? opts.fadeOut
            : (p.lifeTime * 0.4) | 0;
        
        p.invFadeOut = 1 / Math.max(1, p.fadeOut);
        p.additive = !!opts.additive;
        p.layer = opts.layer === 1 ? 1 : 0;
        p.manual = !!opts.manual;

        p.target = opts.target || null;
        p.targetOffX = 0;
        p.targetOffY = 0;

        this.activeSlot[idx] = this.activeList.length;
        this.activeList.push(idx);

        return p;
    }

    Kill(p) {
        if (!p || !p.active) return;
        p.active = false;

        const idx = p._idx;
        const slot = this.activeSlot[idx];
        const lastSlot = this.activeList.length - 1;
        const lastPoolIdx = this.activeList[lastSlot];

        this.activeList[slot] = lastPoolIdx;
        this.activeSlot[lastPoolIdx] = slot;
        this.activeList.pop();
        this.activeSlot[idx] = -1;

        this.freeList[this.freeTop++] = idx;
    }

    Clear() {
        for (let i = this.activeList.length - 1; i >= 0; i--) {
            const idx = this.activeList[i];
            this.pool[idx].active = false;
            this.activeSlot[idx] = -1;
            this.freeList[this.freeTop++] = idx;
        }
        this.activeList.length = 0;
    }

    _resolveTargetPosition(p) {
        const target = p.target;
        if (!target) return null;

        if (typeof target === "function") {
            try {
                return target() || null;
            } catch (e) {
                return null;
            }
        }
        return target.Center || null;
    }

    _updateParticle(p) {
        p.age++;
        if (p.age >= p.lifeTime) {
            this.Kill(p);
            return;
        }

        let vx = p.velX;
        let vy = p.velY + p.gravity;
        if (p.drag > 0) {
            const keep = 1 - p.drag;
            vx *= keep;
            vy *= keep;
        }
        p.velX = vx;
        p.velY = vy;
        p.rotation += p.rotationVelocity;

        if (p.target) {
            const targetPos = this._resolveTargetPosition(p);
            p.targetOffX += vx;
            p.targetOffY += vy;

            if (targetPos) {
                p.posX = targetPos.X + p.targetOffX;
                p.posY = targetPos.Y + p.targetOffY;
            } else {
                p.target = null;
                p.posX += vx;
                p.posY += vy;
            }
        } else {
            p.posX += vx;
            p.posY += vy;
        }

        if (p.manual) return;

        const t = p.age * p.invLifeTime;

        p.curScaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t;
        p.curScaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t;

        p.colorR = p.colorFromR + (p.colorToR - p.colorFromR) * t;
        p.colorG = p.colorFromG + (p.colorToG - p.colorFromG) * t;
        p.colorB = p.colorFromB + (p.colorToB - p.colorFromB) * t;

        p.alpha = p.age >= p.lifeTime - p.fadeOut
            ? Math.max(0, (p.lifeTime - p.age) / Math.max(1, p.fadeOut))
            : 1;
    }

    Update() {
        for (let i = this.activeList.length - 1; i >= 0; i--) {
            const p = this.pool[this.activeList[i]];
            this._updateParticle(p);
        }
    }

    _drawParticle(p) {
        if (!p.texture || p.alpha <= 0) return;

        const screenPos = Main.screenPosition;
        const a = p.additive ? 0 : p.alpha * 255;

        const drawColor = Color.new(
            p.colorR * p.alpha,
            p.colorG * p.alpha,
            p.colorB * p.alpha,
            a
        );

        const origin = Vector2.new(
            p.originX >= 0 ? p.originX : p.texture.Width * 0.5,
            p.originY >= 0 ? p.originY : p.texture.Height * 0.5
        );
        
        const drawPos = Vector2.new(p.posX - screenPos.X, p.posY - screenPos.Y);
        const scale = Vector2.new(p.curScaleX, p.curScaleY);

        Generic.EntityDraw(
            p.texture,
            drawPos,
            Generic.getRect(p.texture),
            drawColor,
            p.rotation,
            origin,
            scale,
            SpriteEffects.None
        );
    }

    DrawAll(layerAfter) {
        const targetLayer = layerAfter ? 1 : 0;
        const activeList = this.activeList;

        for (let i = 0; i < activeList.length; i++) {
            const p = this.pool[activeList[i]];
            if (p.layer !== targetLayer) continue;
            this._drawParticle(p);
        }
    }
}

export default class UParticle {
    static Pool = new ParticleEngine(5000);

    static Spawn(tex, pos, vel, opts = {}) {
        return UParticle.Pool.Spawn(tex, pos, vel, opts);
    }

    static Update() {
        UParticle.Pool.Update();
    }

    static Kill(p) {
        UParticle.Pool.Kill(p);
    }

    static Draw(layerAfter = false) {
        UParticle.Pool.DrawAll(layerAfter);
    }

    static Clear() {
        UParticle.Pool.Clear();
    }
}

