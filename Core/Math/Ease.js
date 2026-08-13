
export default class Ease {

    static Linear = t => t;
    static InQuad = t => t * t;
    static OutQuad = t => t * (2 - t);
    static InOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    static InCubic = t => t * t * t;
    static OutCubic = t => 1 - Math.pow(1 - t, 3);
    static InOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    static InExpo = t => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));
    static OutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    static OutBack = (t, s = 1.70158) => {
        const f = t - 1;
        return f * f * ((s + 1) * f + s) + 1;
    };

    static OutElastic = t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
    };
}