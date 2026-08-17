using(
    "Microsoft.Xna.Framework",
    "Microsoft.Xna.Framework.Graphics",
    "Terraria",
    "Terraria.GameContent"
);

const { Vector2, Color } = Modules;
const { Main, TextureAssets } = Terraria;

const Draw = Main.spriteBatch[
    "void Draw(Texture2D texture, Vector2 position, Nullable`1 sourceRectangle, Color color, float rotation, Vector2 origin, float scale, SpriteEffects effects, float layerDepth)"
];
