import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import RootManagerContract from '../common/classes/RootManagerContract'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const newManager: string = '0:0123456789012345678901234567890123456789012345678901234567890123'

    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())

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

    await rootManager.changeManager(newManager)
    await root.waitForTransaction()

    expect(await root.getManager()).toBe(newManager)
    done()
}, 30000)



it('Wrong manager contract', async done => {
    const newManager: string = '0:0123456789012345678901234567890123456789012345678901234567890123'

    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())

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

    await rootManager.changeManager(newManager)
    await root.waitForTransaction()

    expect(await root.getManager()).not.toBe(newManager)
    done()
}, 30000)



it('Manager contract is null', async done => {
    const newManager: string = '0:0000000000000000000000000000000000000000000000000000000000000000' // THIS

    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())

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

    await rootManager.changeManager(newManager)
    await root.waitForTransaction()

    expect(await root.getManager()).not.toBe(newManager)
    done()
}, 30000)