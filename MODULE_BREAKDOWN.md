# Module Breakdown for Real-Time Chat Application

## 1. Authentication Module

### Purpose

Handles user authentication, registration, and session management using Clerk.

### Components

- **Authentication Pages** (`app/(root)/sign-in/`, `app/(root)/sign-up/`)
  - User sign-in and sign-up interfaces
  - Integration with Clerk authentication providers

- **Auth Success Toast** (`components/auth/AuthSuccessToast.tsx`)
  - Displays success message after authentication

### Key Features

- User registration and login
- OAuth integration (Google, GitHub, etc.)
- Session management
- Protected routes

### Dependencies

- `@clerk/nextjs`
- Clerk authentication configuration

---

## 2. User Management Module

### Purpose

Manages user profiles, presence tracking, and user-related operations.

### Backend Components

- **User Schema** (`convex/schema.ts` - users table)
  - Stores user information: username, imageUrl, clerkId, email
  - Tracks online status and last seen timestamp

- **User Functions** (`convex/user.ts`)
  - `create`: Create new user
  - `deleteUser`: Delete user
  - `get`: Get user by Clerk ID
  - `updateOnlineStatus`: Update user's online status
  - `updateLastSeen`: Update user's last seen timestamp
  - `getOnlineStatus`: Get user's online status

### Frontend Components

- **User Profile Display**
  - Avatar components (`components/ui/avatar.tsx`)
  - User information display in conversations

### Key Features

- User profile management
- Online presence tracking
- Last seen status
- User search and discovery

### Dependencies

- Convex database
- Clerk authentication

---

## 3. Conversation Module

### Purpose

Manages conversations (both direct and group), conversation members, and conversation-related operations.

### Backend Components

- **Conversation Schema** (`convex/schema.ts`)
  - `conversations` table: Stores conversation metadata
  - `conversationMembers` table: Maps users to conversations

- **Conversation Functions** (`convex/conversation.ts`)
  - `get`: Get conversation details with member information

- **Group Functions** (`convex/group.ts`)
  - `createGroup`: Create a new group
  - `addMember`: Add a member to a group
  - `removeMember`: Remove a member from a group
  - `updateGroupImage`: Update group image
  - `leaveGroup`: Leave a group
  - `deleteGroup`: Delete a group
  - `isGroupAdmin`: Check if user is group admin
  - `getGroupMembers`: Get all members of a group

### Frontend Components

- **Conversation List** (`app/(root)/conversations/`)
  - `ConversationFallback.tsx`: Fallback when no conversation is selected
  - `DMConversationItem.tsx`: Direct message conversation item
  - `GroupConversationItem.tsx`: Group conversation item

- **Conversation View** (`app/(root)/conversations/[conversationId]/`)
  - `Header.tsx`: Conversation header with title and actions
  - `Body.tsx`: Message list container
  - `ChatInput.tsx`: Message input component
  - `GroupInfo.tsx`: Group information panel

### Key Features

- Create and manage conversations
- Direct messaging between users
- Group chat functionality
- Conversation member management
- Group admin controls

### Dependencies

- User Management Module
- Message Module
- Presence Module

---

## 4. Message Module

### Purpose

Handles message creation, delivery, read receipts, and message-related operations.

### Backend Components

- **Message Schema** (`convex/schema.ts` - messages table)
  - Stores message content, sender, conversation, type
  - Tracks read status and read receipts

- **Message Functions** (`convex/message.ts`)
  - `create`: Create a new message
  - `markAsDelivered`: Mark a message as delivered
  - `markAsRead`: Mark a message as read
  - `markAllAsRead`: Mark all messages in a conversation as read

- **Message Queries** (`convex/messages.tsx`)
  - Real-time message queries for conversations

### Frontend Components

- **Message Display** (`app/(root)/conversations/[conversationId]/_components/body/`)
  - `Message.tsx`: Individual message display component
  - `Body.tsx`: Message list container with real-time updates

