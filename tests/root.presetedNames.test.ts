import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import SafeMultisigWalletContract from '../common/classes/SafeMultisigWalletContract'
import {KeyPair} from '@tonclient/core/dist/modules'
import CertificateContract, {Whois} from '../common/classes/CertificateContract'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Alphabet', async done => {
    const defaultPublicKey: string = '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff'
    const nameOne: string = Ton.stringToHex('0123456789')
    const nameTwo: string = Ton.stringToHex('ABCDEFJHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const manager: SafeMultisigWalletContract = new SafeMultisigWalletContract(await Ton.randomKeys())
    const certificateOne: CertificateContract = new CertificateContract(rootKeys, nameOne, await root.calculateAddress())
    const certificateTwo: CertificateContract = new CertificateContract(rootKeys, nameTwo, await root.calculateAddress())

    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    await root.deploy(
        1,
        2,
        3,
        true,
        4,
        5,
        6,
        await manager.calculateAddress(),
        [nameOne, nameTwo]
    )
    const deploymentCertificateOneResult: boolean = await certificateOne.waitForTransaction()
    const deploymentCertificateTwoResult: boolean = await certificateTwo.waitForTransaction()
    const whoisOne: Whois = await certificateOne.getWhois()
    const whoisTwo: Whois = await certificateTwo.getWhois()

    expect(deploymentCertificateOneResult).toBeTruthy()
    expect(deploymentCertificateTwoResult).toBeTruthy()
    expect(whoisOne.name).toBe(nameOne)
    expect(whoisTwo.name).toBe(nameTwo)
    expect(whoisOne.root).toBe(await root.calculateAddress())
    expect(whoisTwo.root).toBe(await root.calculateAddress())
    expect(whoisOne.manager).toBe(await manager.calculateAddress())
    expect(whoisTwo.manager).toBe(await manager.calculateAddress())
    expect(whoisOne.owner).toBe(defaultPublicKey)
    expect(whoisTwo.owner).toBe(defaultPublicKey)
    expect(whoisOne.expirationTime).toBe(0xFFFFFFFF.toString())
    expect(whoisTwo.expirationTime).toBe(0xFFFFFFFF.toString())
    expect(whoisOne.managerUnlockTime).toBe('0')
    expect(whoisTwo.managerUnlockTime).toBe('0')
    done()
}, 30000)



it('Length is 0', async done => {
    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const manager: SafeMultisigWalletContract = new SafeMultisigWalletContract(await Ton.randomKeys())
    const certificate: CertificateContract = new CertificateContract(rootKeys, '', await root.calculateAddress())

    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    await root.deploy(
        1,
        2,
        3,
        true,
        4,
        5,
        6,
        await manager.calculateAddress(),
        [''], // THIS
    )
    const deploymentCertificateResult: boolean = await certificate.waitForTransaction()

    expect(deploymentCertificateResult).not.toBeTruthy()
    done()
}, 30000)



it('Dot "." in name', async done => {
    const name: string = Ton.stringToHex('1.2') // THIS

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const manager: SafeMultisigWalletContract = new SafeMultisigWalletContract(await Ton.randomKeys())
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
        await manager.calculateAddress(),
        [name]
    )
    const deploymentCertificateResult: boolean = await certificate.waitForTransaction()

    expect(deploymentCertificateResult).not.toBeTruthy()
    done()
}, 30000)



it('Forward slash "/" in name', async done => {
    const name: string = Ton.stringToHex('1/2') // THIS

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const manager: SafeMultisigWalletContract = new SafeMultisigWalletContract(await Ton.randomKeys())
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
        await manager.calculateAddress(),
        [name]
    )
    const deploymentCertificateResult: boolean = await certificate.waitForTransaction()

    expect(deploymentCertificateResult).not.toBeTruthy()
    done()
}, 30000)



it('Very long name', async done => {
    const name: string = Ton.stringToHex('012345678901234567890123456789012345678901234567890123456789' +
                                               '012345678901234567890123456789012345678901234567890123456789' +
                                               '012345678901234567890123456789012345678901234567890123456789' +
                                               '012345678901234567890123456789012345678901234567890123456789' +
                                               '012345678901234567890123456789012345678901234567890123456789' // THIS
    )

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const manager: SafeMultisigWalletContract = new SafeMultisigWalletContract(await Ton.randomKeys())
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
        await manager.calculateAddress(),
        [name]
    )
    const deploymentCertificateResult: boolean = await certificate.waitForTransaction()

    expect(deploymentCertificateResult).not.toBeTruthy()
    done()
}, 30000)