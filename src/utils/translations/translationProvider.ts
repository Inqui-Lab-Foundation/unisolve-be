import { illegal } from "boom";
import { constents } from "../../configs/constents.config";
import { supported_language } from "../../models/supported_language.model";
import { translation } from "../../models/translation.model";
import { speeches_en } from "./locales/en";
import { speeches_tn } from "./locales/tn";

export default class TranslationsProvider {
    
    private static translationsFromDbArr:any = {}

    private static defaultLocale = constents.translations_flags.default_locale
    static getDefaultLocale(){
        return this.defaultLocale
    }

    private static supportedLocales:any = [
    ]
    static getSupportedLocales(){
        return this.supportedLocales
    }
    
    static async init(){
       await this.initSupportedLanguages()

       await this.initTranslationsFromDb()
    }
    static async initSupportedLanguages(){
        ///initialising supported languages first 
        const data = await supported_language.findAll({
            attributes:[
                "locale"
            ],
            raw:true,
        })
        // console.log(data);
        this.supportedLocales =  data.map((u) => u.locale) 
        // console.log(this.supportedLocales);
    }
    static async initTranslationsFromDb(){
        ///initialising translations for all supported languages  
        for(var i=0;i<this.supportedLocales.length;i++){
            const locale = this.supportedLocales[i];
            this.translationsFromDbArr[locale]={};
            const localeSpecificTranslations = await translation.findAll({
                attributes:[
                    // "translation_id",
                    "key",
                    "value",
                    // "to_locale",
                    // "from_locale",
                ],
                where:{
                    to_locale:locale
                },
                raw:true
            }
            );
            // console.log(localeSpecificTranslations)
            if(localeSpecificTranslations.length>0){
                localeSpecificTranslations.map((translation)=>{
                    this.translationsFromDbArr[locale][""+translation.key]=""+translation.value;
                }); 
            }
               
        }
        // console.log(this.translationsFromDbArr)
    }
    static getTranslationTo(argToLocale:string,argKey:string){
        // console.log(argKey);
        if(this.translationsFromDbArr[argToLocale]){
            const translationsForToLocale = this.translationsFromDbArr[argToLocale]
            if(translationsForToLocale[argKey]){
                return translationsForToLocale[argKey]
            }
        }
        return argKey;
    }
    // static getTranslationFormTo(argFromLocale:string,argToLocale:string,argKey:string){
    //     //sanitation checks below ...!!!!
    //     if(!this.supportedLocales.includes(argFromLocale)){
    //         argFromLocale = this.defaultLocale;
    //     }
    //     if(!this.supportedLocales.includes(argToLocale)){
    //         argToLocale = this.defaultLocale;
    //     }
    //     if(argToLocale==this.defaultLocale){
    //         return argKey
    //     }
    //     if(argFromLocale==argToLocale){
    //         return argKey
    //     }
        
    //     const result = this.translationsFromDbArr.filter(
    //                         (translation:any)=>{
    //                             // console.log("argFromLocale",argFromLocale);
    //                             // console.log("argToLocale",argToLocale);
    //                             // console.log("argKey",argKey);
    //                             if(translation.dataValues.from_locale==argFromLocale &&
    //                                 translation.dataValues.to_locale==argToLocale &&
    //                                 translation.dataValues.key==argKey){
                                        
    //                                     return translation
    //                                 }
    //                         }
    //                     )
        
    //     if(result.length > 0 &&  result[0]){
    //         return result[0].value
    //     }
    //     return argKey
    // }

    

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