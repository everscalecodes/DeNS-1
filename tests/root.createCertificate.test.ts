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
    const name: string = Ton.stringToHex('ton')
    const expirationTime: number = 0xFFFFFFFF
    const price: number = 15

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

    await rootManager.createCertificate(name, expirationTime, 15)
    await certificate.waitForTransaction()

    expect((await certificate.getWhois()).name).toBe(name)
    expect((await certificate.getWhois()).root).toBe(await root.calculateAddress())
    expect((await certificate.getWhois()).manager).toBe(await rootManager.calculateAddress())
    expect((await certificate.getWhois()).owner).toBe('0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff')
    expect((await certificate.getWhois()).expirationTime).toBe(expirationTime.toString())
    expect((await certificate.getWhois()).price).toBe(price.toString())
    done()
}, 30000)



it('Wrong manager contract', async done => {
    const name: string = Ton.stringToHex('ton')

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
        '0:5555555555555555555555555555555555555555555555555555555555555555', // THIS
        []
    )

    await giverContract.sendGrams(10_000_000_000, await rootManager.calculateAddress())
    await rootManager.deploy(
        await root.calculateAddress()
    )

    await rootManager.createCertificate(name, 0xFFFFFFFF, 0)
    const certificateCreationResult: boolean = await certificate.waitForTransaction()

    expect(certificateCreationResult).not.toBeTruthy()
    done()
}, 30000)



it('Name is null', async done => {
    const name: string = '' // THIS

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

    await rootManager.createCertificate(name, 0xFFFFFFFF, 0)
    const certificateCreationResult: boolean = await certificate.waitForTransaction()

    expect(certificateCreationResult).not.toBeTruthy()
    done()
}, 30000)



it('Name length > 255', async done => {
    let name: string = ''
    for (let i: number = 0; i < 256; i++) // THIS
        name = name + 'a'
    name = Ton.stringToHex(name)

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

    await rootManager.createCertificate(name, 0xFFFFFFFF, 0)
    const certificateCreationResult: boolean = await certificate.waitForTransaction()

    expect(certificateCreationResult).not.toBeTruthy()
    done()
}, 30000)