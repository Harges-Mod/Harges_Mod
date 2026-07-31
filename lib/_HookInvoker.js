class HookInvoker {
    /**
     * Injects a hook into any Terraria method.
     * 
     * @param {Object} method - The target method (e.g., Terraria.Main['void DoDraw_UpdateCameraPosition()'])
     * @param {Function} callback - The handler callback structured as (orig, self, ...args)
     * @returns {Function} Function to undo the hook (unhook)
     */
    static On(method, callback) {
        if (!method || typeof method.hook !== 'function') {
            console.error('[HookInvoker] Invalid target method or missing .hook() support.');
            return () => {};
        }

        // Applies the hook, passing along 'orig', 'self', and any additional parameters
        const handle = method.hook((orig, self, ...args) => callback(orig, self, ...args));

        // Returns the Unhook function to be called whenever needed
        return () => {
            if (typeof handle?.dispose === 'function') handle.dispose();
            else if (typeof handle?.unhook === 'function') handle.unhook();
        };
    }
}

globalThis.Hook_On = HookInvoker.On;