- **Message Input** (`app/(root)/conversations/[conversationId]/_components/input/`)
  - `ChatInput.tsx`: Message input with formatting options

### Key Features

- Real-time message delivery
- Message read receipts
- Different message types (text, system, etc.)
- Message history
- Message status indicators (sent, delivered, read)

### Dependencies

- Conversation Module
- User Management Module
- Presence Module

---

## 5. Presence Module

### Purpose

Tracks and displays user online status and presence information.

### Backend Components

- **Presence Functions** (`convex/presence.ts`)
  - `updatePresence`: Update user's presence status
  - `getPresence`: Get user's presence status

### Frontend Components

- **Presence Provider** (`components/providers/PresenceProvider.tsx`)
  - Initializes presence tracking for the app

- **Presence Hooks** (`hooks/usePresence.tsx`)
  - `usePresence`: Track and update user presence
  - `useUserPresence`: Get another user's presence status
  - `useMessageReadReceipts`: Handle message read receipts

### Key Features

- Real-time online status tracking
- Last seen timestamp
- Away status detection
- Presence-based UI updates

### Dependencies

- User Management Module
- Convex real-time subscriptions

---

## 6. Friends Module

### Purpose

Manages friend relationships, friend requests, and friend-related operations.

### Backend Components

- **Friends Schema** (`convex/schema.ts`)
  - `friends` table: Stores friendships between users
  - `requests` table: Stores friend requests

- **Friend Functions** (`convex/request.ts`, `convex/requests.tsx`)
  - Friend request creation and management
  - Friend relationship management

### Frontend Components

- **Friends Page** (`app/(root)/friends/`)
  - Friends list and management interface

- **Friend Components** (`app/(root)/friends/_components/`)
  - `AddFriendDialog.tsx`: Add friend dialog
  - `Request.tsx`: Friend request component
  - `GroupInvitation.tsx`: Group invitation component

### Key Features

- Send and receive friend requests
- Accept or decline friend requests
- View friends list
- Friend status indicators

### Dependencies

- User Management Module
- Conversation Module
- Notifications Module

---

## 7. Group Management Module

### Purpose

Handles group creation, member management, invitations, and group-related operations.

### Backend Components

- **Group Schema** (`convex/schema.ts`)
  - `groupInvitations` table: Stores group invitations

- **Group Functions** (`convex/group.ts`)
  - `createGroup`: Create a new group
  - `addMember`: Add a member to a group
  - `removeMember`: Remove a member from a group
  - `updateGroupImage`: Update group image
  - `sendInvitation`: Send invitation to join a group
  - `acceptInvitation`: Accept a group invitation
  - `rejectInvitation`: Reject a group invitation
  - `getGroupInvitations`: Get group invitations for a user
  - `countGroupInvitations`: Count pending group invitations

### Frontend Components

- **Group Components** (`app/(root)/conversations/_components/`)
  - `CreateGroupDialog.tsx`: Create group dialog
  - `GroupConversationItem.tsx`: Group conversation item

- **Group Info** (`app/(root)/conversations/[conversationId]/_components/`)
  - `GroupInfo.tsx`: Group information and management panel

- **Group Invitation** (`app/(root)/friends/_components/`)
  - `GroupInvitation.tsx`: Group invitation component

### Key Features

- Create and manage groups
- Add and remove group members
- Group admin controls
- Group invitations
- Group settings and information

### Dependencies

- Conversation Module
- User Management Module
- Friends Module
- Notifications Module

---

## 8. Notifications Module

### Purpose

Manages user notifications for various events like messages, friend requests, and group invitations.

### Frontend Components

- **Notifications Page** (`app/(root)/notifications/`)
  - Notifications list and management interface

### Key Features

- Message notifications
- Friend request notifications
- Group invitation notifications
- Notification read status
- Notification settings

### Dependencies

- Message Module
- Friends Module
- Group Management Module

