import { Terraria } from "../TL/ModImports.js";
import { Color } from "../TL/Modules/Color.js";



globalThis.console.prob = Objec => {
	for (const property in Objec) {
        try {
            const value = JSON.stringify(Objec[property]);
            tl.log(`${property}: ${value}`);
        } catch (error) {
            tl.log(`Error accessing property ${property}: ${error}`);
        }
    }
}
globalThis.console.log = (...args) => {
  const text = args
    .map(arg =>
      typeof arg === "object"
        ? JSON.stringify(arg, null, 2)
        : String(arg)
    )
    .join(" ");

  Terraria.Main['void NewText(string newText, Color color)'](text, Color.White)
  
  tl.log(text)
};