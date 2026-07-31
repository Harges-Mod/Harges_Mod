// Testing commit.
// All Mod libs 
import './lib/_RewriteNativeLog.js'
import './lib/_NativeSoundLoader.js'
import './lib/_GlobalImports.js'
import './lib/_BitWiseHelper.js'
import './lib/_StateMachine.js'
import './lib/_ModClasses.js'
import './lib/_HookInvoker.js'


import { RegisterAll } from './Register/RegisterAll.js';
import { SystemLoader } from './TL/Loaders/SystemLoader.js';

RegisterAll();
SystemLoader.OnModLoad()