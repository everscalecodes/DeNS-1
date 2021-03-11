export default {
    make: {
        /**
         * Absolute path to solidity compiler
         * Examples:
         *     '~/Projects/TON-Solidity-Compiler/build/solc/solc'
         *     '/home/user/bin/solc'
         */
        solidityCompiler: '~/Projects/TON-Solidity-Compiler/build/solc/solc',

        /**
         * Absolute path to TVM linker
         * Examples:
         *     '~/Projects/TVM-linker/tvm_linker/target/release/tvm_linker'
         *     '/home/user/bin/tvm_linker'
         */
        tonVirtualMachineLinker: '~/Projects/TVM-linker/tvm_linker/target/release/tvm_linker',
    },
    deploy: {
        local: {
            /**
             * Local network URL
             * Examples:
             *     'http://localhost:8080'
             *     'http://0.0.0.0:80'
             */
            url: 'http://localhost:8080',

            /**
             * Local giver address
             * Examples:
             *     '0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94'
             *     '0:7777777777777777777777777777777777777777777777777777777777777777'
             */
            giver: '0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94',

            /**
             * How long to wait and result of call or deployment from local node in milliseconds
             * Examples:
             *    3000
             *    5000
             */
            timeout: 3000
        },
        public: {
            /**
             * Public network URL
             * Examples:
             *     'https://net.ton.dev'
             *     'https://fld.ton.dev'
             *     'https://main.ton.dev'
             */
            url: 'https://net.ton.dev'
        },

        /**
         * Array of predefined names.
         * Examples:
         *     ['tonos', 'os']
         *     ['123', '456']
         */
        names: ['tonos', 'os', 'gov', 'debot', 'bot', 'dev', 'defi', 'proxy', 'site']
    }
}