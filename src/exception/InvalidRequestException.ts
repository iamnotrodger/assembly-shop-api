/**
 * @category Exceptions
 * @module Exceptions
 */
import HttpException from './HttpException';

export default class InvalidRequestException extends HttpException {
    constructor(message?: string) {
        const errorMessage = message || 'Invalid request';
        super(422, errorMessage);

        Object.setPrototypeOf(this, InvalidRequestException.prototype);
    }
}
