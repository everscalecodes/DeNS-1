import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import {AbiContract, KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'

export default class SafeMultisigWalletContract extends Contract {
    public constructor(keys: KeyPair) {
        super({
            abi: contracts.safeMultisigWallet.abi,
            tvc: contracts.safeMultisigWallet.tvc,
            initialData: {},
            keys: keys
        })
    }



    /**********
     * DEPLOY *
     **********/
    public async deploy(owners: string[] | number[], reqConfirms: number): Promise<boolean> {
        return await this._deploy({
            owners: owners,
            reqConfirms: reqConfirms
        })
    }



    /**********
     * PUBLIC *
     **********/
    public async callAnotherContract(
        dest: string,
        value: number,
        bounce: boolean,
        flags: number,
        abi: AbiContract,
        method: string,
        input: Object,
        keys: KeyPair
    ): Promise<ResultOfProcessMessage> {
        const payload: string = await this._getPayloadToCallAnotherContract(abi, method, input)
        return await this.sendTransaction(
            dest,
            value,
            bounce,
            flags,
            payload,
            keys
        )
    }

    public async sendTransaction(
        dest: string,
        value: number,
        bounce: boolean,
        flags: number,
        payload: string,
        keys: KeyPair
    ): Promise<ResultOfProcessMessage> {
        return await this._call('sendTransaction', {
            dest: dest,
            value: value,
            bounce: bounce,
            flags: flags,
            payload: payload
        }, keys)
    }
}