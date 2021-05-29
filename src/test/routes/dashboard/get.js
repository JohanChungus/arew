describe('routes/dashboard/get', async()=>{

    it('routes/dashboard/get::happy', async() => {
        const ctx =  require(_$t+'context'),
            daemon =  require(_$+'lib/daemon'),
            route = ctx.express.getRoute(_$+'routes/dashboard')

        const settings = {
            dashboards : { default : { watchers : 'test,another' } },
            // need wto watcgers to hit all sort and other collection logic
            watchers : { test : { host: 'http://example.com' }, another : { host: 'http://example.com' } }
        }
 
        ctx.settings(settings)   

        // stub out cron or it will spawn actual threads
        ctx.inject.object('cron', {
            CronJob : class { 
                nextDates(){ return '' }
            }
        })
        ctx.inject.object('./logger', { instanceWatcher(){
            return { info(){}, warn(){}, debug(){}, error(){} }
        }})

        await daemon.start()
        route(ctx.express.req, ctx.express.res)
    })

    it('routes/dashboard/get::invalid dashboard', async() => {
        const ctx =  require(_$t+'context')
        ctx.settings({ dashboards : null })
        ctx.express.req.params.dashboard = 'bogusdashboard'
        
        const route = ctx.express.getRoute(_$+'routes/dashboard')
        route(ctx.express.req, ctx.express.res)
    })

    
    it('routes/dashboard/get::throws error', async() => {
        const ctx =  require(_$t+'context')
        ctx.express.res.send =()=>{ throw 'error' }
        
        const route = ctx.express.getRoute(_$+'routes/dashboard')
        route(ctx.express.req, ctx.express.res)
    })
})