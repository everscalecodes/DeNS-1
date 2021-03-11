import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import {DecodedMessageBody} from '@tonclient/core/dist/modules'

export default class IdleV2Contract extends Contract {
    public constructor(address: string) {
        super({
            abi: contracts.idle.abi,
            address: address
        })
    }



    /***********
     * GETTERS *
     ***********/
    public async getVersionHistory(): Promise<string[]> {
        const result: DecodedMessageBody = await this._run('getVersionHistory')
        return result.value['versionHistory']
    }

    public async isIdle(): Promise<boolean> {
        const result: DecodedMessageBody = await this._run('isIdle')
        return result.value['idle']
    }
}