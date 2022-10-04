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

        for(var i = 0;i<Object.keys(argObj).length;i++){
            const key = Object.keys(argObj)[i];
            const value = argObj[key]
            if(Array.isArray(value)){
                argObj[key] = this.translateEntireObj(value);
            }
            argObj[key] = this.translateTo(this.currentLocale,value)
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