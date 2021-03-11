import Ton from '../common/classes/utils/Ton'
import config from '../configs/config'
import GiverContract from '../common/classes/GiverContract'
import DeNSDeBotContract from '../common/classes/DeNSDeBotContract'
import contracts from '../configs/contracts'
import loggerConfig from '../configs/logger'
import Logger, {LoggerInterface} from 'logger'
import RootContract from '../common/classes/RootContract'
import SafeMultisigWalletContract from '../common/classes/SafeMultisigWalletContract'
import {KeyPair} from '@tonclient/core/dist/modules'
import fs from 'fs'

async function deploy(): Promise<void> {
    Ton.url = config.deploy.local.url
    Ton.timeout = config.deploy.local.timeout

    const logger: LoggerInterface = new Logger(loggerConfig)
    const giverContract: GiverContract = new GiverContract()
    const root: RootContract = new RootContract(await Ton.randomKeys())
    const deBot: DeNSDeBotContract = new DeNSDeBotContract(await Ton.randomKeys())
    const rootManagerMultisigKeys: KeyPair = await Ton.randomKeys()
    const rootManagerMultisig: SafeMultisigWalletContract = new SafeMultisigWalletContract(rootManagerMultisigKeys)

    await giverContract.sendGrams(10_000_000_000, await root.calculateAddress())
    await root.deploy(
        300,
        60,
        120,
        true,
        30,
        30,
        120,
        await rootManagerMultisig.calculateAddress(),
        Ton.stringsToHex(config.deploy.names)
    )

    await giverContract.sendGrams(10_000_000_000, await rootManagerMultisig.calculateAddress())
    await rootManagerMultisig.deploy([Ton.x0(rootManagerMultisigKeys.public)], 1)

    await giverContract.sendGrams(10_000_000_000, await deBot.calculateAddress())
    await deBot.deploy(
        Ton.abiToHex(contracts.densDeBot.abi),
        Ton.abiToHex(contracts.root.abi),
        await root.calculateAddress()
    )

    const text: string = JSON.stringify(rootManagerMultisigKeys, null, 2)
    const fileName: string = `keys/root-manager.json`
    fs.writeFileSync(fileName, text, 'utf8')

    logger.info(`Root ${await root.calculateAddress()}`)
    logger.info(`Root manager safeMultiSig ${await rootManagerMultisig.calculateAddress()}`)
    logger.info(`Root manager safeMultiSig keys saved into ${fileName}`)
    logger.info(`tonos-cli config --url ${config.deploy.local.url}`)
    logger.info(`tonos-cli debot fetch ${await deBot.calculateAddress()}`)
    process.exit()
}
deploy().then()