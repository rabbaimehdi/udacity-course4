import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { Logger } from 'winston'

import { createTodo } from '../../businessLogic/todoService'
import { TodoItem } from '../../models/TodoItem'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import {
  generateResponse,
  getUserId
} from '../utils'

const logger: Logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info(`create new todo ${JSON.stringify(newTodo)}`)

    // createTodoItem -> TodoService (businesslogic)
    const item: TodoItem = await createTodo(getUserId(event), newTodo)

    //return 200 -> stringify
    return generateResponse(200, { item })
  }
)

handler.use(
  cors({
    credentials: true
  })
)
