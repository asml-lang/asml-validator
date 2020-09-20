import asml from 'asml';
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';

export default class AsmlValidator {
    private ajv = new Ajv();
    public errors: object;

    constructor() {
        this.validateAsml();
    }

    validateAsml() {
        delete asml["$schema"];

        this.ajv.addSchema(asml);
        this.errors = this.ajv.errors;
        return this.errors === null;
    }

    validateModel(model: any) {
        if (typeof model == 'string') {
            model = this.safeJsonParse(model);
        }

        model.$schema = asml.$id;
        model.$id = "http://saman.dev/asml/schemas/schema-model.json?" + this.generateUUID();

        this.ajv.addSchema(model);
        this.errors = this.ajv.errors;

        return this.errors === null ? model["$id"] : null;
    }

    validate(model: any, state: any) {
        if (typeof state == 'string') {
            state = this.safeJsonParse(state);
        }

        const model_id = this.validateModel(model);
        if (model_id !== undefined) {
            this.ajv.validate(this.validateModel(model), state);
            this.errors = this.ajv.errors;

            return this.errors === null;
        }
    }

    private generateUUID() {
        return uuidv4();
    }

    private safeJsonParse(str: string) {
        try {
            return [
                [], JSON.parse(str)
            ];
        } catch (error) {
            return [
                [{
                    message: error
                }]
            ];
        }
    }

}

module.exports = AsmlValidator;