---

## 9. Blocking Module

### Purpose

Allows users to block other users to prevent unwanted interactions.

### Backend Components

- **Blocking Schema** (`convex/schema.ts` - blockedUsers table)
  - Stores blocked user relationships

- **Blocking Functions** (`convex/block.ts`)
  - Block and unblock user operations

### Frontend Components

- **Blocking Page** (`app/(root)/blocked/`)
  - Blocked users list and management interface

- **Blocking Hook** (`hooks/useBlockUser.tsx`)
  - Block user functionality

### Key Features

- Block other users
- View blocked users list
- Unblock users
- Blocking restrictions in conversations and messages

### Dependencies

- User Management Module
- Conversation Module
- Message Module

---

## 10. UI Module

### Purpose

Provides reusable UI components and theming for the application.

### Components

- **UI Components** (`components/ui/`)
  - Reusable UI components from shadcn/ui:
    - `avatar.tsx`: User avatar display
    - `button.tsx`: Button component
    - `card.tsx`: Card container
    - `dialog.tsx`: Dialog/modal component
    - `dropdown-menu.tsx`: Dropdown menu
    - `input.tsx`: Input field
    - `label.tsx`: Form label
    - `skeleton.tsx`: Loading skeleton
    - `sonner.tsx`: Toast notifications
    - `tooltip.tsx`: Tooltip component
    - `theme/`: Theme-related components

- **Layout Components** (`components/layout/`)
  - `site-navbar.tsx`: Main navigation bar

- **Shared Components** (`components/shared/`)
  - `conversation/`: Conversation-related components
  - `item-list/`: List display components
  - `sidebar/`: Sidebar navigation components

### Key Features

- Reusable UI components
- Consistent design system
- Theme support (light/dark mode)
- Responsive design
- Accessibility features

### Dependencies

- Tailwind CSS
- Radix UI primitives
- Lucide React icons

---

## 11. Navigation Module

### Purpose

Handles navigation within the application and provides navigation utilities.

### Components

- **Navigation Components** (`components/shared/sidebar/nav/`)
  - `DesktopNav.tsx`: Desktop navigation
  - `MobileNav.tsx`: Mobile navigation

- **Navigation Hook** (`hooks/useNavigation.tsx`)
  - Navigation helpers and utilities

### Key Features

- Responsive navigation
- Active route highlighting
- Mobile-friendly navigation
- Navigation state management

### Dependencies

- Next.js router
- UI Module

---

## 12. Utilities Module

### Purpose

Provides utility functions and helpers used throughout the application.

### Components

- **Utility Functions** (`lib/utils.ts`)
  - Common utility functions
  - Class name merging with clsx

- **Convex Utilities** (`convex/_utils.ts`)
  - Helper functions for Convex operations
  - User lookup by Clerk ID

### Key Features

- Utility functions
- Helper methods
- Common operations
- Code reuse

### Dependencies

- Application-specific dependencies

---

## Module Interactions

### Core Flow

1. **Authentication** → **User Management**: User logs in and profile is created/loaded
2. **User Management** → **Presence**: User presence is tracked
3. **User Management** → **Friends**: User can manage friends
4. **Friends** → **Conversation**: Friends can start conversations
5. **Conversation** → **Message**: Users can send messages in conversations
6. **Message** → **Presence**: Message read receipts update presence
7. **Group Management** → **Conversation**: Groups are a type of conversation
8. **Notifications** → All modules: Notifications for various events
9. **Blocking** → **Conversation/Message**: Blocked users can't interact
10. **UI Module** → All modules: Provides consistent UI components

### Data Flow

1. User actions trigger frontend events
2. Frontend calls Convex mutations/queries
3. Convex updates the database
4. Database changes trigger real-time updates
5. Frontend receives updates and re-renders
6. UI reflects the latest state

This modular architecture allows for separation of concerns, code reusability, and easier maintenance and extension of the application.
