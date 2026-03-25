import { redis } from '@repo/redis';
import { processTick } from './processor';


export const startConsumer = async()=>{
    await drainPending();
    while(true){
        try{
            const results : any= await redis.xreadgroup(
                'GROUP','engine-group','engine-worker-1',
                'COUNT', '10', 
                'BLOCK', '0',
                'STREAMS', 'engine-stream','>'
            ); 

            if (!results) continue

            for( const[stream,messages] of results){         
                for( const [id, fields] of messages){  
                    const tick = JSON.parse(fields[1]) 
                    const { data } = tick;

                    await processTick(data.s.toLowerCase(),Number(data.a));

                    await redis.xack('engine-stream','engine-group',id);
                }
            }
        }catch(err){
            console.error(err)
        }

    }
    
}


const drainPending = async() => {
    while(true){
        try{
            const results :any = await redis.xreadgroup(
                'GROUP','engine-group','engine-worker-1',
                'COUNT','10',
                'BLOCK','100',
                'STREAMS','engine-stream','0'
            )   
            if(!results) break;

            let count = 0 ;

            for(const [stream,messages] of results){
                for(const [id,fields] of messages){
                    await redis.xack('engine-stream','engine-group',id);
                    count++;
                }    
            }
            if(count === 0 ) break ; 
        }catch(err){
            console.log(err);
        }
    }
}