import Contract from './base/Contract'
import contracts from '../../configs/contracts'
import {DecodedMessageBody, KeyPair, ResultOfProcessMessage} from '@tonclient/core/dist/modules'

export default class RootContract extends Contract {
    public constructor(keys: KeyPair) {
        super({
            abi: contracts.root.abi,
            tvc: contracts.root.tvc,
            initialData: {},
            keys: keys
        })
    }



    /**********
     * DEPLOY *
     **********/
    public async deploy(
        certificateDuration: number,
        certificateProlongationPeriod: number,
        certificateAuctionPeriod: number,
        certificateCheckLeapYear: boolean,
        auctionBidsDuration: number,
        auctionSubmittingDuration: number,
        auctionFinishDuration: number,
        manager: string,
        names: string[],
    ): Promise<boolean> {
        return await this._deploy({
            certificateCode: contracts.certificate.code,
            certificateDuration: certificateDuration,
            certificateProlongationPeriod: certificateProlongationPeriod,
            certificateAuctionPeriod: certificateAuctionPeriod,
            certificateCheckLeapYear: certificateCheckLeapYear,
            auctionCode: contracts.auction.code,
            auctionBidsDuration: auctionBidsDuration,
            auctionSubmittingDuration: auctionSubmittingDuration,
            auctionFinishDuration: auctionFinishDuration,
            manager: manager,
            names: names
        })
    }



    /**********
     * PUBLIC *
     **********/
    public async changeManager(manager: string): Promise<ResultOfProcessMessage> {
        return await this._call('changeManager', {manager: manager})
    }



    /***********
     * GETTERS *
     ***********/
    public async getSettings(): Promise<Settings> {
        const result: DecodedMessageBody = await this._run('getSettings')
        return result.value
    }

    public async getPublicKey(): Promise<string> {
        const result: DecodedMessageBody = await this._run('getPublicKey')
        return result.value['publicKey']
    }

    public async getManager(): Promise<string> {
        const result: DecodedMessageBody = await this._run('getManager')
        return result.value['manager']
    }

    public async getVersionHistory(): Promise<string[]> {
        const result: DecodedMessageBody = await this._run('getVersionHistory')
        return result.value['versionHistory']
    }

    public async resolve(name: string): Promise<string> {
        const result: DecodedMessageBody = await this._run('resolve', {
            name: name
        })
        return result.value['addr']
    }

    public async resolveAuction(name: string): Promise<string> {
        const result: DecodedMessageBody = await this._run('resolveAuction', {
            name: name
        })
        return result.value['addr']
    }
}

export interface Settings {
    certificateCode: string
    certificateDuration: string
    certificateProlongationPeriod: string
    certificateAuctionPeriod: string
    certificateCheckLeapYear: boolean
    auctionCode: string
    auctionBidsDuration: string
    auctionSubmittingDuration: string
    auctionFinishDuration: string
}