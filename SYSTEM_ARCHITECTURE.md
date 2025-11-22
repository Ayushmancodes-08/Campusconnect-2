# CampusConnect ERP - System Architecture

## Overview

CampusConnect ERP is a role-based educational management system with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    CampusConnect ERP                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Authentication Layer                     │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Login Form (src/components/auth/login-form)  │  │   │
│  │  │  - Role selection                              │  │   │
│  │  │  - Email/Password validation                   │  │   │
│  │  │  - Hardcoded & Generated credentials check     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Session Management                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  localStorage:                                 │  │   │
│  │  │  - userRole                                    │  │   │
│  │  │  - userEmail                                   │  │   │
│  │  │  - isLoggedIn                                  │  │   │
│  │  │  - userCredentials (generated)                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           User Data Management                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  useCurrentUser Hook     