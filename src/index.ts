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
        this.errors = null;
        delete asml["$schema"];

        try {
            this.ajv.addSchema(asml);
        } catch (error) {
            this.errors = this.ajv.errors;
            return null;
        }

        return this.errors === null;
    }

    validateModel(model: any) {
        this.errors = null;
        if (typeof model === 'string') {
            [this.errors, model] = this.safeJsonParse(model);
        }

        if (this.errors === null) {
            model.$schema = asml.$id;
            model.$id = "http://saman.dev/asml/schemas/schema-model.json?" + this.generateUUID();

            try {
                this.ajv.addSchema(model);
            } catch (error) {
                this.errors = this.ajv.errors;
                return null;
            }
        }

        return this.errors === null ? model["$id"] : null;
    }

    validate(model: any, state: any) {
        this.errors = null;
        if (typeof state == 'string') {
            [this.errors, state] = this.safeJsonParse(state);
        }
        if (state !== undefined) {
            const model_id = this.validateModel(model);
            if (model_id !== undefined) {
                try {
                    this.ajv.validate(model_id, state);
                    this.errors = this.ajv.errors;
                } catch (error) {
                    this.errors = this.ajv.errors;
                }
            }
        }
        return this.errors === null;
    }

    private generateUUID() {
        return uuidv4();
    }

    private safeJsonParse(str: string) {
        try {
            return [
                null, JSON.parse(str)
            ];
        } catch (error) {
            return [
                [{
                    message: error.name + ': ' + error.message
                }]
            ];
        }
    }

}
