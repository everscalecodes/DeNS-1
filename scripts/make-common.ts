import {exec, ExecException} from 'child_process'
import {red, green} from 'colors'
import config from '../configs/config'

const commands: string = `cd common/contracts
${config.make.solidityCompiler} IdleV2.sol
${config.make.solidityCompiler} RootManager.sol
${config.make.tonVirtualMachineLinker} compile IdleV2.code -o IdleV2.tvc
${config.make.tonVirtualMachineLinker} compile RootManager.code -o RootManager.tvc
${config.make.tonVirtualMachineLinker} decode --tvc IdleV2.tvc > IdleV2.decode
${config.make.tonVirtualMachineLinker} decode --tvc RootManager.tvc > RootManager.decode
${config.make.tonVirtualMachineLinker} decode --tvc SafeMultisigWallet.tvc > SafeMultisigWallet.decode`
exec(commands, onExecComplete)

function onExecComplete(error: ExecException | null, standardOutput: string, standardError: string): void {
    if (error)
        console.error(error)
    else if (standardError.length)
        console.error(red(standardError))
    else
        console.log(`${green('✓')} common`)
}