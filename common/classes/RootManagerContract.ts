import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import {KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'

export default class RootOManagerContract extends Contract {
    public constructor(keys: KeyPair) {
        super({
            abi: contracts.rootManager.abi,
            tvc: contracts.rootManager.tvc,
            initialData: {},
            keys: keys
        })
    }



    /**********
     * DEPLOY *
     **********/
    public async deploy(
        root: string
    ): Promise<boolean> {
        return await this._deploy({
            root: root
        })
    }



    /**********
     * PUBLIC *
     **********/
    public changeManager(manager: string): Promise<ResultOfProcessMessage> {
        return this._call('changeManager', {
            manager: manager
        })
    }

    public upgrade(code: string): Promise<ResultOfProcessMessage> {
        return this._call('upgrade', {
            code: code
        })
    }

    public createCertificate(name: string, expirationTime: number, price: number): Promise<ResultOfProcessMessage> {
        return this._call('createCertificate', {
            name: name,
            expirationTime: expirationTime,
            price: price
        })
    }

    public prolongCertificate(name: string, expirationTime: number): Promise<ResultOfProcessMessage> {
        return this._call('prolongCertificate', {
            name: name,
            expirationTime: expirationTime
        })
    }
}