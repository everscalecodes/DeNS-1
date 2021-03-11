import path from 'path'
import fs from 'fs'
import giverAbi from '../common/contracts/giver.abi.json'
import rootOwnerAbi from '../common/contracts/RootManager.abi.json'
import idleAbi from '../common/contracts/IdleV2.abi.json'
import safeMultisigWalletAbi from '../common/contracts/SafeMultisigWallet.abi.json'
import auctionAbi from '../contracts/Auction.abi.json'
import certificateAbi from '../contracts/Certificate.abi.json'
import rootAbi from '../contracts/Root.abi.json'
import densDeBotAbi from '../contracts/DeNSDeBot.abi.json'

function base64(relativePath: string): string {
    relativePath += '.tvc'
    const absolutePath: string = path.resolve(__dirname, relativePath)
    return fs.readFileSync(absolutePath, 'base64')
}

function code(relativePath: string): string {
    relativePath += '.decode'
    const absolutePath: string = path.resolve(__dirname, relativePath)
    const decodedText: string = fs.readFileSync(absolutePath, 'utf8')
    return decodedText.match(/(?<=code: ).+/)[0]
}

const rootManager: string = '../common/contracts/RootManager'
const idle: string = '../common/contracts/IdleV2'
const safeMultisigWallet: string = '../common/contracts/SafeMultisigWallet'
const auction: string = '../contracts/Auction'
const certificate: string = '../contracts/Certificate'
const root: string = '../contracts/Root'
const densDeBot: string = '../contracts/DeNSDeBot'

export default {
    giver: {
        abi: giverAbi,
        tvc: ''
    },
    rootManager: {
        abi: rootOwnerAbi,
        tvc: base64(rootManager),
        code: code(rootManager)
    },
    idle: {
        abi: idleAbi,
        tvc: base64(idle),
        code: code(idle)
    },
    safeMultisigWallet: {
        abi: safeMultisigWalletAbi,
        tvc: base64(safeMultisigWallet),
        code: code(safeMultisigWallet)
    },
    auction: {
        abi: auctionAbi,
        tvc: base64(auction),
        code: code(auction)
    },
    certificate: {
        abi: certificateAbi,
        tvc: base64(certificate),
        code: code(certificate)
    },
    root: {
        abi: rootAbi,
        tvc: base64(root),
        code: code(root)
    },
    densDeBot: {
        abi: densDeBotAbi,
        tvc: base64(densDeBot),
        code: code(densDeBot)
    }
}