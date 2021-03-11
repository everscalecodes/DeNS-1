export default {
    console: {
        /**
         * Output in console.
         */
        enabled: true,

        /**
         * Log level from RFC5424.
         * @see https://tools.ietf.org/html/rfc5424
         * Variables:
         *     'emerg'
         *     'alert'
         *     'crit'
         *     'error'
         *     'warning'
         *     'notice'
         *     'info'
         *     'debug'
         */
        level: 'debug'
    },
    file: {
        /**
         * Output in file.
         */
        enabled: true,

        /**
         * Log level from RFC5424.
         * IMPORTANT!!! DO NOT SET DEBUG LEVEL ON PRODUCTION.
         * If you do this. Your redis password and bot token will be written to the text log. This is not good.
         * @see https://tools.ietf.org/html/rfc5424
         * Variables:
         *     'emerg'
         *     'alert'
         *     'crit'
         *     'error'
         *     'warning'
         *     'notice'
         *     'info'
         *     'debug'
         */
        level: 'info',

        /**
         * Path to logs directory.
         */
        directory: './keys/logs',

        /**
         * Maximum file size in bytes.
         */
        maxSize: 10 * 1024 * 1024
    }
}