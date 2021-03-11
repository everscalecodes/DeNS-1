import Contract from './base/Contract'
import {DecodedMessageBody, KeyPair} from '@tonclient/core/dist/modules'
import contracts from '../../configs/contracts'

export default class CertificateContract extends Contract {
    public constructor(keys: KeyPair, name: string, root: string) {
        super({
            abi: contracts.certificate.abi,
            tvc: contracts.certificate.tvc,
            initialData: {
                _name: name,
                _root: root
            },
            keys: keys
        })
    }



    /**********
     * DEPLOY *
     **********/
    public async deploy(
        manager: string,
        owner: string,
        expirationTime: number,
        price: number
    ): Promise<boolean> {
        return await this._deploy({
            manager: manager,
            owner: owner,
            expirationTime: expirationTime,
            price: price
        })
    }



    /***********
     * GETTERS *
     ***********/
    public async getWhois(): Promise<Whois> {
        const result: DecodedMessageBody = await this._run('getWhois')
        return result.value
    }
}

export interface Whois {
    name: string
    root: string
    manager: string
    owner: string
    creationTime: string
    expirationTime: string
    managerUnlockTime: string
    price: string
}