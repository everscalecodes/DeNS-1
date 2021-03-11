import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import Ton from '../common/classes/utils/Ton'
import RootManagerContract from '../common/classes/RootManagerContract'
import CertificateContract from '../common/classes/CertificateContract'
import {KeyPair} from '@tonclient/core/dist/modules'
import config from '../configs/config'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const name: string = Ton.stringToHex('123')
    const expirationTime: number = 0xAFFFFFFF
    const newExpirationTime: number = 0xBFFFFFFF

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
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
        await rootManager.calculateAddress(),
        []
    )

    await giverContract.sendGrams(10_000_000_000, await rootManager.calculateAddress())
    await rootManager.deploy(
        await root.calculateAddress()
    )

    await rootManager.createCertificate(name, expirationTime, 0)
    await certificate.waitForTransaction()

    await rootManager.prolongCertificate(name, newExpirationTime)
    await certificate.waitForTransaction()

    expect((await certificate.getWhois()).expirationTime).toBe(newExpirationTime.toString())
    done()
}, 30000)



it('Wrong manager contract', async done => {
    const name: string = Ton.stringToHex('123')
    const expirationTime: number = 0xAFFFFFFF
    const newExpirationTime: number = 0xBFFFFFFF

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
    const rootManagerWrong: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
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
        await rootManager.calculateAddress(),
        []
    )

    await giverContract.sendGrams(10_000_000_000, await rootManager.calculateAddress())
    await rootManager.deploy(
        await root.calculateAddress()
    )

    await giverContract.sendGrams(10_000_000_000, await rootManagerWrong.calculateAddress())
    await rootManagerWrong.deploy(
        await root.calculateAddress()
    )

    await rootManager.createCertificate(name, expirationTime, 0)
    await certificate.waitForTransaction()

    await rootManagerWrong.prolongCertificate(name, newExpirationTime)  // THIS
    const certificateWaitingTransactionResult: boolean = await certificate.waitForTransaction()
    
    expect(certificateWaitingTransactionResult).not.toBeTruthy()
    done()
}, 30000)



it('Invalid expiration time', async done => {
    const name: string = Ton.stringToHex('123')
    const expirationTime: number = 0xAFFFFFFF
    const newExpirationTime: number = 0x9FFFFFFF // THIS

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
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
        await rootManager.calculateAddress(),
        []
    )

    await giverContract.sendGrams(10_000_000_000, await rootManager.calculateAddress())
    await rootManager.deploy(
        await root.calculateAddress()
    )

    await rootManager.createCertificate(name, expirationTime, 0)
    await certificate.waitForTransaction()

    await rootManager.prolongCertificate(name, newExpirationTime)
    await certificate.waitForTransaction()

    expect((await certificate.getWhois()).expirationTime).toBe(expirationTime.toString())
    done()
}, 30000)