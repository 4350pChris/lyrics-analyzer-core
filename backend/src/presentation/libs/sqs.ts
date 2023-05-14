/* eslint-disable @typescript-eslint/naming-convention */
import type {FromSchema, JSONSchema} from 'json-schema-to-ts';
import {type Handler, type SQSRecord} from 'aws-lambda';

type ValidatedSQSEvent<S extends JSONSchema> = {Records: Array<Omit<SQSRecord, 'body'> & {body: FromSchema<S>}>};
export type ValidatedEventSQSEvent<S extends JSONSchema> = Handler<ValidatedSQSEvent<S>, void>;
