import Contract from './base/Contract'
import {KeyPair} from '@tonclient/core/dist/modules'
import contracts from '../../configs/contracts'

export default class AuctionContract extends Contract {
    public constructor(keys: KeyPair, name: string, root: string) {
        super({
            abi: contracts.auction.abi,
            tvc: contracts.auction.tvc,
            initialData: {
                _name: name,
                _root: root
            },
            keys: keys
        })
    }
}