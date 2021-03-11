import {ResultOfProcessMessage} from '@tonclient/core/dist/modules'
import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import config from '../../configs/config'

export default class GiverContract extends Contract {
    public constructor() {
        super({
            abi: contracts.giver.abi,
            address: config.deploy.local.giver
        })
    }



    /**********
     * PUBLIC *
     **********/
    public sendGrams(amount: number, dest: string): Promise<ResultOfProcessMessage> {
        return this._call('sendGrams', {
            amount: amount,
            dest: dest
        })
    }
}