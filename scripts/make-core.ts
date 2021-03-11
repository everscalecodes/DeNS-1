import {exec, ExecException} from 'child_process'
import {red, green} from 'colors'
import config from '../configs/config'

const commands: string = `cd contracts
${config.make.solidityCompiler} Auction.sol
${config.make.solidityCompiler} Certificate.sol
${config.make.solidityCompiler} Root.sol
${config.make.solidityCompiler} DeNSDeBot.sol
${config.make.tonVirtualMachineLinker} compile Auction.code -o Auction.tvc
${config.make.tonVirtualMachineLinker} compile Certificate.code -o Certificate.tvc
${config.make.tonVirtualMachineLinker} compile Root.code -o Root.tvc
${config.make.tonVirtualMachineLinker} compile DeNSDeBot.code -o DeNSDeBot.tvc
${config.make.tonVirtualMachineLinker} decode --tvc Auction.tvc > Auction.decode
${config.make.tonVirtualMachineLinker} decode --tvc Certificate.tvc > Certificate.decode
${config.make.tonVirtualMachineLinker} decode --tvc Root.tvc > Root.decode
${config.make.tonVirtualMachineLinker} decode --tvc DeNSDeBot.tvc > DeNSDeBot.decode`
exec(commands, onExecComplete)

function onExecComplete(error: ExecException | null, standardOutput: string, standardError: string): void {
    if (error)
        console.error(error)
    else if (standardError.length)
        console.error(red(standardError))
    else
        console.log(`${green('✓')} core`)
}