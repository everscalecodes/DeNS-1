import * as fs from 'fs'
import Ton from '../common/classes/utils/Ton'
import config from '../configs/config'
import GiverContract from '../common/classes/GiverContract'
import loggerConfig from '../configs/logger'
import Logger, {LoggerInterface} from 'logger'
import SafeMultisigWalletContract from '../common/classes/SafeMultisigWalletContract'
import {KeyPair} from '@tonclient/core/dist/modules'

async function deploy(): Promise<void> {
    Ton.url = config.deploy.local.url
    Ton.timeout = config.deploy.local.timeout

    const logger: LoggerInterface = new Logger(loggerConfig)
    const giverContract: GiverContract = new GiverContract()
    for (let i = 0; i < 3; i++) {
        const safeMultisigWalletKeys: KeyPair = await Ton.randomKeys()
        const safeMultisigWallet: SafeMultisigWalletContract = new SafeMultisigWalletContract(safeMultisigWalletKeys)
        const walletAddress: string = await safeMultisigWallet.calculateAddress()
        await giverContract.sendGrams(1_000_000_000_000, walletAddress)
        const text: string = JSON.stringify(safeMultisigWalletKeys, null, 2)
        const fileName: string = `keys/wallet${i}.json`
        fs.writeFileSync(fileName, text, 'utf8')
        logger.info(`Wallet ${walletAddress}`)
        logger.info(`Keys saved into ${fileName}`)
    }
    process.exit()
}
deploy().then()