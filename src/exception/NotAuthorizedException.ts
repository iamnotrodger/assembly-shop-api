/**
 * @packageDocumentation
 * @category Exceptions
 * @module Exceptions
 */
import HttpException from './HttpException';

export default class NotAuthorizedException extends HttpException {
    constructor(status: number = 403, message: string = 'Unauthorized') {
        super(status, message);
    }
}
