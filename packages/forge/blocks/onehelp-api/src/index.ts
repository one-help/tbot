import { createBlock } from '@typebot.io/forge'
import { OnehelpApiLogo } from './logo'
import { auth } from './auth'
import { httpRequest } from './actions/httpRequest'

export const onehelpApiBlock = createBlock({
  id: 'onehelp-api',
  name: 'OneHelp API',
  tags: ['api', 'http', 'rest'],
  LightLogo: OnehelpApiLogo,
  auth,
  actions: [httpRequest],
})
