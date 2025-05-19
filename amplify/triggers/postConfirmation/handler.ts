import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../data/resource";

const client = generateClient<Schema>();

export const postConfirmationHandler: PostConfirmationTriggerHandler = async (event) => {
    const email = event.request.userAttributes.email;
    const userId = event.request.userAttributes.sub;
    const profileOwner = `${event.request.userAttributes.sub}::${event.userName}`;

    // Create a new profile for the user
    await client.models.Users.create({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        email,
        name: event.userName,
        profileOwner,
    });

    return event;
}