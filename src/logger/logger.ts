/**
 * logger.ts 
 * 
 * Implémentation d'un logger global en standalone
 * pour une application NodeJS / TS 
 * 
 */
import {Console} from "node:console";

/**
 * Codes de couleur pour le balisage 
 * dans le terminal télétype (TTY)
 * Pour plus d'informations : 
 * https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors
 */
const tty:{[key:string]:unknown} = {
    stop : "\x1b[0m",
    date : "\x1b[90m" , 
    state: "\x1b[37m",
    level : {
        info: "\x1b[44m" , 
        error: "\x1b[41m" , 
        warn: "\x1b[43m",
        debug: "\x1b[45m"
    }
};

/**
 * Console personalisée pour un logging
 * aussi bien sur la sortie standard
 * que dans un fichier
 */
class ConsoleLogger
{
    private _cls: Console;
    private enableMarkups: boolean;
    
    constructor(stdout: NodeJS.WritableStream, stderr?: NodeJS.WritableStream , enableMarkups = true){
        this._cls = new Console(stdout, stderr);
        this.enableMarkups = enableMarkups;
    }

    log(level: string, 
        dateFormatter: (arg0:Date) => string, 
        ...args:unknown[]) {

        const logFunctions:{[key:string]: (...args:unknown[])=>void} = {
            "info": this._cls.info , 
            "warn": this._cls.warn , 
            "error" : this._cls.error, 
            "debug": this._cls.debug, 
        };

        const f = (logFunctions[level] as (...args:unknown[])=>void) 
            ?? this._cls.log; 

        f(this.enableMarkups ? tty.date : "",
            dateFormatter(new Date()),
            this.enableMarkups ?  tty.stop : "",
            this.enableMarkups ?  
                (tty.level as {[key:string]:string})[level] ?? tty.state
                : "",
            level.toUpperCase(),
            this.enableMarkups ? tty.stop : "", 
            this.enableMarkups ? tty.state : "",
            ...args,
            this.enableMarkups ? tty.stop : "",
        );
    }
}


export interface GlobalLoggerOptions {
    stdout?: NodeJS.WritableStream, 
    stderr?: NodeJS.WritableStream,
    dateFormatter: (date:Date) => string;
    allowDebug: boolean;
}
/**
 * Classe (Singleton) principale chargée d'éffectuer le logging
 */
export class GlobalLogger
{
    static instance: GlobalLogger = new GlobalLogger({
        dateFormatter:(d) => d.toISOString(), allowDebug:true
    });
    static I: GlobalLogger = GlobalLogger.instance;

    static useOptions(options: GlobalLoggerOptions) {
        GlobalLogger.instance = new GlobalLogger(options);
        GlobalLogger.I = GlobalLogger.instance;
    }

    private dateFormatter: (date:Date) => string;
    private clsLogger: ConsoleLogger;
    private fileLogger?: ConsoleLogger;
    private allowDebug: boolean;
    private constructor(options:GlobalLoggerOptions) {
        // private constructor
        this.dateFormatter = options.dateFormatter;
        this.allowDebug = options.allowDebug;
        this.clsLogger = new ConsoleLogger(process.stdout, process.stderr);
        if(options.stdout != null){
            this.fileLogger =new ConsoleLogger(options.stdout, options.stderr,false , );
        }
    }


    public logInfo(...args: unknown[]) {
        if(null != this.fileLogger){
            this.fileLogger.log("info" , this.dateFormatter, ...args);
        }
        this.clsLogger.log("info" , this.dateFormatter, ...args);
        
    }

    public logWarning(...args: unknown[]){
        if(null != this.fileLogger) {
            this.fileLogger.log("warn" , this.dateFormatter, ...args);
        }
        this.clsLogger.log("warn" , this.dateFormatter, ...args);
    }

    public logError(...args: unknown[]){
        if( null != this.fileLogger){
            this.fileLogger.log("error" , this.dateFormatter, ...args);
        }
        this.clsLogger.log("error" , this.dateFormatter, ...args);
    }

    // public logFatal(...args: string[]){
    //     this.fileLogger.log("error" , this.dateFormatter, ...args);
    //     this.clsLogger.log("errro" , this.dateFormatter, ...args);
    // }

    public debug(...args: unknown[]) {
        if(this.allowDebug){    
            if(null != this.fileLogger){
                this.fileLogger.log("debug" , this.dateFormatter, ...args);
            }
            this.clsLogger.log("debug" , this.dateFormatter, ...args);
        }
    }
}

/**
 * ... Aliasing ... 
 */
export const glo = {
    console: {
        log : (...args: unknown[]) => GlobalLogger.I.logInfo(...args),
        info : (...args: unknown[]) => GlobalLogger.I.logInfo(...args),
        warn : (...args: unknown[]) => GlobalLogger.I.logWarning(...args),
        error : (...args: unknown[]) => GlobalLogger.I.logError(...args),
        debug : (...args: unknown[]) => GlobalLogger.I.debug(...args),
    }
};