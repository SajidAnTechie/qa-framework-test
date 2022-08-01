const Mustache = require('mustache');

/**
 * Function to parse mustache syntax.
 * for eg: {{firstName}} ==> John doe
 * 
 * @param {object|string|Array} template
 * @param {object} view 
 * @returns {object|string}
 */
function parseMustacheTemplate(template, view) {
    if(!template){
        return;
    }

    if(typeof template === 'object' || Array.isArray(template)){
        const parsedTemplate = Mustache.render(JSON.stringify(template), view);

        return JSON.parse(parsedTemplate);
    }

    return Mustache.render(template, view);
}

module.exports = {
    parseMustacheTemplate
}