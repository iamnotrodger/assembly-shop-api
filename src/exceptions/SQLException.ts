/**
 * @packageDocumentation
 * @category Exceptions
 * @module Exceptions
 */
import HttpException from './HttpException';

export default class SQLException extends HttpException {
    public severity: string | undefined;
    public code: string | undefined;
    public detail: string | undefined;
    public schema: string | undefined;
    public table: string | undefined;

    constructor(
        message: string,
        severity?: string,
        code?: string,
        detail?: string,
        schema?: string,
        table?: string,
    ) {
        super(500, message);
        this.severity = severity;
        this.code = code;
        this.detail = detail;
        this.schema = schema;
        this.table = table;

        Object.setPrototypeOf(this, SQLException.prototype);
    }
}
