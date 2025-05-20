import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/postConfirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);


Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
    const email = event.request.userAttributes.email;
    const userId = event.request.userAttributes.sub;
    const profileOwner = `${event.request.userAttributes.sub}::${event.userName}`;

    // Create a new profile for the user
    await client.models.Users.create({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        email,
        name: `${event.request.userAttributes.given_name} ${event.request.userAttributes.family_name}`,
        profileOwner,
    });

    return event;
}