import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from '../triggers/postConfirmation/resource'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  accountRecovery: "NONE",
  triggers: {
    postConfirmation
  }
});
