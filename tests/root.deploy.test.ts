import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract, {Settings} from '../common/classes/RootContract'
import contracts from '../configs/contracts'
import {KeyPair} from '@tonclient/core/dist/modules'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Check getters', async done => {
    const certificateDuration: number = 1
    const certificateProlongationPeriod: number = 2
    const certificateAuctionPeriod: number = 3
    const certificateCheckLeapYear: boolean = false
    const auctionBidsDuration: number = 4
    const auctionSubmittingDuration: number = 5
    const auctionFinishDuration: number = 6
    const manager: string = '0:1234567890123456789012345678901234567890123456789012345678901234'

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair = await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)

    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    const rootDeploymentResult: boolean = await root.deploy(
        certificateDuration,
        certificateProlongationPeriod,
        certificateAuctionPeriod,
        certificateCheckLeapYear,
        auctionBidsDuration,
        auctionSubmittingDuration,
        auctionFinishDuration,
        manager,
        Ton.stringsToHex(['ton', 'os'])
    )

    const settings: Settings = await root.getSettings()

    expect(rootDeploymentResult).toBeTruthy()
    expect(settings.certificateCode).toBe(contracts.certificate.code)
    expect(settings.certificateDuration).toBe(certificateDuration.toString())
    expect(settings.certificateProlongationPeriod).toBe(certificateProlongationPeriod.toString())
    expect(settings.certificateAuctionPeriod).toBe(certificateAuctionPeriod.toString())
    expect(settings.certificateCheckLeapYear).toBe(certificateCheckLeapYear)
    expect(settings.auctionCode).toBe(contracts.auction.code)
    expect(settings.auctionBidsDuration).toBe(auctionBidsDuration.toString())
    expect(settings.auctionSubmittingDuration).toBe(auctionSubmittingDuration.toString())
    expect(settings.auctionFinishDuration).toBe(auctionFinishDuration.toString())
    expect(await root.getManager()).toBe(manager)
    expect((await root.getVersionHistory()).length).toBe(1)
    expect(await root.getPublicKey()).toBe(Ton.x0(rootKeys.public))
    done()
}, 30000)



it('Manager is null', async done => {
    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())

    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    const rootDeploymentResult: boolean = await root.deploy(
        1,
        2,
        3,
        true,
        4,
        5,
        6,
        '0:0000000000000000000000000000000000000000000000000000000000000000', // THIS
        Ton.stringsToHex(['ton', 'os'])
    )

    expect(rootDeploymentResult).not.toBeTruthy()
    done()
}, 30000)