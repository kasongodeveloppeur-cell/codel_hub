# Security Specification for Codel_club

## 1. Data Invariants
- A user profile can only be created by the authenticated user with matching UID.
- Only users with `clubRole` of 'Président' or 'Superviseur' can modify other users' roles.
- Projects can only be created by authenticated members.
- Projects can only be updated by their owner or an administrator.
- Chat messages are immutable once sent.
- Forum topics can only be created or modified by administrators.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. User trying to create a profile with a different UID.
2. User trying to set `isAdmin: true` on their own profile during creation.
3. User trying to change their own `clubRole` to 'Président'.
4. User trying to delete a project they don't own.
5. User trying to update a project's `authorId`.
6. Anonymous user trying to write to the chat.
7. Authenticated user trying to edit someone else's chat message.
8. User trying to inject 2MB of text into a project description.
9. User trying to set a future `createdAt` timestamp.
10. User trying to create a project with an invalid status (e.g., 'HACKED').
11. User trying to delete the `events` collection.
12. User trying to list all users' private emails (if we had private fields).

## 3. Test Runner (Conceptual)
All the above payloads must return `PERMISSION_DENIED`.
