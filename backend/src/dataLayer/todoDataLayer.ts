import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { Logger } from 'winston'

import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const ATTACHMENT_S3_BUCKET: string = process.env.ATTACHMENT_S3_BUCKET
const EXPIRES: number = Number(process.env.SIGNED_URL_EXPIRATION)
const logger: Logger = createLogger('TodoDataLayer')

export class TodoDataLayer {
  constructor(
    private readonly dynamoClient: DocumentClient = createDynamoDBClient(),
    private readonly s3Client: any = generateS3Client(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly TodosIndex = process.env.TODO_INDEX_NAME,
    private readonly logger: Logger = createLogger('TodoDataLayer')
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    this.logger.info(`get todos for user ${userId}`)

    const result = await this.dynamoClient
      .query({
        TableName: this.TodosTable,
        IndexName: this.TodosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    this.logger.info(`deleting todo (${todoId}) for user ${userId} `)

    await this.dynamoClient
      .delete({
        TableName: this.TodosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    this.logger.info(`create todo (${item.todoId}) for user ${item.userId}`)

    await this.dynamoClient
      .put({
        TableName: this.TodosTable,
        Item: item
      })
      .promise()

    return item
  }

  async updateTodoAttachment(
    userId: string,
    todoId: string,
    attachmentUrl: string
  ): Promise<void> {
    this.logger.info(`update todo (${todoId}) attachment for user ${userId}`)

    await this.dynamoClient
      .update({
        TableName: this.TodosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
  }

  async updateTodo(
    userId: string,
    todoId: string,
    todoRequest: UpdateTodoRequest
  ): Promise<TodoItem> {
    this.logger.info(`update todo (${todoId}) for user ${userId}`)

    const result = await this.dynamoClient
      .update({
        TableName: this.TodosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression:
          'SET #todoItemName = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': todoRequest.name,
          ':dueDate': todoRequest.dueDate,
          ':done': todoRequest.done
        },
        ExpressionAttributeNames: {
          '#todoItemName': 'name'
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    return result.Attributes as TodoItem
  }

  async getSignedUploadUrl(todoId: string): Promise<string> {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: ATTACHMENT_S3_BUCKET,
      Key: todoId,
      Expires: EXPIRES
    })
  }
}

function generateS3Client() {
  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    // I tried to use XAWS but then it didn't recognize DocumentClient anymore.
    // So the tracing is only enabled for the s3
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
