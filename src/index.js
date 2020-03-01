(async function(){

    // force import .env settings if present
    const fs = require('fs-extra');
    if (await fs.exists('./.env'))
        require('custom-env').env();

    const 
        http = require('http'),
        Express = require('express'),
        path = require('path'),
        app = Express(),
        settingsProvider = require('./lib/settings'),
        settings = await settingsProvider.get(),
        logger = require('./lib/logger'),
        daemon = require('./lib/daemon'),
        routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));

    await fs.ensureDir(settings.logs);

    // static content
    app.use(Express.static('./public'));

    // load routes
    for (let routeFile of routeFiles){
        const name = routeFile.match(/(.*).js/).pop(),
            routes = require(`./routes/${name}`);

        routes(app);
    }

    await daemon.start();
    
    const server = http.createServer(app);
    server.listen(settings.port);

    console.log(`Listening on port ${settings.port}`);
})()