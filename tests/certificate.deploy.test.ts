import GiverContract from '../common/classes/GiverContract'
import Ton from '../common/classes/utils/Ton'
import CertificateContract from '../common/classes/CertificateContract'
import config from '../configs/config'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid deploy', async done => {
    const giverContract: GiverContract = new GiverContract()
    const certificate: CertificateContract = new CertificateContract(
        await Ton.randomKeys(),
        Ton.stringToHex('0'),
        '0:0000000000000000000000000000000000000000000000000000000000000000'
    )

    await giverContract.sendGrams(10_000_000_000, await certificate.calculateAddress())
    const certificateDeploymentResult: boolean = await certificate.deploy(
        '0:0123456789012345678901234567890123456789012345678901234567890123',
        '0x0123456789012345678901234567890123456789012345678901234567890123',
        0,
        0
    )

    expect(certificateDeploymentResult).toBeTruthy()
    done()
}, 30000)



it('Root and message sender not equals', async done => {
    const giverContract: GiverContract = new GiverContract()
    const certificate: CertificateContract = new CertificateContract(
        await Ton.randomKeys(),
        Ton.stringToHex('0'),
        '0:5555555555555555555555555555555555555555555555555555555555555555' // THIS
    )

    await giverContract.sendGrams(10_000_000_000, await certificate.calculateAddress())
    const certificateDeploymentResult: boolean = await certificate.deploy(
        '0:0123456789012345678901234567890123456789012345678901234567890123',
        '0x0123456789012345678901234567890123456789012345678901234567890123',
        0,
        0
    )

    expect(certificateDeploymentResult).not.toBeTruthy()
    done()
}, 30000)



it('Manager is null', async done => {
    const giverContract: GiverContract = new GiverContract()
    const certificate: CertificateContract = new CertificateContract(
        await Ton.randomKeys(),
        Ton.stringToHex('0'),
        '0:0000000000000000000000000000000000000000000000000000000000000000'
    )

    await giverContract.sendGrams(10_000_000_000, await certificate.calculateAddress())
    const certificateDeploymentResult: boolean = await certificate.deploy(
        '0:0000000000000000000000000000000000000000000000000000000000000000', // THIS
        '0x0123456789012345678901234567890123456789012345678901234567890123',
        0,
        0
    )

    expect(certificateDeploymentResult).not.toBeTruthy()
    done()
}, 30000)



it('Owner is null', async done => {
    const giverContract: GiverContract = new GiverContract()
        const certificate: CertificateContract = new CertificateContract(
        await Ton.randomKeys(),
        Ton.stringToHex('0'),
        '0:0000000000000000000000000000000000000000000000000000000000000000'
    )

    await giverContract.sendGrams(10_000_000_000, await certificate.calculateAddress())
    const certificateDeploymentResult: boolean = await certificate.deploy(
        '0:0123456789012345678901234567890123456789012345678901234567890123',
        '0x0', // THIS
        0,
        0
    )

    expect(certificateDeploymentResult).not.toBeTruthy()
    done()
}, 30000)