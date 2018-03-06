import * as models from './model/models';
export const utils = {
    /**
     * Parses an ISO-8601 string representation of a date value.
     * @param {String} str The date value as a string.
     * @returns {Date} The parsed date object.
     */
    parseDate: function parseDate(str) {
        return new Date(str.replace(/T/i, ' '));
    },

    /**
     * Converts a value to the specified type.
     * @param {(String|Object)} data The data to convert, as a string or object.
     * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns An instance of the specified type.
     */
     convert: function convert(data: any, type: string) {
        switch (type) {
            case 'boolean':
                return Boolean(data);
            case 'integer':
                return parseInt(data, 10);
            case 'number':
                return parseFloat(data);
            case 'string':
                return data ? String(data) : data + '';
            case 'Date':
                return utils.parseDate(String(data));
            default:
                if (type) {
                    if (type.indexOf('models.') > -1) {
                        let model = models[type.replace('models.', '')];
                        if (model) {
                            return model.Format(data)
                        } else {
                            
                        }
                    } else if (type.indexOf('Array<') > -1) {
                        let _type = type.replace('Array<', '').replace('>', '');
                        
                        if(typeof data === 'undefined'){
                            return [];
                        }else{
                            return data.map((item) => {
                                utils.convert(item, _type);
                            });
                        }
                    }
                }
                return data;
        }
    }
};