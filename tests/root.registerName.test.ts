import config from '../configs/config'
import Ton from '../common/classes/utils/Ton'
import GiverContract from '../common/classes/GiverContract'
import RootContract from '../common/classes/RootContract'
import contracts from '../configs/contracts'
import {KeyPair} from '@tonclient/core/dist/modules'
import SafeMultisigWalletContract from '../common/classes/SafeMultisigWalletContract'
import AuctionContract from '../common/classes/AuctionContract'

Ton.url = config.deploy.local.url
Ton.timeout = config.deploy.local.timeout

it('Valid', async done => {
    const name: string = Ton.stringToHex('123')

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair =await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const multisigKeys: KeyPair = await Ton.randomKeys()
    const multisig: SafeMultisigWalletContract = new SafeMultisigWalletContract(multisigKeys)
    const auction: AuctionContract = new AuctionContract(rootKeys, name, await root.calculateAddress())

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
    await giverContract.sendGrams(10_000_000_000, await multisig.calculateAddress())
    await multisig.deploy([Ton.x0(multisigKeys.public)], 1)
    await multisig.callAnotherContract(
        await root.calculateAddress(),
        1_000_000_000,
        false,
        1,
        contracts.root.abi,
        'registerName',
        {
            name: name,
            periods: 1,
            bid: 0x555
        },
        multisigKeys
    )

    const waitingTransactionResult = await auction.waitForTransaction()
    expect(waitingTransactionResult).toBeTruthy()
    done()
}, 30000)



it('Wrong value', async done => {
    const name: string = Ton.stringToHex('123')

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair =await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const multisigKeys: KeyPair = await Ton.randomKeys()
    const multisig: SafeMultisigWalletContract = new SafeMultisigWalletContract(multisigKeys)
    const auction: AuctionContract = new AuctionContract(rootKeys, name, await root.calculateAddress())

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
    await giverContract.sendGrams(10_000_000_000, await multisig.calculateAddress())
    await multisig.deploy([Ton.x0(multisigKeys.public)], 1)
    await multisig.callAnotherContract(
        await root.calculateAddress(),
        2_000_000_000, // THIS
        false,
        1,
        contracts.root.abi,
        'registerName',
        {
            name: name,
            periods: 1,
            bid: 0x555
        },
        multisigKeys
    )

    const waitingTransactionResult = await auction.waitForTransaction()

    expect(waitingTransactionResult).not.toBeTruthy()
    done()
}, 30000)



it('Wrong name', async done => {
    const name: string = Ton.stringToHex('.') // THIS

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair =await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const multisigKeys: KeyPair = await Ton.randomKeys()
    const multisig: SafeMultisigWalletContract = new SafeMultisigWalletContract(multisigKeys)
    const auction: AuctionContract = new AuctionContract(rootKeys, name, await root.calculateAddress())

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
    await giverContract.sendGrams(10_000_000_000, await multisig.calculateAddress())
    await multisig.deploy([Ton.x0(multisigKeys.public)], 1)
    await multisig.callAnotherContract(
        await root.calculateAddress(),
        1_000_000_000,
        false,
        1,
        contracts.root.abi,
        'registerName',
        {
            name: name,
            periods: 1,
            bid: 0x555
        },
        multisigKeys
    )

    const waitingTransactionResult = await auction.waitForTransaction()

    expect(waitingTransactionResult).not.toBeTruthy()
    done()
}, 30000)



it('Wrong periods', async done => {
    const name: string = Ton.stringToHex('123')

    const giverContract: GiverContract = new GiverContract()
    const rootKeys: KeyPair =await Ton.randomKeys()
    const root: RootContract = new RootContract(rootKeys)
    const multisigKeys: KeyPair = await Ton.randomKeys()
    const multisig: SafeMultisigWalletContract = new SafeMultisigWalletContract(multisigKeys)
    const auction: AuctionContract = new AuctionContract(rootKeys, name, await root.calculateAddress())

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
    await giverContract.sendGrams(10_000_000_000, await multisig.calculateAddress())
    await multisig.deploy([Ton.x0(multisigKeys.public)], 1)
    await multisig.callAnotherContract(
        await root.calculateAddress(),
        1_000_000_000,
        false,
        1,
        contracts.root.abi,
        'registerName',
        {
            name: name,
            periods: 5, // THIS
            bid: 0x555
        },
        multisigKeys
    )

    const waitingTransactionResult = await auction.waitForTransaction()

    expect(waitingTransactionResult).not.toBeTruthy()
    done()
}, 30000)