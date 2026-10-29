import type { D1Migration } from 'cloudflare:test'
import type * as mainModule from '../src/index'

declare global {
    namespace Cloudflare {
        interface Env {
            TEST_MIGRATIONS: D1Migration[]
        }

        interface GlobalProps {
            mainModule: typeof mainModule
        }
    }
}
