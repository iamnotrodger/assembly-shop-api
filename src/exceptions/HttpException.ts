/** Exceptions that the API responds with
 * @packageDocumentation
 * @category Exceptions
 * @module Exceptions
 * @preferred
 */
class HttpException extends Error {
    public status: number;
    public message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;

        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export default HttpException;
