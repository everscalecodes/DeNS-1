import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import {KeyPair} from '@tonclient/core/dist/modules'
import CertificateContract from '../common/classes/CertificateContract'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const name: string = Ton.stringToHex('123')

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const certificate: CertificateContract = new CertificateContract(rootKeys, name, await root.calculateAddress())

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
        []
    )

    const certificateAddress: string = await root.resolve(name)

    expect(certificateAddress).toBe(await certificate.calculateAddress())
    done()
}, 30000)