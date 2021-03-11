import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import {KeyPair} from '@tonclient/core/dist/modules'

export default class DeNSDeBotContract extends Contract {
    public constructor(keys: KeyPair) {
        super({
            abi: contracts.densDeBot.abi,
            tvc: contracts.densDeBot.tvc,
            initialData: {},
            keys: keys
        })
    }

    public async deploy(deBotAbi: string, targetAbi: string, targetAddr: string): Promise<boolean> {
        return await this._deploy({
            deBotAbi: deBotAbi,
            targetAbi: targetAbi,
            targetAddr: targetAddr
        })
    }
}