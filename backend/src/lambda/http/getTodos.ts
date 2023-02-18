import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'

import { getTodos } from '../../businessLogic/todoService'
import { createLogger } from '../../utils/logger'
import {
  generateResponse,
  getUserId
} from '../utils'

const logger: Logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(event)

    // Get todo items  -> TodoService (businesslogic)
    const items = await getTodos(getUserId(event))
    // return 200 -> stringify (todo items)
    return generateResponse(200, { items })
  }
)

handler.use(
  cors({
    credentials: true
  })
)
