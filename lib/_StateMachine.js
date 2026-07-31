/** @format */

class AIState {
    constructor(config) {
        this.enter = config.enter || (() => {});
        this.update = config.update || (() => {});
        this.exit = config.exit || (() => {});
        this.transitions = []; // Armazena transições: { target, condition }

        // Copia os hooks customizados adicionais
        Object.assign(this, config);
    }
}

export class GlobalStateMachine {
    /**
     * @param {object} entity - A instância da entidade física do Terraria (proj, npc, etc.)
     * @param {string} name - Identificador para depuração
     * @param {boolean} debug - Ativa logs no console
     */
    constructor(entity, name = "GlobalEntity", debug = false) {
        this.entity = entity;
        this.name = name;
        this.states = new Map();
        
        this.currentStateName = null;
        this.currentState = null;
        this.previousStateName = null;
        this.debug = debug;
    }

    /**
     * Registra um novo estado configurado.
     */
    AddState(name, config) {
        this.states.set(name, new AIState(config));
        return this; // Permite encadeamento (Method Chaining)
    }

    /**
     * Adiciona uma transição condicional entre dois estados existentes.
     */
    AddTransition(fromStateName, toStateName, conditionFunc) {
        const state = this.states.get(fromStateName);
        if (!state) {
            if (this.debug) console.error(`[StateMachine:${this.name}] Erro: Estado de origem "${fromStateName}" não existe.`);
            return this;
        }
        state.transitions.push({ target: toStateName, condition: conditionFunc });
        return this;
    }

    /**
     * DEFINE E INICIALIZA O ESTADO INICIAL DA MÁQUINA DE FORMA NATIVA.
     * Garante a execução do ciclo 'enter' do primeiro estado.
     * @param {string} stateName - O nome do estado inicial.
     * @param {...any} args - Parâmetros opcionais (como o 'data' do BitWiseHelper).
     */
    SetInitialState(stateName, ...args) {
        if (!this.states.has(stateName)) {
            if (this.debug) console.error(`[StateMachine:${this.name}] Erro: Estado inicial "${stateName}" não registrado.`);
            return this;
        }

        this.currentStateName = stateName;
        this.currentState = this.states.get(stateName);

        if (this.debug) console.log(`[StateMachine:${this.name}] Inicializado no estado: "${stateName}"`);

        // Dispara o enter do estado inicial passando a entidade e os argumentos
        this.currentState.enter(this.entity, this, ...args);
        return this;
    }

    /**
     * Executa a transição para um novo estado de forma segura.
     */
    TransitionTo(nextStateName, ...args) {
        if (!this.states.has(nextStateName)) {
            if (this.debug) console.error(`[StateMachine:${this.name}] Erro: Estado de destino "${nextStateName}" não existe.`);
            return;
        }

        // Evita transição redundante para si mesmo
        if (this.currentStateName === nextStateName) return;

        if (this.debug) {
            console.log(`[StateMachine:${this.name}] Transição: ${this.currentStateName || "None"} -> ${nextStateName}`);
        }

        // 1. Executa a saída do estado que está sendo abandonado
        if (this.currentState) {
            this.currentState.exit(this.entity, this, ...args);
        }

        // 2. Transiciona as referências
        this.previousStateName = this.currentStateName;
        this.currentStateName = nextStateName;
        this.currentState = this.states.get(nextStateName);

        // 3. Executa a inicialização do novo estado
        if (this.currentState) {
            this.currentState.enter(this.entity, this, ...args);
        }
    }

    /**
     * Retorna ao estado anterior.
     */
    RevertToPrevious(...args) {
        if (this.previousStateName) {
            this.TransitionTo(this.previousStateName, ...args);
        }
    }

    /**
     * Executa hooks customizados opcionais nos estados.
     */
    TriggerHook(hookName, ...args) {
        if (this.currentState && typeof this.currentState[hookName] === 'function') {
            this.currentState[hookName](this.entity, this, ...args);
        }
    }

    /**
     * Processa a lógica de transições automáticas e o update contínuo do estado ativo.
     */
    Update(...args) {
        if (!this.currentState) return;

        let transitionsEvaluated = 0;
        const maxTransitionsPerFrame = 5;

        // Processa transições sequenciais instantâneas se as condições forem atendidas
        while (this.currentState && this.currentState.transitions) {
            let transitionTriggered = false;

            for (const trans of this.currentState.transitions) {
                if (trans.condition(this.entity, this, ...args)) {
                    this.TransitionTo(trans.target, ...args);
                    transitionTriggered = true;
                    transitionsEvaluated++;
                    break;
                }
            }

            if (!transitionTriggered) break;

            if (transitionsEvaluated >= maxTransitionsPerFrame) {
                if (this.debug) console.error(`[StateMachine:${this.name}] Loop infinito de transições interrompido por segurança.`);
                return;
            }
        }

        // Executa o update contínuo do estado de forma segura
        if (this.currentState) {
            this.currentState.update(this.entity, this, ...args);
        }
    }
}

globalThis.GlobalStateMachine = GlobalStateMachine;
