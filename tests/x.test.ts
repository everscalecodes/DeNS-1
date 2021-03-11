import Ton from '../common/classes/utils/Ton'
import config from '../configs/config'
import GiverContract from '../common/classes/GiverContract'
import {KeyPair} from '@tonclient/core/dist/modules'
import RootContract, {Settings} from '../common/classes/RootContract'
import contracts from '../configs/contracts'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)

    const long: string = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789' +
                         '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789' +
                         '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    await root.deploy(
        1,
        2,
        3,
        true,
        4,
        5,
        6,
        '0:1234567890123456789012345678901234567890123456789012345678901234',
        Ton.stringsToHex(['ton', '4'])
    )

    console.log(await root.getX())
    console.log(await root.getY())

    done()
}, 30000)