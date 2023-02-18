import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'

import { parseUserId } from '../auth/utils'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

/**
 * Generate an Response object
 * @param statusCode statuscode which should be returned
 * @param body any body which is then stringified and return as body
 */
export function generateResponse(
  statusCode: number,
  body?: any
): APIGatewayProxyResult {
  return {
    statusCode,
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    body: !!body ? JSON.stringify(body) : ''
  }
}
