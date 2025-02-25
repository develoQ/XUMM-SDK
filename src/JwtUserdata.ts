import {debug as Debug} from 'debug'
import type {Meta} from './Meta'

import type {
  AnyJson,
  JwtUserdataList,
  JwtUserdataGet,
  JwtUserdataSet,
  JwtUserdataDelete
} from './types'

import {throwIfError} from './utils'

const log = Debug('xumm-sdk:xapp:userdata')

export class JwtUserdata {
  private Meta: Meta

  constructor (MetaObject: Meta) {
    log('Constructed')
    this.Meta = MetaObject
  }

  public async list (): Promise<string[]> {
    const call = await this.Meta.call<JwtUserdataList>('userdata', 'GET')

    throwIfError(call)

    return call.keys
  }

  public async get (key: string | string[]): Promise<AnyJson> {
    const keys = Array.isArray(key) ? key.join(',') : key
    const call = await this.Meta.call<JwtUserdataGet>('userdata/' + keys, 'GET')

    throwIfError(call)

    return keys.split(',').length > 1 ? call.data : (call.data?.[keys] as AnyJson || {})
  }

  public async delete (key: string): Promise<boolean> {
    const call = await this.Meta.call<JwtUserdataDelete>('userdata/' + key, 'DELETE')

    throwIfError(call)

    return call.persisted
  }

  public async set (key: string, data: AnyJson): Promise<boolean> {
    const call = await this.Meta.call<JwtUserdataSet>('userdata/' + key, 'POST', data)

    throwIfError(call)

    return call.persisted
  }
}
