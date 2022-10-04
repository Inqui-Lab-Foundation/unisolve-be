import { Model } from "sequelize";
import { speeches } from "../configs/speeches.config";
import TranslationsProvider from "../utils/translations/translationProvider";

export default class TranslationService {

    
    private currentLocale=TranslationsProvider.defaultLocale

    constructor(argCurrentLocale:string=TranslationsProvider.defaultLocale,initProviderAsWell=false){
        this.setCurrentLocale(argCurrentLocale)
        if(initProviderAsWell){
            TranslationsProvider.init()
        }
    }

    getSupportedLocales(){
        return TranslationsProvider.supportedLocales;
    }

    getDefaultLocale(){
        return TranslationsProvider.defaultLocale
    }

    getCurrentLocale(){
        return this.currentLocale
    }

    setCurrentLocale(argLocale:string){
        this.currentLocale = argLocale;
    }
    
    translateEntireObj(argObj:any){
        if(!argObj){
            return argObj
        }
        else if(typeof argObj == 'object'||Array.isArray(argObj)){
            
            //make sure sequelize model is objectified first before proessing further
            if(argObj instanceof Model){
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                argObj = argObj.dataValues;
            }

            for(var i = 0;i<Object.keys(argObj).length;i++){
                const key = Object.keys(argObj)[i];
                let value = argObj[key]///remember value can be 3 things, either obj or arr or others
                if(typeof value == 'object'||Array.isArray(value)){
                    // for(var j=0 ;j<value.length;j++){
                    //     value[j] = this.translateEntireObj(value[j]);
                    // }
                    argObj[key] = this.translateEntireObj(value);
                }
                // else if(value instanceof Object){
                //     argObj[key] = this.translateEntireObj(value);
                // }
                else{
                    argObj[key] = this.translateTo(this.currentLocale,value)
                }
            }
        }else{
            argObj = this.translateTo(this.currentLocale,""+argObj)
        }
        
        return argObj
    }

    translate(argKey:string){
        return this.translateTo(this.currentLocale,argKey)
    }

    translateTo(argToLocale:string,argKey:string){
        return TranslationsProvider.getTranslationTo(argToLocale,argKey);
    }

    getSpeeches(){
        return TranslationsProvider.getSpeechesFor(this.currentLocale);
    }
}