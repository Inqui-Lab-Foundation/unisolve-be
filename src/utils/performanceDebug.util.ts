export default class PerformanceDebug {
    startTime:any = new Date();
    endTime:any = new Date();
    constructor(shouldStartAtInit=true){
        if(shouldStartAtInit){
            this.start()
        }
    }
    start(){
        this.startTime = new Date();
    }

    end(logMsgPrefix="",logMsgSuffix="",){
        this.endTime = new Date();
        console.log(":"+logMsgPrefix+": time taken : "+ (this.endTime-this.startTime/1000) +"secs :"+logMsgSuffix+" : ")
    }

}