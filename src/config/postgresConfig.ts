import { Pool, PoolConfig, PoolClient, QueryResult, types } from 'pg';
import SQLException from '../exceptions/SQLException';
import InvalidRequestException from '../exceptions/InvalidRequestException';

let pgconfig: PoolConfig;

if (process.env.NODE_ENV === 'production') {
    pgconfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    };
} else {
    pgconfig = {
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT!),
        // max: config.db.max,
        // idleTimeoutMillis: config.db.idleTimeoutMillis
    };
}

const PostgresClient = new Pool(pgconfig);

PostgresClient.on('error', function (err: Error, client: PoolClient) {
    console.log(err.message);
});

/**
 * Execute a sql statement with a single row of data
 * @param sql the query for store data
 * @param data the data to be stored
 */
export const query = async (sql: string, data: any[]) => {
    let result: QueryResult;
    try {
        result = await PostgresClient.query(sql, data);
        return result;
    } catch (error) {
        throw pgError(error);
    }
};

/**
 * Execute a sql statement with a single row of data
 * This is used for transactions
 * @param sql the query for store data
 * @param data the data to be stored
 */
export const exec = async (client: PoolClient, sql: string, data: any[]) => {
    let result: QueryResult;
    try {
        result = await client.query(sql, data);
        return result;
    } catch (error) {
        throw pgError(error);
    }
};

/**
 * Execute a sql statement with multiple rows of parameter data.
 * @param sql the query for store data
 * @param data the data to be stored
 */
export const multExec = async (
    client: PoolClient,
    sql: string,
    data: any[][],
) => {
    if (data.length !== 0) {
        for (let item of data) {
            try {
                await client.query(sql, item);
            } catch (error) {
                throw pgError(error);
            }
        }
    } else {
        throw new Error('Invalid data parameter. No data available.');
    }
};

/**
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMIT or ROLLBACK needs to be called at the end before releasing the connection back to pool.
 */
export const transaction = async () => {
    const client: PoolClient = await PostgresClient.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        throw pgError(error);
    }
};

/**
 * Rollback transaction
 */
export const rollback = async (client: PoolClient) => {
    if (typeof client !== undefined && client) {
        try {
            await client.query('ROLLBACK');
        } catch (error) {
            throw pgError(error);
        } finally {
            client.release();
        }
    }
};

/**
 * Commit transaction
 */
export const commit = async (client: PoolClient) => {
    try {
        await client.query('COMMIT');
    } catch (error) {
        throw pgError(error);
    } finally {
        client.release();
    }
};

/**
 * Middle wear for throwing SQLException
 */
export const pgError = (error: any) => {
    const { code, message, severity, detail, schema, table } = error;

    if (process.env.NODE_ENV !== 'production') {
        console.log(code);
        console.log(message);
    }

    switch (code) {
        //violates unique constraints
        case '23505':
        case '23503':
            return new InvalidRequestException(message);
        default:
            return new SQLException(
                message,
                severity,
                code,
                detail,
                schema,
                table,
            );
    }
};
