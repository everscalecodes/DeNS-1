import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import contracts from '../configs/contracts'
import IdleV2Contract from '../common/classes/IdleV2Contract'
import RootManagerContract from '../common/classes/RootManagerContract'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
    const idle: IdleV2Contract = new IdleV2Contract(await root.calculateAddress())

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

    await rootManager.upgrade(contracts.idle.code)
    await root.waitForTransaction()

    expect((await idle.getVersionHistory()).length).toBe(2)
    expect(await idle.isIdle()).toBeTruthy()
    done()
}, 30000)



it('Wrong manager contract', async done => {
    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const rootManager: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
    const rootManagerWrong: RootManagerContract = new RootManagerContract(await Ton.randomKeys())
    const idle: IdleV2Contract = new IdleV2Contract(await root.calculateAddress())

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

    await giverContract.sendGrams(10_000_000_000, await rootManagerWrong.calculateAddress())
    await rootManagerWrong.deploy(
        await root.calculateAddress()
    )

    try {
        await rootManagerWrong.upgrade(contracts.idle.code) // THIS
        await idle.waitForTransaction()
    } catch (e: any) {
        done()
    }

    expect((await root.getVersionHistory()).length).toBe(1)
    done()
}, 30000)