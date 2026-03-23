import { redis } from '@repo/redis';
import { startConsumer } from './consumer';
import { refreshPositions } from './processor';


const startEngine = async()=>{
    try{
        await redis.xgroup('CREATE','engine-stream','engine-group','$','MKSTREAM') //creating the consumer group
    }catch(err:any){
        if(!err.message.includes('BUSYGROUP')) throw err
    }
    console.log("starting engine");
    await refreshPositions();
    await startConsumer();
}

startEngine();