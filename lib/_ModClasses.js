const AppDomain = new NativeClass("System", "AppDomain");
const Assembly = new NativeClass("System.Reflection", "Assembly");

const GetAssemblies = AppDomain["Assembly[] GetAssemblies()"];
const GetTypes = Assembly["Type[] GetTypes()"];

function buildCompleteTree() {
    const assemblies = GetAssemblies(AppDomain.CurrentDomain);
    const tree = {};

    for (let i = 0; i < assemblies.length; i++) {
        let types;
        try {
            types = GetTypes(assemblies[i]);
        } catch {
            continue; 
        }

        for (let j = 0; j < types.length; j++) {
            const type = types[j];
            let typeName = type.Name;
            const namespace = type.Namespace;

            const finalNamespace = namespace || "GLOBAL";
            if (!typeName) continue;

            // Remove o backtick das classes genéricas do C# (ex: List`1 -> List)
            if (typeName.includes('`')) {
                typeName = typeName.split('`')[0];
            }

            try {
                const nativeClassInstance = new NativeClass(namespace || "", type.Name);
                const parts = finalNamespace.split('.');
                let current = tree;

                for (const part of parts) {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }

                current[typeName] = nativeClassInstance;
            } catch {
                // Pula interfaces puras ou structs incompatíveis
            }
        }
    }
    return tree;
}

// Mapa completo da memória
export const NativeTree = buildCompleteTree();

// Exportação estática de ABSOLUTAMENTE TODAS as raízes detectadas no seu ambiente
export const { 
    System,
    Terraria,
    GLOBAL,
    UnityEngine,
    InControl,
    Newtonsoft,
    Microsoft,
    Mono,
    MS,
    Ionic,
    ReLogic,
    Unity,
    Open,
    NaughtyAttributes,
    Assets,
    Internal,
    Controller,
    Telepathy,
    UnityEngineInternal,
    MonoGame,
    BCrypt,
    PS4Keyboard
} = NativeTree;

/**
 * Injeta dinamicamente as classes de qualquer namespace ou sub-namespace no escopo global
 * Suporta caminhos profundos como using('UnityEngine.UI') ou using('System.IO')
 */
export function using(...namespaces) {
    for (const namespace of namespaces) {
        const parts = namespace.split('.');
        let current = NativeTree;

        for (const part of parts) {
            if (current && current[part]) {
                current = current[part];
            } else {
                current = null;
                break;
            }
        }

        if (current) {
            for (const key in current) {
                if (current[key] instanceof NativeClass || (current[key] && typeof current[key] === 'object' && !Object.keys(current[key]).every(k => typeof current[key][k] === 'object'))) {
                    globalThis[key] = current[key];
                }
            }
        }
    }
}

globalThis.using = using;