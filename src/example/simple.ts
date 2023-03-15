/**
 * glo.ts
 * 
 * Exemples simples d'usage de la librairie
 */

import { glo } from "../logger/logger";

export function gloSimpleExample() {
  try {
   
    glo.console.log("Hello, je suis un simple message d'information");
    glo.console.warn("Vous vous apprêtez à faire un truc bizarre");
    glo.console.warn("Attention");
    glo.console.debug("Mon deboggage" , {
      a : 1 ,
      b : 2 , 
      c:  {
        x : 1 , 
        y : 2 , 
        z : 3,
      }
    })
    glo.console.error("Une erreur s'est produite");
    //throw new Error("Une exception s'est produite");  
  } catch (error) {
    glo.console.error(error);
  }
}