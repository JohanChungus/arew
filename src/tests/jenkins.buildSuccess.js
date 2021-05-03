// url for this job should be :
// http://<myjenkins>/job/<myjob>/lastBuild/api/json
// or
// http://user:password@<myjenkins>/job/<myjob>/lastBuild/api/json
const httpHelper = require('madscience-httputils')

module.exports = async function(config){
    // validate settings
    if (!config.url)
        throw {
            type : 'configError',
            text : '.url required'
        }

    let jsonraw = null, 
        json = null

    try{
        jsonraw = await httpHelper.downloadString(config.url)
    } catch(ex){
        throw {
            type: 'awdtest.fail',
            test : 'jenkins.buildSuccess',
            text:  JSON.stringify(ex)
        }
    }

    try {
        json = JSON.parse(jsonraw.body)
    } catch (ex){
        throw {
            type: 'awdtest.fail',
            test : 'jenkins.buildSuccess',
            text:  'Jenkins returned invalid JSON'
        }
    }

    if (!json || json.result !== 'SUCCESS')      
        throw{
            type: 'awdtest.fail',
            test : 'jenkins.buildSuccess',
            text: `Jenkins job has unwanted status "${json.result}".`
        }
}

