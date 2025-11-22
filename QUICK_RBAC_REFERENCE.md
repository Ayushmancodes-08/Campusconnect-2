# Quick RBAC Reference

## Login Credentials

### Hardcoded Roles (Special IDs)
Find these in `src/lib/data.ts` - `userProfiles` object:

- **Admin**: `admin@campus.edu` / `password`
- **Finance**: `finance@campus.edu` / `password`
- **Hostel**: `hostel@campus.edu` / `password`

### Dynamic Roles
- **Student**: Created by admin after application approval
- **Teacher**: Created by admin after application approval

---

## What Each Role Can Do

### 👨‍💼 Admin
- Approve/reject applications
- Create student & teacher credentials
- Manage all users
- View financial data
- Manage holidays
- **Default Dashboard:** Applications

### 👨‍🏫 Teacher
- View assigned courses
- Mark attendance
- Enter grades
- View students
- **Default Dashboard:** Courses

### 👨‍🎓 Student
- View courses
- Check grades
- View fees
- Make payments
- View profile (real data from admission form)
- **Default Dashboard:** Dashboard

### 💰 Finance
- Manage fees
- View financial reports
- Process payments
- **Default Dashboard:** Finance

### 🏠 Hostel
- Manage rooms
- View residents
- Manage mess
- **Default Dashboard:** Rooms

---

## How Access Control Works

1. **User logs in** → Role stored in localStorage
2. **User navigates** → System checks if role can access route
3. **If allowed** → Page displays
4. **If denied** → Redirects to default dashboard for that role

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/route-protection.ts` | Defines route permissions |
| `src/components/dashboard/main-layout.tsx` | Enforces route protection |
| `src/components/dashboard/sidebar-nav.tsx` | Shows role-based menu |
| `src/lib/data.ts` | Hardcoded credentials |

---

## Testing

**Try this:**
1. Login as Student
2. Try accessing `/dashboard/applications`
3. Should redirect to `/dashboard` (student's default)

**Or:**
1. Login as Admin
2. Try accessing `/dashboard/pay-fee`
3. Should redirect to `/dashboard/applications` (admin's default)

---

## Adding New Restricted Routes

1. Create page in `src/app/dashboard/[route]/page.tsx`
2. Add to `src/lib/route-protection.ts`:
   ```typescript
   "/dashboard/my-route": ["admin", "teacher"],
   ```
3. Add to sidebar in `src/components/dashboard/sidebar-nav.tsx`

Done! Route is now protected.

