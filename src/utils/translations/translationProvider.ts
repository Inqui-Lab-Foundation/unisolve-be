import { illegal } from "boom";
import { constents } from "../../configs/constents.config";
import { translation } from "../../models/translation.model";
import { speeches_en } from "./locales/en";
import { speeches_tn } from "./locales/tn";

export default class TranslationsProvider {
    
    static translationsFromDbArr:translation[] = []
    
    static translationsFromCodeArr:any = []

    static defaultLocale = constents.translations_flags.default_locale

    static supportedLocales = [
        'en',
        'tn'
    ]

    static async init(){
        this.translationsFromDbArr = await translation.findAll();
    }
    
    static getTranslationTo(argToLocale:string,argKey:string){
        return this.getTranslationFormTo(this.defaultLocale,argToLocale,argKey)
    }
    static getTranslationFormTo(argFromLocale:string,argToLocale:string,argKey:string){
        //sanitation checks below ...!!!!
        if(!this.supportedLocales.includes(argFromLocale)){
            argFromLocale = this.defaultLocale;
        }
        if(!this.supportedLocales.includes(argToLocale)){
            argToLocale = this.defaultLocale;
        }
        if(argToLocale==this.defaultLocale){
            return argKey
        }
        if(argFromLocale==argToLocale){
            return argKey
        }

        const result = this.translationsFromDbArr.filter(
                        translation=>translation.from_locale==argFromLocale &&
                        translation.to_locale==argToLocale &&
                        translation.key==argKey)

        if(result.length > 0 ){
            return result[0].value
        }
        return argKey
    }

    static getSpeechesFor(arglocale:string=this.defaultLocale){
        switch (arglocale) {
            case "en":
                return speeches_en;
            case "tn":
                return speeches_tn;
            default:
                return speeches_en;
        }
    }

}