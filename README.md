# MyNotes

A full-stack note-taking app built with Next.js, AWS Amplify Gen 2, MUI, and TypeScript.

## Features

- User authentication (sign up, login, email verification)
- Secure user profile with editable avatar (drag & drop or long-press to upload)
- Create, edit, and view notes
- Notes and user data stored in Amplify Data (DynamoDB)
- Profile pictures stored in Amplify Storage (S3) and served via CDN (CloudFront)
- Responsive UI using Material-UI (MUI)
- Auth-guarded routes

## Project Structure

```
/amplify         # Amplify backend (auth, data, storage, triggers)
/src
  /components    # React components (Navbar, NotesList, NoteDetails, etc.)
  /pages         # Next.js pages (sign-up, login, home, verify-email, etc.)
  /styles        # CSS modules and global styles
  /types         # TypeScript types
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Amplify setup:**
   - Make sure you have the [Amplify CLI](https://docs.amplify.aws/cli/) installed.
   - Initialize and deploy the backend:
     ```sh
     npx ampx sandbox
     ```

3. **Run the app locally:**
   ```sh
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Usage

- **Sign Up:** Create a new account and verify your email.
- **Login:** Access your notes after authentication.
- **Notes:** Create, select, edit, and save notes. If no notes exist, a friendly message is shown.
- **Profile Picture:** Click and hold (long-press) the avatar to upload a new profile picture, or drag and drop an image onto the avatar.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [AWS Amplify Gen 2](https://docs.amplify.aws/gen2/)
- [Material-UI (MUI)](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Customization

- **Amplify Data Model:** See `/amplify/data/resource.ts` to adjust user or note schema.
- **Storage/CDN:** Profile pictures are stored in S3 and served via Presigned URLs. See `/amplify/storage/resource.ts` and `/amplify/backend.ts`.

## License

MIT
