import fs from "fs";
import dayjs from "dayjs";
import { GlobalLogger, glo } from "../logger/logger";

export function gloAdvancedExample() {  
  GlobalLogger.useOptions({
    stdout : fs.createWriteStream("server.log" , {flags: 'a'}), 
    stderr: fs.createWriteStream("error.log" , {flags: 'a'}), 
    allowDebug: true , 
    dateFormatter(date) {
      return "[" + dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS") + "]"
    },
  })

  glo.console.log("Le serveur à démarré sur ::3000")
  glo.console.log("Mon message d'information dans les deux fichiers")
  glo.console.error("Une erreur s'est produite");
}